# Task 02 — AI Orchestration Layer

**Goal**: Wire TabPFN classification, Gemma prompt generation, and ElevenLabs TTS into typed Rust service modules.

## Sub-tasks

### 2.1 `src/services/tabpfn_service.rs`
- [x] `ClassificationResult` struct: `biophony_score: f32`, `anthrophony_score: f32`, `environment_tag: String`
- [x] `classify(features: &AcousticFeatures, config: &AppConfig) -> Result<ClassificationResult>`
- [x] Implementation: Send acoustic feature vector to TabPFN inference endpoint
- [x] Fallback: If API unavailable, derive score from `biophony_ratio` heuristic
- [x] `environment_tag` values: `"forest"`, `"urban_park"`, `"busy_street"`, `"coastal"`, `"meadow"`, `"indoor"`

### 2.2 `src/services/gemma_service.rs`
- [x] `generate_prompt(features: &AcousticFeatures, classification: &ClassificationResult, config: &AppConfig) -> Result<String>`
- [x] System prompt: _"You are AuraFlora. Generate exactly ONE sentence — a specific, physical, sensory outdoor grounding action. Target the user's immediate environment: {environment_tag}. Biophony: {biophony_score:.0%}. No screen time. No digital tasks. Pure tactile reality."_
- [x] Use Gemma 2B-IT via Google AI Studio API
- [x] Temperature: 0.7, max_tokens: 80
- [x] Strip quotes and trailing punctuation from response

### 2.3 `src/services/tts_service.rs`
- [x] `synthesize(text: &str, config: &AppConfig) -> Result<Vec<u8>>`
- [x] Call ElevenLabs `/v1/text-to-speech/{voice_id}/stream`
- [x] Model: `eleven_turbo_v2`, voice settings: stability 0.9, similarity_boost 0.5 (calm whisper)
- [x] Return raw MP3 bytes
- [x] Backend stores audio as temp file, returns relative URL path `/audio/{uuid}.mp3`

### 2.4 Audio File Serving
- [x] `GET /audio/:filename` route — serve temp MP3 files
- [x] Files auto-deleted after 60 seconds (tokio spawn cleanup task)

## Acceptance Criteria
- Mock mode (no API keys): returns deterministic test prompt + silence MP3
- With API keys: full pipeline executes in < 8 seconds end-to-end
- `cargo test services::*` passes
