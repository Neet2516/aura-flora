export interface SpectralFeatures {
  spectral_centroid: number;
  spectral_entropy: number;
  biophony_ratio: number;
  rms_db: number;
  zero_crossing_rate: number;
}

export interface SoundscapeClassification {
  biophony_score: number;
  anthrophony_score: number;
  environment_tag: 'forest' | 'meadow' | 'creek' | 'urban_park' | 'rain' | 'coastal';
}

export interface GroundResponse {
  prompt: string;
  audio_url: string;
  features: SpectralFeatures;
  classification: SoundscapeClassification;
}

export type GroundingStatus = 
  | 'idle'
  | 'recording'
  | 'analyzing'
  | 'ready'
  | 'blackout'
  | 'error';

export interface SoundscapePreset {
  id: string;
  title: string;
  location: string;
  description: string;
  features: SpectralFeatures;
  classification: SoundscapeClassification;
  samplePrompt: string;
  audioToneType: 'forest' | 'creek' | 'rain' | 'meadow' | 'urban_park';
}
