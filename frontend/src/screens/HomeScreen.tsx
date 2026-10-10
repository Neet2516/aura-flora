import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { Colors } from '../theme/colors';
import { Config } from '../constants/config';
import { GroundResponse, GroundingStatus } from '../types';
import { PulseButton } from '../components/PulseButton';
import { SensoryBadge } from '../components/SensoryBadge';
import { AudioService } from '../services/audio';
import { ApiService } from '../services/api';

interface HomeScreenProps {
  onEnterBlackout: (response: GroundResponse) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onEnterBlackout }) => {
  const [status, setStatus] = useState<GroundingStatus>('idle');
  const [lastResponse, setLastResponse] = useState<GroundResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [badgeVisible, setBadgeVisible] = useState(false);

  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const recordingStartRef = useRef<number | null>(null);
  const errorTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up timers
  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) clearTimeout(recordingTimerRef.current);
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
    };
  }, []);

  const showError = (msg: string) => {
    setErrorMessage(msg);
    setStatus('error');
    if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
    errorTimerRef.current = setTimeout(() => {
      setErrorMessage(null);
      setStatus('idle');
    }, Config.errorDismissMs);
  };

  const handleStartGrounding = async () => {
    if (status !== 'idle') return;

    try {
      const hasPerm = await AudioService.requestPermissions();
      if (!hasPerm) {
        showError('Microphone permission required for soundscape grounding.');
        return;
      }

      await AudioService.startRecording();
      recordingStartRef.current = Date.now();
      setStatus('recording');

      // Auto-stop at maxRecordingMs (10s)
      recordingTimerRef.current = setTimeout(() => {
        handleStopAndProcess();
      }, Config.maxRecordingMs);
    } catch (e: any) {
      showError(e.message || 'Could not start microphone');
    }
  };

  const handleStopRecordingEarly = async () => {
    if (status !== 'recording') return;

    if (recordingTimerRef.current) {
      clearTimeout(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }

    const elapsed = recordingStartRef.current
      ? Date.now() - recordingStartRef.current
      : 5000;

    if (elapsed < Config.minRecordingMs) {
      // Wait remaining time up to minRecordingMs
      const remaining = Config.minRecordingMs - elapsed;
      setTimeout(() => {
        handleStopAndProcess();
      }, remaining);
    } else {
      await handleStopAndProcess();
    }
  };

  const handleStopAndProcess = async () => {
    if (recordingTimerRef.current) {
      clearTimeout(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }

    setStatus('processing');

    try {
      const audioB64 = await AudioService.stopRecording();
      const response = await ApiService.groundMe(audioB64);

      setLastResponse(response);
      setStatus('readyForBlackout');
      setBadgeVisible(true);

      // Show detected sensory badge for 2 seconds, then enter blackout
      setTimeout(() => {
        setBadgeVisible(false);
        onEnterBlackout(response);
        // Reset status for when user returns
        setTimeout(() => {
          setStatus('idle');
        }, 500);
      }, Config.badgeDisplayMs);
    } catch (e: any) {
      showError('Could not process soundscape. Try again outdoors.');
    }
  };

  const isRecording = status === 'recording';
  const isProcessing = status === 'processing';
  const isDisabled = status === 'processing' || status === 'readyForBlackout';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>AURAFLORA</Text>
          <Text style={styles.subtitle}>PRESS · LISTEN · GO</Text>
        </View>

        {/* Center: Pulse Button & Activity indicator */}
        <View style={styles.centerSection}>
          <PulseButton
            isRecording={isRecording}
            isDisabled={isDisabled}
            onPress={isRecording ? handleStopRecordingEarly : handleStartGrounding}
          />

          {isProcessing && (
            <View style={styles.processingRow}>
              <ActivityIndicator size="small" color={Colors.herbalLight} />
              <Text style={styles.processingText}>reading the air</Text>
            </View>
          )}

          {isRecording && (
            <View style={styles.statusLabelContainer}>
              <Text style={styles.listeningText}>listening...</Text>
            </View>
          )}

          {status === 'readyForBlackout' && (
            <View style={styles.statusLabelContainer}>
              <Text style={styles.groundedText}>grounded.</Text>
            </View>
          )}
        </View>

        {/* Bottom Sensory Badge */}
        <View style={styles.bottomSection}>
          <SensoryBadge
            environmentTag={lastResponse?.classification.environment_tag || 'forest'}
            visible={badgeVisible}
          />
        </View>

        {/* Error Notification Pill */}
        {status === 'error' && errorMessage && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.forestDeep,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 36,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 6,
    color: Colors.sand,
  },
  subtitle: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 3,
    color: Colors.sandMuted,
    marginTop: 8,
  },
  centerSection: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  processingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    gap: 8,
  },
  processingText: {
    color: Colors.sandFaint,
    fontSize: 13,
    letterSpacing: 2,
    fontWeight: '500',
  },
  statusLabelContainer: {
    marginTop: 24,
  },
  listeningText: {
    color: Colors.herbalLight,
    fontSize: 13,
    letterSpacing: 2,
    fontWeight: '500',
  },
  groundedText: {
    color: Colors.herbalLight,
    fontSize: 13,
    letterSpacing: 2,
    fontWeight: '600',
  },
  bottomSection: {
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  errorBanner: {
    position: 'absolute',
    bottom: 80,
    backgroundColor: Colors.mossMuted,
    borderWidth: 1,
    borderColor: 'rgba(139, 74, 74, 0.4)',
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 12,
    maxWidth: '90%',
  },
  errorText: {
    color: Colors.sand,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
});
