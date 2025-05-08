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

type T_Reverb_FX = {
  readonly id: "REVERB";
  readonly name: "Reverb";

  wet: T_Num<{ min: 0; max: 1; default: 1 }> & { name: "D/W" };
  decay: T_Num<{ min: 0; max: 1; default: 0.5 }> & { name: "Decay" };
  preDelay: T_Num<{ min: 0; max: 1; default: 0.5 }> & { name: "PreDelay" };
};

type T_Distortion_FX = {
  readonly id: "DISTORTION";
  readonly name: "Distortion";

  wet: T_Num<{ min: 0; max: 1; default: 1 }> & { name: "D/W" };
  distortion: T_Num<{ min: 0; max: 1; default: 0.5 }> & { name: "Distortion" };
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

type T_BitCrusher_FX = {
  readonly id: "BITCRUSHER";
  readonly name: "BitCrusher";

  wet: T_Num<{ min: 0; max: 1; default: 1 }> & { name: "D/W" };
  bits: T_Num<{ min: 1; max: 16; default: 1; step: 1 }> & { name: "Bits" };
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
  frequency: T_Num<{ min: 0; max: 1000; default: 0; step: 50 }> & {
    name: "Frequency";
  };
};

// main params /////
type FX_ParamsTypes_List =
  | T_Reverb_FX
  | T_Distortion_FX
  | T_FeedbackDelay_FX
  | T_BitCrusher_FX
  | T_Phaser_FX
  | T_FrequencyShifter_FX;

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
  REVERB: { id: "REVERB", name: "Reverb" },
  DISTORTION: { id: "DISTORTION", name: "Distortion" },
  FEEDBACKDELAY: { id: "FEEDBACKDELAY", name: "FeedbackDelay" },
  BITCRUSHER: { id: "BITCRUSHER", name: "BitCrusher" },
  PHASER: { id: "PHASER", name: "Phaser" },
  FREQUENCYSHIFTER: { id: "FREQUENCYSHIFTER", name: "FrequencyShifter" },
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
  FEEDBACKDELAY: {
    wet: { value: 1 },
    delayTime: { value: 0.5 },
    feedback: { value: 0.5 },
  },
  BITCRUSHER: {
    wet: { value: 1 },
    bits: { value: 1 },
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
};
