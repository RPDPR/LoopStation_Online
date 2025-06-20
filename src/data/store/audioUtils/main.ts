import * as Tone from "tone";
import {
  FX_ParamsTypes,
  FX_ID,
  FX_PARAMS_DEFAULTS,
} from "@data/store/FX_ParamsTypes";
import { Bundle, T_FX_Node } from "@data/store/FXStoreTypes.ts";
import { FX_PARAMS_TEMPLATES } from "@data/store/FX_ParamsObjects.ts";
import {
  TrackFX,
  MasterFX,
  InputFX,
  ContainerFxBundle,
  Track_DW_NodeValue,
  Track_OG_NodeValue,
  Track_DW_Nodes,
  Track_OG_Node,
} from "@data/store/LoopStoreTypes.ts";

export const FXUtils = {
  splitFXParams<K extends keyof typeof FX_PARAMS_DEFAULTS>(
    fxParams: (typeof FX_PARAMS_DEFAULTS)[K]
  ) {
    const entries = Object.entries(fxParams) as [
      keyof typeof fxParams,
      { value: unknown; isMain?: boolean }
    ][];
    const mainEntries = entries.filter(([, val]) => val.isMain);
    const sideEntries = entries.filter(([, val]) => !val.isMain);

    const mainParams = Object.fromEntries(
      mainEntries.map(([key, val]) => [key, val.value])
    ) as {
      [P in keyof typeof fxParams as (typeof fxParams)[P] extends {
        isMain: true;
      }
        ? P
        : never]: (typeof fxParams)[P]["value"];
    };

    const sideParams = Object.fromEntries(
      sideEntries.map(([key, val]) => [key, val.value])
    ) as {
      [P in keyof typeof fxParams as (typeof fxParams)[P] extends {
        isMain: true;
      }
        ? never
        : P]: (typeof fxParams)[P]["value"];
    };

    return { mainParams, sideParams };
  },

  buildFxObject<T extends FX_ID>(
    fxID: T,
    fxParams: T_FX_Node[T] & { [key: string]: unknown }
  ): FX_ParamsTypes[T] {
    const template = FX_PARAMS_TEMPLATES[fxID];

    const fxEditableParams: typeof fxParams = Object.fromEntries(
      Object.entries(fxParams).filter(([paramKey]) => {
        return Object.keys(template).includes(paramKey);
      })
    );

    const filled = Object.fromEntries(
      Object.entries(template).map(([key, param]) => {
        if (key === "id" || key === "name") return [key, param];

        return [
          key,
          {
            ...param,
            value: fxEditableParams[key as keyof typeof fxEditableParams],
          },
        ];
      })
    );

    return filled as FX_ParamsTypes[T];
  },
};

