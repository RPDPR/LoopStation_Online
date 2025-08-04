import { Bundle } from "@data/store/FXStoreTypes.ts";
import {
  Recorder,
  ToneAudioBuffer,
  Gain,
  Player,
  Clock,
  NoiseSynth,
} from "tone";

// Main LoopStore types /////
export type TrackIndexArray = [0, 1, 2, 3, 4];
export type TrackIndex = TrackIndexArray[number];

export const trackIndexArray: TrackIndexArray = [0, 1, 2, 3, 4];

// <--------------> /////
export const LoopState_Rec = {
  Idle: "Idle",
  Recording: "Recording",
  Overdubbing: "Overdubbing",
  Playing: "Playing",
} as const;
export type LoopState_Rec = (typeof LoopState_Rec)[keyof typeof LoopState_Rec];
// <--------------> /////
export const LoopState_Pause = {
  Playing: "Playing",
  Paused: "Paused",
} as const;
export type LoopState_Pause =
  (typeof LoopState_Pause)[keyof typeof LoopState_Pause];
// <--------------> /////
export const LoopState_TrackFX = {
  On: "On",
  Off: "Off",
} as const;
export type LoopState_TrackFX =
  (typeof LoopState_TrackFX)[keyof typeof LoopState_TrackFX];
// <--------------> /////
export const LoopState_MasterFX = {
  On: "On",
  Off: "Off",
} as const;
export type LoopState_MasterFX =
  (typeof LoopState_MasterFX)[keyof typeof LoopState_MasterFX];
// <--------------> /////
export const LoopState_InputFX = {
  On: "On",
  Off: "Off",
} as const;
export type LoopState_InputFX =
  (typeof LoopState_InputFX)[keyof typeof LoopState_InputFX];
// <--------------> /////

// Main Measurements /////
export type System_Bpm = number;
export type System_Measure = number;

// Track types /////
export type Track_IsSelected = boolean;
export type Track_Recorder = Recorder;
export type Track_Buffer = ToneAudioBuffer | null;
export type Track_Player = Player | null;
export type Track_Volume = number;
export type Track_Length = number | null;

// Track params types /////
export type Track_OG_Value = number;
export type Track_OG_NodeValue = number;
export type Track_OG_Node = Gain;
export type Track_OG_Min = number;
export type Track_OG_Max = number;
export type Track_OG_Step = number;

export type Track_DW_Value = number;
export type Track_DW_NodeValue = number;
export type Track_DW_Nodes = { dryGain: Gain; wetGain: Gain };
export type Track_DW_Min = number;
export type Track_DW_Max = number;
export type Track_DW_Step = number;

export type TrackOutputGain = {
  value: Track_OG_Value;
  nodeValue: Track_OG_NodeValue;
  node: Track_OG_Node;
  min: Track_OG_Min;
  max: Track_OG_Max;
  step?: Track_OG_Step;
};
export type TrackDryWet = {
  value: Track_DW_Value;
  nodeValue: Track_DW_NodeValue;
  nodes: Track_DW_Nodes;
  min: Track_DW_Min;
  max: Track_DW_Max;
  step?: Track_DW_Step;
};

export type Track_Params = {
  outputGain: TrackOutputGain;
  dryWet: TrackDryWet;
};

// Metronome types /////
export type Metronome_Bpm = number | null;
export type Metronome_Measure = number | null;
export type Metronome_NoteValue = number | null;
export type Metronome_Clock = Clock | null;
export type Metronome_Synth = NoiseSynth | null;
export type Metronome_Volume = number;

// Main LoopStore interfaces /////
export interface Track {
  trackIsSelected: Track_IsSelected;
  trackParams: Track_Params;

  state_rec: LoopState_Rec;
  state_pause: LoopState_Pause;
  state_trackFX: LoopState_TrackFX;
  state_masterFX: LoopState_MasterFX;
  state_inputFX: LoopState_InputFX;
  recorder: Track_Recorder;
  buffer: Track_Buffer;
  player: Track_Player;
  volume: Track_Volume;
  length: Track_Length;
}
export type TrackArray = Track[];

// Metronome /////
export interface Metronome {
  bpm: Metronome_Bpm;
  measure: Metronome_Measure;
  noteValue: Metronome_NoteValue;
  metronomeClock: Metronome_Clock;
  metronomeSynth: Metronome_Synth;
  volume: Metronome_Volume;
}

// LoopStore /////
export interface LoopStore {
  trackArray: Track[];

  setTrackSelection: (
    trackIndex: TrackIndex,
    isSelected: Track_IsSelected
  ) => void;
  setTrackParams: (
    trackIndex: TrackIndex,
    params: {
      gainValue?: Track_OG_Value;
      dryWetValue?: Track_DW_Value;
    }
  ) => void;

  bpm: System_Bpm;
  measure: System_Measure;
  setBpm: (bpm: System_Bpm) => void;
  setMeasure: (buffer: Track_Buffer, bpm: System_Bpm) => void;

  startRecording: (trackIndex: TrackIndex) => Promise<void>;
  stopRecording: (trackIndex: TrackIndex) => Promise<void>;
  // playLoop: (trackIndex: TrackIndex) => void;
  stopLoop: (trackIndex: TrackIndex) => void;
  changeVolume: (trackIndex: TrackIndex, volume: Track_Volume) => void;
  updateTrackFXs: (trackIndex: TrackIndex) => void;
  toggleTrackFX: (trackIndex: TrackIndex) => void;

  metronome: Metronome;
  startMetronome: (
    bpm: Metronome_Bpm,
    measure: Metronome_Measure,
    noteValue: Metronome_NoteValue
  ) => void;
  stopMetronome: () => Promise<void>;
  updateMetronome: (params: {
    bpm?: Metronome_Bpm;
    volume?: Metronome_Volume;
    measure?: Metronome_Measure;
    noteValue?: Metronome_NoteValue;
  }) => void;
}

// Container Bundle Aliases /////
export type ContainerFxBundle = {
  bundleID: Bundle["bundleID"];
  bundleParams: Bundle["bundleParams"];
};
