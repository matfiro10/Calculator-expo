import React, { useState, useRef } from 'react';
import { Pressable, StyleSheet, Text, View, ScrollView, useWindowDimensions, StyleProp, ViewStyle } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const calcButtons = [
  ['AC', '+-', '%', '/'],
  ['7', '8', '9', 'x'],
  ['4', '5', '6', '-'],
  ['1', '2', '3', '+'],
  ['0', '.', '<=', '='],
];

const calcButtonsExt = [
  ['(', ')'],
  ['^2', 'sqrt'],
  ['x^y', '1/x'],
  ['pi', 'e'],
  ['sin', 'cos'],
  ['tan', 'rad'],
];

export default function App() {
  const [displayText, setDisplayText] = useState('');
  const { width, height } = useWindowDimensions();
  const landscape = width > height;

  const handlePress = (val: string) => {
    if (val === 'AC') setDisplayText('');
    else if (val === '<=') setDisplayText((prev) => prev.slice(0, -1));
    else setDisplayText((prev) => prev + val);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <CalcDisplay text={displayText} landscape={landscape} />
          
          <View style={landscape ? styles.keypadsRow : styles.keypadsColumn}>
            <Keypad buttonsMatrix={calcButtons} onButtonPress={handlePress} style={{ flex: 4 }} />
            {landscape && (
              <Keypad buttonsMatrix={calcButtonsExt} onButtonPress={handlePress} style={{ flex: 2 }} />
            )}
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

function CalcDisplay({ text, landscape }: { text: string; landscape: boolean }) {
  const scrollRef = useRef<ScrollView>(null); 

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
  buttonsMatrix: string[][];
  onButtonPress: (val: string) => void;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[styles.keypad, style]}>
      {buttonsMatrix.map((row, idx) => (
        <ButtonsRow 
          key={idx}
          buttons={row}
          onButtonPress={onButtonPress} 
        />
      ))}
    </View>
  );
}

function ButtonsRow({
  buttons,
  onButtonPress,
}: {
  buttons: string[];
  onButtonPress: (val: string) => void;
}) {
  return (
    <View style={styles.buttonsRow}>
      {buttons.map((label) => (
        <CalcButton 
          key={label} 
          label={label} 
          onPress={() => onButtonPress(label)} 
        />
      ))}
    </View>
  );
}

function CalcButton({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        pressed && styles.buttonPressed,
      ]}
      onPress={onPress}
    >
      <Text style={styles.buttonText}>{label}</Text>
    </Pressable>
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
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#eef1f4',
  },
  buttonPressed: {
    backgroundColor: '#d8dee6',
  },
  buttonText: {
    color: '#244b70',
    fontSize: 20,
    fontWeight: '500',
  },
});