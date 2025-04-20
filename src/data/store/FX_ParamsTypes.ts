interface I_ToneBaseParam<T> {
  value: T;
}

type T_Num<
  T extends { min: number; max: number; step?: number; default: number }
> = I_ToneBaseParam<number> & {
  type: "number";
} & T & { step: T extends { step: number } ? T["step"] : 0.1 };

type T_Str<T extends { options: readonly string[]; default: string }> =
  I_ToneBaseParam<string> & {
    type: "string";
  } & T;

type T_Reverb_FX = {
  readonly id: "REVERB";

  // PARAMS /////
  decay: T_Num<{ min: 0; max: 1; default: 0.5 }>;
  preDelay: T_Num<{ min: 0; max: 1; default: 0.5 }>;
};

type T_Distortion_FX = {
  readonly id: "DISTORTION";

  // PARAMS /////
  distortion: T_Num<{ min: 0; max: 1; default: 0.5 }>;
  oversample: T_Str<{ options: ["none", "2x", "4x"]; default: "none" }>;
};
type T_FeedbackDelay_FX = {
  readonly id: "FEEDBACKDELAY";

  // PARAMS /////
  delayTime: T_Num<{ min: 0; max: 1; default: 0.5 }>;
  feedback: T_Num<{ min: 0; max: 1; default: 0.5 }>;
  maxDelay: T_Num<{ min: 0; max: 1; default: 0.5 }>;
};

export type FX_ParamsTypes = {
  reverb: T_Reverb_FX;
  distortion: T_Distortion_FX;
  feedbackDelay: T_FeedbackDelay_FX;
};
