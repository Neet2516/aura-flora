export interface AcousticFeatures {
  spectral_centroid: number;
  spectral_entropy: number;
  biophony_ratio: number;
  rms_db: number;
  zero_crossing_rate: number;
}

export interface ClassificationResult {
  biophony_score: number;
  anthrophony_score: number;
  environment_tag: string;
}

export interface GroundResponse {
  prompt: string;
  audio_url: string;
  features: AcousticFeatures;
  classification: ClassificationResult;
}

export type GroundingStatus =
  | 'idle'
  | 'recording'
  | 'processing'
  | 'readyForBlackout'
  | 'error';

export interface GroundingState {
  status: GroundingStatus;
  lastResponse: GroundResponse | null;
  errorMessage: string | null;
  recordingSeconds: number;
}
