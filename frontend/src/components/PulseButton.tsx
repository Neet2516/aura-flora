import React, { useEffect, useRef } from 'react';
import {
  Animated,
  TouchableOpacity,
  StyleSheet,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { Config } from '../constants/config';

interface PulseButtonProps {
  isRecording: boolean;
  isDisabled: boolean;
  onPress: () => void;
}

export const PulseButton: React.FC<PulseButtonProps> = ({
  isRecording,
  isDisabled,
  onPress,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const period = isRecording
      ? Config.recordingPulsePeriodMs
      : Config.idlePulsePeriodMs;

    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1.05,
            duration: period / 2,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: isRecording ? 0.9 : 0.5,
            duration: period / 2,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 0.96,
            duration: period / 2,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0.25,
            duration: period / 2,
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    pulseAnimation.start();

    return () => {
      pulseAnimation.stop();
    };
  }, [isRecording]);

  return (
    <View style={styles.container}>
      {/* Outer animated aura halo */}
      <Animated.View
        style={[
          styles.glowHalo,
          {
            transform: [{ scale: scaleAnim }],
            opacity: isDisabled ? 0 : glowAnim,
          },
        ]}
      />

      {/* Main button circle */}
      <Animated.View
        style={[
          styles.buttonWrapper,
          {
            transform: [{ scale: isDisabled ? 1.0 : scaleAnim }],
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          disabled={isDisabled}
          onPress={onPress}
          style={[
            styles.button,
            isDisabled && styles.buttonDisabled,
            isRecording && styles.buttonRecording,
          ]}
        >
          <Ionicons
            name={isRecording ? 'stop' : 'mic'}
            size={48}
            color={Colors.sand}
          />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 160,
    height: 160,
  },
  glowHalo: {
    position: 'absolute',
    width: 148,
    height: 148,
    borderRadius: 74,
    backgroundColor: Colors.herbal,
    shadowColor: Colors.herbalLight,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 35,
    elevation: 20,
  },
  buttonWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  button: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.herbal,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
  buttonRecording: {
    backgroundColor: '#356639',
  },
  buttonDisabled: {
    backgroundColor: Colors.mossMuted,
  },
});
