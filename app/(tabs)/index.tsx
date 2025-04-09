import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts, CrimsonPro_400Regular, CrimsonPro_600SemiBold } from '@expo-google-fonts/crimson-pro';
import { Camera, RefreshCw, Sparkles } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import Animated, { 
  useAnimatedStyle, 
  withRepeat, 
  withTiming,
  withSequence,
  withDelay,
  withSpring,
  Easing,
  useSharedValue,
  interpolate,
  interpolateColor,
} from 'react-native-reanimated';

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);
const AnimatedSparkles = Animated.createAnimatedComponent(Sparkles);

const ANALYZING_TEXTS = [
  "Reading your destiny...",
  "Analyzing palm lines...",
  "Decoding your future...",
  "Connecting to the mystic realm...",
  "Unveiling your path...",
  "Channeling ancient wisdom...",
];

const PALM_READINGS = [
  "Your heart line flows deep and true — a sign of emotional wisdom. Love may take an unexpected turn this year, revealing new paths you hadn't considered.",
  "The intersecting lines on your palm reveal a dual nature: one part dreamer, one part doer. Destiny is calling — but only you can decide which voice to follow.",
  "A fragmented life line suggests resilience forged through challenge. You've walked through storms before… and the next sunrise will be your brightest yet.",
  "Your palm speaks of a creative soul with a restless mind. Embrace your spontaneity — it will guide you to the right place, at the perfect moment.",
  "Long and curved lines suggest harmony between logic and feeling. You'll soon face a choice — trust your intuition, and the world will unfold in your favor.",
  "You were born with the markings of a quiet leader. Others may not see it yet, but the decisions you make in silence shape your future in loud, meaningful ways.",
  "Your hand reveals spiritual energy — a seeker's hand. Don't ignore your inner calling. Something unseen is about to become undeniable.",
  "The patterns in your palm hint at a significant life shift. It may begin subtly, but soon you'll feel the ground moving beneath you — toward growth.",
  "You have a rare fate line — a mark of those who forge their own destiny. Keep your eyes open. A window of opportunity is drawing near.",
  "Balance, love, and challenge — your palm holds all three. Life will test your ability to stay centered, but your calm heart is your greatest strength.",
];

