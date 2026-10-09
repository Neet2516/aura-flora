import 'dart:convert';
import 'dart:typed_data';
import 'package:dio/dio.dart';
import '../core/constants/app_constants.dart';

/// Exception thrown when the backend API returns an error.
class ApiException implements Exception {
  final String message;
  final int? statusCode;

  const ApiException(this.message, {this.statusCode});

  @override
  String toString() =>
      'ApiException[$statusCode]: $message';
}

/// Acoustic features extracted by the backend DSP pipeline.
class AcousticFeatures {
  final double spectralCentroid;
  final double spectralEntropy;
  final double biophonyRatio;
  final double rmsDb;
  final double zeroCrossingRate;

  const AcousticFeatures({
    required this.spectralCentroid,
    required this.spectralEntropy,
    required this.biophonyRatio,
    required this.rmsDb,
    required this.zeroCrossingRate,
  });

  factory AcousticFeatures.fromJson(Map<String, dynamic> json) =>
      AcousticFeatures(
        spectralCentroid: (json['spectral_centroid'] as num).toDouble(),
        spectralEntropy: (json['spectral_entropy'] as num).toDouble(),
        biophonyRatio: (json['biophony_ratio'] as num).toDouble(),
        rmsDb: (json['rms_db'] as num).toDouble(),
        zeroCrossingRate: (json['zero_crossing_rate'] as num).toDouble(),
      );
}

/// Classification result from the backend's TabPFN / heuristic classifier.
class ClassificationResult {
  final double biophonyScore;
  final double anthrophonyScore;
  final String environmentTag;

  const ClassificationResult({
    required this.biophonyScore,
    required this.anthrophonyScore,
    required this.environmentTag,
  });

  factory ClassificationResult.fromJson(Map<String, dynamic> json) =>
      ClassificationResult(
        biophonyScore: (json['biophony_score'] as num).toDouble(),
        anthrophonyScore: (json['anthrophony_score'] as num).toDouble(),
        environmentTag: json['environment_tag'] as String,
      );
}

/// Complete response from the POST /api/v1/ground endpoint.
class GroundResponse {
  /// Single-sentence tactile outdoor grounding instruction.
  final String prompt;

  /// Absolute URL to the synthesized MP3 audio file.
  final String audioUrl;

  /// Extracted acoustic features.
  final AcousticFeatures features;

  /// Environment classification.
  final ClassificationResult classification;

  const GroundResponse({
    required this.prompt,
    required this.audioUrl,
    required this.features,
    required this.classification,
  });

  factory GroundResponse.fromJson(Map<String, dynamic> json) => GroundResponse(
        prompt: json['prompt'] as String,
        audioUrl: json['audio_url'] as String,
        features: AcousticFeatures.fromJson(
            json['features'] as Map<String, dynamic>),
        classification: ClassificationResult.fromJson(
            json['classification'] as Map<String, dynamic>),
      );

  /// Construct the full absolute audio URL from backend base URL + relative path.
  String absoluteAudioUrl(String baseUrl) {
    if (audioUrl.startsWith('http')) return audioUrl;
    return '$baseUrl$audioUrl';
  }
}

/// HTTP API client for the AuraFlora backend.
///
/// Uses [Dio] for typed JSON requests. Timeout: 15s, zero retries.
class ApiClient {
  late final Dio _dio;

  ApiClient({String? baseUrl}) {
    _dio = Dio(
      BaseOptions(
        baseUrl: baseUrl ?? AppConstants.backendBaseUrl,
        connectTimeout:
            const Duration(milliseconds: AppConstants.apiTimeoutMs),
        receiveTimeout:
            const Duration(milliseconds: AppConstants.apiTimeoutMs),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      ),
    );
  }

  /// Send audio bytes to the grounding endpoint.
  ///
  /// [audioBytes] — raw WAV file bytes (16 kHz, mono).
  ///
  /// Returns a [GroundResponse] with the grounding prompt and audio URL.
  /// Throws [ApiException] on network or server errors.
  Future<GroundResponse> groundMe(Uint8List audioBytes) async {
    final base64Audio = base64Encode(audioBytes);

    try {
      final response = await _dio.post<Map<String, dynamic>>(
        AppConstants.groundEndpoint,
        data: {
          'audio_b64': base64Audio,
          'sample_rate': AppConstants.recordSampleRate,
        },
      );

      if (response.data == null) {
        throw const ApiException('Empty response from server');
      }

      return GroundResponse.fromJson(response.data!);
    } on DioException catch (e) {
      final status = e.response?.statusCode;
      final message = e.response?.data?['error']?.toString() ??
          e.message ??
          'Network error';
      throw ApiException(message, statusCode: status);
    }
  }

  /// Check backend health.
  Future<bool> isHealthy() async {
    try {
      final response = await _dio.get<Map<String, dynamic>>('/health');
      return response.data?['status'] == 'ok';
    } catch (_) {
      return false;
    }
  }
}
