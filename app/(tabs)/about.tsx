import { StyleSheet, Text, View, ScrollView, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts, CrimsonPro_400Regular, CrimsonPro_600SemiBold } from '@expo-google-fonts/crimson-pro';

export default function AboutScreen() {
  const [fontsLoaded] = useFonts({
    'CrimsonPro-Regular': CrimsonPro_400Regular,
    'CrimsonPro-SemiBold': CrimsonPro_600SemiBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#2d1b4c', '#1a0f2e']}
        style={StyleSheet.absoluteFill}
      />
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        <Text style={styles.title}>Palm Reader</Text>
        <Text style={styles.subtitle}>A Mystical Journey Through Your Palm</Text>
        
        <Text style={styles.sectionTitle}>How It Works</Text>
        <Text style={styles.text}>
          Our palm reader uses advanced technology to analyze the unique patterns of your palm. 
          By examining your heart line, head line, and life line, we generate personalized mystical insights 
          about your potential future paths.
        </Text>
        
        <Text style={styles.sectionTitle}>For Entertainment Only</Text>
        <Text style={styles.text}>
          Please note that this app is designed for entertainment purposes only. The readings are generated 
          through creative interpretation and should not be used for making life decisions or as a substitute 
          for professional advice.
        </Text>
        
        <Text style={styles.sectionTitle}>Privacy</Text>
        <Text style={styles.text}>
          Your privacy is important to us. All palm analysis happens directly on your device, 
          and we don't store any images or personal information.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 32,
    color: '#e879f9',
    textAlign: 'center',
    marginTop: 60,
    marginBottom: 10,
    fontFamily: 'CrimsonPro-SemiBold',
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 40,
    opacity: 0.8,
    fontFamily: 'CrimsonPro-Regular',
  },
  sectionTitle: {
    fontSize: 22,
    color: '#e879f9',
    marginTop: 30,
    marginBottom: 10,
    fontFamily: 'CrimsonPro-SemiBold',
  },
  text: {
    fontSize: 16,
    color: '#fff',
    lineHeight: 24,
    opacity: 0.8,
    fontFamily: 'CrimsonPro-Regular',
  },
});