import { FxID } from "./FXStoreTypes";

interface I_ToneBaseParam<T> {
  value: T;
  isMain?: boolean;
}

type T_Num<
  T extends {
    min: number;
    max: number;
    step?: number;
    default: number;
  }
> = I_ToneBaseParam<number> & {
  type: "number";
} & T & { step: T extends { step: number } ? T["step"] : 0.1 };

type T_Str<
  T extends {
    options: readonly string[];
    default: T["options"][number];
  }
> = I_ToneBaseParam<T["options"][number]> & {
  type: "string";
} & T;

type T_AutoPanner_FX = {
  readonly id: "AUTOPANNER";
  readonly name: "AutoPanner";

  wet: T_Num<{ min: 0; max: 1; default: 1 }> & { name: "D/W" };
  frequency: T_Num<{ min: 0.1; max: 20; default: 0.1; step: 0.1 }> & {
    name: "Frequency";
  };
  type: T_Str<{
    options: ["sine", "square", "triangle", "sawtooth"];
    default: "sine";
  }> & {
    name: "Type";
  };
  depth: T_Num<{ min: 0; max: 1; default: 1; step: 0.01 }> & {
    name: "Depth";
  };
};

type T_Reverb_FX = {
  readonly id: "REVERB";
  readonly name: "Reverb";

  wet: T_Num<{ min: 0; max: 1; default: 1 }> & { name: "D/W" };
  decay: T_Num<{ min: 0.01; max: 1; default: 0.5; step: 0.01 }> & {
    name: "Decay";
  };
  preDelay: T_Num<{ min: 0; max: 1; default: 0.5 }> & { name: "PreDelay" };
};

type T_Distortion_FX = {
  readonly id: "DISTORTION";
  readonly name: "Distortion";

  wet: T_Num<{ min: 0; max: 1; default: 1 }> & { name: "D/W" };
  distortion: T_Num<{ min: 0; max: 5; default: 0.5 }> & { name: "Distortion" };
  oversample: T_Str<{
    options: ["none", "2x", "4x"];
    default: "none";
  }> & { name: "Oversample" };
};

type T_Chebyshev_FX = {
  readonly id: "CHEBYSHEV";
  readonly name: "Chebyshev";

  wet: T_Num<{ min: 0; max: 1; default: 1 }> & { name: "D/W" };
  order: T_Num<{ min: 1; max: 100; default: 1; step: 1 }> & { name: "Order" };
  oversample: T_Str<{
    options: ["none", "2x", "4x"];
    default: "none";
  }> & { name: "Oversample" };
};

type T_FeedbackDelay_FX = {
  readonly id: "FEEDBACKDELAY";
  readonly name: "FeedbackDelay";

  wet: T_Num<{ min: 0; max: 1; default: 1 }> & { name: "D/W" };
  delayTime: T_Num<{ min: 0; max: 1; default: 0.5 }> & { name: "DelayTime" };
  feedback: T_Num<{ min: 0; max: 1; default: 0.5 }> & { name: "Feedback" };
};

type T_PitchShift_FX = {
  readonly id: "PITCHSHIFT";
  readonly name: "PitchShift";

  wet: T_Num<{ min: 0; max: 1; default: 1 }> & { name: "D/W" };
  feedback: T_Num<{ min: 0; max: 1; default: 0; step: 0.01 }> & {
    name: "Feedback";
  };
  pitch: T_Num<{ min: -12; max: 12; default: 0; step: 1 }> & {
    name: "Pitch";
  };
  windowSize: T_Num<{ min: 0.01; max: 1; default: 0.1; step: 0.01 }> & {
    name: "WindowSize";
  };
  delayTime: T_Num<{ min: 0; max: 1; default: 0; step: 0.01 }> & {
    name: "DelayTime";
  };
};

type T_BitCrusher_FX = {
  readonly id: "BITCRUSHER";
  readonly name: "BitCrusher";

  wet: T_Num<{ min: 0; max: 1; default: 1 }> & { name: "D/W" };
  bits: T_Num<{ min: 1; max: 16; default: 16; step: 1 }> & { name: "Bits" };
};