export default function PalmReaderScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [reading, setReading] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [analyzingTextIndex, setAnalyzingTextIndex] = useState(0);

  const scannerOpacity = useSharedValue(0.3);
  const scannerScale = useSharedValue(1);
  const scannerRotation = useSharedValue(0);
  const scanLinePosition = useSharedValue(0);
  const glowIntensity = useSharedValue(0);
  const sparkleOpacity = useSharedValue(0);
  const textProgress = useSharedValue(0);

  const [fontsLoaded] = useFonts({
    'CrimsonPro-Regular': CrimsonPro_400Regular,
    'CrimsonPro-SemiBold': CrimsonPro_600SemiBold,
  });

  useEffect(() => {
    if (isCapturing) {
      // Scanner animations
      scannerOpacity.value = withRepeat(
        withSequence(
          withTiming(0.8, { duration: 1000 }),
          withTiming(0.3, { duration: 1000 })
        ),
        -1,
        true
      );

      scannerScale.value = withRepeat(
        withSequence(
          withTiming(1.1, { duration: 1500 }),
          withTiming(1, { duration: 1500 })
        ),
        -1,
        true
      );

      scannerRotation.value = withRepeat(
        withSequence(
          withTiming(360, { 
            duration: 3000,
            easing: Easing.linear 
          })
        ),
        -1,
        false
      );

      // Scan line animation
      scanLinePosition.value = withRepeat(
        withSequence(
          withTiming(1, { 
            duration: 2000,
            easing: Easing.inOut(Easing.ease)
          }),
          withTiming(0, { 
            duration: 2000,
            easing: Easing.inOut(Easing.ease)
          })
        ),
        -1,
        true
      );

      // Glow animation
      glowIntensity.value = withRepeat(
        withSequence(
          withSpring(1),
          withSpring(0.3)
        ),
        -1,
        true
      );

      // Sparkle animation
      sparkleOpacity.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1000 }),
          withTiming(0.3, { duration: 1000 })
        ),
        -1,
        true
      );

      // Analyzing text animation
      const textInterval = setInterval(() => {
        setAnalyzingTextIndex(current => (current + 1) % ANALYZING_TEXTS.length);
      }, 2000);

      return () => clearInterval(textInterval);
    } else {
      scannerOpacity.value = withTiming(0.3);
      scannerScale.value = withTiming(1);
      scannerRotation.value = withTiming(0);
      scanLinePosition.value = withTiming(0);
      glowIntensity.value = withTiming(0);
      sparkleOpacity.value = withTiming(0);
    }
  }, [isCapturing]);

  const scannerStyle = useAnimatedStyle(() => {
    return {
      opacity: scannerOpacity.value,
      transform: [
        { scale: scannerScale.value },
        { rotate: `${scannerRotation.value}deg` }
      ],
    };
  });

  const scanLineStyle = useAnimatedStyle(() => {
    return {
      transform: [{ 
        translateY: interpolate(
          scanLinePosition.value,
          [0, 1],
          [0, 300]
        )
      }],
      opacity: interpolate(
        scanLinePosition.value,
        [0, 0.5, 1],
        [0.5, 1, 0.5]
      ),
    };
  });

  const glowStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      glowIntensity.value,
      [0, 1],
      ['rgba(232, 121, 249, 0.3)', 'rgba(232, 121, 249, 0.8)']
    );

    return {
      backgroundColor: color,
    };
  });

  const sparkleStyle = useAnimatedStyle(() => {
    return {
      opacity: sparkleOpacity.value,
      transform: [
        { scale: interpolate(sparkleOpacity.value, [0.3, 1], [0.8, 1.2]) }
      ],
    };
  });

  if (!fontsLoaded) {
    return null;
  }

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#2d1b4c', '#1a0f2e']}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.permissionContainer}>
          <Text style={styles.message}>We need your permission to read your palm</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={requestPermission}>
            <Text style={styles.buttonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const handleCapture = async () => {
    if (isCapturing) return;
    
    setIsCapturing(true);
    
    // Simulate palm analysis delay with mystical reading selection
    setTimeout(() => {
      const randomReading = PALM_READINGS[Math.floor(Math.random() * PALM_READINGS.length)];
      setReading(randomReading);
      setIsCapturing(false);
    }, 3000);
  };

  const resetReading = () => {
    setReading(null);
  };

  return (
    <View style={styles.container}>
      {!reading ? (
        <CameraView 
          style={styles.camera} 
          facing={facing}
        >
          <LinearGradient
            colors={['rgba(0,0,0,0.7)', 'transparent', 'rgba(0,0,0,0.7)']}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.overlay}>
            {isCapturing && (
              <Text style={styles.analyzingText}>
                {ANALYZING_TEXTS[analyzingTextIndex]}
              </Text>
            )}
            
            <AnimatedBlurView
              intensity={20}
              tint="dark"
              style={[styles.scannerOverlay, scannerStyle]}
            >
              <Animated.View style={[styles.scannerBorder, glowStyle]} />
              <Animated.View style={[styles.scanLine, scanLineStyle]} />
              <AnimatedSparkles 
                style={[styles.sparkles, sparkleStyle]}
                color="#e879f9"
                size={24}
              />
            </AnimatedBlurView>

            <TouchableOpacity
              style={[styles.captureButton, isCapturing && styles.capturing]}
              onPress={handleCapture}
              disabled={isCapturing}
            >
              <Camera color="#fff" size={28} />
            </TouchableOpacity>
          </View>
        </CameraView>
      ) : (
        <View style={styles.readingContainer}>
          <LinearGradient
            colors={['#2d1b4c', '#1a0f2e']}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.readingContent}>
            <Text style={styles.readingTitle}>Your Palm Reading</Text>
            <Text style={styles.readingText}>{reading}</Text>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={resetReading}
            >
              <RefreshCw color="#e879f9" size={24} />
              <Text style={styles.resetText}>New Reading</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 60,
  },
  scannerOverlay: {
    position: 'absolute',
    top: '25%',
    left: '10%',
    right: '10%',
    bottom: '25%',
    borderRadius: 20,
    overflow: 'hidden',
  },
  scannerBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 2,
    borderColor: '#e879f9',
    borderRadius: 20,
  },
  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#e879f9',
    shadowColor: '#e879f9',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  sparkles: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -12 }, { translateY: -12 }],
  },
  analyzingText: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'CrimsonPro-Regular',
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 20,
  },
  instruction: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'CrimsonPro-Regular',
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#e879f9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  capturing: {
    opacity: 0.7,
  },
  message: {
    color: '#fff',
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 30,
    fontFamily: 'CrimsonPro-Regular',
  },
  button: {
    backgroundColor: '#e879f9',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#e879f9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'CrimsonPro-SemiBold',
  },
  readingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  readingContent: {
    padding: 30,
    width: '100%',
    maxWidth: 600,
  },
  readingTitle: {
    color: '#e879f9',
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'CrimsonPro-SemiBold',
  },
  readingText: {
    color: '#fff',
    fontSize: 24,
    textAlign: 'center',
    lineHeight: 36,
    fontFamily: 'CrimsonPro-Regular',
    textShadowColor: 'rgba(232, 121, 249, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(232, 121, 249, 0.1)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 40,
    alignSelf: 'center',
  },
  resetText: {
    color: '#e879f9',
    fontSize: 16,
    marginLeft: 8,
    fontFamily: 'CrimsonPro-SemiBold',
  },
});