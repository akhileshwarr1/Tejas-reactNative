import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  SafeAreaView
} from 'react-native';
import { useTheme } from '../components/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';

const LloydsHomeScreen = ({ navigation }) => {
  const { theme, isDarkMode } = useTheme();
  
  // Create dynamic styles using the theme
  const styles = createStyles(theme, isDarkMode);

  // Navigate to MindMoney screen
  const navigateToMindMoney = () => {
    navigation.navigate('MindMoney');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Image 
            source={require('../../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.welcomeText}>Welcome back, Maneesha</Text>
        </View>

        {/* Account Summary Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Account Summary</Text>
          <View style={styles.accountRow}>
            <Text style={styles.accountLabel}>Current Account</Text>
            <Text style={styles.accountValue}>£2,450.75</Text>
          </View>
          <View style={styles.accountRow}>
            <Text style={styles.accountLabel}>Savings</Text>
            <Text style={styles.accountValue}>£8,320.00</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.viewDetailsButton}>
            <Text style={styles.viewDetailsText}>Account Details</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsContainer}>
          <View style={styles.quickActionButton}>
            <Ionicons name="swap-horizontal" size={24} color={theme.colors.primaryDarkGreen} />
            <Text style={styles.quickActionText}>Transfer</Text>
          </View>

          <View style={styles.quickActionButton}>
            <Ionicons name="card" size={24} color={theme.colors.primaryDarkGreen} />
            <Text style={styles.quickActionText}>Pay</Text>
          </View>

          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={navigateToMindMoney}
          >
            <Ionicons name="bulb" size={24} color={theme.colors.primaryDarkGreen} />
            <Text style={styles.quickActionText}>Mind & Money</Text>
          </TouchableOpacity>

          <View style={styles.quickActionButton}>
            <Ionicons name="person-add" size={24} color={theme.colors.primaryDarkGreen} />
            <Text style={styles.quickActionText}>Contacts</Text>
          </View>

          <View style={styles.quickActionButton}>
            <Ionicons name="stats-chart" size={24} color={theme.colors.primaryDarkGreen} />
            <Text style={styles.quickActionText}>Insights</Text>
          </View>
        </View>
        
        {/* Savings Goal */}
        <View style={styles.savingsGoalCard}>
          <Text style={styles.savingsGoalTitle}>Travel Fund Goal</Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '90%' }]} />
            </View>
            <Text style={styles.progressText}>90% Complete</Text>
          </View>
          <Text style={styles.savingsGoalAmount}>£950 / £1,000</Text>
          <View style={styles.addFundsButton}>
            <Text style={styles.addFundsButtonText}>Add Funds</Text>
          </View>
        </View>

        {/* Support Button */}
        <View style={styles.supportButton}>
          <Ionicons name="help-buoy" size={20} color={theme.colors.white} />
          <Text style={styles.supportButtonText}>Get Support</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (theme, isDarkMode) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDarkMode ? theme.colors.grey700 : theme.colors.background,
  },
  scrollView: {
    flex: 1,
    padding: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: theme.spacing.md,
  },
  welcomeText: {
    fontSize: theme.typography.fontSize.xl,
    fontFamily: theme.typography.fontFamily.bold,
    color: isDarkMode ? theme.colors.white : theme.colors.grey700,
  },
  card: {
    ...theme.components.card.container,
    marginVertical: theme.spacing.md,
  },
  cardTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.primaryDarkGreen,
    marginBottom: theme.spacing.md,
  },
  accountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  accountLabel: {
    fontSize: theme.typography.fontSize.md,
    color: isDarkMode ? theme.colors.grey300 : theme.colors.grey600,
  },
  accountValue: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.medium,
    color: isDarkMode ? theme.colors.white : theme.colors.grey700,
  },
  divider: {
    height: 1,
    backgroundColor: isDarkMode ? theme.colors.grey600 : theme.colors.grey300,
    marginVertical: theme.spacing.md,
  },
  viewDetailsButton: {
    alignItems: 'center',
  },
  viewDetailsText: {
    color: theme.colors.primaryDarkGreen,
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.medium,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.bold,
    color: isDarkMode ? theme.colors.grey200 : theme.colors.grey700,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: theme.spacing.lg,
  },
  quickActionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: isDarkMode ? theme.colors.grey600 : theme.colors.white,
    width: 65,
    height: 70,
    borderRadius: 12,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.light,
  },
  quickActionText: {
    fontSize: theme.typography.fontSize.sm,
    color: isDarkMode ? theme.colors.grey300 : theme.colors.grey600,
    marginTop: theme.spacing.xs,
  },
  savingsGoalCard: {
    ...theme.components.card.container,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.xl,
    padding: theme.spacing.lg,
  },
  savingsGoalTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.primaryDarkGreen,
    marginBottom: theme.spacing.md,
  },
  progressContainer: {
    marginBottom: theme.spacing.sm,
  },
  progressBar: {
    height: 10,
    backgroundColor: isDarkMode ? theme.colors.grey500 : theme.colors.grey300,
    borderRadius: 5,
    marginBottom: theme.spacing.xs,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.accentYellow,
    borderRadius: 5,
  },
  progressText: {
    fontSize: theme.typography.fontSize.sm,
    color: isDarkMode ? theme.colors.grey300 : theme.colors.grey600,
    textAlign: 'right',
  },
  savingsGoalAmount: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.medium,
    color: isDarkMode ? theme.colors.white : theme.colors.grey700,
    marginBottom: theme.spacing.md,
  },
  addFundsButton: {
    ...theme.components.button.secondary,
    alignItems: 'center',
  },
  addFundsButtonText: {
    color: theme.colors.primaryDarkGreen,
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.medium,
  },
  supportButton: {
    flexDirection: 'row',
    backgroundColor: theme.colors.primaryDarkGreen,
    borderRadius: theme.borders.radius.md,
    padding: theme.spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  supportButtonText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.medium,
    marginLeft: theme.spacing.sm,
  },
});

export default LloydsHomeScreen;