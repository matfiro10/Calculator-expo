import React, { useRef, useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, useWindowDimensions, StyleProp, ViewStyle } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { Key, BASIC, EXTENDED } from './src/keys';
import { CalculatorKey } from './src/components/CalculatorKey';
import { useCalculator } from './src/hooks/useCalculator';
import { ExpressionError } from './src/logic/evaluate';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function App() {
  const { displayText, isResult, press } = useCalculator();
  const [error, setError] = useState<string | null>(null);
  const { width, height } = useWindowDimensions();
  const landscape = width > height;

  useEffect(() => {
  const timer = setTimeout(() => {
    SplashScreen.hideAsync().catch(() => {});
  }, 1000);
  return () => clearTimeout(timer);
}, []);

  const handlePress = (key: Key) => {
    if (error) {
      setError(null);
    }

    try {
      press(key);
    } catch (err) {
      if (err instanceof ExpressionError) {
        setError(err.message);
      } else {
        setError('Błąd obliczeń');
      }
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <CalcDisplay
            text={displayText}
            error={error}
            isResult={isResult}
            landscape={landscape}
          />

          <View style={landscape ? styles.keypadsRow : styles.keypadsColumn}>
            <Keypad buttonsMatrix={BASIC} onButtonPress={handlePress} style={{ flex: 4 }} />
            {landscape && (
              <Keypad buttonsMatrix={EXTENDED} onButtonPress={handlePress} style={{ flex: 2 }} />
            )}
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

function CalcDisplay({
  text,
  error,
  isResult,
  landscape,
}: {
  text: string;
  error: string | null;
  isResult: boolean;
  landscape: boolean;
}) {
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
          style={[
            styles.displayText,
            landscape && styles.displayTextLandscape,
            isResult && styles.displayTextResult,
          ]}
        >
          {text}
        </Text>
      </ScrollView>

      {error ? (
        <Text
          numberOfLines={1}
          style={[styles.errorText, landscape && styles.errorTextLandscape]}
        >
          {error}
        </Text>
      ) : null}
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
    fontSize: 44,
    fontWeight: '400',
    fontVariant: ['tabular-nums'],
    includeFontPadding: false,
  },
  displayTextLandscape: {
    fontSize: 34,
  },
  displayTextResult: {
    color: '#3a4552',
    fontWeight: '600',
  },
  errorText: {
    position: 'absolute',
    bottom: 8,
    right: '4%',
    left: '4%',
    color: '#c93b3b',
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'right',
    includeFontPadding: false,
  },
  errorTextLandscape: {
    bottom: 4,
    fontSize: 12,
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