export const loopUtils = {
  mixBuffers: (
    bufferA: Tone.ToneAudioBuffer | null,
    bufferB: Tone.ToneAudioBuffer
  ) => {
    const audioContext = Tone.getContext().rawContext;
    const mixedBuffer = audioContext.createBuffer(
      bufferA?.numberOfChannels || bufferB.numberOfChannels,
      Math.max(bufferA?.length || 0, bufferB.length),
      bufferB.sampleRate
    );

    for (let channel = 0; channel < bufferB.numberOfChannels; channel++) {
      const oldData =
        bufferA?.getChannelData(channel) ||
        new Float32Array(mixedBuffer.length);
      const newData = bufferB.getChannelData(channel);
      const mixedData = mixedBuffer.getChannelData(channel);

      for (let i = 0; i < mixedData.length; i++) {
        mixedData[i] = ((oldData[i] || 0) + (newData[i] || 0)) / 2;
      }
    }

    return new Tone.ToneAudioBuffer(mixedBuffer);
  },

  quantizeBuffer: (
    buffer: Tone.ToneAudioBuffer,
    bpm: number,
    measure: number
  ) => {
    const audioContext = Tone.getContext().rawContext;
    if (!buffer || buffer.length === 0) {
      return buffer;
    }

    const samplesPerBeat = buffer.sampleRate * (60 / bpm);
    const beatsLength = buffer.length / samplesPerBeat;

    const quantizedBeats = Math.max(
      1,
      Math.round(beatsLength / measure) * measure
    );
    const quantizedLength = Math.max(
      1,
      Math.round(quantizedBeats * samplesPerBeat)
    );

    const quantizedBuffer = audioContext.createBuffer(
      buffer.numberOfChannels,
      quantizedLength,
      buffer.sampleRate
    );

    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
      const oldData = buffer.getChannelData(channel);
      const newData = quantizedBuffer.getChannelData(channel);

      for (let i = 0; i < quantizedLength; i++) {
        newData[i] = oldData[i] || 0;
      }
    }

    return new Tone.ToneAudioBuffer(quantizedBuffer);
  },

  getTrackFxNodes: (
    trackIndex: number,
    bundleContainers: {
      trackFX?: TrackFX[];
      masterFX?: MasterFX;
      inputFX?: InputFX;
    },
    includeFlags: {
      includeTrackFxNodes?: boolean;
      includeMasterFxNodes?: boolean;
      includeInputFxNodes?: boolean;
    }
  ): Tone.ToneAudioNode[] => {
    const {
      includeTrackFxNodes = true,
      includeMasterFxNodes = true,
      includeInputFxNodes = false,
    } = includeFlags;

    const fxNodes: Tone.ToneAudioNode[] = [];

    if (includeTrackFxNodes && bundleContainers.trackFX) {
      const trackFxBundles =
        bundleContainers.trackFX[trackIndex].containerFxBundles;
      trackFxBundles.forEach((bundle) => {
        bundle.bundleParams.fxs.forEach((fx) => fxNodes.push(fx.fxNode!));
      });
    }

    if (includeMasterFxNodes && bundleContainers.masterFX) {
      bundleContainers.masterFX.containerFxBundles.forEach((bundle) => {
        bundle.bundleParams.fxs.forEach((fx) => fxNodes.push(fx.fxNode!));
      });
    }

    if (includeInputFxNodes && bundleContainers.inputFX) {
      bundleContainers.inputFX.containerFxBundles.forEach((bundle) => {
        bundle.bundleParams.fxs.forEach((fx) => fxNodes.push(fx.fxNode!));
      });
    }
    return fxNodes;
  },

  createPlayer: (
    buffer: Tone.ToneAudioBuffer,
    volume: number,
    fxNodesArray: Tone.ToneAudioNode[] | null,
    track_DW_nodeValue: Track_DW_NodeValue,
    track_OG_nodeValue: Track_OG_NodeValue
  ) => {
    // player creating /////
    const player = new Tone.Player(new Tone.ToneAudioBuffer(buffer));
    player.loop = true;
    player.disconnect();

    // player Volume /////
    const minDb = -40;
    const volumeDb =
      volume === 0 ? -Infinity : minDb + (volume / 100) * Math.abs(minDb);

    player.volume.value = volumeDb;

    // player outputGain /////
    const gainNode = new Tone.Gain(track_OG_nodeValue);

    // player dryWet /////
    const dryGain = new Tone.Gain(1 - track_DW_nodeValue);
    const wetGain = new Tone.Gain(track_DW_nodeValue);

    player.fan(dryGain, wetGain);

    if (fxNodesArray && fxNodesArray.length) {
      wetGain.chain(...fxNodesArray, gainNode);
    } else {
      wetGain.connect(gainNode);
    }
    dryGain.connect(gainNode);

    gainNode.toDestination();

    return player;
  },

  applyParamsToTrack: (
    player: Tone.Player,
    fxNodesArray: Tone.ToneAudioNode[] | null,
    track_DW_nodeValue: Track_DW_NodeValue,
    track_OG_nodeValue: Track_OG_NodeValue,
    track_DW_nodes: Track_DW_Nodes,
    track_OG_node: Track_OG_Node
  ) => {
    // player disconnecting /////
    player.disconnect();
    track_DW_nodes.dryGain.disconnect();
    track_DW_nodes.wetGain.disconnect();
    track_OG_node.disconnect();

    // params setting /////
    track_DW_nodes.dryGain.set({ gain: 1 - track_DW_nodeValue });
    track_DW_nodes.wetGain.set({ gain: track_DW_nodeValue });
    track_OG_node.set({ gain: track_OG_nodeValue });

    player.fan(track_DW_nodes.dryGain, track_DW_nodes.wetGain);

    if (fxNodesArray?.length) {
      track_DW_nodes.wetGain.chain(...fxNodesArray, track_OG_node);
    } else {
      track_DW_nodes.wetGain.connect(track_OG_node);
    }
    track_DW_nodes.dryGain.connect(track_OG_node);

    track_OG_node.toDestination();

    return player;
  },

  convertFxBundleToContainerFxBundle: (bundle: Bundle): ContainerFxBundle => {
    if (!bundle) {
      return {
        bundleID: -1,
        bundleParams: {
          fxs: [],
        },
      };
    }
    const containerFxBundle: ContainerFxBundle = {
      bundleID: bundle.bundleID,
      bundleParams: { ...bundle.bundleParams },
    };
    return containerFxBundle;
  },
};
