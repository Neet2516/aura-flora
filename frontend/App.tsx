import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Colors } from './src/theme/colors';
import { GroundResponse } from './src/types';
import { HomeScreen } from './src/screens/HomeScreen';
import { BlackoutScreen } from './src/screens/BlackoutScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'home' | 'blackout'>('home');
  const [groundResponse, setGroundResponse] = useState<GroundResponse | null>(null);

  const handleEnterBlackout = (response: GroundResponse) => {
    setGroundResponse(response);
    setCurrentScreen('blackout');
  };

  const handleExitBlackout = () => {
    setCurrentScreen('home');
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" backgroundColor={Colors.forestDeep} />
      {currentScreen === 'home' || !groundResponse ? (
        <HomeScreen onEnterBlackout={handleEnterBlackout} />
      ) : (
        <BlackoutScreen
          response={groundResponse}
          onExit={handleExitBlackout}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.forestDeep,
  },
});
