/**
 * AuraFlora Native Web Audio & Procedural Bioacoustic Engine
 *
 * Implements real 16 kHz mono PCM microphone recording, true little-endian
 * integer sample encoding, live FFT frequency analysis, and reliable spoken
 * guidance synthesis with automatic fallback when remote TTS returns silence.
 */

export interface RecordedAudioResult {
  audioB64: string;
  sampleRate: number;
  samples: Float32Array;
  durationSec: number;
  rmsDb: number;
}

class SoundEngine {
  private ctx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private activeGenerators: { stop: () => void }[] = [];
  private micStream: MediaStream | null = null;
  private micSourceNode: MediaStreamAudioSourceNode | null = null;
  private micProcessorNode: ScriptProcessorNode | null = null;
  private micRecordedChunks: Float32Array[] = [];
  private isRecording = false;
  private isSynthesizing = false;
  private currentAudioElement: HTMLAudioElement | null = null;
  private activeSpeechSessionId: string | null = null;

  public getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public getAnalyser(): AnalyserNode {
    const ctx = this.getContext();
    if (!this.analyser) {
      this.analyser = ctx.createAnalyser();
      this.analyser.fftSize = 512;
      this.analyser.smoothingTimeConstant = 0.82;
    }
    return this.analyser;
  }

  // ===========================================================================
  // REAL MICROPHONE RECORDING (16 kHz Mono Signed 16-bit PCM)
  // ===========================================================================

