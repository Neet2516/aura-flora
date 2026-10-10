import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { Colors } from '../theme/colors';
import { Config } from '../constants/config';
import { GroundResponse } from '../types';
import { AudioService } from '../services/audio';

interface BlackoutScreenProps {
  response: GroundResponse;
  onExit: () => void;
}

export const BlackoutScreen: React.FC<BlackoutScreenProps> = ({
  response,
  onExit,
}) => {
  const [isAudioDone, setIsAudioDone] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const lastTapRef = useRef<number>(0);

  useEffect(() => {
    // Enable wakelock so screen stays on without timing out
    activateKeepAwakeAsync().catch(() => {});

    // Fade in faint hints after 1.5s
    const fadeTimer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    }, 1500);

    // Start audio playback
    const fullAudioUrl = response.audio_url
      ? response.audio_url.startsWith('http')
        ? response.audio_url
        : `${Config.backendBaseUrl}${response.audio_url}`
      : '';

    AudioService.playAudio(fullAudioUrl, () => {
      setIsAudioDone(true);
    });

    return () => {
      clearTimeout(fadeTimer);
      deactivateKeepAwake().catch(() => {});
      AudioService.stopAudio();
    };
  }, [response]);

  const handleDoubleTap = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 350;

    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      AudioService.stopAudio();
      deactivateKeepAwake().catch(() => {});
      onExit();
    } else {
      lastTapRef.current = now;
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handleDoubleTap}>
      <View style={styles.blackoutContainer}>
        <Animated.View style={[styles.hintsWrapper, { opacity: fadeAnim }]}>
          <Text style={styles.primaryHint}>Screen locked. Look up.</Text>
          <Text style={styles.subHint}>Double-tap to exit</Text>

          {isAudioDone && <Text style={styles.completionDot}>·</Text>}
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  blackoutContainer: {
    flex: 1,
    backgroundColor: Colors.blackout,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hintsWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryHint: {
    color: Colors.hintWhite,
    fontSize: 16,
    letterSpacing: 2,
    fontWeight: '400',
    textAlign: 'center',
    marginBottom: 12,
  },
  subHint: {
    color: Colors.hintWhiteFaint,
    fontSize: 12,
    letterSpacing: 1.5,
    fontWeight: '300',
    textAlign: 'center',
  },
  completionDot: {
    color: 'rgba(255, 255, 255, 0.05)',
    fontSize: 24,
    marginTop: 36,
  },
});
