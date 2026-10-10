import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';

interface SensoryBadgeProps {
  environmentTag: string;
  visible: boolean;
}

export const SensoryBadge: React.FC<SensoryBadgeProps> = ({
  environmentTag,
  visible,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: visible ? 1 : 0,
      duration: 350,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  const getIconName = (tag: string): keyof typeof Ionicons.glyphMap => {
    switch (tag.toLowerCase()) {
      case 'forest':
        return 'leaf';
      case 'meadow':
        return 'flower';
      case 'coastal':
        return 'water';
      case 'urban_park':
        return 'trail-sign';
      case 'busy_street':
        return 'car';
      case 'indoor':
        return 'home';
      default:
        return 'planet';
    }
  };

  const formattedLabel = (environmentTag || 'FOREST')
    .replace('_', ' ')
    .toUpperCase();

  return (
    <Animated.View
      style={[
        styles.badgeContainer,
        {
          opacity: fadeAnim,
          transform: [
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [10, 0],
              }),
            },
          ],
        },
      ]}
    >
      <View style={styles.badge}>
        <Ionicons
          name={getIconName(environmentTag)}
          size={14}
          color={Colors.herbalLight}
          style={styles.icon}
        />
        <Text style={styles.text}>{formattedLabel}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  badgeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.mossMuted,
    borderWidth: 1,
    borderColor: 'rgba(78, 135, 82, 0.4)',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  icon: {
    marginRight: 8,
  },
  text: {
    color: Colors.herbalLight,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1.5,
  },
});
