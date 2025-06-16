import { create } from "zustand";
import * as Tone from "tone";
import { loopUtils } from "./audioUtils/main.ts";
import { useFXStore } from "@data/store/FXStore.ts";
import {
  LoopState_Rec,
  LoopState_Pause,
  LoopState_TrackFX,
  LoopState_MasterFX,
  LoopState_InputFX,
  TrackArray,
  Track,
  TrackFX,
  MasterFX,
  InputFX,
  TrackIndex,
  ContainerFxBundle,
  ContainerFxBundleID,
  ContainerFxBundleParams,
  BundleContainerTypesElem,
  OperationTypeElem,
  bundleContainerTypesArray,
  trackIndexArray,
  System_Bpm,
  Track_Buffer,
  Track_Volume,
  Metronome_Bpm,
  Metronome_Measure,
  Metronome_NoteValue,
  Metronome_Volume,
  LoopStore,
} from "@data/store/LoopStoreTypes.ts";

export const useLoopStore = create<LoopStore>((set, get) => ({
  trackArray: Array.from(
    { length: 5 },
    (): Track => ({
      state_rec: LoopState_Rec.Idle,
      state_pause: LoopState_Pause.Playing,
      state_trackFX: LoopState_TrackFX.Off,
      state_masterFX: LoopState_MasterFX.Off,
      state_inputFX: LoopState_InputFX.Off,
      recorder: new Tone.Recorder(),
      buffer: null,
      player: null,
      volume: 100,
      length: null,
    })
  ) as TrackArray,

  trackFX: Array.from(
    { length: 5 },
    () =>
      ({
        bundleContainerType: "TRACKFX",
        containerFxBundles: [],
      } as TrackFX)
  ),
  masterFX: {
    bundleContainerType: "MASTERFX",
    containerFxBundles: [],
  } as MasterFX,
  inputFX: {
    bundleContainerType: "INPUTFX",
    containerFxBundles: [],
  } as InputFX,

  updateFxBundlesContainer: (
    bundleContainerType: BundleContainerTypesElem,
    params: {
      operationType?: OperationTypeElem;
      trackIndex?: TrackIndex;
      containerFxBundleID?: ContainerFxBundleID;
      containerFxBundle?: ContainerFxBundle;
      containerFxBundleParams?: ContainerFxBundleParams;
    }
  ) => {
    set((state) => {
      const operationType = params.operationType ?? "UPDATE";
      const containerFxBundleID = params.containerFxBundleID ?? -1;
      const containerFxBundle = params.containerFxBundle ?? null;
      const containerFxBundleParams = params.containerFxBundleParams ?? null;
      const trackIndex = params.trackIndex ?? -1;

      const newContainerFxBundles = [
        ...(bundleContainerType === "INPUTFX"
          ? state.inputFX.containerFxBundles
          : bundleContainerType === "MASTERFX"
          ? state.masterFX.containerFxBundles
          : state.trackFX[trackIndex].containerFxBundles),
      ];

      if (operationType === "DELETE" && containerFxBundleID != -1) {
        const containerFxBundleIndex = newContainerFxBundles.findIndex(
          (bndl) => bndl.bundleID === containerFxBundleID
        );
        if (containerFxBundleIndex !== -1) {
          newContainerFxBundles.splice(containerFxBundleIndex, 1);
        }
      } else if (
        operationType === "ADD" &&
        containerFxBundle != null &&
        containerFxBundle.bundleID != -1
      ) {
        const isNoBundleAlreadyExists =
          newContainerFxBundles.findIndex(
            (bndl) => bndl.bundleID == containerFxBundle.bundleID
          ) >= 0
            ? false
            : true;
        // console.log(isNoBundleAlreadyExists);
        if (isNoBundleAlreadyExists && newContainerFxBundles.length <= 3) {
          newContainerFxBundles.push(containerFxBundle);
        } else {
          console.error(
            "A bundle with that name already exists or this container is already filled!"
          );
        }
      } else if (
        operationType === "UPDATE" &&
        containerFxBundleID != -1 &&
        containerFxBundleParams != null
      ) {
        const containerFxBundleIndex =
          newContainerFxBundles.findIndex(
            (bndl) => bndl.bundleID == containerFxBundleID
          ) ?? -1;
        if (containerFxBundleIndex !== -1) {
          newContainerFxBundles[containerFxBundleIndex] = {
            ...newContainerFxBundles[containerFxBundleIndex],
            bundleParams: { ...containerFxBundleParams },
          };
          // console.log(state.trackFX[trackIndex].containerFxBundles);
          console.log(
            `In the ${
              newContainerFxBundles[containerFxBundleIndex].bundleID
            } bundleID containerBundle there are ${newContainerFxBundles[
              containerFxBundleIndex
            ].bundleParams.fxs.map((fx) => {
              return fx.fxNode;
            })} fxs!`
          );
          // console.log(
          //   `Now here is a ${containerFxBundleParams.fxs.length} fxs in the bundle with ${containerFxBundleID} id. It's a ${bundleContainerType} tho)`
          // );
        } else {
          // console.log(
          //   `There is no bundle with that id exists in ${bundleContainerType}!`
          // );
        }
      }

      return {
        ...(bundleContainerType === "INPUTFX"
          ? {
              inputFX: {
                ...state.inputFX,
                containerFxBundles: newContainerFxBundles,
              },
            }
          : bundleContainerType === "MASTERFX"
          ? {
              masterFX: {
                ...state.masterFX,
                containerFxBundles: newContainerFxBundles,
              },
            }
          : {
              trackFX: state.trackFX.map((track, i) =>
                i === trackIndex
                  ? { ...track, containerFxBundles: newContainerFxBundles }
                  : track
              ),
            }),
      };
    });
  },

  updateEntireFxBundleContainers: async (
    containerFxBundleID: ContainerFxBundleID = -1
  ) => {
    const fxStore = useFXStore.getState();
    const bundleArray = fxStore.bundleArray;
    const containerFxBundleParams = bundleArray.find(
      (bdl) => bdl.bundleID == containerFxBundleID
    )?.bundleParams;

    bundleContainerTypesArray.forEach((containerType) => {
      if (containerType === "TRACKFX") {
        trackIndexArray.forEach((trackIndex) => {
          get().updateFxBundlesContainer(containerType, {
            operationType: "UPDATE",
            trackIndex: trackIndex,
            containerFxBundleID: containerFxBundleID,
            containerFxBundleParams: containerFxBundleParams,
          });
          get().updateTrackFXs(trackIndex);
        });
      }
      if (containerType === "INPUTFX") {
        get().updateFxBundlesContainer(containerType, {
          operationType: "UPDATE",
          containerFxBundleID: containerFxBundleID,
          containerFxBundleParams: containerFxBundleParams,
        });
      }
      if (containerType === "MASTERFX") {
        get().updateFxBundlesContainer(containerType, {
          operationType: "UPDATE",
          containerFxBundleID: containerFxBundleID,
          containerFxBundleParams: containerFxBundleParams,
        });
      }
    });
  },

  bpm: 120,
  measure: 0,

  setBpm: (bpm: System_Bpm) => {
    set((state) => {
      state.updateMetronome({ bpm: bpm });
      return { bpm: bpm };
    });
  },
  setMeasure: (buffer: Track_Buffer, bpm: System_Bpm) => {
    set((state) => {
      if (state.measure > 0 || !buffer || !bpm)
        return { measure: state.measure };

      const quarterNotes = buffer.duration / (60 / bpm);
      const newMeasure = Math.max(1, Math.round(quarterNotes));
      return { measure: newMeasure };
    });
  },

  startRecording: async (trackIndex: TrackIndex) => {
    const trackArray = get().trackArray;
    const track = trackArray[trackIndex];

    if (
      track.state_pause === LoopState_Pause.Paused &&
      track.state_rec !== LoopState_Rec.Idle
    ) {
      const measure = get().measure;
      const bpm = get().bpm;
      const startTime =
        Math.ceil(Tone.now() / ((measure * 60) / bpm)) * ((measure * 60) / bpm);
      if (track.player) track.player.start(startTime);
      set((state) => {
        const newTrackArray = [...state.trackArray];
        newTrackArray[trackIndex] = {
          ...track,
          state_pause: LoopState_Pause.Playing,
        };
        return { trackArray: newTrackArray };
      });
      return;
    }

    await Tone.start();
    const mic = new Tone.UserMedia();
    await mic.open();
    mic.connect(track.recorder);

    track.recorder.start();

    set((state) => {
      const newTrackArray = [...state.trackArray];
      newTrackArray[trackIndex] = {
        ...track,
        state_rec:
          track.state_rec === LoopState_Rec.Idle
            ? LoopState_Rec.Recording
            : LoopState_Rec.Overdubbing,
      };
      return { trackArray: newTrackArray };
    });
  },

  stopRecording: async (trackIndex: TrackIndex) => {
    const trackArray = get().trackArray;
    const track = trackArray[trackIndex];
    const MIN_TRACK_LENGTH = 0.25;
    const bpm = get().bpm;
    const measure = get().measure;
    const startTime =
      Math.ceil(Tone.now() / ((measure * 60) / bpm)) * ((measure * 60) / bpm);

    const recording = await track.recorder.stop();
    if (!recording) return;

    const blobUrl = URL.createObjectURL(recording);
    const newBuffer = await Tone.ToneAudioBuffer.fromUrl(blobUrl);

    if (track.state_rec === LoopState_Rec.Recording) {
      console.log(`PreRec: ${newBuffer.duration} `, newBuffer.length);

      get().setMeasure(newBuffer, bpm);

      set((state) => {
        const newTrackArray = [...state.trackArray];
        newTrackArray[trackIndex] = {
          ...track,
          buffer: newBuffer,
          state_rec: LoopState_Rec.Overdubbing,
          state_pause: LoopState_Pause.Playing,
        };
        return {
          trackArray: newTrackArray,
          measure: get().measure,
          bpm: bpm,
        };
      });
      console.log(`PostRec: ${newBuffer.duration} `, newBuffer.length);
      get().startRecording(trackIndex);
    } else if (track.state_rec === LoopState_Rec.Overdubbing) {
      if (track.player) track.player.stop();

      if (newBuffer.duration <= MIN_TRACK_LENGTH) {
        if (track.buffer) {
          const quantizedBuffer = loopUtils.quantizeBuffer(
            track.buffer,
            bpm,
            measure
          );

          const newPlayer = loopUtils.createPlayer(
            quantizedBuffer,
            track.volume,
            track.state_trackFX !== LoopState_TrackFX.Off
              ? loopUtils.getTrackFxNodes(
                  trackIndex,
                  { trackFX: get().trackFX, masterFX: get().masterFX },
                  { includeTrackFxNodes: true, includeMasterFxNodes: true }
                )
              : []
          );

          newPlayer.start(startTime);

          set((state) => {
            const newTrackArray = [...state.trackArray];
            newTrackArray[trackIndex] = {
              ...track,
              player: newPlayer,
              state_rec: LoopState_Rec.Playing,
              state_pause: LoopState_Pause.Playing,
            };
            return {
              trackArray: newTrackArray,
              measure: measure,
              bpm: bpm,
            };
          });
        }
        console.log(measure, bpm);
        return;
      }

      const mixedBuffer = loopUtils.mixBuffers(track.buffer, newBuffer);
      const quantizedBuffer = loopUtils.quantizeBuffer(
        mixedBuffer,
        bpm,
        measure
      );

      const newPlayer = loopUtils.createPlayer(
        quantizedBuffer,
        track.volume,
        track.state_trackFX !== LoopState_TrackFX.Off
          ? loopUtils.getTrackFxNodes(
              trackIndex,
              { trackFX: get().trackFX, masterFX: get().masterFX },
              { includeTrackFxNodes: true, includeMasterFxNodes: true }
            )
          : []
      );

      newPlayer.start();
      console.log(`PostOverdub: ${newBuffer.duration} `, newBuffer.length);
      console.log(measure, bpm);
      set((state) => {
        const newTrackArray = [...state.trackArray];
        newTrackArray[trackIndex] = {
          ...track,
          buffer: new Tone.ToneAudioBuffer(mixedBuffer),
          state_rec: LoopState_Rec.Playing,
          state_pause: LoopState_Pause.Playing,
          player: newPlayer,
        };
        return { trackArray: newTrackArray, measure: measure, bpm: bpm };
      });
    }
  },

  // playLoop: (trackIndex: TrackIndex) => {
  //   const trackArray = get().trackArray;
  //   const track = trackArray[trackIndex];

  //   if (track.buffer) {
  //     if (track.player) track.player.stop();
  //     const player = new Tone.Player(track.buffer).toDestination();
  //     player.loop = true;
  //     player.volume.value = track.volume;
  //     player.start();

  //     set((state) => {
  //       const newTrackArray = [...state.trackArray];
  //       newTrackArray[trackIndex] = {
  //         ...track,
  //         player,
  //         volume: track.volume,
  //         state_pause: LoopState_Pause.Playing,
  //         effects: track.effects,
  //       };
  //       return { trackArray: newTrackArray };
  //     });
  //   }
  // },

  stopLoop: (trackIndex: TrackIndex) => {
    set((state) => {
      const newTrackArray = [...state.trackArray];
      const track = newTrackArray[trackIndex];

      if (track.recorder.state == "started") track.recorder.stop();

      if (track.player) {
        track.player.stop();
        // track.player = null;
      }

      newTrackArray[trackIndex] = {
        ...track,
        state_pause: LoopState_Pause.Paused,
        state_rec:
          (track.state_rec === LoopState_Rec.Overdubbing && !track.player) ||
          track.state_rec !== LoopState_Rec.Playing
            ? LoopState_Rec.Idle
            : LoopState_Rec.Playing,
      };
      console.log(LoopState_Rec[newTrackArray[trackIndex].state_rec]);
      // const pitchShift = new Tone.PitchShift(-12);
      // const eq = new Tone.EQ3({ low: +12, mid: -3, high: -18 });
      // const distortion = new Tone.Distortion(0.3);
      // const reverb = new Tone.Reverb({ decay: 2, wet: 0.2 });
      // newTracks[trackIndex] = {
      //   ...track,
      //   //effects: [...(track.effects || []), pitchShift, eq, distortion, reverb],
      // };

      return {
        trackArray: newTrackArray,
      };
    });
  },

  changeVolume: (trackIndex: TrackIndex, volume: Track_Volume) => {
    set((state) => {
      const newTrackArray = [...state.trackArray];
      const track = newTrackArray[trackIndex];

      if (!track) return { trackArray: newTrackArray };

      const minDb = -40;
      const volumeDb =
        volume === 0 ? -Infinity : minDb + (volume / 100) * Math.abs(minDb);

      if (track.player) {
        track.player.volume.value = volumeDb;
      }

      track.volume = volume;
      return { trackArray: newTrackArray };
    });
  },

  updateTrackFXs: (trackIndex: TrackIndex) => {
    set((state) => {
      const newTrackArray = [...state.trackArray];
      const track = newTrackArray[trackIndex];

      if (!track.player) return { trackArray: newTrackArray };
      if (track.state_trackFX === LoopState_TrackFX.Off)
        return { trackArray: newTrackArray };

      const trackFxNodes = loopUtils.getTrackFxNodes(
        trackIndex,
        {
          trackFX: state.trackFX,
          masterFX: state.masterFX,
          inputFX: state.inputFX,
        },
        {
          includeTrackFxNodes: true,
          includeMasterFxNodes: true,
          includeInputFxNodes: true,
        }
      );
      console.log(trackFxNodes);
      track.player.disconnect();
      if (trackFxNodes.length > 0) {
        track.player.chain(...trackFxNodes, Tone.getDestination());
      } else {
        track.player.toDestination();
      }

      newTrackArray[trackIndex] = {
        ...track,
        player: track.player,
      };
      console.log(
        `TrackIndex is ${trackIndex}. trackFxNodes: ${trackFxNodes}. ContainerFxBundles: ${state.trackFX[
          trackIndex
        ].containerFxBundles.map((contBndl) => {
          return `${contBndl.bundleID}, ${contBndl.bundleParams.fxs.map(
            (fx) => {
              return fx.fxNode;
            }
          )}`;
        })} `
      );
      return { trackArray: newTrackArray };
    });
  },

  toggleTrackFX: (trackIndex: TrackIndex) => {
    set((state) => {
      const newTrackArray = [...state.trackArray];
      const track = newTrackArray[trackIndex];

      if (!track.player) return { trackArray: newTrackArray };

      const trackFxNodes = loopUtils.getTrackFxNodes(
        trackIndex,
        { trackFX: state.trackFX },
        { includeTrackFxNodes: true }
      );

      track.player.disconnect();

      if (
        track.state_trackFX === LoopState_TrackFX.Off &&
        trackFxNodes.length > 0
      ) {
        track.player.chain(...trackFxNodes, Tone.getDestination());
      } else {
        track.player.toDestination();
      }

      newTrackArray[trackIndex] = {
        ...track,
        player: track.player,
        state_trackFX:
          track.state_trackFX === LoopState_TrackFX.Off
            ? LoopState_TrackFX.On
            : LoopState_TrackFX.Off,
      };

      return { trackArray: newTrackArray };
    });
  },

  metronome: {
    bpm: null,
    measure: null,
    noteValue: 4,
    metronomeClock: null,
    metronomeSynth: null,
    volume: 50,
  },

  startMetronome: (
    bpm: Metronome_Bpm,
    measure: Metronome_Measure,
    noteValue: Metronome_NoteValue = 4
  ) => {
    if (!measure || !bpm || !noteValue) return;

    const synth = new Tone.NoiseSynth({
      noise: { type: "white" },
      envelope: { attack: 0.001, decay: 0.02, sustain: 0, release: 0.01 },
      volume:
        get().metronome.volume === 0
          ? -Infinity
          : -40 + (get().metronome.volume / 100) * 40,
    }).toDestination();

    let beat = 0;

    const clock = new Tone.Clock((time) => {
      const isStrongBeat = beat === 0;

      synth.envelope.decay = isStrongBeat ? 0.03 : 0.01;
      synth.triggerAttackRelease("8n", time);

      beat = (beat + 1) % measure;
    }, (bpm * (4 / noteValue)) / 60);

    clock.start();

    set((state) => {
      return {
        metronome: {
          ...state.metronome,
          bpm,
          measure,
          noteValue,
          metronomeClock: clock,
          metronomeSynth: synth,
        },
      };
    });
  },

  stopMetronome: async () => {
    set((state) => {
      const newMetronome = state.metronome;
      const { metronomeClock: clock, metronomeSynth: synth } = newMetronome;
      if (clock) {
        clock.stop();
        clock.dispose();
      }
      if (synth) {
        synth.dispose();
      }

      return {
        metronome: {
          ...newMetronome,
          bpm: null,
          measure: null,
          clock,
          synth,
        },
      };
    });
  },

  updateMetronome: (params: {
    bpm?: Metronome_Bpm;
    volume?: Metronome_Volume;
    measure?: Metronome_Measure;
    noteValue?: Metronome_NoteValue;
  }) => {
    set((state) => {
      const newMetronome = state.metronome;
      let { metronomeClock: newClock, metronomeSynth: newSynth } = newMetronome;

      if (params.bpm !== undefined && params.bpm !== null) {
        if (newClock) {
          newClock.frequency.value =
            (params.bpm * (4 / (params.noteValue ?? newMetronome.noteValue!))) /
            60;
        }
        newMetronome.bpm = params.bpm;
      }

      if (params.volume !== undefined) {
        const minDb = -40;
        const volumeDb =
          params.volume === 0
            ? -Infinity
            : minDb + (params.volume / 100) * Math.abs(minDb);
        if (newSynth) {
          newSynth.volume.value = volumeDb;
        }
        newMetronome.volume = params.volume;
      }

      if (params.measure !== undefined && params.noteValue !== undefined) {
        const wasRunning = !!newClock;

        if (newClock) {
          newClock.stop();
          newClock.dispose();
        }
        if (newSynth) {
          newSynth.dispose();
        }
        newSynth = new Tone.NoiseSynth({
          noise: { type: "white" },
          envelope: { attack: 0.001, decay: 0.02, sustain: 0, release: 0.01 },
          volume:
            newMetronome.volume === 0
              ? -Infinity
              : -40 + (newMetronome.volume / 100) * 40,
        }).toDestination();

        let beat = 0;
        newClock = new Tone.Clock((time) => {
          if (newSynth) {
            const isStrongBeat = beat === 0;
            newSynth.envelope.decay = isStrongBeat ? 0.03 : 0.01;
            newSynth.triggerAttackRelease("8n", time);
          }
          beat = (beat + 1) % params.measure!;
        }, ((params.bpm ?? newMetronome.bpm!) * (4 / params.noteValue!)) / 60);

        if (wasRunning) {
          newClock.start();
        }

        newMetronome.measure = params.measure;
        newMetronome.noteValue = params.noteValue;
        newMetronome.metronomeClock = newClock;
        newMetronome.metronomeSynth = newSynth;
      }

      return { metronome: newMetronome };
    });
  },
}));
