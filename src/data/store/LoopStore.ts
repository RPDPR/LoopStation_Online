import { create } from "zustand";
import * as Tone from "tone";
import { loopUtils } from "./audioUtils/main.ts";
export enum LoopState_Rec {
  Idle,
  Recording,
  Overdubbing,
  Playing,
}

export const LoopState_Pause = {
  Playing: "Playing",
  Paused: "Paused",
} as const;

export type LoopState_Pause =
  (typeof LoopState_Pause)[keyof typeof LoopState_Pause];

export enum LoopState_FX {
  On,
  Off,
}

export interface Metronome {
  bpm: number | null;
  measure: number | null;
  noteValue: number | null;
  metronomeClock: Tone.Clock | null;
  metronomeSynth: Tone.NoiseSynth | null;
  volume: number;
}

export interface Track {
  state_rec: LoopState_Rec;
  state_pause: LoopState_Pause;
  state_fx: LoopState_FX;
  recorder: Tone.Recorder;
  buffer: Tone.ToneAudioBuffer | null;
  player: Tone.Player | null;
  volume: number;
  length: number | null;
  effects: Tone.ToneAudioNode[] | null;
}

interface LoopStore {
  tracks: Track[];
  bpm: number;
  setBpm: (value: number) => void;
  measure: number;
  setMeasure: (buffer: Tone.ToneAudioBuffer, bpm: number) => void;
  startRecording: (trackIndex: number) => Promise<void>;
  stopRecording: (trackIndex: number) => Promise<void>;
  // playLoop: (trackIndex: number) => void;
  stopLoop: (trackIndex: number) => void;
  changeVolume: (trackIndex: number, value: number) => void;
  toggleEffects: (trackIndex: number) => void;
  metronome: Metronome;
  startMetronome: (bpm: number, measure: number, noteValue: number) => void;
  stopMetronome: () => Promise<void>;
  updateMetronome: (params: {
    bpm?: number;
    volume?: number;
    measure?: number;
    noteValue?: number;
  }) => void;
}