  /**
   * Request microphone permission explicitly
   */
  public async requestMicPermission(): Promise<boolean> {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('Web Audio getUserMedia is not supported in this browser.');
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });
      // Release test tracks immediately
      stream.getTracks().forEach((t) => t.stop());
      return true;
    } catch (err: any) {
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        throw new Error('Microphone permission was denied. Please allow microphone access in your browser.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        throw new Error('No microphone device was detected on your system.');
      } else {
        throw new Error(`Microphone error: ${err.message || err.name}`);
      }
    }
  }

  /**
   * Start recording raw microphone PCM samples into Float32 buffers
   */
  public async startMicRecording(): Promise<void> {
    if (this.isRecording) {
      this.cancelMicRecording();
    }

    const ctx = this.getContext();
    const analyser = this.getAnalyser();

    this.micStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        channelCount: 1,
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false,
      },
    });

    this.micRecordedChunks = [];
    this.isRecording = true;

    // Connect source to analyser for live visualizer
    this.micSourceNode = ctx.createMediaStreamSource(this.micStream);
    this.micSourceNode.connect(analyser);

    // Buffer size 4096 gives ~85ms buffer at 48kHz, very reliable across browsers
    this.micProcessorNode = ctx.createScriptProcessor(4096, 1, 1);
    this.micProcessorNode.onaudioprocess = (e) => {
      if (!this.isRecording) return;
      const inputData = e.inputBuffer.getChannelData(0);
      // Copy array data into a new Float32Array to avoid buffer mutation
      this.micRecordedChunks.push(new Float32Array(inputData));
    };

    // Route processor to a muted gain node so audio flows through the graph
    // without creating acoustic feedback through device speakers
    const muteGain = ctx.createGain();
    muteGain.gain.setValueAtTime(0, ctx.currentTime);

    this.micSourceNode.connect(this.micProcessorNode);
    this.micProcessorNode.connect(muteGain);
    muteGain.connect(ctx.destination);
  }

  /**
   * Stop microphone recording, resample to 16 kHz mono, and encode to 16-bit signed PCM Base64
   */
  public async stopMicRecording(): Promise<RecordedAudioResult> {
    this.isRecording = false;

    // Disconnect and release audio nodes
    if (this.micProcessorNode) {
      this.micProcessorNode.onaudioprocess = null;
      try {
        this.micProcessorNode.disconnect();
      } catch {}
      this.micProcessorNode = null;
    }

    if (this.micSourceNode) {
      try {
        this.micSourceNode.disconnect();
      } catch {}
      this.micSourceNode = null;
    }

    // Stop all media stream hardware tracks immediately
    if (this.micStream) {
      this.micStream.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch {}
      });
      this.micStream = null;
    }

    // Assemble all captured Float32 chunks
    let totalSamples = 0;
    for (const chunk of this.micRecordedChunks) {
      totalSamples += chunk.length;
    }

    if (totalSamples === 0) {
      throw new Error('No audio data was captured during recording.');
    }

    const mergedFloat32 = new Float32Array(totalSamples);
    let offset = 0;
    for (const chunk of this.micRecordedChunks) {
      mergedFloat32.set(chunk, offset);
      offset += chunk.length;
    }
    this.micRecordedChunks = [];

    const inputSampleRate = this.ctx ? this.ctx.sampleRate : 48000;
    const targetSampleRate = 16000;

    // Resample down to 16,000 Hz if needed
    const resampled = this.resampleTo16k(mergedFloat32, inputSampleRate, targetSampleRate);

    // Compute RMS and RMS dB
    let sumSquares = 0;
    for (let i = 0; i < resampled.length; i++) {
      sumSquares += resampled[i] * resampled[i];
    }
    const rms = Math.sqrt(sumSquares / Math.max(1, resampled.length));
    const rmsDb = 20 * Math.log10(Math.max(rms, 0.00001));

    // Convert to Little-Endian 16-bit Signed PCM
    const pcmBuffer = this.floatTo16BitPCM(resampled);

    if (pcmBuffer.byteLength < 512) {
      throw new Error('Audio sample is too short. Please speak or hold phone toward the environment.');
    }

    const audioB64 = this.arrayBufferToBase64(pcmBuffer);
    const durationSec = resampled.length / targetSampleRate;

    return {
      audioB64,
      sampleRate: targetSampleRate,
      samples: resampled,
      durationSec,
      rmsDb: Number(rmsDb.toFixed(1)),
    };
  }

  /**
   * Cancel and cleanup recording session
   */
  public cancelMicRecording(): void {
    this.isRecording = false;
    this.micRecordedChunks = [];

    if (this.micProcessorNode) {
      this.micProcessorNode.onaudioprocess = null;
      try {
        this.micProcessorNode.disconnect();
      } catch {}
      this.micProcessorNode = null;
    }

    if (this.micSourceNode) {
      try {
        this.micSourceNode.disconnect();
      } catch {}
      this.micSourceNode = null;
    }

    if (this.micStream) {
      this.micStream.getTracks().forEach((t) => {
        try {
          t.stop();
        } catch {}
      });
      this.micStream = null;
    }
  }

  /**
   * Linear interpolation resampler from source sample rate to 16,000 Hz
   */
  private resampleTo16k(input: Float32Array, inputRate: number, targetRate = 16000): Float32Array {
    if (inputRate === targetRate) return input;

    const ratio = inputRate / targetRate;
    const outputLength = Math.round(input.length / ratio);
    const output = new Float32Array(outputLength);

    for (let i = 0; i < outputLength; i++) {
      const srcIndex = i * ratio;
      const indexFloor = Math.floor(srcIndex);
      const indexCeil = Math.min(input.length - 1, indexFloor + 1);
      const frac = srcIndex - indexFloor;
      output[i] = input[indexFloor] * (1 - frac) + input[indexCeil] * frac;
    }

    return output;
  }

  /**
   * Converts Float32Array (-1.0 to 1.0) into 16-bit signed integer little-endian ArrayBuffer
   */
  private floatTo16BitPCM(samples: Float32Array): ArrayBuffer {
    const buffer = new ArrayBuffer(samples.length * 2);
    const view = new DataView(buffer);

    for (let i = 0; i < samples.length; i++) {
      const s = Math.max(-1, Math.min(1, samples[i]));
      // Scale to signed 16-bit range (-32768 to 32767)
      const val = s < 0 ? s * 0x8000 : s * 0x7fff;
      view.setInt16(i * 2, val, true); // true = Little-Endian
    }

    return buffer;
  }

  /**
   * Convert ArrayBuffer to Base64 in chunks to avoid call stack limits
   */
  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    const chunkSize = 0x8000; // 32KB chunking

    for (let i = 0; i < bytes.length; i += chunkSize) {
      binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunkSize) as any);
    }

    return btoa(binary);
  }

  // ===========================================================================
  // RELIABLE SPOKEN GUIDANCE PLAYBACK
  // ===========================================================================

  /**
   * Deliver spoken guidance corresponding to the current grounding instruction.
   *
   * Verifies that remote audio is valid. If remote audio is missing, silent
   * (e.g. 40-byte placeholder from ElevenLabs fallback), or errors, it seamlessly
   * uses Web Speech API (window.speechSynthesis) with deliberate, calm timing (~6s).
   */
  public async speakPrompt(
    text: string,
    audioUrl?: string,
    onEnd?: () => void,
    sessionId?: string
  ): Promise<void> {
    const currentSession = sessionId || Math.random().toString(36).substring(2);
    this.activeSpeechSessionId = currentSession;
    this.stopSpeaking();

    let remoteAudioSucceeded = false;

    // Check if remote audioUrl is provided and test if it's real audio (not the 40-byte silent fallback)
    if (audioUrl && audioUrl.trim().length > 0) {
      try {
        const backendOrigin = import.meta.env.VITE_BACKEND_URL || '';
        const fullUrl = audioUrl.startsWith('http')
          ? audioUrl
          : `${backendOrigin}${audioUrl.startsWith('/') ? '' : '/'}${audioUrl}`;

        // Probe the audio URL to verify file size > 512 bytes
        const probeRes = await fetch(fullUrl, { method: 'GET' });
        if (probeRes.ok) {
          const blob = await probeRes.blob();
          // If blob is tiny (like the 40-byte silent frame), do not play silence
          if (blob.size > 512) {
            const objectUrl = URL.createObjectURL(blob);
            const audio = new Audio(objectUrl);
            this.currentAudioElement = audio;

            await new Promise<void>((resolve, reject) => {
              audio.onended = () => {
                URL.revokeObjectURL(objectUrl);
                this.currentAudioElement = null;
                remoteAudioSucceeded = true;
                if (this.activeSpeechSessionId === currentSession && onEnd) {
                  onEnd();
                }
                resolve();
              };
              audio.onerror = (e) => {
                URL.revokeObjectURL(objectUrl);
                this.currentAudioElement = null;
                reject(e);
              };
              audio.play().catch(reject);
            });
          }
        }
      } catch (err) {
        console.info('Remote audio stream unavailable or silent fallback detected. Engaging Web Speech engine:', err);
      }
    }

    if (remoteAudioSucceeded) return;

    // Fallback: Native browser speech synthesis
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      // Tempo target: ~6 seconds for a 15-20 word sentence
      utterance.rate = 0.82;
      utterance.pitch = 0.95;
      utterance.volume = 1.0;

      // Select natural English voice if available
      const voices = window.speechSynthesis.getVoices();
      const naturalVoice = voices.find(
        (v) =>
          v.lang.startsWith('en') &&
          (v.name.includes('Natural') ||
            v.name.includes('Daniel') ||
            v.name.includes('Samantha') ||
            v.name.includes('Google US English') ||
            v.name.includes('Ava') ||
            v.name.includes('Karen'))
      );
      if (naturalVoice) {
        utterance.voice = naturalVoice;
      }

      utterance.onend = () => {
        if (this.activeSpeechSessionId === currentSession && onEnd) {
          onEnd();
        }
      };

      utterance.onerror = (err) => {
        console.warn('Speech synthesis error:', err);
        if (this.activeSpeechSessionId === currentSession && onEnd) {
          onEnd();
        }
      };

      window.speechSynthesis.speak(utterance);
    } else {
      // Fallback timer if speech synthesis is completely absent
      if (onEnd) {
        setTimeout(() => {
          if (this.activeSpeechSessionId === currentSession) {
            onEnd();
          }
        }, 5500);
      }
    }
  }

  public stopSpeaking(): void {
    this.activeSpeechSessionId = null;

    if (this.currentAudioElement) {
      try {
        this.currentAudioElement.pause();
        this.currentAudioElement.currentTime = 0;
      } catch {}
      this.currentAudioElement = null;
    }

    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
  }

  // ===========================================================================
  // PROCEDURAL BIOME AMBIENCE (For Lab Explorations & Soundscape Library)
  // ===========================================================================

  public playAmbient(type: 'forest' | 'creek' | 'rain' | 'meadow' | 'urban_park'): void {
    this.stopAmbient();
    const ctx = this.getContext();
    const analyser = this.getAnalyser();

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.32, ctx.currentTime);
    masterGain.connect(analyser);
    analyser.connect(ctx.destination);

    this.isSynthesizing = true;

    // Pink/Brown noise generator
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.969 * b2 + white * 0.153852;
      b3 = 0.8665 * b3 + white * 0.3104856;
      b4 = 0.55 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.016898;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.055;
      b6 = white * 0.115926;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    const filter = ctx.createBiquadFilter();
    if (type === 'forest') {
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, ctx.currentTime);
    } else if (type === 'creek') {
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, ctx.currentTime);
      filter.Q.setValueAtTime(1.2, ctx.currentTime);
    } else if (type === 'rain') {
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2200, ctx.currentTime);
      filter.Q.setValueAtTime(0.8, ctx.currentTime);
    } else if (type === 'meadow') {
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(650, ctx.currentTime);
    } else {
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, ctx.currentTime);
    }

    noiseSource.connect(filter);
    filter.connect(masterGain);
    noiseSource.start();

    let intervalId: any = null;
    if (type === 'forest' || type === 'meadow') {
      intervalId = setInterval(() => {
        if (!this.isSynthesizing || !this.ctx) return;
        this.triggerChirp(this.ctx, masterGain, type === 'meadow' ? 4200 : 2800);
      }, 1800);
    } else if (type === 'creek') {
      intervalId = setInterval(() => {
        if (!this.isSynthesizing || !this.ctx) return;
        this.triggerDroplet(this.ctx, masterGain);
      }, 750);
    }

    this.activeGenerators.push({
      stop: () => {
        try {
          noiseSource.stop();
          noiseSource.disconnect();
          if (intervalId) clearInterval(intervalId);
          masterGain.disconnect();
        } catch {}
      },
    });
  }

  private triggerChirp(ctx: AudioContext, destination: AudioNode, baseFreq: number): void {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;

    osc.type = 'sine';
    const variance = (Math.random() - 0.5) * 400;
    osc.frequency.setValueAtTime(baseFreq + variance, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq + variance + 700, now + 0.08);
    osc.frequency.exponentialRampToValueAtTime(baseFreq + variance - 200, now + 0.18);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.06, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

    osc.connect(gain);
    gain.connect(destination);

    osc.start(now);
    osc.stop(now + 0.24);
  }

  private triggerDroplet(ctx: AudioContext, destination: AudioNode): void {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;

    const startFreq = 800 + Math.random() * 900;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(startFreq + 1100, now + 0.12);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.045, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);

    osc.connect(gain);
    gain.connect(destination);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  public stopAmbient(): void {
    this.isSynthesizing = false;
    this.activeGenerators.forEach((gen) => gen.stop());
    this.activeGenerators = [];
  }

  public playHaptic(): void {
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.05);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch {}
  }
}

export const soundEngine = new SoundEngine();
