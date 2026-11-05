import React, { useRef, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, useWindowDimensions, StyleProp, ViewStyle } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { Key, BASIC, EXTENDED } from './src/keys';
import { CalculatorKey } from './src/components/CalculatorKey';
import { useCalculator } from './src/hooks/useCalculator';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function App() {
  const { displayText, press } = useCalculator();
  const { width, height } = useWindowDimensions();
  const landscape = width > height;

  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <CalcDisplay text={displayText} landscape={landscape} />

          <View style={landscape ? styles.keypadsRow : styles.keypadsColumn}>
            <Keypad buttonsMatrix={BASIC} onButtonPress={press} style={{ flex: 4 }} />
            {landscape && (
              <Keypad buttonsMatrix={EXTENDED} onButtonPress={press} style={{ flex: 2 }} />
            )}
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

function CalcDisplay({ text, landscape }: { text: string; landscape: boolean }) {
  const scrollRef = useRef<React.ComponentRef<typeof ScrollView>>(null);

  return (
    <View style={[styles.display, landscape && styles.displayLandscape]}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
      >
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          style={[styles.displayText, landscape && styles.displayTextLandscape]}
        >
          {text}
        </Text>
      </ScrollView>
    </View>
  );
}

function Keypad({
  buttonsMatrix,
  onButtonPress,
  style,
}: {
  buttonsMatrix: Key[][];
  onButtonPress: (item: Key) => void;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[styles.keypad, style]}>
      {buttonsMatrix.map((row, idx) => (
        <ButtonsRow key={idx} buttons={row} onButtonPress={onButtonPress} />
      ))}
    </View>
  );
}

function ButtonsRow({
  buttons,
  onButtonPress,
}: {
  buttons: Key[];
  onButtonPress: (item: Key) => void;
}) {
  return (
    <View style={styles.buttonsRow}>
      {buttons.map((item) => (
        <CalculatorKey key={item.label} item={item} onPress={onButtonPress} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: '4%',
    paddingBottom: '2%',
    gap: 8,
  },
  display: {
    width: '100%',
    flex: 1,
    backgroundColor: '#f2f3f5',
    borderRadius: 14,
    paddingHorizontal: '4%',
    justifyContent: 'center',
  },
  displayLandscape: {
    flex: 1.2,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  displayText: {
    color: '#244b70',
    fontSize: 40,
    fontWeight: '400',
    fontVariant: ['tabular-nums'],
    includeFontPadding: false,
  },
  displayTextLandscape: {
    fontSize: 32,
  },
  keypadsColumn: {
    flex: 5,
    width: '100%',
  },
  keypadsRow: {
    flex: 5,
    flexDirection: 'row',
    gap: 8,
    width: '100%',
  },
  keypad: {
    gap: 6,
    height: '100%',
  },
  buttonsRow: {
    flex: 1,
    gap: 6,
    width: '100%',
    flexDirection: 'row',
  },
});