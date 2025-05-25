import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';

interface TutorialModalProps {
  visible: boolean;
  onClose: () => void;
}

const tutorialSteps = [
  {
    title: 'Welcome to RageDrop!',
    content:
      "This app allows you to discover and connect to nearby devices using RageDrop service. Let's learn how to use it!",
    image: '🚀',
  },
  {
    title: 'Your Device',
    content:
      'The left panel shows your device. When the server is running (green text), other devices can discover and connect to you.',
    image: '📱',
  },
  {
    title: 'Discover Devices',
    content:
      'The right panel automatically scans for nearby devices. Discovered devices will appear in the list automatically.',
    image: '🔍',
  },
  {
    title: 'Connect to Device',
    content:
      "Tap on any discovered device to connect to it. Connected devices will show a 'Connected' status.",
    image: '🔗',
  },
  {
    title: 'Share Texts',
    content:
      'Use the bottom panel to select and transmit texts to connected devices. Choose your text and tap to send!',
    image: '📤',
  },
  {
    title: 'Ready to Start!',
    content:
      "You're all set! Make sure both devices are on the same network and start discovering nearby devices.",
    image: '✅',
  },
];

export default function TutorialModal({
  visible,
  onClose,
}: TutorialModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    setCurrentStep(0);
    onClose();
  };

  const currentTutorial = tutorialSteps[currentStep];

  if (!currentTutorial) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.stepIndicator}>
                {currentStep + 1} of {tutorialSteps.length}
              </Text>
              <TouchableOpacity
                onPress={handleFinish}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Content */}
            <View style={styles.content}>
              <Text style={styles.emoji}>{currentTutorial.image}</Text>
              <Text style={styles.title}>{currentTutorial.title}</Text>
              <Text style={styles.description}>{currentTutorial.content}</Text>
            </View>

            {/* Progress Indicator */}
            <View style={styles.progressContainer}>
              {tutorialSteps.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.progressDot,
                    index === currentStep && styles.activeProgressDot,
                  ]}
                />
              ))}
            </View>

            {/* Navigation Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[
                  styles.button,
                  styles.previousButton,
                  currentStep === 0 && styles.disabledButton,
                ]}
                onPress={handlePrevious}
                disabled={currentStep === 0}
              >
                <Text
                  style={[
                    styles.buttonText,
                    styles.previousButtonText,
                    currentStep === 0 && styles.disabledButtonText,
                  ]}
                >
                  Previous
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.nextButton]}
                onPress={handleNext}
              >
                <Text style={[styles.buttonText, styles.nextButtonText]}>
                  {currentStep === tutorialSteps.length - 1
                    ? 'Get Started'
                    : 'Next'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.9,
    maxHeight: height * 0.8,
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
  },
  scrollContainer: {
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  stepIndicator: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: 'bold',
  },
  content: {
    alignItems: 'center',
    marginBottom: 30,
  },
  emoji: {
    fontSize: 60,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 4,
  },
  activeProgressDot: {
    backgroundColor: '#007AFF',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  previousButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  nextButton: {
    backgroundColor: '#007AFF',
  },
  disabledButton: {
    backgroundColor: 'transparent',
    borderColor: '#ccc',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  previousButtonText: {
    color: '#007AFF',
  },
  nextButtonText: {
    color: 'white',
  },
  disabledButtonText: {
    color: '#ccc',
  },
});
