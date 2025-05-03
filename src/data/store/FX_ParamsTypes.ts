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

  wet: T_Num<{ min: 0; max: 1; default: 1 }> & { name: "Wet" };
  decay: T_Num<{ min: 0; max: 1; default: 0.5 }> & { name: "Decay" };
  preDelay: T_Num<{ min: 0; max: 1; default: 0.5 }> & { name: "PreDelay" };
};

type T_Distortion_FX = {
  readonly id: "DISTORTION";
  readonly name: "Distortion";

  wet: T_Num<{ min: 0; max: 1; default: 1 }> & { name: "Wet" };
  distortion: T_Num<{ min: 0; max: 1; default: 0.5 }> & { name: "Distortion" };
  oversample: T_Str<{
    options: ["none", "2x", "4x"];
    default: "none";
  }> & { name: "Oversample" };
};

type T_FeedbackDelay_FX = {
  readonly id: "FEEDBACKDELAY";
  readonly name: "FeedbackDelay";

  wet: T_Num<{ min: 0; max: 1; default: 1 }> & { name: "Wet" };
  delayTime: T_Num<{ min: 0; max: 1; default: 0.5 }> & { name: "DelayTime" };
  feedback: T_Num<{ min: 0; max: 1; default: 0.5 }> & { name: "Feedback" };
  maxDelay: T_Num<{ min: 0; max: 1; default: 0.5 }> & {
    name: "MaxDelay";
    isMain: true;
  };
};

// main params /////
export type FX_ParamsTypes = {
  reverb: T_Reverb_FX;
  distortion: T_Distortion_FX;
  feedbackDelay: T_FeedbackDelay_FX;
};
// main params /////

type T_FX_PACK = {
  [K in keyof FX_ParamsTypes]: {
    id: FX_ParamsTypes[K]["id"];
    name: FX_ParamsTypes[K]["name"];
  };
};
export const FX_PACK: T_FX_PACK = {
  reverb: { id: "REVERB", name: "Reverb" },
  distortion: { id: "DISTORTION", name: "Distortion" },
  feedbackDelay: { id: "FEEDBACKDELAY", name: "FeedbackDelay" },
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
  reverb: {
    wet: { value: 1 },
    decay: { value: 0.5 },
    preDelay: { value: 0.5 },
  },
  distortion: {
    wet: { value: 1 },
    distortion: { value: 0.5 },
    oversample: { value: "none" },
  },
  feedbackDelay: {
    wet: { value: 1 },
    delayTime: { value: 0.5 },
    feedback: { value: 0.5 },
    maxDelay: { value: 0.5, isMain: true },
  },
};
