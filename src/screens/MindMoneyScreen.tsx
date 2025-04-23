import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import { useTheme } from '../components/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';

const MindMoneyScreen = ({ navigation }) => {
  const { theme, isDarkMode } = useTheme();
  
  // Create dynamic styles using the theme
  const styles = createStyles(theme, isDarkMode);

  // Navigate to ChatTherapy screen
  const navigateToChatTherapy = () => {
    navigation.navigate('ChatTherapy');
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
    {
      id: 'mindfulness',
      title: 'Mindfulness & Stress Management',
      description: 'Guided breathing exercises, meditation tools, and self-care techniques.',
      icon: 'leaf',
      onPress: () => {} // Placeholder for future implementation
    },
    {
      id: 'peer',
      title: 'Peer Support & Community Forums',
      description: 'Safe spaces to connect with others facing similar challenges.',
      icon: 'people',
      onPress: () => {} // Placeholder for future implementation
    },
    {
      id: 'crisis',
      title: 'Crisis Hotline & Emergency Help',
      description: 'Quick access to immediate mental health assistance.',
      icon: 'medkit',
      onPress: () => {} // Placeholder for future implementation
    }
  ];

  // Financial guidance options from prompts.txt
  const financialGuidanceOptions = [
    {
      id: 'budget',
      title: 'Budgeting & Money Management Tools',
      description: 'AI-driven apps for tracking expenses and creating savings plans.',
      icon: 'calculator'
    },
    {
      id: 'debt',
      title: 'Debt Support & Loan Guidance',
      description: 'Resources for managing student loans, credit card debt, and financial stress.',
      icon: 'cash'
    },
    {
      id: 'employment',
      title: 'Employment & Side Hustle Finder',
      description: 'Job opportunities, freelancing platforms, and gig economy insights.',
      icon: 'briefcase'
    },
    {
      id: 'insurance',
      title: 'Insurance & Financial Safety Nets',
      description: 'Guidance on health, home, and financial protection solutions.',
      icon: 'shield-checkmark'
    }
  ];

  // Practical resources options from prompts.txt
  const practicalResourcesOptions = [
    {
      id: 'education',
      title: 'Educational Hub',
      description: 'Articles, videos, and workshops on mental resilience and financial literacy.',
      icon: 'book'
    },
    {
      id: 'goals',
      title: 'Goal Setting & Progress Tracker',
      description: 'Personalized plans to build financial security while prioritizing wellness.',
      icon: 'trophy'
    },
    {
      id: 'coach',
      title: 'AI Financial Coach',
      description: 'Smart suggestions on financial decisions based on spending habits.',
      icon: 'analytics'
    },
    {
      id: 'assessment',
      title: 'Self-Assessment Tools',
      description: 'Interactive questionnaires to help users gauge their mental and financial well-being.',
      icon: 'clipboard'
    }
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
        <Text style={styles.optionTitle}>{option.title}</Text>
        <Text style={styles.optionDescription}>{option.description}</Text>
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
            <Ionicons name="brain" size={28} color={theme.colors.white} />
          </View>
          <Text style={styles.introTitle}>Mental Wellness & Financial Health</Text>
          <Text style={styles.introText}>
            Discover tools and resources to support both your mental wellbeing and financial stability. 
            Take care of your mind while securing your financial future.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Mental Wellness Support</Text>
        {mentalWellnessOptions.map(option => renderOptionCard(option))}

        <Text style={styles.sectionTitle}>Financial Stability & Guidance</Text>
        {financialGuidanceOptions.map(option => renderOptionCard(option))}

        <Text style={styles.sectionTitle}>Practical Resources & Life Skills</Text>
        {practicalResourcesOptions.map(option => renderOptionCard(option))}

        <TouchableOpacity style={styles.specialistButton}>
          <Ionicons name="videocam" size={22} color={theme.colors.white} />
          <Text style={styles.specialistButtonText}>Book a Specialist Consultation</Text>
        </TouchableOpacity>

        <View style={styles.footerSpace} />
      </ScrollView>
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
  }
});

export default MindMoneyScreen;