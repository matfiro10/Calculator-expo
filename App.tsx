import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Header />
        <Body />
        <Footer />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    
  },

  header: {
    backgroundColor: '#3b3ba4',
    color: '#d8d8d8',
    padding: 30,
  },

  headerText: {
    fontSize: 26,
    fontWeight: '500',
  },

  body: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    
  },

  bodyBlock: {
    flex: 1,
    aspectRatio: 1,
    marginHorizontal: 10,
    backgroundColor: 'rgb(201, 234, 239)',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  bodyBlockText: {
    fontSize: 24,
    fontWeight: '500',
  },

  footer: {
    backgroundColor: 'rgba(232, 232, 232, 0.8)',
    padding: 15,
  },
});


function Header() {
  return (
    <View style = {styles.header}>
      <Text style = {styles.headerText}>Header</Text>
    </View>
  );
}

function Body() {
  return (
    <View style = {styles.body}>
      <BodyBlock text='A'/>
      <BodyBlock text='B'/>
      <BodyBlock text='C'/>
    </View>
  );
}

function BodyBlock({ text }: { text: string }) {
  return (
    <View style = {styles.bodyBlock}>
      <Text style = {styles.bodyBlockText}>{text}</Text>
    </View>
  );
}

function Footer() {
  return (
    <View style = {styles.footer}>
      <Text>Footer</Text>
    </View>
  );
}