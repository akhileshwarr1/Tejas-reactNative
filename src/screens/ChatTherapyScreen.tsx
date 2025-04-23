import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  Animated,
  ActivityIndicator,
  Modal,
  AccessibilityInfo
} from 'react-native';
import { useTheme } from '../components/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import OpenAIService, { ChatMessage, SentimentAnalysis } from '../services/OpenAIService';

// Define message types for the chat
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  sentiment?: string;
  score?: number;
}

// Predefined therapy options
interface TherapyOption {
  id: string;
  title: string;
  description: string;
  icon: string;
}

// Define relaxation suggestion type
interface RelaxationSuggestion {
  id: string;
  text: string;
}

const ChatTherapyScreen = ({ navigation }) => {
  const { theme, isDarkMode } = useTheme();
  const styles = createStyles(theme, isDarkMode);
  
  // Accessibility states
  const [isScreenReaderEnabled, setIsScreenReaderEnabled] = useState(false);
  const [reduceMotionEnabled, setReduceMotionEnabled] = useState(false);
  
  // States
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello, I'm your mental wellness assistant. How are you feeling today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  
  // Store OpenAI conversation history
  const [openAIMessages, setOpenAIMessages] = useState<ChatMessage[]>([
    {
      role: 'system',
      content: 'You are a helpful mental wellness assistant. Provide supportive, empathetic responses without giving medical advice. If someone seems to be in crisis, suggest professional help. Keep responses brief and helpful, under 150 words.'
    },
    {
      role: 'assistant',
      content: "Hello, I'm your mental wellness assistant. How are you feeling today?"
    }
  ]);
  
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showTherapistModal, setShowTherapistModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'chat' | 'therapy'>('chat');
  const [currentSentiment, setCurrentSentiment] = useState<SentimentAnalysis | null>(null);
  const [relaxationSuggestions, setRelaxationSuggestions] = useState<RelaxationSuggestion[]>([]);
  const [showSuggestionModal, setShowSuggestionModal] = useState(false);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);
  
  // Check for screen reader and reduce motion settings
  useEffect(() => {
    const screenReaderListener = AccessibilityInfo.addEventListener(
      'screenReaderChanged',
      handleScreenReaderToggled
    );
    
    const reduceMotionListener = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      handleReduceMotionToggled
    );

    // Initial checks
    AccessibilityInfo.isScreenReaderEnabled().then(
      screenReaderEnabled => {
        setIsScreenReaderEnabled(screenReaderEnabled);
      }
    );
    
    AccessibilityInfo.isReduceMotionEnabled().then(
      reduceMotionEnabled => {
        setReduceMotionEnabled(reduceMotionEnabled);
      }
    );

    return () => {
      screenReaderListener.remove();
      reduceMotionListener.remove();
    };
  }, []);

  const handleScreenReaderToggled = (isEnabled: boolean) => {
    setIsScreenReaderEnabled(isEnabled);
  };

  const handleReduceMotionToggled = (isEnabled: boolean) => {
    setReduceMotionEnabled(isEnabled);
  };

  // Therapy options
  const therapyOptions: TherapyOption[] = [
    {
      id: '1',
      title: 'Talk Therapy',
      description: 'Connect with licensed therapists for one-on-one video sessions.',
      icon: 'videocam'
    },
    {
      id: '2',
      title: 'Group Therapy',
      description: 'Join supportive group sessions led by professional counselors.',
      icon: 'people'
    },
    {
      id: '3',
      title: 'Specialized Mental Health Support',
      description: 'Access to psychiatrists and specialized mental health services.',
      icon: 'medical'
    },
    {
      id: '4',
      title: 'Emergency Mental Health',
      description: 'Immediate access to mental health professionals for urgent concerns.',
      icon: 'alert-circle'
    },
    {
      id: '5',
      title: 'Digital CBT Program',
      description: 'Self-guided cognitive behavioral therapy programs.',
      icon: 'laptop'
    }
  ];

  // Quick response options
  const quickResponses = [
    "I'm feeling anxious today",
    "Need help with stress",
    "Can't sleep well",
    "Feeling overwhelmed"
  ];

  // Fade in animation on mount - respecting reduce motion preferences
  useEffect(() => {
    if (!reduceMotionEnabled) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true
      }).start();
    } else {
      // Skip animation if reduce motion is enabled
      fadeAnim.setValue(1);
    }
  }, [reduceMotionEnabled]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: !reduceMotionEnabled });
      }, 100);
    }
  }, [messages, reduceMotionEnabled]);

  // Function to handle sending messages
  const handleSend = async () => {
    if (inputText.trim() === '') return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    // Add user message to chat UI
    setMessages(prevMessages => [...prevMessages, newUserMessage]);
    
    // Add user message to OpenAI conversation history
    const userOpenAIMessage: ChatMessage = {
      role: 'user',
      content: inputText
    };
    
    const updatedOpenAIMessages = [...openAIMessages, userOpenAIMessage];
    setOpenAIMessages(updatedOpenAIMessages);
    
    const userInputText = inputText;
    setInputText('');
    setIsTyping(true);

    // Announce to screen reader that message was sent
    if (isScreenReaderEnabled) {
      AccessibilityInfo.announceForAccessibility('Message sent. Assistant is responding.');
    }

    try {
      // Analyze sentiment first
      const sentimentAnalysis = await OpenAIService.analyzeSentiment(userInputText);
      setCurrentSentiment(sentimentAnalysis);
      
      // Update relaxation suggestions based on sentiment analysis
      const newSuggestions = sentimentAnalysis.relaxationSuggestions.map((suggestion, index) => ({
        id: `suggestion-${index}`,
        text: suggestion
      }));
      setRelaxationSuggestions(newSuggestions);
      
      // Generate response with awareness of sentiment
      const enhancedSystemMessage: ChatMessage = {
        role: 'system',
        content: `The user's message has been analyzed with sentiment: ${sentimentAnalysis.sentiment}, 
                  score: ${sentimentAnalysis.score}. Respond in a way that addresses their emotional state.
                  If their sentiment is negative (anxious, stressed, depressed) or score is below -2,
                  be especially supportive and empathetic. Keep responses brief and helpful, under 150 words.`
      };
      
      // Append the enhanced system message for better context
      const botResponse = await OpenAIService.sendMessage([
        ...updatedOpenAIMessages,
        enhancedSystemMessage
      ]);
      
      // Create new bot message for UI
      const newBotMessage: Message = {
        id: Date.now().toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
        sentiment: sentimentAnalysis.sentiment,
        score: sentimentAnalysis.score
      };
      
      // Add bot message to chat UI
      setMessages(prevMessages => [...prevMessages, newBotMessage]);
      
      // Add bot response to OpenAI conversation history
      setOpenAIMessages(prevMessages => [
        ...prevMessages, 
        { role: 'assistant', content: botResponse }
      ]);
      
      // If the sentiment indicates the user might need help, show suggestions
      if (sentimentAnalysis.sentiment === 'anxious' || 
          sentimentAnalysis.sentiment === 'depressed' || 
          sentimentAnalysis.sentiment === 'stressed' ||
          sentimentAnalysis.score < -3) {
        setTimeout(() => {
          setShowSuggestionModal(true);
        }, 1000);
      }
      
      // Follow up with the suggested question if sentiment is negative
      if (sentimentAnalysis.sentiment !== 'positive' && sentimentAnalysis.sentiment !== 'neutral') {
        setTimeout(() => {
          const followUpMessage: Message = {
            id: Date.now().toString(),
            text: sentimentAnalysis.followUpQuestion,
            sender: 'bot',
            timestamp: new Date()
          };
          
          setMessages(prevMessages => [...prevMessages, followUpMessage]);
          
          setOpenAIMessages(prevMessages => [
            ...prevMessages, 
            { role: 'assistant', content: sentimentAnalysis.followUpQuestion }
          ]);
        }, 3000);
      }
      
      // Announce response to screen reader
      if (isScreenReaderEnabled) {
        AccessibilityInfo.announceForAccessibility('New response: ' + botResponse);
      }
    } catch (error) {
      console.error('Error getting response from OpenAI:', error);
      
      // Create error message for UI
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: "I'm sorry, I couldn't connect to the assistant right now. Please try again later.",
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  // Handle quick response selection
  const handleQuickResponse = (response: string) => {
    setInputText(response);
    
    // Announce for screen readers
    if (isScreenReaderEnabled) {
      AccessibilityInfo.announceForAccessibility('Quick response selected: ' + response);
    }
  };

  // Format timestamp
  const formatTime = (date: Date) => {
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  // Render individual message
  const renderMessage = ({ item }: { item: Message }) => {
    // Create accessible label for screen readers
    const accessibilityLabel = `${item.sender === 'user' ? 'You said' : 'Assistant said'}: ${item.text}. Sent at ${formatTime(item.timestamp)}`;
    
    return (
      <View 
        style={[
          styles.messageBubble,
          item.sender === 'user' ? styles.userMessage : styles.botMessage
        ]}
        accessible={true}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="text"
      >
        <Text style={[
          styles.messageText,
          item.sender === 'user' ? styles.userMessageText : styles.botMessageText
        ]}>
          {item.text}
        </Text>
        <Text style={[
          styles.timestampText,
          item.sender === 'user' ? styles.userTimestampText : styles.botTimestampText
        ]}>
          {formatTime(item.timestamp)}
        </Text>
      </View>
    );
  };

  // Book therapist function
  const handleBookTherapist = (therapyOption: TherapyOption) => {
    setShowTherapistModal(true);
    
    // Announce for screen readers
    if (isScreenReaderEnabled) {
      AccessibilityInfo.announceForAccessibility(`Opening booking options for ${therapyOption.title}`);
    }
  };

  // Render therapy options
  const renderTherapyOption = (option: TherapyOption) => {
    // Create accessible label for screen readers
    const accessibilityLabel = `${option.title}. ${option.description}. Tap to view booking options.`;
    
    return (
      <TouchableOpacity 
        key={option.id}
        style={styles.therapyOption}
        onPress={() => handleBookTherapist(option)}
        accessible={true}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
        accessibilityHint="Opens booking options for this therapy service"
      >
        <View style={styles.therapyIconContainer}>
          <Ionicons name={option.icon} size={28} color={theme.colors.white} />
        </View>
        <View style={styles.therapyTextContainer}>
          <Text style={styles.therapyTitle}>{option.title}</Text>
          <Text style={styles.therapyDescription}>{option.description}</Text>
        </View>
        <Ionicons 
          name="chevron-forward" 
          size={24} 
          color={isDarkMode ? theme.colors.grey400 : theme.colors.grey600}
          accessibilityElementsHidden={true}
          importantForAccessibility="no"
        />
      </TouchableOpacity>
    );
  };

  // Handle tab switching with accessibility announcement
  const handleTabSwitch = (tab: 'chat' | 'therapy') => {
    setSelectedTab(tab);
    
    if (isScreenReaderEnabled) {
      const tabName = tab === 'chat' ? 'AI Chat Assistant' : 'Professional Therapy';
      AccessibilityInfo.announceForAccessibility(`Switched to ${tabName} tab`);
    }
  };

  // Add this new function to render relaxation suggestions modal
  const renderSuggestionsModal = () => {
    if (!currentSentiment) return null;
    
    return (
      <Modal
        visible={showSuggestionModal}
        animationType={reduceMotionEnabled ? "none" : "slide"}
        transparent={true}
        onRequestClose={() => setShowSuggestionModal(false)}
        accessibilityViewIsModal={true}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, styles.suggestionModalContent]}>
            <View style={styles.modalHeader}>
              <Text 
                style={styles.modalTitle}
                accessible={true}
                accessibilityRole="header"
              >
                {getSuggestionTitle(currentSentiment.sentiment)}
              </Text>
              <TouchableOpacity
                onPress={() => setShowSuggestionModal(false)}
                accessible={true}
                accessibilityLabel="Close suggestions"
                accessibilityRole="button"
              >
                <Ionicons name="close" size={24} color={isDarkMode ? theme.colors.white : theme.colors.grey700} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalBody}>
              <Text style={styles.suggestionIntro}>
                {getSuggestionIntro(currentSentiment.sentiment)}
              </Text>
              
              {relaxationSuggestions.map((suggestion, index) => (
                <View 
                  key={suggestion.id} 
                  style={styles.suggestionItem}
                  accessible={true}
                  accessibilityLabel={`Suggestion ${index + 1}: ${suggestion.text}`}
                >
                  <Ionicons 
                    name="checkmark-circle" 
                    size={22} 
                    color={theme.colors.primaryDarkGreen} 
                    style={styles.suggestionIcon}
                  />
                  <Text style={styles.suggestionText}>{suggestion.text}</Text>
                </View>
              ))}
              
              {currentSentiment.recommendTherapy && (
                <View style={styles.therapyRecommendation}>
                  <Ionicons 
                    name="alert-circle" 
                    size={24} 
                    color={theme.colors.warning} 
                    style={styles.therapyRecommendIcon}
                  />
                  <Text style={styles.therapyRecommendText}>
                    It might be beneficial to speak with a professional. Would you like to explore therapy options?
                  </Text>
                </View>
              )}
              
              <View style={styles.suggestionFooter}>
                <TouchableOpacity
                  style={styles.suggestionButton}
                  onPress={() => setShowSuggestionModal(false)}
                  accessible={true}
                  accessibilityLabel="Close suggestions"
                  accessibilityRole="button"
                >
                  <Text style={styles.suggestionButtonText}>Close</Text>
                </TouchableOpacity>
                
                {currentSentiment.recommendTherapy && (
                  <TouchableOpacity
                    style={[styles.suggestionButton, styles.therapyButton]}
                    onPress={() => {
                      setShowSuggestionModal(false);
                      handleTabSwitch('therapy');
                    }}
                    accessible={true}
                    accessibilityLabel="View therapy options"
                    accessibilityRole="button"
                  >
                    <Text style={styles.therapyButtonText}>View Therapy Options</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  // Helper function to get appropriate title based on sentiment
  const getSuggestionTitle = (sentiment: string) => {
    switch(sentiment) {
      case 'anxious':
        return 'Anxiety Relief Suggestions';
      case 'depressed':
        return 'Mood Improvement Suggestions';
      case 'stressed':
        return 'Stress Relief Suggestions';
      case 'negative':
        return 'Wellness Suggestions';
      default:
        return 'Relaxation Suggestions';
    }
  };
  
  // Helper function to get appropriate intro based on sentiment
  const getSuggestionIntro = (sentiment: string) => {
    switch(sentiment) {
      case 'anxious':
        return "I notice you might be feeling anxious. Here are some techniques that could help:";
      case 'depressed':
        return "It sounds like you might be experiencing low mood. These activities might help:";
      case 'stressed':
        return "I can see you're dealing with some stress. Consider trying these techniques:";
      case 'negative':
        return "I notice you're not feeling your best. Here are some suggestions that might help:";
      default:
        return "Here are some relaxation techniques you might find helpful:";
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          accessible={true}
          accessibilityLabel="Go back"
          accessibilityRole="button"
          accessibilityHint="Returns to the previous screen"
        >
          <Ionicons 
            name="arrow-back" 
            size={24} 
            color={isDarkMode ? theme.colors.white : theme.colors.grey700} 
          />
        </TouchableOpacity>
        <Text 
          style={styles.headerTitle}
          accessible={true}
          accessibilityRole="header"
        >
          Mental Wellness Support
        </Text>
        <TouchableOpacity 
          style={styles.headerButton}
          accessible={true}
          accessibilityLabel="Information about mental wellness support"
          accessibilityRole="button"
        >
          <Ionicons 
            name="information-circle-outline" 
            size={24} 
            color={isDarkMode ? theme.colors.white : theme.colors.grey700} 
          />
        </TouchableOpacity>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, selectedTab === 'chat' && styles.activeTab]}
          onPress={() => handleTabSwitch('chat')}
          accessible={true}
          accessibilityLabel="AI Chat Assistant tab"
          accessibilityRole="tab"
          accessibilityState={{ selected: selectedTab === 'chat' }}
        >
          <Text style={[styles.tabText, selectedTab === 'chat' && styles.activeTabText]}>
            AI Chat Assistant
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, selectedTab === 'therapy' && styles.activeTab]}
          onPress={() => handleTabSwitch('therapy')}
          accessible={true}
          accessibilityLabel="Professional Therapy tab"
          accessibilityRole="tab"
          accessibilityState={{ selected: selectedTab === 'therapy' }}
        >
          <Text style={[styles.tabText, selectedTab === 'therapy' && styles.activeTabText]}>
            Professional Therapy
          </Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 90}
      >
        <Animated.View style={[styles.contentContainer, {opacity: fadeAnim}]}>
          {selectedTab === 'chat' ? (
            // Chat Interface
            <>
              <ScrollView
                ref={scrollViewRef}
                style={styles.messagesContainer}
                contentContainerStyle={styles.messagesContent}
                accessible={true}
                accessibilityLabel="Chat message history"
                accessibilityRole="scrollbar"
              >
                {/* Messages */}
                {messages.map(message => renderMessage({ item: message }))}
                
                {/* "Bot is typing" indicator */}
                {isTyping && (
                  <View 
                    style={styles.typingIndicator}
                    accessible={true}
                    accessibilityLabel="Assistant is thinking"
                    accessibilityRole="text"
                  >
                    <Text style={styles.typingText}>Thinking</Text>
                    <ActivityIndicator size="small" color={theme.colors.primaryDarkGreen} />
                  </View>
                )}
              </ScrollView>

              {/* Quick responses */}
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.quickResponsesContainer}
                accessibilityRole="scrollbar"
                accessibilityLabel="Quick response options"
              >
                {quickResponses.map((response, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.quickResponseButton}
                    onPress={() => handleQuickResponse(response)}
                    accessible={true}
                    accessibilityLabel={`Quick response: ${response}`}
                    accessibilityRole="button"
                    accessibilityHint="Adds this text to the message input"
                  >
                    <Text style={styles.quickResponseText}>{response}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Input area */}
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Type a message..."
                  placeholderTextColor={isDarkMode ? theme.colors.grey500 : theme.colors.grey400}
                  value={inputText}
                  onChangeText={setInputText}
                  multiline
                  accessible={true}
                  accessibilityLabel="Message input field"
                  accessibilityRole="text"
                  accessibilityHint="Type your message here"
                />
                <TouchableOpacity 
                  style={styles.sendButton}
                  onPress={handleSend}
                  disabled={inputText.trim() === ''}
                  accessible={true}
                  accessibilityLabel="Send message"
                  accessibilityRole="button"
                  accessibilityState={{ disabled: inputText.trim() === '' }}
                >
                  <Ionicons 
                    name="send" 
                    size={24} 
                    color={inputText.trim() === '' 
                      ? (isDarkMode ? theme.colors.grey600 : theme.colors.grey400)
                      : theme.colors.white
                    } 
                    accessibilityElementsHidden={true}
                  />
                </TouchableOpacity>
              </View>
            </>
          ) : (
            // Therapy Access Interface
            <ScrollView
              style={styles.therapyContainer}
              contentContainerStyle={styles.therapyContent}
              accessible={true}
              accessibilityLabel="Professional therapy options"
              accessibilityRole="scrollbar"
            >
              <View 
                style={styles.therapyIntro}
                accessible={true}
                accessibilityRole="text"
              >
                <Ionicons 
                  name="heart" 
                  size={40} 
                  color={theme.colors.primaryDarkGreen} 
                  style={styles.therapyIcon}
                  accessibilityElementsHidden={true}
                />
                <Text 
                  style={styles.therapyIntroTitle}
                  accessible={true}
                  accessibilityRole="header"
                >
                  Professional Mental Health Support
                </Text>
                <Text style={styles.therapyIntroText}>
                  Connect with licensed therapists and mental health professionals for personalized support.
                </Text>
              </View>

              <Text 
                style={styles.therapySectionTitle}
                accessible={true}
                accessibilityRole="header"
              >
                Available Services
              </Text>
              
              {therapyOptions.map(option => renderTherapyOption(option))}

              <View 
                style={styles.therapyNote}
                accessible={true}
                accessibilityLabel="Important note: All sessions are confidential and conducted by licensed professionals"
              >
                <Ionicons 
                  name="shield-checkmark" 
                  size={20} 
                  color={theme.colors.primaryDarkGreen}
                  accessibilityElementsHidden={true}
                />
                <Text style={styles.therapyNoteText}>
                  All sessions are confidential and conducted by licensed professionals
                </Text>
              </View>
            </ScrollView>
          )}
        </Animated.View>
      </KeyboardAvoidingView>

      {/* Therapist Booking Modal */}
      <Modal
        visible={showTherapistModal}
        animationType={reduceMotionEnabled ? "none" : "slide"}
        transparent={true}
        onRequestClose={() => setShowTherapistModal(false)}
        accessibilityViewIsModal={true}
      >
        <View 
          style={styles.modalOverlay}
          accessible={true}
          accessibilityLabel="Booking session modal"
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text 
                style={styles.modalTitle}
                accessible={true}
                accessibilityRole="header"
              >
                Book a Session
              </Text>
              <TouchableOpacity
                onPress={() => setShowTherapistModal(false)}
                accessible={true}
                accessibilityLabel="Close modal"
                accessibilityRole="button"
                accessibilityHint="Closes the booking options"
              >
                <Ionicons name="close" size={24} color={isDarkMode ? theme.colors.white : theme.colors.grey700} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalBody}>
              <Text 
                style={styles.modalMessage}
                accessible={true}
              >
                You're one step closer to connecting with a mental health professional. 
                In a real application, you would now see scheduling options and therapist profiles.
              </Text>
              
              <View style={styles.modalFeatures}>
                <View 
                  style={styles.modalFeatureItem}
                  accessible={true}
                  accessibilityLabel="Feature: Flexible scheduling"
                >
                  <Ionicons 
                    name="calendar" 
                    size={24} 
                    color={theme.colors.primaryDarkGreen}
                    accessibilityElementsHidden={true}
                  />
                  <Text style={styles.modalFeatureText}>Flexible scheduling</Text>
                </View>
                <View 
                  style={styles.modalFeatureItem}
                  accessible={true}
                  accessibilityLabel="Feature: Secure video sessions"
                >
                  <Ionicons 
                    name="videocam" 
                    size={24} 
                    color={theme.colors.primaryDarkGreen}
                    accessibilityElementsHidden={true}
                  />
                  <Text style={styles.modalFeatureText}>Secure video sessions</Text>
                </View>
                <View 
                  style={styles.modalFeatureItem}
                  accessible={true}
                  accessibilityLabel="Feature: Licensed professionals"
                >
                  <Ionicons 
                    name="person" 
                    size={24} 
                    color={theme.colors.primaryDarkGreen}
                    accessibilityElementsHidden={true}
                  />
                  <Text style={styles.modalFeatureText}>Licensed professionals</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.modalButton}
              onPress={() => setShowTherapistModal(false)}
              accessible={true}
              accessibilityLabel="Close"
              accessibilityRole="button"
              accessibilityHint="Closes this dialog"
            >
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Relaxation Suggestions Modal */}
      {renderSuggestionsModal()}
    </SafeAreaView>
  );
};

