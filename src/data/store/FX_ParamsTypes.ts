export type FX_ParamsTypes = {
  reverb: T_Reverb_FX;
  distortion: T_Distortion_FX;
  feedbackDelay: T_FeedbackDelay_FX;
};

type T_Reverb_FX = {
  decay: number;
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