export const useLoopStore = create<LoopStore>((set, get) => ({
  tracks: Array.from({ length: 5 }, () => ({
    state_rec: LoopState_Rec.Idle,
    state_pause: LoopState_Pause.Playing,
    state_fx: LoopState_FX.Off,
    recorder: new Tone.Recorder(),
    buffer: null,
    player: null,
    volume: 100,
    length: null,
    effects: null,
  })),

  bpm: 120,

  setBpm: (value: number) => {
    set((state) => {
      state.updateMetronome({ bpm: value });
      return { bpm: value };
    });
  },

  measure: 0,

  setMeasure: (buffer: Tone.ToneAudioBuffer, bpm: number) => {
    if (get().measure > 0) return;

    const quarterNotes = buffer.duration / (60 / bpm);
    const measure = Math.max(1, Math.round(quarterNotes));

    set({ measure });
  },

  startRecording: async (trackIndex) => {
    const tracks = get().tracks;
    const track = tracks[trackIndex];

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
        const newTracks = [...state.tracks];
        newTracks[trackIndex] = {
          ...track,
          state_pause: LoopState_Pause.Playing,
        };
        return { tracks: newTracks };
      });
      return;
    }

    await Tone.start();
    const mic = new Tone.UserMedia();
    await mic.open();
    mic.connect(track.recorder);

    track.recorder.start();

    set((state) => {
      const newTracks = [...state.tracks];
      newTracks[trackIndex] = {
        ...track,
        state_rec:
          track.state_rec === LoopState_Rec.Idle
            ? LoopState_Rec.Recording
            : LoopState_Rec.Overdubbing,
      };
      return { tracks: newTracks };
    });
  },

  stopRecording: async (trackIndex) => {
    const tracks = get().tracks;
    const track = tracks[trackIndex];
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
        const newTracks = [...state.tracks];
        newTracks[trackIndex] = {
          ...track,
          buffer: newBuffer,
          state_rec: LoopState_Rec.Overdubbing,
          state_pause: LoopState_Pause.Playing,
          effects: track.effects,
        };
        return {
          tracks: newTracks,
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
            track.effects
          );

          newPlayer.start(startTime);

          set((state) => {
            const newTracks = [...state.tracks];
            newTracks[trackIndex] = {
              ...track,
              player: newPlayer,
              state_rec: LoopState_Rec.Playing,
              state_pause: LoopState_Pause.Playing,
              effects: track.effects,
            };
            return {
              tracks: newTracks,
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
        track.effects
      );

      newPlayer.start();
      console.log(`PostOverdub: ${newBuffer.duration} `, newBuffer.length);
      console.log(measure, bpm);
      set((state) => {
        const newTracks = [...state.tracks];
        newTracks[trackIndex] = {
          ...track,
          buffer: new Tone.ToneAudioBuffer(mixedBuffer),
          state_rec: LoopState_Rec.Playing,
          state_pause: LoopState_Pause.Playing,
          player: newPlayer,
          effects: track.effects,
        };
        return { tracks: newTracks, measure: measure, bpm: bpm };
      });
    }
  },

  // playLoop: (trackIndex) => {
  //   const tracks = get().tracks;
  //   const track = tracks[trackIndex];

  //   if (track.buffer) {
  //     if (track.player) track.player.stop();
  //     const player = new Tone.Player(track.buffer).toDestination();
  //     player.loop = true;
  //     player.volume.value = track.volume;
  //     player.start();

  //     set((state) => {
  //       const newTracks = [...state.tracks];
  //       newTracks[trackIndex] = {
  //         ...track,
  //         player,
  //         volume: track.volume,
  //         state_pause: LoopState_Pause.Playing,
  //         effects: track.effects,
  //       };
  //       return { tracks: newTracks };
  //     });
  //   }
  // },

  stopLoop: (trackIndex) => {
    set((state) => {
      const newTracks = [...state.tracks];
      const track = newTracks[trackIndex];

      if (track.recorder.state == "started") track.recorder.stop();

      if (track.player) {
        track.player.stop();
        // track.player = null;
      }

      newTracks[trackIndex] = {
        ...track,
        state_pause: LoopState_Pause.Paused,
        state_rec:
          (track.state_rec === LoopState_Rec.Overdubbing && !track.player) ||
          track.state_rec !== LoopState_Rec.Playing
            ? LoopState_Rec.Idle
            : LoopState_Rec.Playing,
      };
      console.log(LoopState_Rec[newTracks[trackIndex].state_rec]);
      // const pitchShift = new Tone.PitchShift(-12);
      // const eq = new Tone.EQ3({ low: +12, mid: -3, high: -18 });
      // const distortion = new Tone.Distortion(0.3);
      // const reverb = new Tone.Reverb({ decay: 2, wet: 0.2 });
      // newTracks[trackIndex] = {
      //   ...track,
      //   //effects: [...(track.effects || []), pitchShift, eq, distortion, reverb],
      // };

      return {
        tracks: newTracks,
      };
    });
  },

  changeVolume: (trackIndex, value) => {
    set((state) => {
      const newTracks = [...state.tracks];
      const track = newTracks[trackIndex];

      if (!track) return { tracks: newTracks };

      const minDb = -40;
      const volumeDb =
        value === 0 ? -Infinity : minDb + (value / 100) * Math.abs(minDb);

      if (track.player) {
        track.player.volume.value = volumeDb;
      }

      track.volume = value;
      return { tracks: newTracks };
    });
  },

  toggleEffects: (trackIndex) => {
    set((state) => {
      const newTracks = [...state.tracks];
      const track = newTracks[trackIndex];

      if (track.player && track.effects) {
        track.player.disconnect();

        if (track.state_fx === LoopState_FX.Off) {
          track.player.chain(...track.effects, Tone.getDestination());
        } else {
          track.player.chain(Tone.getDestination());
        }
      }
      newTracks[trackIndex] = {
        ...track,
        player: track.player,
        state_fx:
          track.state_fx === LoopState_FX.Off
            ? LoopState_FX.On
            : LoopState_FX.Off,
      };
      console.log(track.state_fx);
      return { tracks: newTracks };
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

  startMetronome: (bpm, measure, noteValue = 4) => {
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
    const { metronomeClock: clock, metronomeSynth: synth } = get().metronome;
    if (clock) {
      clock.stop();
      clock.dispose();
    }
    if (synth) {
      synth.dispose();
    }
    set(() => {
      return {
        metronome: {
          ...get().metronome,
          bpm: null,
          measure: null,
          clock,
          synth,
        },
      };
    });
  },

  updateMetronome: (params: {
    bpm?: number;
    volume?: number;
    measure?: number;
    noteValue?: number;
  }) => {
    set((state) => {
      const { metronome } = state;
      const { metronomeClock: clock, metronomeSynth: synth } = metronome;
      let newClock = clock;
      let newSynth = synth;

      if (params.bpm !== undefined) {
        if (clock) {
          clock.frequency.value =
            (params.bpm * (4 / (params.noteValue ?? metronome.noteValue!))) /
            60;
        }
        metronome.bpm = params.bpm;
      }

      if (params.volume !== undefined) {
        const minDb = -40;
        const volumeDb =
          params.volume === 0
            ? -Infinity
            : minDb + (params.volume / 100) * Math.abs(minDb);
        if (synth) {
          synth.volume.value = volumeDb;
        }
        metronome.volume = params.volume;
      }

      if (params.measure !== undefined && params.noteValue !== undefined) {
        const wasRunning = !!clock;

        if (clock) {
          clock.stop();
          clock.dispose();
        }
        if (synth) {
          synth.dispose();
        }
        newSynth = new Tone.NoiseSynth({
          noise: { type: "white" },
          envelope: { attack: 0.001, decay: 0.02, sustain: 0, release: 0.01 },
          volume:
            metronome.volume === 0
              ? -Infinity
              : -40 + (metronome.volume / 100) * 40,
        }).toDestination();

        let beat = 0;
        newClock = new Tone.Clock((time) => {
          if (newSynth) {
            const isStrongBeat = beat === 0;
            newSynth.envelope.decay = isStrongBeat ? 0.03 : 0.01;
            newSynth.triggerAttackRelease("8n", time);
          }
          beat = (beat + 1) % params.measure!;
        }, ((params.bpm ?? metronome.bpm!) * (4 / params.noteValue!)) / 60);

        if (wasRunning) {
          newClock.start();
        }

        metronome.measure = params.measure;
        metronome.noteValue = params.noteValue;
        metronome.metronomeClock = newClock;
        metronome.metronomeSynth = newSynth;
      }

      return { metronome };
    });
  },
}));