type T_Phaser_FX = {
  readonly id: "PHASER";
  readonly name: "Phaser";

  wet: T_Num<{ min: 0; max: 1; default: 1 }> & { name: "D/W" };
  frequency: T_Num<{ min: 0.1; max: 10; default: 0.5; step: 0.1 }> & {
    name: "Frequency";
  };
  octaves: T_Num<{ min: 1; max: 8; default: 3; step: 0.1 }> & {
    name: "Octaves";
  };
  baseFrequency: T_Num<{ min: 20; max: 2000; default: 350; step: 10 }> & {
    name: "BaseFrequency";
  };
  Q: T_Num<{ min: 0.1; max: 15; default: 1; step: 0.1 }> & { name: "Q" };
};

type T_FrequencyShifter_FX = {
  readonly id: "FREQUENCYSHIFTER";
  readonly name: "FrequencyShifter";

  wet: T_Num<{ min: 0; max: 1; default: 1 }> & { name: "D/W" };
  frequency: T_Num<{ min: 0; max: 2000; default: 0; step: 50 }> & {
    name: "Frequency";
  };
};

type T_Tremolo_FX = {
  readonly id: "TREMOLO";
  readonly name: "Tremolo";

  wet: T_Num<{ min: 0; max: 1; default: 1 }> & { name: "D/W" };
  frequency: T_Num<{ min: 0; max: 20; default: 0; step: 0.1 }> & {
    name: "Frequency";
  };
  type: T_Str<{
    options: ["sine", "square", "triangle", "sawtooth"];
    default: "sine";
  }> & {
    name: "Type";
  };
  depth: T_Num<{ min: 0; max: 1; default: 0.5; step: 0.01 }> & {
    name: "Depth";
  };
  spread: T_Num<{ min: 0; max: 180; default: 180; step: 1 }> & {
    name: "Spread";
  };
};

type T_EQ3_FX = {
  readonly id: "EQ3";
  readonly name: "EQ3";

  wet: T_Num<{ min: 0; max: 1; default: 1 }> & { name: "D/W" };
  low: T_Num<{ min: -60; max: 60; default: 0; step: 0.5 }> & {
    name: "Low";
  };
  mid: T_Num<{ min: -60; max: 60; default: 0; step: 0.5 }> & {
    name: "Mid";
  };
  high: T_Num<{ min: -60; max: 60; default: 0; step: 0.5 }> & {
    name: "High";
  };
  lowFrequency: T_Num<{ min: 0; max: 800; default: 400; step: 10 }> & {
    name: "LowFrequency";
  };
  highFrequency: T_Num<{ min: 0; max: 5000; default: 2500; step: 50 }> & {
    name: "HighFrequency";
  };
  Q: T_Num<{ min: 0.1; max: 15; default: 1; step: 0.1 }> & {
    name: "Q";
  };
};

type T_Compressor_FX = {
  readonly id: "COMPRESSOR";
  readonly name: "Compressor";

  threshold: T_Num<{ min: -100; max: 0; default: -24; step: 1 }> & {
    name: "Threshold";
  };
  ratio: T_Num<{ min: 1; max: 20; default: 12; step: 0.1 }> & {
    name: "Ratio";
  };
  attack: T_Num<{ min: 0.01; max: 1; default: 0.03; step: 0.01 }> & {
    name: "Attack";
  };
  release: T_Num<{ min: 0.01; max: 1; default: 0.25; step: 0.01 }> & {
    name: "Release";
  };
  knee: T_Num<{ min: 0; max: 40; default: 30; step: 1 }> & {
    name: "Knee";
  };
};

// main params /////
type FX_ParamsTypes_List =
  | T_AutoPanner_FX
  | T_Reverb_FX
  | T_Distortion_FX
  | T_Chebyshev_FX
  | T_FeedbackDelay_FX
  | T_PitchShift_FX
  | T_BitCrusher_FX
  | T_Phaser_FX
  | T_FrequencyShifter_FX
  | T_Tremolo_FX
  | T_EQ3_FX
  | T_Compressor_FX;

