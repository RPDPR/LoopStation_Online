interface I_ToneBaseParam<T> {
  value: T;
}

type T_ToneNumberParam<T extends { min: number; max: number; step?: number }> =
  I_ToneBaseParam<number> & {
    type: "number";
  } & T & { step: T extends { step: number } ? T["step"] : 0.1 };

type T_ToneStringParam<T extends { options: readonly string[] }> =
  I_ToneBaseParam<number> & {
    type: "string";
  } & T;

type T_Reverb_FX = {
  decay: T_ToneNumberParam<{ min: 0; max: 1 }>;
  preDelay: T_ToneNumberParam<{ min: 0; max: 1 }>;
};

type T_Distortion_FX = {
  distortion: T_ToneNumberParam<{ min: 0; max: 1 }>;
  oversample: T_ToneStringParam<{ options: ["none", "2x", "4x"] }>;
};
type T_FeedbackDelay_FX = {
  delayTime: T_ToneNumberParam<{ min: 0; max: 1 }>;
  feedback: T_ToneNumberParam<{ min: 0; max: 1 }>;
  maxDelay: T_ToneNumberParam<{ min: 0; max: 1 }>;
};

export type FX_ParamsTypes = {
  reverb: { id: Readonly<"REVERB"> } & T_Reverb_FX;
  distortion: { id: Readonly<"DISTORTION"> } & T_Distortion_FX;
  feedbackDelay: { id: Readonly<"FEEDBACKDELAY"> } & T_FeedbackDelay_FX;
};
