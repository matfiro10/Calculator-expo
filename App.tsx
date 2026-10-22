import React, { useState, useRef } from 'react';
import { Pressable, StyleSheet, Text, View, ScrollView } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
  const [displayText, setDisplayText] = useState('');

  const handlePress = (val: string) => {
    setDisplayText((prev) => {
      return prev + val;
    });
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <CalcDisplay text={displayText} />
          <ButtonsRow 
            buttons={['7', '8', '9', '/']} 
            onButtonPress={handlePress} 
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

function CalcDisplay({ text }: { text: string }) {
  const scrollRef = useRef<ScrollView>(null); 

  return (
    <View style={styles.display}>
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
          style={styles.displayText}
        >
          {text}
        </Text>
      </ScrollView>
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
    paddingTop: '4%',
  },
  display: {
    width: '100%',
    aspectRatio: 4,
    backgroundColor: '#f2f3f5',
    borderRadius: 14,
    paddingHorizontal: '4%',
    justifyContent: 'center',
    marginBottom: '4%',
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
  buttonsRow: {
    width: '100%',
    flexDirection: 'row',
    marginBottom: '2.5%',
  },
  button: {
    flex: 1,
    aspectRatio: 1, 
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#eef1f4',
    marginHorizontal: '1.2%',
  },
  buttonPressed: {
    backgroundColor: '#d8dee6',
  },
  buttonText: {
    color: '#244b70',
    fontSize: 26,
    fontWeight: '500',
  },
});