type T_FXParam = {
  NUMBER: {
    value: number;
    min: number;
    max: number;
    step?: number;
  };
  SELECT: {
    options: string[];
  };
};
type FXParamType = keyof T_FXParam;
type FXParam<T extends FXParamType, V> = V extends T_FXParam[T] ? V : never;

type T_Reverb_FX = {
  decay: FXParam<"NUMBER", { min: 0 }>;
  preDelay: number;
  wet: number;
};

type T_Distortion_FX = {
  distortion: number;
  oversample: "none" | "2x" | "4x";
  wet: number;
};

type T_FeedbackDelay_FX = {
  delayTime: number;
  feedback: number;
  wet: number;
};

export type FX_ParamsTypes = {
  reverb: T_Reverb_FX;
  distortion: T_Distortion_FX;
  feedbackDelay: T_FeedbackDelay_FX;
};
