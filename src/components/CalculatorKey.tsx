import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import type { Key, KeyRole } from '../keys';

type CalculatorKeyProps = {
  item: Key;
  onPress: (item: Key) => void;
};

export function CalculatorKey({ item, onPress }: CalculatorKeyProps) {
  return (
    <Pressable
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={item.ariaLabel || item.label}
      style={({ pressed }) => [
        styles.key,
        ROLE_VIEW[item.role],
        item.span ? { flex: item.span } : null,
        pressed && styles.buttonPressed,
      ]}
      onPress={() => onPress(item)}
    >
      <Text
        aria-hidden={true}
        style={[
          styles.buttonText,
          item.role === 'equals' && styles.equalsButtonText,
        ]}
      >
        {item.label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  key: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  digitKey: {
    backgroundColor: '#eef1f4',
  },
  operatorKey: {
    backgroundColor: '#dbe4ed',
  },
  functionKey: {
    backgroundColor: '#b6d6f595',
  },
  equalsKey: {
    backgroundColor: '#244b70',
  },
  clearKey: {
    backgroundColor: '#fce4e4',
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#244b70',
    fontSize: 20,
    fontWeight: '500',
  },
  equalsButtonText: {
    color: '#ffffff',
  },
});

const ROLE_VIEW: Record<KeyRole, object> = {
  digit: styles.digitKey,
  operator: styles.operatorKey,
  function: styles.functionKey,
  equals: styles.equalsKey,
  clear: styles.clearKey,
};