export type FX_ParamsTypes = {
  [FX in FX_ParamsTypes_List as FX["id"]]: FX;
};

export type FX_ID = keyof FX_ParamsTypes;
export type FX_NAME = FX_ParamsTypes[FxID]["name"];
// main params /////

type T_FX_PACK = {
  [K in FX_ID]: {
    id: FX_ParamsTypes[K]["id"];
    name: FX_ParamsTypes[K]["name"];
  };
};
export const FX_PACK: T_FX_PACK = {
  AUTOPANNER: { id: "AUTOPANNER", name: "AutoPanner" },
  REVERB: { id: "REVERB", name: "Reverb" },
  DISTORTION: { id: "DISTORTION", name: "Distortion" },
  CHEBYSHEV: { id: "CHEBYSHEV", name: "Chebyshev" },
  FEEDBACKDELAY: { id: "FEEDBACKDELAY", name: "FeedbackDelay" },
  PITCHSHIFT: { id: "PITCHSHIFT", name: "PitchShift" },
  BITCRUSHER: { id: "BITCRUSHER", name: "BitCrusher" },
  PHASER: { id: "PHASER", name: "Phaser" },
  FREQUENCYSHIFTER: { id: "FREQUENCYSHIFTER", name: "FrequencyShifter" },
  TREMOLO: { id: "TREMOLO", name: "Tremolo" },
  EQ3: { id: "EQ3", name: "EQ3" },
  COMPRESSOR: { id: "COMPRESSOR", name: "Compressor" },
};
export const FX_PACK_IDs = Object.values(FX_PACK).map((fx) => fx.id);

type T_FX_PARAMS_DEFAULTS = {
  [K in keyof FX_ParamsTypes]: {
    [P in keyof FX_ParamsTypes[K] as P extends "id" | "name"
      ? never
      : P]: FX_ParamsTypes[K][P] extends { default: infer D }
      ? FX_ParamsTypes[K][P] extends { isMain: infer M }
        ? { value: D; isMain: M }
        : { value: D }
      : never;
  };
};

export const FX_PARAMS_DEFAULTS: T_FX_PARAMS_DEFAULTS = {
  AUTOPANNER: {
    wet: { value: 1 },
    frequency: { value: 0.1 },
    type: { value: "sine" },
    depth: { value: 1 },
  },
  REVERB: {
    wet: { value: 1 },
    decay: { value: 0.5 },
    preDelay: { value: 0.5 },
  },
  DISTORTION: {
    wet: { value: 1 },
    distortion: { value: 0.5 },
    oversample: { value: "none" },
  },
  CHEBYSHEV: {
    wet: { value: 1 },
    order: { value: 1 },
    oversample: { value: "none" },
  },
  FEEDBACKDELAY: {
    wet: { value: 1 },
    delayTime: { value: 0.5 },
    feedback: { value: 0.5 },
  },
  PITCHSHIFT: {
    wet: { value: 1 },
    feedback: { value: 0 },
    pitch: { value: 0 },
    windowSize: { value: 0.1 },
    delayTime: { value: 0 },
  },
  BITCRUSHER: {
    wet: { value: 1 },
    bits: { value: 16 },
  },
  PHASER: {
    wet: { value: 1 },
    frequency: { value: 0.5 },
    octaves: { value: 3 },
    baseFrequency: { value: 350 },
    Q: { value: 1 },
  },
  FREQUENCYSHIFTER: {
    wet: { value: 1 },
    frequency: { value: 0 },
  },
  TREMOLO: {
    wet: { value: 1 },
    frequency: { value: 0 },
    type: { value: "sine" },
    depth: { value: 0.5 },
    spread: { value: 180 },
  },
  EQ3: {
    wet: { value: 1 },
    low: { value: 0 },
    mid: { value: 0 },
    high: { value: 0 },
    lowFrequency: { value: 400 },
    highFrequency: { value: 2500 },
    Q: { value: 1 },
  },
  COMPRESSOR: {
    threshold: { value: -24 },
    ratio: { value: 12 },
    attack: { value: 0.03 },
    release: { value: 0.25 },
    knee: { value: 30 },
  },
};
