# Task 02 — AI Orchestration Layer & Acoustic Telemetry

**Goal**: Wire TabPFN bioacoustic classification, Gemma 2B grounding prompt generation, and ElevenLabs TTS into typed Rust service modules with transparent provider status and truthful audio fallbacks.

## Sub-tasks

### 2.1 `src/services/tabpfn_service.rs` — bioacoustic classification
- [x] `ClassificationResult` struct: `biophony_score: f32`, `anthrophony_score: f32`, `environment_tag: String`
- [x] `classify(features: &AcousticFeatures, config: &AppConfig, client: &reqwest::Client) -> ClassificationResult`
- [x] Upstream call: Prior Labs TabPFN tabular inference endpoint when API key configured
- [x] Resilient heuristic fallback: If API key missing or endpoint unreachable, derives bioacoustic balance from `biophony_ratio` and frequency thresholds
- [x] Supported `environment_tag` classifications: `"forest"`, `"urban_park"`, `"busy_street"`, `"coastal"`, `"meadow"`, `"indoor"`

### 2.2 `src/services/gemma_service.rs` — grounding prompt generation
- [x] `generate_prompt(features: &AcousticFeatures, classification: &ClassificationResult, config: &AppConfig, client: &reqwest::Client) -> Result<String, AppError>`
- [x] Anti-screen grounding instruction prompt:
  - Strict constraint: exactly ONE physical outdoor grounding sentence targeting immediate acoustic telemetry
  - No gamification, no screen tasks, no streaks, pure sensory awareness
- [x] Gemma 2B-IT via Google AI Studio API (`v1beta/models/gemma-2b-it:generateContent`)
- [x] Output post-processing: sanitizes quotation marks, prefixes, and markdown tags
- [x] Deterministic offline fallback prompt tailored to detected `environment_tag` and biophony score

### 2.3 `src/services/tts_service.rs` — audio synthesis & truthfulness invariant
- [x] `synthesize(text: &str, config: &AppConfig, client: &reqwest::Client) -> Result<Option<String>, AppError>`
- [x] ElevenLabs `/v1/text-to-speech/{voice_id}` streaming integration
- [x] Calm whisper voice profile: `eleven_turbo_v2` / `eleven_multilingual_v2` with stability 0.85
- [x] **Audio Truthfulness Invariant**:
  - Never fabricate acoustic telemetry or generate silent dummy MP3 files when ElevenLabs is unconfigured or offline
  - When synthesis is unavailable, cleanly returns `audio_url: ""` with `provider_status.elevenlabs_live: false`
  - Frontend detects `is_synthesized: false` and smoothly falls back to browser Web Speech API or visual whisper
- [x] Writes generated MP3 to isolated temporary directory (`AUDIO_TEMP_DIR`)

### 2.4 `src/models/mod.rs` — typed API contracts
- [x] `ProviderStatus` struct: `gemma_live: bool`, `tabpfn_live: bool`, `elevenlabs_live: bool`
- [x] `GroundRequest`: `audio_b64: String`, `sample_rate: Option<u32>`
- [x] `GroundResponse`: `prompt: String`, `audio_url: String`, `features: AcousticFeatures`, `classification: ClassificationResult`, `provider_status: ProviderStatus`

### 2.5 Audio File Serving & Cleanup
- [x] `GET /audio/:filename` route streaming generated MP3s with `Content-Type: audio/mpeg`
- [x] Path sanitization preventing directory traversal (`..` and absolute paths rejected)
- [x] Automatic file cleanup routine

## Acceptance Criteria
- Offline mode (without API keys): returns transparent telemetry with `gemma_live: false`, `tabpfn_live: false`, `elevenlabs_live: false`, valid heuristic features, and empty audio URL
- Live mode (with API keys): completes full AI orchestration in <4 seconds
- Audio truthfulness preserved: zero dummy silent MP3 generation
- All unit and service fallback tests pass