const createStyles = (theme: any, isDarkMode: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDarkMode ? theme.colors.grey700 : theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: isDarkMode ? theme.colors.grey600 : theme.colors.grey300,
  },
  backButton: {
    padding: theme.spacing.xs,
  },
  headerTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.bold,
    color: 'black',
  },
  headerButton: {
    padding: theme.spacing.xs,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: isDarkMode ? theme.colors.grey600 : theme.colors.grey300,
  },
  tab: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.primaryDarkGreen,
  },
  tabText: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.medium,
    color: 'black',
  },
  activeTabText: {
    color: theme.colors.primaryDarkGreen,
    fontFamily: theme.typography.fontFamily.bold,
  },
  keyboardAvoid: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    padding: theme.spacing.md,
  },
  messagesContent: {
    paddingBottom: theme.spacing.md,
  },
  messageBubble: {
    maxWidth: '80%', // Limit width to 80% of container
    minWidth: '40%',
    padding: theme.spacing.md,
    borderRadius: theme.borders.radius.lg,
    marginBottom: theme.spacing.md,
    flexDirection: 'column',
  },
  userMessage: {
    backgroundColor: theme.colors.primaryDarkGreen,
    alignSelf: 'flex-end',
    borderTopRightRadius: 4,
  },
  botMessage: {
    backgroundColor: isDarkMode ? theme.colors.grey600 : theme.colors.grey200,
    alignSelf: 'flex-start',
    borderTopLeftRadius: 4,
  },
  messageText: {
    fontSize: theme.typography.fontSize.md,
    lineHeight: 24, // Increased line height for better readability
    color: isDarkMode ? theme.colors.white : theme.colors.grey800,
    flexWrap: 'wrap', // Ensure text wraps
    width: '100%', // Take full width of bubble
  },
  userMessageText: {
    color: theme.colors.white,
  },
  botMessageText: {
    color: isDarkMode ? theme.colors.white : theme.colors.grey800,
  },
  timestampText: {
    fontSize: theme.typography.fontSize.xs,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  userTimestampText: {
    color: 'black',
  },
  botTimestampText: {
    color: 'black',
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: isDarkMode ? theme.colors.grey600 : theme.colors.grey200,
    borderRadius: theme.borders.radius.lg,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  typingText: {
    fontSize: theme.typography.fontSize.sm,
    color: 'black',
    marginRight: theme.spacing.sm,
  },
  quickResponsesContainer: {
    padding: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: isDarkMode ? theme.colors.grey600 : theme.colors.grey300,
  },
  quickResponseButton: {
    backgroundColor: isDarkMode ? theme.colors.grey600 : theme.colors.grey200,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: 20,
    marginRight: theme.spacing.sm,
  },
  quickResponseText: {
    fontSize: theme.typography.fontSize.sm,
    color: 'black',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: isDarkMode ? theme.colors.grey600 : theme.colors.grey300,
    backgroundColor: isDarkMode ? theme.colors.grey700 : theme.colors.white,
  },
  input: {
    flex: 1,
    backgroundColor: isDarkMode ? theme.colors.grey600 : theme.colors.grey100,
    borderRadius: theme.borders.radius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginRight: theme.spacing.sm,
    color: 'black',
    maxHeight: 120,
  },
  sendButton: {
    backgroundColor: theme.colors.primaryDarkGreen,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  therapyContainer: {
    flex: 1,
  },
  therapyContent: {
    padding: theme.spacing.md,
  },
  therapyIntro: {
    backgroundColor: isDarkMode ? theme.colors.grey600 : theme.colors.white,
    borderRadius: theme.borders.radius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    alignItems: 'center',
    ...theme.shadows.light,
  },
  therapyIcon: {
    marginBottom: theme.spacing.md,
  },
  therapyIntroTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontFamily: theme.typography.fontFamily.bold,
    color: 'black',
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  therapyIntroText: {
    fontSize: theme.typography.fontSize.md,
    color: 'black',
    textAlign: 'center',
    lineHeight: theme.typography.lineHeight.normal,
  },
  therapySectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.bold,
    color: 'black',
    marginBottom: theme.spacing.md,
  },
  therapyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDarkMode ? theme.colors.grey600 : theme.colors.white,
    borderRadius: theme.borders.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.light,
  },
  therapyIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.primaryDarkGreen,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  therapyTextContainer: {
    flex: 1,
  },
  therapyTitle: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.bold,
    color: 'black',
    marginBottom: 4,
  },
  therapyDescription: {
    fontSize: theme.typography.fontSize.sm,
    color: 'black',
    lineHeight: theme.typography.lineHeight.normal,
  },
  therapyNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDarkMode ? 'rgba(0, 106, 77, 0.1)' : 'rgba(0, 106, 77, 0.05)',
    borderRadius: theme.borders.radius.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.xl,
  },
  therapyNoteText: {
    flex: 1,
    marginLeft: theme.spacing.sm,
    fontSize: theme.typography.fontSize.sm,
    color: 'black',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  modalContent: {
    width: '90%',
    backgroundColor: isDarkMode ? theme.colors.grey700 : theme.colors.white,
    borderRadius: theme.borders.radius.lg,
    padding: theme.spacing.lg,
    ...theme.shadows.medium,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  modalTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.primaryDarkGreen,
  },
  modalBody: {
    marginBottom: theme.spacing.lg,
  },
  modalMessage: {
    fontSize: theme.typography.fontSize.md,
    color: 'black',
    lineHeight: theme.typography.lineHeight.normal,
    marginBottom: theme.spacing.lg,
  },
  modalFeatures: {
    marginVertical: theme.spacing.md,
  },
  modalFeatureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  modalFeatureText: {
    marginLeft: theme.spacing.md,
    fontSize: theme.typography.fontSize.md,
    color: 'black',
  },
  modalButton: {
    backgroundColor: theme.colors.primaryDarkGreen,
    borderRadius: theme.borders.radius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  modalButtonText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.medium,
  },
  therapyRecommendation: {
    backgroundColor: isDarkMode ? 'rgba(0, 106, 77, 0.1)' : 'rgba(0, 106, 77, 0.05)',
    padding: theme.spacing.md,
    borderRadius: theme.borders.radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  recommendationIcon: {
    marginRight: theme.spacing.md,
  },
  recommendationText: {
    flex: 1,
    fontSize: theme.typography.fontSize.md,
    color: isDarkMode ? theme.colors.white : theme.colors.grey800,
    lineHeight: theme.typography.lineHeight.normal,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  suggestionText: {
    marginLeft: theme.spacing.md,
    fontSize: theme.typography.fontSize.md,
    color: isDarkMode ? theme.colors.white : theme.colors.grey800,
    flex: 1,
  },
  therapyButton: {
    backgroundColor: theme.colors.primaryDarkGreen,
    padding: theme.spacing.md,
    borderRadius: theme.borders.radius.md,
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  therapyButtonText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.medium,
  },
  suggestionModalContent: {
    maxHeight: '80%',
  },
  suggestionIntro: {
    fontSize: 16,
    color: isDarkMode ? theme.colors.grey200 : theme.colors.grey700,
    marginBottom: 15,
    lineHeight: 22,
  },
  suggestionIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  therapyRecommendIcon: {
    marginRight: 10,
  },
  therapyRecommendText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: isDarkMode ? theme.colors.grey200 : theme.colors.grey800,
  },
  suggestionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  suggestionButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: isDarkMode ? theme.colors.grey700 : theme.colors.grey300,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
  },
  suggestionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: isDarkMode ? theme.colors.white : theme.colors.grey800,
  },
});

export default ChatTherapyScreen;