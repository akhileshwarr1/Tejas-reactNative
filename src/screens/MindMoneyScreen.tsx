import React, { useState, useRef, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  AppState,
  AppStateStatus,
  Animated
} from 'react-native';
import { useTheme } from '../components/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { notificationService, NotificationData } from '../services/NotificationService';
import * as Notifications from 'expo-notifications';

const MindMoneyScreen = ({ navigation }) => {
  const { theme, isDarkMode } = useTheme();
  
  // Create dynamic styles using the theme
  const styles = createStyles(theme, isDarkMode);

  // State for AI Financial Assistant
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [userQuestion, setUserQuestion] = useState('');
  const [messages, setMessages] = useState([
    { 
      id: '1', 
      type: 'system', 
      text: 'Hello! I\'m your AI Financial Assistant. Ask me about your finances or check out my insights below.', 
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef(null);
  const [showInsights, setShowInsights] = useState(true);

  // State for push notifications
  const [showNotification, setShowNotification] = useState(false);
  const [currentNotification, setCurrentNotification] = useState(null);
  const notificationOpacity = useRef(new Animated.Value(0)).current;
  const notificationPosition = useRef(new Animated.Value(-100)).current;

  // Mock financial data for demonstrations
  const mockFinancialData = {
    currentBalance: 1587.42,
    overdraftLimit: 500,
    projectedEndOfMonth: 276.35,
    recentLargeExpenses: [
      { id: '1', name: 'Amazon', amount: 49.99, date: '22 Apr 2025' },
      { id: '2', name: 'Uber', amount: 32.50, date: '20 Apr 2025' },
      { id: '3', name: 'Sainsbury\'s', amount: 87.65, date: '19 Apr 2025' }
    ],
    subscriptions: [
      { id: '1', name: 'Netflix', amount: 15.99, lastUsed: '23 Apr 2025' },
      { id: '2', name: 'Gym Membership', amount: 49.99, lastUsed: '15 Feb 2025' },
      { id: '3', name: 'Spotify', amount: 9.99, lastUsed: '24 Apr 2025' }
    ],
    billChanges: [
      { id: '1', name: 'Electricity', currentAmount: 125.40, previousAmount: 104.50, percentChange: 20 },
      { id: '2', name: 'Water', currentAmount: 45.75, previousAmount: 42.60, percentChange: 7 }
    ],
    savingOpportunities: [
      { id: '1', category: 'Entertainment', currentSpend: 145.80, suggestedSpend: 100.00, saving: 45.80 },
      { id: '2', category: 'Food & Dining', currentSpend: 420.30, suggestedSpend: 350.00, saving: 70.30 }
    ]
  };

  // Financial insights based on mock data
  const financialInsights = [
    {
      id: '1',
      type: 'warning',
      title: 'Approaching Overdraft',
      description: `Your projected balance by month-end is £${mockFinancialData.projectedEndOfMonth}. Consider reducing expenses to avoid charges.`,
      icon: 'alert-circle'
    },
    {
      id: '2',
      type: 'suggestion',
      title: 'Unused Gym Membership',
      description: `Your gym subscription (£${mockFinancialData.subscriptions[1].amount}/month) hasn't been used in 2 months. Consider pausing or canceling.`,
      icon: 'fitness'
    },
    {
      id: '3',
      type: 'alert',
      title: 'Bill Increase Detected',
      description: `Your electricity bill increased by ${mockFinancialData.billChanges[0].percentChange}% this month (£${mockFinancialData.billChanges[0].previousAmount} → £${mockFinancialData.billChanges[0].currentAmount}).`,
      icon: 'flash'
    },
    {
      id: '4',
      type: 'saving',
      title: 'Potential Monthly Savings',
      description: `You could save £${mockFinancialData.savingOpportunities[0].saving + mockFinancialData.savingOpportunities[1].saving} by optimizing your spending on entertainment and dining.`,
      icon: 'cash'
    }
    ,
    {
      id: '5',
      type: 'saving',
      title: 'Well done!',
      description: `You stayed on track for both your wallet and your wellbeing. You’re not just rich — you’re wise. 🌿`,
      icon: 'fitness'
    }

    
  ];

  // Sample questions that user can ask the AI
  const sampleQuestions = [
    "Can I afford a new phone next month?",
    "How much am I spending on subscriptions?",
    "Where can I cut back on expenses?",
    "Am I on track with my savings goals?"
  ];

  // Function to handle user questions
  const handleSendQuestion = () => {
    if (!userQuestion.trim()) return;
    
    // Add user question to messages
    const userMsg = {
      id: Date.now().toString(),
      type: 'user',
      text: userQuestion,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setUserQuestion('');
    setIsTyping(true);
    setShowInsights(false);
    
    // Simulate AI thinking and response
    setTimeout(() => {
      const aiResponse = getAIResponse(userMsg.text);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
      
      // Scroll to the bottom
      if (flatListRef.current) {
        flatListRef.current.scrollToEnd({ animated: true });
      }
    }, 1500);
  };

  // Generate AI responses based on user questions
  const getAIResponse = (question) => {
    const lowerQuestion = question.toLowerCase();
    let response = {
      id: Date.now().toString(),
      type: 'system',
      text: "I'm sorry, I don't have enough information to answer that question.",
      timestamp: new Date()
    };
    
    // Check for different types of questions and provide appropriate responses
    if (lowerQuestion.includes('afford') && lowerQuestion.includes('phone')) {
      response.text = `Based on your current balance of £${mockFinancialData.currentBalance} and projected end-of-month balance of £${mockFinancialData.projectedEndOfMonth}, purchasing a new phone next month might be challenging without adjusting your budget. Consider waiting until you've built up more savings or look into phone plans with lower upfront costs.`;
    } 
    else if (lowerQuestion.includes('subscription')) {
      const totalSubscriptions = mockFinancialData.subscriptions.reduce((sum, sub) => sum + sub.amount, 0);
      response.text = `You're currently spending £${totalSubscriptions.toFixed(2)} monthly on subscriptions:\n\n` + 
        mockFinancialData.subscriptions.map(sub => `• ${sub.name}: £${sub.amount}`).join('\n');
    }
    else if (lowerQuestion.includes('cut') && lowerQuestion.includes('expenses') || 
             lowerQuestion.includes('save') && lowerQuestion.includes('money')) {
      response.text = `Here are some ways you could save money:\n\n` +
        `• Cancel your unused gym membership: £${mockFinancialData.subscriptions[1].amount}/month\n` +
        `• Reduce entertainment spending: potential saving of £${mockFinancialData.savingOpportunities[0].saving}/month\n` +
        `• Optimize food & dining: potential saving of £${mockFinancialData.savingOpportunities[1].saving}/month\n\n` +
        `Would you like me to help you set up a savings plan?`;
    }
    else if (lowerQuestion.includes('saving') && lowerQuestion.includes('goal')) {
      response.text = "Based on your recent spending patterns and current savings rate, you're not on track to meet your emergency fund goal. Consider increasing your monthly savings by £75-100 to stay on schedule.";
    }
    
    return response;
  };

  // Handle tapping on a sample question
  const handleSampleQuestion = (question) => {
    setUserQuestion(question);
    setShowInsights(false);
  };

  // Navigate to ChatTherapy screen
  const navigateToChatTherapy = () => {
    navigation.navigate('ChatTherapy');
  };

  // Navigate to Budgeting screen
  const navigateToBudgeting = () => {
    navigation.navigate('Budgeting');
  };

  // Navigate to Wellness Dashboard screen
  const navigateToWellnessDashboard = () => {
    navigation.navigate('WellnessDashboard');
  };

  // Mental wellness support options from prompts.txt
  const mentalWellnessOptions = [
    {
      id: 'chat',
      title: 'Instant Chat & Therapy Access',
      description: 'AI-powered mental health support or direct access to licensed professionals.',
      icon: 'chatbubble-ellipses',
      onPress: navigateToChatTherapy
    },
    // {
    //   id: 'mindfulness',
    //   title: 'Mindfulness & Stress Management',
    //   description: 'Guided breathing exercises, meditation tools, and self-care techniques.',
    //   icon: 'leaf',
    //   onPress: () => {} // Placeholder for future implementation
    // },
    {
      id: 'wellness',
      title: 'Wellness Dashboard',
      description: 'Integrated health data with personalized recommendations for mental wellbeing.',
      icon: 'fitness',
      onPress: navigateToWellnessDashboard
    },
    // {
    //   id: 'peer',
    //   title: 'Peer Support & Community Forums',
    //   description: 'Safe spaces to connect with others facing similar challenges.',
    //   icon: 'people',
    //   onPress: () => {} // Placeholder for future implementation
    // },
    // {
    //   id: 'crisis',
    //   title: 'Crisis Hotline & Emergency Help',
    //   description: 'Quick access to immediate mental health assistance.',
    //   icon: 'medkit',
    //   onPress: () => {} // Placeholder for future implementation
    // }
  ];

  // Financial guidance options from prompts.txt
  const financialGuidanceOptions = [
    {
        id: 'budget',
        title: 'Budgeting & Money Management Tools',
        description: 'AI-driven apps for tracking expenses and creating savings plans.',
        icon: 'calculator',
        onPress: navigateToBudgeting
    },
    {
      id: 'ai-assistant',
      title: 'AI Financial Assistant',
      description: 'Ask questions about your finances and get personalized advice and insights.',
      icon: 'chatbox-ellipses',
      onPress: () => setShowAIAssistant(true)
    },
    {
      id: 'rewards',
      title: 'Personalised Rewards',
      description: 'Earn rewards for reaching your finance and wellness goals.',
      icon: 'gift',
      onPress: () => navigation.navigate('Rewards')
    },
    // {
    //   id: 'debt',
    //   title: 'Debt Support & Loan Guidance',
    //   description: 'Resources for managing student loans, credit card debt, and financial stress.',
    //   icon: 'cash'
    // },
    // {
    //   id: 'employment',
    //   title: 'Employment & Side Hustle Finder',
    //   description: 'Job opportunities, freelancing platforms, and gig economy insights.',
    //   icon: 'briefcase'
    // },
    // {
    //   id: 'insurance',
    //   title: 'Insurance & Financial Safety Nets',
    //   description: 'Guidance on health, home, and financial protection solutions.',
    //   icon: 'shield-checkmark'
    // }
  ];

  // Practical resources options from prompts.txt
  const practicalResourcesOptions = [
    {
      id: 'education',
      title: 'Educational Hub',
      description: 'Articles, videos, and workshops on mental resilience and financial literacy.',
      icon: 'book'
    },
    // {
    //   id: 'goals',
    //   title: 'Goal Setting & Progress Tracker',
    //   description: 'Personalized plans to build financial security while prioritizing wellness.',
    //   icon: 'trophy'
    // },
    // {
    //   id: 'coach',
    //   title: 'AI Financial Coach',
    //   description: 'Smart suggestions on financial decisions based on spending habits.',
    //   icon: 'analytics'
    // },
    // {
    //   id: 'assessment',
    //   title: 'Self-Assessment Tools',
    //   description: 'Interactive questionnaires to help users gauge their mental and financial well-being.',
    //   icon: 'clipboard'
    // }
  ];

  const renderOptionCard = (option) => (
    <TouchableOpacity 
      key={option.id}
      style={styles.optionCard}
      onPress={option.onPress}
    >
    <View style={styles.optionIconContainer}>
        <Ionicons name={option.icon} size={28} color={theme.colors.white} />
      </View>
      <View style={styles.optionTextContainer}>
        {/* <View style={styles.optionTextContent}> */}
          <Text style={styles.optionTitle} numberOfLines={1}>{option.title}</Text>
          {/* <Text style={styles.optionDescription} numberOfLines={2}>{option.description}</Text> */}
        {/* </View> */}
      </View>
      <View style={styles.optionArrow}>
        <Ionicons 
          name="chevron-forward" 
          size={22} 
          color={isDarkMode ? theme.colors.grey400 : theme.colors.grey600} 
        />
      </View>

    </TouchableOpacity>
  );

  // Define the notification timer effect and notification response handler
  useEffect(() => {
    // Request notification permissions when component mounts
    notificationService.requestPermissions();
    
    // Track app state to reset notification timer when app comes to foreground
    const appStateSubscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        // App has come to the foreground
        console.log('App has come to the foreground');
      }
    });
    
    // Function to show a random insight as a mobile notification
    const showRandomInsightNotification = () => {
      // Pick a random insight
      const randomIndex = Math.floor(Math.random() * financialInsights.length);
      const insight = financialInsights[randomIndex];
      
      // Create notification data
      const notificationData: NotificationData = {
        id: insight.id,
        title: insight.title,
        body: insight.description,
        type: insight.type as 'warning' | 'alert' | 'suggestion' | 'saving',
        data: {
          insightId: insight.id,
          type: insight.type
        }
      };
      
      // Using presentNotificationImmediately for more reliable notifications
      console.log("Showing notification:", notificationData.title);
      notificationService.presentNotificationImmediately(notificationData);
    };
    
    // Set up interval for notifications (every 100 seconds for testing)
    const notificationTimer = setInterval(showRandomInsightNotification, 100000); // 100 seconds for testing
    
    // Show first notification after a short delay
    const initialTimer = setTimeout(showRandomInsightNotification, 2000);
    
    // Set up notification response listener
    const notificationResponseListener = Notifications.addNotificationResponseReceivedListener(response => {
      // Handle the notification tap here
      console.log('Notification tapped:', response);
      
      // Open AI Assistant when notification is tapped
      setShowAIAssistant(true);
    });
    
    // Set up notification received listener (when app is in foreground)
    const notificationReceivedListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received in foreground:', notification);
    });
    
    // Clean up on component unmount
    return () => {
      clearInterval(notificationTimer);
      clearTimeout(initialTimer);
      notificationResponseListener.remove();
      notificationReceivedListener.remove();
      appStateSubscription.remove();
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons 
            name="arrow-back" 
            size={24} 
            color={isDarkMode ? theme.colors.white : theme.colors.grey700} 
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mind & Money</Text>
        <View style={styles.headerIconPlaceholder} />
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>23 April 2025</Text>
        </View>

        <View style={styles.introContainer}>
          <View style={styles.introIconContainer}>
          <Ionicons name="bulb-outline" size={28} color={theme.colors.white} />
          </View>
            <Text style={styles.introTitle}>Financial Independence & Mental Wellness</Text>
        </View>

        <Text style={styles.sectionTitle}>Financial Stability & Guidance</Text>
        {financialGuidanceOptions.map(option => renderOptionCard(option))}

        <Text style={styles.sectionTitle}>Mental Wellness Support</Text>
        {mentalWellnessOptions.map(option => renderOptionCard(option))}

    
        <Text style={styles.sectionTitle}>Personalised Insights & Rewards</Text>
        {practicalResourcesOptions.map(option => renderOptionCard(option))}

        <TouchableOpacity style={styles.specialistButton}>
          <Ionicons name="videocam" size={22} color={theme.colors.white} />
          <Text style={styles.specialistButtonText}>Book a Specialist Consultation</Text>
        </TouchableOpacity>

        <View style={styles.footerSpace} />
      </ScrollView>

      {/* AI Financial Assistant Modal */}
      <Modal
        visible={showAIAssistant}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowAIAssistant(false)}
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.aiHeader}>
            <View style={styles.aiHeaderContent}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => {
                  setShowAIAssistant(false);
                  setShowInsights(true);
                }}
              >
                <Ionicons 
                  name="arrow-back" 
                  size={24} 
                  color={isDarkMode ? theme.colors.white : theme.colors.grey700} 
                />
              </TouchableOpacity>
              <Text style={styles.aiHeaderTitle}>AI Financial Assistant</Text>
            </View>
            <View style={styles.aiHeaderActions}>
              <TouchableOpacity 
                style={styles.aiHeaderButton}
                onPress={() => setShowInsights(!showInsights)}
              >
                <Ionicons 
                  name={showInsights ? "eye-off" : "eye"} 
                  size={24} 
                  color={isDarkMode ? theme.colors.white : theme.colors.grey700} 
                />
              </TouchableOpacity>
            </View>
          </View>

          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
          >
            <FlatList
              ref={flatListRef}
              data={messages}
              style={styles.chatContainer}
              keyExtractor={(item) => item.id}
              onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
              ListHeaderComponent={
                showInsights ? (
                  <View style={styles.insightsContainer}>
                    <Text style={styles.insightsTitle}>Financial Insights</Text>
                    
                    {financialInsights.map((insight) => (
                      <View
                        key={insight.id} 
                        style={[
                          styles.insightCard,
                          insight.type === 'warning' && styles.warningCard,
                          insight.type === 'alert' && styles.alertCard,
                          insight.type === 'suggestion' && styles.suggestionCard,
                          insight.type === 'saving' && styles.savingCard,
                        ]}
                      >
                        <View style={styles.insightIconContainer}>
                          <Ionicons 
                            name={insight.icon} 
                            size={22} 
                            color={theme.colors.white} 
                          />
                        </View>
                        <View style={styles.insightContent}>
                          <Text style={styles.insightTitle}>{insight.title}</Text>
                          <Text style={styles.insightDescription}>{insight.description}</Text>
                        </View>
                      </View>
                    ))}
                    
                    <Text style={styles.questionSuggestionsTitle}>
                      Popular Questions
                    </Text>
                    <View style={styles.questionSuggestions}>
                      {sampleQuestions.map((question, index) => (
                        <TouchableOpacity 
                          key={index} 
                          style={styles.suggestionChip}
                          onPress={() => handleSampleQuestion(question)}
                        >
                          <Text style={styles.suggestionChipText}>{question}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                ) : null
              }
              renderItem={({ item }) => (
                <View style={[
                  styles.messageContainer,
                  item.type === 'user' ? styles.userMessage : styles.systemMessage
                ]}>
                  {item.type !== 'user' && (
                    <View style={styles.avatarContainer}>
                      <Ionicons name="logo-buffer" size={18} color={theme.colors.white} />
                    </View>
                  )}
                  <View style={[
                    styles.messageBubble,
                    item.type === 'user' ? styles.userBubble : styles.systemBubble
                  ]}>
                    <Text style={[
                      styles.messageText,
                      item.type === 'user' ? styles.userMessageText : styles.systemMessageText
                    ]}>
                      {item.text}
                    </Text>
                  </View>
                  {item.type === 'user' && (
                    <View style={styles.avatarContainer}>
                      <Ionicons name="person" size={18} color={theme.colors.white} />
                    </View>
                  )}
                </View>
              )}
              ListFooterComponent={
                isTyping ? (
                  <View style={styles.typingContainer}>
                    <View style={styles.typingBubble}>
                      <View style={styles.typingIndicator}>
                        <View style={[styles.typingDot, styles.typingDot1]} />
                        <View style={[styles.typingDot, styles.typingDot2]} />
                        <View style={[styles.typingDot, styles.typingDot3]} />
                      </View>
                    </View>
                  </View>
                ) : null
              }
            />

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={userQuestion}
                onChangeText={setUserQuestion}
                placeholder="Ask me about your finances..."
                placeholderTextColor={isDarkMode ? theme.colors.grey500 : theme.colors.grey400}
                multiline
              />
              <TouchableOpacity 
                style={[
                  styles.sendButton, 
                  !userQuestion.trim() && styles.sendButtonDisabled
                ]}
                onPress={handleSendQuestion}
                disabled={!userQuestion.trim()}
              >
                <Ionicons name="send" size={20} color={theme.colors.white} />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const createStyles = (theme, isDarkMode) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDarkMode ? theme.colors.grey700 : theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: isDarkMode ? theme.colors.grey600 : theme.colors.grey300,
  },
  headerTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontFamily: theme.typography.fontFamily.bold,
    color: isDarkMode ? theme.colors.white : theme.colors.grey700,
  },
  backButton: {
    padding: theme.spacing.xs,
  },
  headerIconPlaceholder: {
    width: 40, // To balance the header layout
  },
  scrollView: {
    flex: 1,
    padding: theme.spacing.md,
  },
  dateContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  dateText: {
    fontSize: theme.typography.fontSize.sm,
    color: isDarkMode ? theme.colors.grey400 : theme.colors.grey600,
  },
  introContainer: {
    backgroundColor: isDarkMode ? theme.colors.grey600 : theme.colors.white,
    borderRadius: theme.borders.radius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    alignItems: 'center',
    ...theme.shadows.light,
  },
  introIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.primaryDarkGreen,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  introTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontFamily: theme.typography.fontFamily.bold,
    color: isDarkMode ? theme.colors.white : theme.colors.grey700,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  introText: {
    fontSize: theme.typography.fontSize.md,
    color: isDarkMode ? theme.colors.grey300 : theme.colors.grey600,
    textAlign: 'center',
    lineHeight: theme.typography.lineHeight.normal,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.bold,
    color: isDarkMode ? theme.colors.grey200 : theme.colors.grey700,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDarkMode ? theme.colors.grey600 : theme.colors.white,
    borderRadius: theme.borders.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.light,
  },

  optionIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.primaryDarkGreen,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTextContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.medium,
    color: isDarkMode ? theme.colors.white : theme.colors.grey700,
    marginBottom: theme.spacing.xs,
  },
  optionDescription: {
    fontSize: theme.typography.fontSize.sm,
    color: isDarkMode ? theme.colors.grey300 : theme.colors.grey600,
    lineHeight: theme.typography.lineHeight.normal,
  },
  optionArrow: {
    paddingLeft: theme.spacing.sm,
  },
  specialistButton: {
    flexDirection: 'row',
    backgroundColor: theme.colors.primaryDarkGreen,
    borderRadius: theme.borders.radius.md,
    padding: theme.spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.md,
  },
  specialistButtonText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.medium,
    marginLeft: theme.spacing.sm,
  },
  footerSpace: {
    height: 30,
  },
  aiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: isDarkMode ? theme.colors.grey600 : theme.colors.grey300,
  },
  aiHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiHeaderTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontFamily: theme.typography.fontFamily.bold,
    color: isDarkMode ? theme.colors.white : theme.colors.grey700,
    marginLeft: theme.spacing.sm,
  },
  aiHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiHeaderButton: {
    padding: theme.spacing.xs,
  },
  chatContainer: {
    flex: 1,
    padding: theme.spacing.md,
  },
  insightsContainer: {
    marginBottom: theme.spacing.md,
  },
  insightsTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.bold,
    color: isDarkMode ? theme.colors.white : theme.colors.grey700,
    marginBottom: theme.spacing.sm,
  },
  insightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDarkMode ? theme.colors.grey600 : theme.colors.white,
    borderRadius: theme.borders.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.light,
  },
  warningCard: {
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.warning,
  },
  alertCard: {
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.alert,
  },
  suggestionCard: {
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.suggestion,
  },
  savingCard: {
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.saving,
  },
  insightIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primaryDarkGreen,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.medium,
    color: isDarkMode ? theme.colors.white : theme.colors.grey700,
    marginBottom: theme.spacing.xs,
  },
  insightDescription: {
    fontSize: theme.typography.fontSize.sm,
    color: isDarkMode ? theme.colors.grey300 : theme.colors.grey600,
    lineHeight: theme.typography.lineHeight.normal,
  },
  questionSuggestionsTitle: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.bold,
    color: isDarkMode ? theme.colors.white : theme.colors.grey700,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  questionSuggestions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  suggestionChip: {
    backgroundColor: theme.colors.primaryDarkGreen,
    borderRadius: theme.borders.radius.md,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    marginRight: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  suggestionChipText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.medium,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: theme.spacing.md,
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  systemMessage: {
    justifyContent: 'flex-start',
  },
  avatarContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: theme.colors.primaryDarkGreen,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  messageBubble: {
    maxWidth: '80%',
    borderRadius: theme.borders.radius.md,
    padding: theme.spacing.md,
  },
  userBubble: {
    backgroundColor: theme.colors.primaryDarkGreen,
  },
  systemBubble: {
    backgroundColor: isDarkMode ? theme.colors.grey600 : theme.colors.white,
  },
  messageText: {
    fontSize: theme.typography.fontSize.md,
  },
  userMessageText: {
    color: theme.colors.white,
  },
  systemMessageText: {
    color: isDarkMode ? theme.colors.white : theme.colors.grey700,
  },
  typingContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  typingBubble: {
    maxWidth: '80%',
    borderRadius: theme.borders.radius.md,
    padding: theme.spacing.md,
    backgroundColor: isDarkMode ? theme.colors.grey600 : theme.colors.white,
  },
  typingIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 40,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: isDarkMode ? theme.colors.white : theme.colors.grey700,
  },
  typingDot1: {
    animation: 'typing 1s infinite',
  },
  typingDot2: {
    animation: 'typing 1s infinite 0.2s',
  },
  typingDot3: {
    animation: 'typing 1s infinite 0.4s',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: isDarkMode ? theme.colors.grey600 : theme.colors.grey300,
  },
  input: {
    flex: 1,
    backgroundColor: isDarkMode ? theme.colors.grey600 : theme.colors.white,
    borderRadius: theme.borders.radius.md,
    padding: theme.spacing.md,
    fontSize: theme.typography.fontSize.md,
    color: isDarkMode ? theme.colors.white : theme.colors.grey700,
    marginRight: theme.spacing.sm,
  },
  sendButton: {
    backgroundColor: theme.colors.primaryDarkGreen,
    borderRadius: theme.borders.radius.md,
    padding: theme.spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: isDarkMode ? theme.colors.grey600 : theme.colors.grey300,
  },
  notificationContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: isDarkMode ? theme.colors.grey600 : theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: isDarkMode ? theme.colors.grey600 : theme.colors.grey300,
    padding: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1000,
  },
  warningNotification: {
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.warning,
  },
  alertNotification: {
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.alert,
  },
  suggestionNotification: {
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.suggestion,
  },
  savingNotification: {
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.saving,
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  notificationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primaryDarkGreen,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  notificationTextContainer: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.medium,
    color: isDarkMode ? theme.colors.white : theme.colors.grey700,
    marginBottom: theme.spacing.xs,
  },
  notificationDescription: {
    fontSize: theme.typography.fontSize.sm,
    color: isDarkMode ? theme.colors.grey300 : theme.colors.grey600,
    lineHeight: theme.typography.lineHeight.normal,
  },
  notificationCloseButton: {
    padding: theme.spacing.xs,
  },
});

export default MindMoneyScreen;