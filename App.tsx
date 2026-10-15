import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
export default function App() {
  // The second element is a function that REPLACES the value.
  const [visible, setVisible] = useState(true);

  return (
      <View style={styles.container}>
        <Pressable onPress={() => setVisible(!visible)} style={styles.button}>
          <Text style={styles.buttonLabel}>{ visible ? "Hide" : "Show"}</Text>
        </Pressable>

        {/* Rendered only when "visible" is true. */}
        {visible && (
          <NameCard 
            name="Jan Kowalski" 
            description="Zaawansowane programowanie systemów mobilnych" 
          />
        )}
      </View>
    );
}

function NameCard({ name, description } : {name: string, description: string}) {
  return (
    <View style={styles.card}>
      <Text style={styles.nameText}>{name}</Text>
      <Text style={styles.descriptionText}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#006d77',
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderRadius: 8,
    marginBottom: 16,
  },
  buttonLabel: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  card: {
    backgroundColor: '#f2f7f4',
    borderWidth: 1,
    borderColor: '#4d908e',
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    width: '100%',
    maxWidth: 320,
  },
  nameText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0e2a47',
    marginBottom: 4,
    textAlign: 'center',
  },
  descriptionText: {
    fontSize: 12,
    color: '#5a6b7c',
    textAlign: 'center',
  },
});
