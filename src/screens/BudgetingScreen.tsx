import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Alert,
  Modal,
  TextInput,
  Switch,
  FlatList,
  Animated,
  Platform
} from 'react-native';
import { useTheme } from '../components/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { PieChart, ProgressChart } from 'react-native-chart-kit';
import DateTimePicker from '@react-native-community/datetimepicker';

// Get screen dimensions for responsive layouts
const { width } = Dimensions.get('window');

// Define interface for expense data
interface ExpenseCategory {
  name: string;
  amount: number;
  color: string;
  legendFontColor: string;
  legendFontSize: number;
}

// Define interface for direct debit data
interface DirectDebit {
  id: string;
  name: string;
  amount: number;
  date: string; // Format: "DD MMM YYYY"
  company: string;
  category: string;
}

// Define interface for savings goal data
interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: Date;
  dateCreated: Date;
  icon: string;
  color: string;
  enableRoundUp: boolean;
  monthlySavingTarget: number;
}

// Define transaction interface for round-up feature
interface Transaction {
  id: string;
  name: string;
  amount: number;
  date: string;
  roundUpAmount: number;
  category: string;
}

const BudgetingScreen = ({ navigation }) => {
  const { theme, isDarkMode } = useTheme();
  
  // Create dynamic styles using the theme
  const styles = createStyles(theme, isDarkMode);

  // Month selection state (for future enhancement to switch months)
  const [selectedMonth, setSelectedMonth] = useState('April');
  
  // States for goal creation modal
  const [isGoalModalVisible, setIsGoalModalVisible] = useState(false);
  const [goalName, setGoalName] = useState('');
  const [goalTargetAmount, setGoalTargetAmount] = useState('');
  const [goalTargetDate, setGoalTargetDate] = useState(new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)); // 3 months from now
  const [goalIcon, setGoalIcon] = useState('cash');
  const [goalColor, setGoalColor] = useState('#006A4D');
  const [enableRoundUp, setEnableRoundUp] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  // States for round-up feature demo modal
  const [isRoundUpModalVisible, setIsRoundUpModalVisible] = useState(false);
  const [selectedGoalForRoundUp, setSelectedGoalForRoundUp] = useState<SavingsGoal | null>(null);
  
  // Animation for progress bars
  const progressAnimation = useRef(new Animated.Value(0)).current;

  // Mock data for current month's expenses (April 2025)
  const [currentMonthExpenses] = useState<ExpenseCategory[]>([
    {
      name: 'General',
      amount: 850,
      color: '#006A4D', // Theme primary color
      legendFontColor: isDarkMode ? '#FFF' : '#333',
      legendFontSize: 14,
    },
    {
      name: 'Entertainment',
      amount: 350,
      color: '#FFB600', // Theme yellow
      legendFontColor: isDarkMode ? '#FFF' : '#333',
      legendFontSize: 14,
    },
    {
      name: 'Bills',
      amount: 620,
      color: '#0077B3', // Theme blue
      legendFontColor: isDarkMode ? '#FFF' : '#333',
      legendFontSize: 14,
    },
    {
      name: 'Personal Care',
      amount: 280,
      color: '#FF9E1B', // Theme amber
      legendFontColor: isDarkMode ? '#FFF' : '#333',
      legendFontSize: 14,
    },
  ]);

  // Mock data for last month's expenses (March 2025)
  const [lastMonthExpenses] = useState<ExpenseCategory[]>([
    {
      name: 'General',
      amount: 920,
      color: '#006A4D',
      legendFontColor: isDarkMode ? '#FFF' : '#333',
      legendFontSize: 14,
    },
    {
      name: 'Entertainment',
      amount: 420,
      color: '#FFB600',
      legendFontColor: isDarkMode ? '#FFF' : '#333',
      legendFontSize: 14,
    },
    {
      name: 'Bills',
      amount: 580,
      color: '#0077B3',
      legendFontColor: isDarkMode ? '#FFF' : '#333',
      legendFontSize: 14,
    },
    {
      name: 'Personal Care',
      amount: 310,
      color: '#FF9E1B',
      legendFontColor: isDarkMode ? '#FFF' : '#333',
      legendFontSize: 14,
    },
  ]);
  
  // Mock data for savings goals
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([
    {
      id: '1',
      name: 'Emergency Fund',
      targetAmount: 5000,
      currentAmount: 2750,
      targetDate: new Date('2025-10-25'),
      dateCreated: new Date('2025-01-15'),
      icon: 'medkit',
      color: '#006A4D',
      enableRoundUp: true,
      monthlySavingTarget: 450
    },
    {
      id: '2',
      name: 'Summer Vacation',
      targetAmount: 2000,
      currentAmount: 850,
      targetDate: new Date('2025-07-15'),
      dateCreated: new Date('2025-02-10'),
      icon: 'airplane',
      color: '#0077B3',
      enableRoundUp: true,
      monthlySavingTarget: 380
    },
    {
      id: '3',
      name: 'New Phone',
      targetAmount: 1200,
      currentAmount: 600,
      targetDate: new Date('2025-06-30'),
      dateCreated: new Date('2025-03-01'),
      icon: 'phone-portrait',
      color: '#FF9E1B',
      enableRoundUp: false,
      monthlySavingTarget: 200
    }
  ]);

  // Mock recent transactions for round-up feature
  const [recentTransactions] = useState<Transaction[]>([
    {
      id: '1',
      name: 'Costa Coffee',
      amount: 4.75,
      date: '24 Apr 2025',
      roundUpAmount: 0.25,
      category: 'Food & Drink'
    },
    {
      id: '2',
      name: 'Tesco Express',
      amount: 12.45,
      date: '23 Apr 2025',
      roundUpAmount: 0.55,
      category: 'Groceries'
    },
    {
      id: '3',
      name: 'TFL Travel',
      amount: 5.80,
      date: '23 Apr 2025',
      roundUpAmount: 0.20,
      category: 'Transport'
    },
    {
      id: '4',
      name: 'Amazon',
      amount: 24.99,
      date: '22 Apr 2025',
      roundUpAmount: 0.01,
      category: 'Shopping'
    },
    {
      id: '5',
      name: 'Pret A Manger',
      amount: 8.65,
      date: '22 Apr 2025',
      roundUpAmount: 0.35,
      category: 'Food & Drink'
    },
  ]);

  // Mock data for direct debits
  const [directDebits] = useState<DirectDebit[]>([
    {
      id: '1',
      name: 'Netflix Subscription',
      amount: 15.99,
      date: '28 Apr 2025',
      company: 'Netflix',
      category: 'Entertainment'
    },
    {
      id: '2',
      name: 'Gym Membership',
      amount: 49.99,
      date: '01 May 2025',
      company: 'FitLife Gym',
      category: 'Health'
    },
    {
      id: '3',
      name: 'Electricity Bill',
      amount: 85.50,
      date: '15 May 2025',
      company: 'PowerGen Energy',
      category: 'Utilities'
    },
    {
      id: '4',
      name: 'Mobile Plan',
      amount: 35.00,
      date: '22 May 2025',
      company: 'Vodafone',
      category: 'Telecommunications'
    },
    {
      id: '5',
      name: 'Cloud Storage',
      amount: 9.99,
      date: '05 May 2025',
      company: 'Google Drive',
      category: 'Digital Services'
    }
  ]);

  // Calculate total expenses for current and previous month
  const currentMonthTotal = currentMonthExpenses.reduce((sum, item) => sum + item.amount, 0);
  const lastMonthTotal = lastMonthExpenses.reduce((sum, item) => sum + item.amount, 0);
  
  // Calculate percentage change compared to last month
  const expenseDifference = lastMonthTotal - currentMonthTotal;
  const expenseChangePercent = Math.round((expenseDifference / lastMonthTotal) * 100);
  const hasSaved = expenseDifference > 0;

  // Animation for goal progress bars
  React.useEffect(() => {
    Animated.timing(progressAnimation, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false
    }).start();
  }, [savingsGoals]);
  
  // Calculate total round-up amount available
  const totalRoundUpAmount = recentTransactions.reduce((sum, transaction) => sum + transaction.roundUpAmount, 0);
  
  // Format date to display format (e.g., "15 Jul 2025")
  const formatDate = (date: Date): string => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };
  
  // Format currency amount with £ sign
  const formatCurrency = (amount: number): string => {
    return `£${amount.toFixed(2)}`;
  };
  
  // Calculate months between two dates
  const monthsBetween = (date1: Date, date2: Date): number => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const yearDiff = d2.getFullYear() - d1.getFullYear();
    const monthDiff = d2.getMonth() - d1.getMonth();
    return yearDiff * 12 + monthDiff;
  };
  
  // Calculate suggested monthly savings
  const calculateMonthlySavings = (targetAmount: number, targetDate: Date): number => {
    const today = new Date();
    const monthsRemaining = monthsBetween(today, targetDate);
    
    if (monthsRemaining <= 0) {
      return targetAmount; // If target date is in the past or today, suggest full amount
    }
    
    return Math.ceil(targetAmount / monthsRemaining);
  };
  
  // Handle creating a new savings goal
  const handleCreateGoal = () => {
    if (!goalName.trim()) {
      Alert.alert('Missing Information', 'Please enter a goal name.');
      return;
    }
    
    const targetAmount = parseFloat(goalTargetAmount);
    if (isNaN(targetAmount) || targetAmount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid target amount.');
      return;
    }
    
    const today = new Date();
    if (goalTargetDate <= today) {
      Alert.alert('Invalid Date', 'Target date must be in the future.');
      return;
    }
    
    const monthlySavingTarget = calculateMonthlySavings(targetAmount, goalTargetDate);
    
    const newGoal: SavingsGoal = {
      id: (savingsGoals.length + 1).toString(),
      name: goalName,
      targetAmount: targetAmount,
      currentAmount: 0,
      targetDate: goalTargetDate,
      dateCreated: today,
      icon: goalIcon,
      color: goalColor,
      enableRoundUp: enableRoundUp,
      monthlySavingTarget: monthlySavingTarget
    };
    
    setSavingsGoals([...savingsGoals, newGoal]);
    
    // Reset form fields
    setGoalName('');
    setGoalTargetAmount('');
    setGoalTargetDate(new Date(Date.now() + 90 * 24 * 60 * 60 * 1000));
    setGoalIcon('cash');
    setGoalColor('#006A4D');
    setEnableRoundUp(true);
    
    // Close modal
    setIsGoalModalVisible(false);
    
    // Show success message
    Alert.alert('Goal Created', 
      `Your "${goalName}" goal has been created! 
      We suggest saving ${formatCurrency(monthlySavingTarget)} monthly to reach your target by ${formatDate(goalTargetDate)}.`
    );
  };
  
  // Handle date change in date picker
  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setGoalTargetDate(selectedDate);
    }
  };
  
  // Show demo of round-up feature
  const showRoundUpDemo = (goal: SavingsGoal) => {
    setSelectedGoalForRoundUp(goal);
    setIsRoundUpModalVisible(true);
  };
  
  // Apply round-ups to selected goal
  const applyRoundUps = () => {
    if (!selectedGoalForRoundUp) return;
    
    const updatedGoals = savingsGoals.map(goal => {
      if (goal.id === selectedGoalForRoundUp.id) {
        return {
          ...goal,
          currentAmount: goal.currentAmount + totalRoundUpAmount
        };
      }
      return goal;
    });
    
    setSavingsGoals(updatedGoals);
    setIsRoundUpModalVisible(false);
    
    // Show confirmation
    Alert.alert(
      'Round-Ups Applied',
      `${formatCurrency(totalRoundUpAmount)} has been added to your "${selectedGoalForRoundUp.name}" goal from transaction round-ups.`
    );
  };

  // Handle cancellation of direct debit
  const handleCancelDirectDebit = (debit: DirectDebit) => {
    Alert.alert(
      'Cancel Direct Debit',
      `Are you sure you want to cancel your ${debit.name} direct debit of £${debit.amount.toFixed(2)}?`,
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes, Cancel',
          onPress: () => Alert.alert(
            'Action Required',
            `In a real app, this would initiate the cancellation process for your ${debit.name} direct debit. Please contact ${debit.company} to complete cancellation.`
          ),
          style: 'destructive',
        },
      ]
    );
  };
  
  // Available goal icons
  const goalIcons = [
    { name: 'cash', label: 'General' },
    { name: 'home', label: 'Home' },
    { name: 'car', label: 'Car' },
    { name: 'airplane', label: 'Travel' },
    { name: 'gift', label: 'Gift' },
    { name: 'school', label: 'Education' },
    { name: 'medkit', label: 'Emergency' },
    { name: 'phone-portrait', label: 'Electronics' }
  ];
  
  // Available colors for goals
  const goalColors = [
    '#006A4D', // Lloyds green
    '#0077B3', // Blue
    '#FF9E1B', // Amber
    '#FFB600', // Yellow
    '#D0021B', // Red
    '#9013FE', // Purple
    '#50E3C2', // Teal
    '#F5A623'  // Orange
  ];

  // Chart configurations
  const chartConfig = {
    backgroundGradientFrom: isDarkMode ? theme.colors.grey700 : theme.colors.white,
    backgroundGradientTo: isDarkMode ? theme.colors.grey700 : theme.colors.white,
    color: (opacity = 1) => `rgba(0, 106, 77, ${opacity})`,
  };

  // Render goal progress item
  const renderGoalProgressItem = (goal: SavingsGoal) => {
    const progressPercentage = Math.min(goal.currentAmount / goal.targetAmount, 1);
    const progressWidth = progressAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: ['0%', `${progressPercentage * 100}%`]
    });
    
    const timeLeft = monthsBetween(new Date(), goal.targetDate);
    const isBehindSchedule = goal.currentAmount < 
      (goal.targetAmount * monthsBetween(goal.dateCreated, new Date()) / 
      monthsBetween(goal.dateCreated, goal.targetDate));
    
    return (
      <View style={styles.goalItem} key={goal.id}>
        <View style={styles.goalHeader}>
          <View style={[styles.goalIconContainer, { backgroundColor: goal.color }]}>
            <Ionicons name={goal.icon} size={20} color={theme.colors.white} />
          </View>
          <View style={styles.goalHeaderContent}>
            <Text style={styles.goalName}>{goal.name}</Text>
            <View style={styles.goalMetaContainer}>
              <Text style={styles.goalMeta}>
                Target: {formatCurrency(goal.targetAmount)} by {formatDate(goal.targetDate)}
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBackground}>
            <Animated.View 
              style={[
                styles.progressBar, 
                { width: progressWidth, backgroundColor: goal.color }
              ]} 
            />
          </View>
          
          <View style={styles.goalAmountContainer}>
            <Text style={styles.goalCurrentAmount}>
              {formatCurrency(goal.currentAmount)}
            </Text>
            <Text style={styles.goalTargetAmount}>
              {formatCurrency(goal.targetAmount)}
            </Text>
          </View>
          
          <View style={styles.goalStatusContainer}>
            <Text style={styles.goalProgressText}>
              {Math.round(progressPercentage * 100)}% Complete
            </Text>
            <Text style={[
              styles.goalTimeText,
              isBehindSchedule ? styles.goalBehindText : {}
            ]}>
              {timeLeft > 0 ? 
                `${timeLeft} ${timeLeft === 1 ? 'month' : 'months'} remaining` : 
                'Target date reached'}
            </Text>
          </View>
        </View>
        
        <View style={styles.goalActionsContainer}>
          <View style={styles.monthlySavingContainer}>
            <Text style={styles.monthlySavingLabel}>Monthly Target:</Text>
            <Text style={styles.monthlySavingAmount}>
              {formatCurrency(goal.monthlySavingTarget)}
            </Text>
          </View>
          
          {goal.enableRoundUp && (
            <TouchableOpacity 
              style={styles.roundUpButton}
              onPress={() => showRoundUpDemo(goal)}
            >
              <Ionicons name="arrow-up-circle" size={16} color={theme.colors.white} />
              <Text style={styles.roundUpButtonText}>Round-Up</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
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
        <Text style={styles.headerTitle}>Budgeting & Money Management</Text>
        <View style={styles.headerIconPlaceholder} />
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Spending Chart Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Spending Overview</Text>
          <Text style={styles.sectionSubtitle}>{selectedMonth} 2025</Text>
          
          {/* Savings/Overspending indicator - moved above chart */}
          <View style={[
            styles.savingsIndicator, 
            hasSaved ? styles.savedIndicator : styles.overspentIndicator
          ]}>
            <Ionicons 
              name={hasSaved ? "trending-down" : "trending-up"} 
              size={16} 
              color={hasSaved ? theme.colors.success : theme.colors.error} 
            />
            <View style={styles.savingsTextContainer}>
              <Text style={[
                styles.savingsText,
                hasSaved ? styles.savedText : styles.overspentText
              ]}>
                {hasSaved 
                  ? `Saved ${Math.abs(expenseChangePercent)}% (£${Math.abs(expenseDifference).toFixed(2)})` 
                  : `Overspent ${Math.abs(expenseChangePercent)}% (£${Math.abs(expenseDifference).toFixed(2)})`}
              </Text>
              <Text style={styles.comparedText}>compared to March</Text>
            </View>
          </View>
          
          <View style={styles.chartContainer}>
            <PieChart
              data={currentMonthExpenses}
              width={width - 32}
              height={220}
              chartConfig={chartConfig}
              accessor="amount"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          </View>
          
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total Expenses:</Text>
            <Text style={styles.totalAmount}>£{currentMonthTotal.toFixed(2)}</Text>
          </View>
          
          <View style={styles.summaryContainer}>
            {currentMonthExpenses.map((category) => (
              <View key={category.name} style={styles.summaryCategoryContainer}>
                <View style={styles.categoryLabelContainer}>
                  <View style={[styles.categoryColorDot, {backgroundColor: category.color}]} />
                  <Text style={styles.categoryLabel}>{category.name}</Text>
                </View>
                <Text style={styles.categoryAmount}>£{category.amount.toFixed(2)}</Text>
              </View>
            ))}
          </View>
        </View>
        
        {/* Savings Goals Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionTitleContainer}>
            <Text style={styles.sectionTitle}>Savings Goals</Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => setIsGoalModalVisible(true)}
            >
              <Ionicons name="add-circle" size={24} color={theme.colors.primaryDarkGreen} />
            </TouchableOpacity>
          </View>
          
          {savingsGoals.length > 0 ? (
            <View style={styles.goalsContainer}>
              {savingsGoals.map(goal => renderGoalProgressItem(goal))}
            </View>
          ) : (
            <View style={styles.noGoalsContainer}>
              <Ionicons name="flag-outline" size={48} color={isDarkMode ? theme.colors.grey500 : theme.colors.grey400} />
              <Text style={styles.noGoalsText}>You haven't set any savings goals yet.</Text>
              <Text style={styles.noGoalsSubtext}>Tap the "+" button to add your first goal.</Text>
            </View>
          )}
        </View>
        
        {/* Direct Debits Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Upcoming Direct Debits</Text>
          
          {directDebits.map((debit) => (
            <View key={debit.id} style={styles.debitItemContainer}>
              <View style={styles.debitMainInfo}>
                <View style={styles.debitDetails}>
                  <Text style={styles.debitName}>{debit.name}</Text>
                  <Text style={styles.debitCompany}>{debit.company}</Text>
                  
                  <View style={styles.debitMetaContainer}>
                    <View style={styles.debitDateContainer}>
                      <Ionicons name="calendar-outline" size={14} color={isDarkMode ? theme.colors.grey400 : theme.colors.grey600} />
                      <Text style={styles.debitDate}>{debit.date}</Text>
                    </View>
                    
                    <View style={styles.debitCategoryContainer}>
                      <Ionicons name="pricetag-outline" size={14} color={isDarkMode ? theme.colors.grey400 : theme.colors.grey600} />
                      <Text style={styles.debitCategory}>{debit.category}</Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.debitAmountContainer}>
                  <Text style={styles.debitAmount}>£{debit.amount.toFixed(2)}</Text>
                </View>
              </View>
              
              <View style={styles.debitActionsContainer}>
                <TouchableOpacity 
                  style={styles.debitActionButton}
                  onPress={() => Alert.alert('Payment Schedule', `You can manage the payment schedule for ${debit.name} in a real banking app.`)}
                >
                  <Ionicons name="calendar" size={18} color={theme.colors.primaryDarkGreen} />
                  <Text style={styles.actionButtonText}>Schedule</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.debitActionButton, styles.cancelButton]}
                  onPress={() => handleCancelDirectDebit(debit)}
                >
                  <Ionicons name="close-circle" size={18} color={theme.colors.error} />
                  <Text style={[styles.actionButtonText, styles.cancelButtonText]}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
        
        {/* Additional Money Management Options */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Money Management Tools</Text>
          
          <TouchableOpacity 
            style={styles.toolButton}
            onPress={() => setIsGoalModalVisible(true)}
          >
            <Ionicons name="create-outline" size={20} color={theme.colors.white} />
            <Text style={styles.toolButtonText}>Create Budget Plan</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.toolButton}>
            <Ionicons name="analytics-outline" size={20} color={theme.colors.white} />
            <Text style={styles.toolButtonText}>Spending Insights</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.toolButton}>
            <Ionicons name="alert-circle-outline" size={20} color={theme.colors.white} />
            <Text style={styles.toolButtonText}>Set Spending Alerts</Text>
          </TouchableOpacity>
        </View>
        
        {/* Spacing at the bottom for better scrolling */}
        <View style={styles.footerSpace} />
      </ScrollView>
      
      {/* Goal Creation Modal */}
      <Modal
        visible={isGoalModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsGoalModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, isDarkMode ? styles.modalContentDark : {}]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create a Savings Goal</Text>
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => setIsGoalModalVisible(false)}
              >
                <Ionicons 
                  name="close" 
                  size={24} 
                  color={isDarkMode ? theme.colors.white : theme.colors.grey700} 
                />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalScrollView}>
              {/* Goal Name Input */}
              <Text style={styles.inputLabel}>Goal Name</Text>
              <TextInput
                style={[styles.textInput, isDarkMode ? styles.textInputDark : {}]}
                value={goalName}
                onChangeText={setGoalName}
                placeholder="e.g., Emergency Fund, Vacation, New Phone"
                placeholderTextColor={isDarkMode ? theme.colors.grey500 : theme.colors.grey400}
              />
              
              {/* Goal Amount Input */}
              <Text style={styles.inputLabel}>Target Amount (£)</Text>
              <TextInput
                style={[styles.textInput, isDarkMode ? styles.textInputDark : {}]}
                value={goalTargetAmount}
                onChangeText={setGoalTargetAmount}
                placeholder="0.00"
                placeholderTextColor={isDarkMode ? theme.colors.grey500 : theme.colors.grey400}
                keyboardType="numeric"
              />
              
              {/* Goal Date Input */}
              <Text style={styles.inputLabel}>Target Date</Text>
              <TouchableOpacity 
                style={[styles.dateButton, isDarkMode ? styles.dateButtonDark : {}]}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={[styles.dateButtonText, isDarkMode ? styles.dateButtonTextDark : {}]}>
                  {formatDate(goalTargetDate)}
                </Text>
                <Ionicons 
                  name="calendar" 
                  size={20} 
                  color={isDarkMode ? theme.colors.grey300 : theme.colors.grey600} 
                />
              </TouchableOpacity>
              
              {/* Date Picker (iOS style sheet) */}
              {showDatePicker && (
                <DateTimePicker
                  value={goalTargetDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleDateChange}
                  minimumDate={new Date()}
                />
              )}
              
              {/* Goal Icon Selection */}
              <Text style={styles.inputLabel}>Icon</Text>
              <View style={styles.iconSelectionContainer}>
                {goalIcons.map(icon => (
                  <TouchableOpacity
                    key={icon.name}
                    style={[
                      styles.iconOption,
                      goalIcon === icon.name ? { backgroundColor: goalColor } : {}
                    ]}
                    onPress={() => setGoalIcon(icon.name)}
                  >
                    <Ionicons 
                      name={icon.name} 
                      size={24} 
                      color={goalIcon === icon.name ? theme.colors.white : 
                        isDarkMode ? theme.colors.grey300 : theme.colors.grey600} 
                    />
                  </TouchableOpacity>
                ))}
              </View>
              
              {/* Goal Color Selection */}
              <Text style={styles.inputLabel}>Color</Text>
              <View style={styles.colorSelectionContainer}>
                {goalColors.map(color => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorOption,
                      { backgroundColor: color },
                      goalColor === color ? styles.selectedColorOption : {}
                    ]}
                    onPress={() => setGoalColor(color)}
                  >
                    {goalColor === color && (
                      <Ionicons name="checkmark" size={18} color={theme.colors.white} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
              
              {/* Enable Round-Up Toggle */}
              <View style={styles.toggleContainer}>
                <View style={styles.toggleLabelContainer}>
                  <Text style={styles.toggleLabel}>Enable "Round-Up to Save"</Text>
                  <Text style={styles.toggleDescription}>
                    Automatically round up transactions to the nearest pound and add the difference to this goal
                  </Text>
                </View>
                <Switch
                  value={enableRoundUp}
                  onValueChange={setEnableRoundUp}
                  trackColor={{ false: theme.colors.grey400, true: theme.colors.primaryDarkGreen }}
                  thumbColor={enableRoundUp ? theme.colors.white : theme.colors.grey300}
                />
              </View>
              
              {/* Create Goal Button */}
              <TouchableOpacity 
                style={styles.createButton}
                onPress={handleCreateGoal}
              >
                <Text style={styles.createButtonText}>Create Goal</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
      
      {/* Round-Up Demo Modal */}
      <Modal
        visible={isRoundUpModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsRoundUpModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, isDarkMode ? styles.modalContentDark : {}, styles.roundUpModalContent]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Round-Up to Save</Text>
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => setIsRoundUpModalVisible(false)}
              >
                <Ionicons 
                  name="close" 
                  size={24} 
                  color={isDarkMode ? theme.colors.white : theme.colors.grey700} 
                />
              </TouchableOpacity>
            </View>
            
            {selectedGoalForRoundUp && (
              <View style={styles.roundUpGoalInfo}>
                <Text style={styles.roundUpTitle}>Add to "{selectedGoalForRoundUp.name}" Goal</Text>
                <Text style={styles.roundUpDescription}>
                  Round-ups from your recent transactions can be added to your savings goal.
                </Text>
                
                <View style={styles.roundUpTotalContainer}>
                  <Text style={styles.roundUpTotalAmount}>{formatCurrency(totalRoundUpAmount)}</Text>
                  <Text style={styles.roundUpTotalLabel}>Available from your recent transactions</Text>
                </View>
                
                <Text style={styles.roundUpTransactionsTitle}>Recent Transactions</Text>
                <View style={styles.transactionsContainer}>
                  {recentTransactions.map(transaction => (
                    <View key={transaction.id} style={styles.transactionItem}>
                      <View style={styles.transactionDetails}>
                        <Text style={styles.transactionName}>{transaction.name}</Text>
                        <Text style={styles.transactionAmount}>{formatCurrency(transaction.amount)}</Text>
                      </View>
                      <View style={styles.roundUpDetails}>
                        <Ionicons name="arrow-up" size={14} color={theme.colors.primaryDarkGreen} />
                        <Text style={styles.roundUpAmount}>+{formatCurrency(transaction.roundUpAmount)}</Text>
                      </View>
                    </View>
                  ))}
                </View>
                
                <TouchableOpacity 
                  style={styles.applyRoundUpButton}
                  onPress={applyRoundUps}
                >
                  <Text style={styles.applyRoundUpText}>
                    Apply {formatCurrency(totalRoundUpAmount)} to Goal
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
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
  sectionContainer: {
    backgroundColor: isDarkMode ? theme.colors.grey600 : theme.colors.white,
    borderRadius: theme.borders.radius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.medium,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontFamily: theme.typography.fontFamily.bold,
    color: isDarkMode ? theme.colors.white : theme.colors.grey700,
    marginBottom: theme.spacing.xs,
  },
  sectionSubtitle: {
    fontSize: theme.typography.fontSize.md,
    color: isDarkMode ? theme.colors.grey300 : theme.colors.grey600,
    marginBottom: theme.spacing.md,
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: theme.spacing.md,
    position: 'relative',
  },
  savingsIndicator: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    alignSelf: 'flex-end',
    borderRadius: theme.borders.radius.md,
    padding: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },
  savedIndicator: {
    backgroundColor: 'rgba(40, 167, 69, 0.1)', // Light green for savings
  },
  overspentIndicator: {
    backgroundColor: 'rgba(220, 53, 69, 0.1)', // Light red for overspending
  },
  savingsTextContainer: {
    marginLeft: theme.spacing.xs,
  },
  savingsText: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.medium,
  },
  savedText: {
    color: theme.colors.success,
  },
  overspentText: {
    color: theme.colors.error,
  },
  comparedText: {
    fontSize: theme.typography.fontSize.xs,
    color: isDarkMode ? theme.colors.grey300 : theme.colors.grey600,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.sm,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    paddingBottom: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: isDarkMode ? theme.colors.grey500 : theme.colors.grey300,
  },
  totalLabel: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.medium,
    color: isDarkMode ? theme.colors.white : theme.colors.grey700,
  },
  totalAmount: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.primaryDarkGreen,
  },
  summaryContainer: {
    marginTop: theme.spacing.md,
  },
  summaryCategoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  categoryLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: theme.spacing.sm,
  },
  categoryLabel: {
    fontSize: theme.typography.fontSize.md,
    color: isDarkMode ? theme.colors.white : theme.colors.grey700,
  },
  categoryAmount: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.medium,
    color: isDarkMode ? theme.colors.white : theme.colors.grey700,
  },
  debitItemContainer: {
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
    borderRadius: theme.borders.radius.md,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.primaryDarkGreen,
  },
  debitMainInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  debitDetails: {
    flex: 1,
  },
  debitName: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.bold,
    color: isDarkMode ? theme.colors.white : theme.colors.grey700,
    marginBottom: 2,
  },
  debitCompany: {
    fontSize: theme.typography.fontSize.sm,
    color: isDarkMode ? theme.colors.grey300 : theme.colors.grey600,
    marginBottom: theme.spacing.sm,
  },
  debitMetaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  debitDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  debitDate: {
    fontSize: theme.typography.fontSize.sm,
    marginLeft: 4,
    color: isDarkMode ? theme.colors.grey400 : theme.colors.grey600,
  },
  debitCategoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  debitCategory: {
    fontSize: theme.typography.fontSize.sm,
    marginLeft: 4,
    color: isDarkMode ? theme.colors.grey400 : theme.colors.grey600,
  },
  debitAmountContainer: {
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
  },
  debitAmount: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.primaryDarkGreen,
  },
  debitActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
  },
  debitActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.sm,
    borderRadius: theme.borders.radius.md,
    backgroundColor: isDarkMode ? 'rgba(0, 106, 77, 0.1)' : 'rgba(0, 106, 77, 0.05)',
    marginLeft: theme.spacing.sm,
  },
  actionButtonText: {
    marginLeft: 4,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primaryDarkGreen,
  },
  cancelButton: {
    backgroundColor: isDarkMode ? 'rgba(220, 53, 69, 0.1)' : 'rgba(220, 53, 69, 0.05)',
  },
  cancelButtonText: {
    color: theme.colors.error,
  },
  toolButton: {
    backgroundColor: theme.colors.primaryDarkGreen,
    borderRadius: theme.borders.radius.md,
    padding: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  toolButtonText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.medium,
    marginLeft: theme.spacing.sm,
  },
  footerSpace: {
    height: 40,
  },
  // Savings Goals Section
  sectionTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  addButton: {
    padding: theme.spacing.xs,
  },
  goalsContainer: {
    marginTop: theme.spacing.sm,
  },
  noGoalsContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  noGoalsText: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.medium,
    color: isDarkMode ? theme.colors.grey300 : theme.colors.grey600,
    marginTop: theme.spacing.md,
  },
  noGoalsSubtext: {
    fontSize: theme.typography.fontSize.sm,
    color: isDarkMode ? theme.colors.grey400 : theme.colors.grey500,
    marginTop: theme.spacing.xs,
  },
  goalItem: {
    backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
    borderRadius: theme.borders.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.primaryDarkGreen,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  goalIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primaryDarkGreen,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  goalHeaderContent: {
    flex: 1,
  },
  goalName: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.bold,
    color: isDarkMode ? theme.colors.white : theme.colors.grey700,
    marginBottom: 2,
  },
  goalMetaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalMeta: {
    fontSize: theme.typography.fontSize.sm,
    color: isDarkMode ? theme.colors.grey300 : theme.colors.grey600,
  },
  progressContainer: {
    marginBottom: theme.spacing.md,
  },
  progressBackground: {
    height: 12,
    backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: theme.spacing.xs,
  },
  progressBar: {
    height: '100%',
    backgroundColor: theme.colors.primaryDarkGreen,
    borderRadius: 6,
  },
  goalAmountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xs,
  },
  goalCurrentAmount: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.medium,
    color: isDarkMode ? theme.colors.white : theme.colors.grey700,
  },
  goalTargetAmount: {
    fontSize: theme.typography.fontSize.sm,
    color: isDarkMode ? theme.colors.grey300 : theme.colors.grey600,
  },
  goalStatusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goalProgressText: {
    fontSize: theme.typography.fontSize.xs,
    color: isDarkMode ? theme.colors.grey300 : theme.colors.grey600,
  },
  goalTimeText: {
    fontSize: theme.typography.fontSize.xs,
    color: isDarkMode ? theme.colors.grey300 : theme.colors.grey600,
  },
  goalBehindText: {
    color: theme.colors.error,
  },
  goalActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
    paddingTop: theme.spacing.sm,
  },
  monthlySavingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  monthlySavingLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: isDarkMode ? theme.colors.grey300 : theme.colors.grey600,
    marginRight: theme.spacing.xs,
  },
  monthlySavingAmount: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.primaryDarkGreen,
  },
  roundUpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primaryDarkGreen,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borders.radius.sm,
  },
  roundUpButtonText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.white,
    marginLeft: theme.spacing.xs,
  },
  
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.white,
    borderTopLeftRadius: theme.borders.radius.lg,
    borderTopRightRadius: theme.borders.radius.lg,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
    maxHeight: '90%',
    minHeight: '60%',
  },
  modalContentDark: {
    backgroundColor: theme.colors.grey700,
  },
  roundUpModalContent: {
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: isDarkMode ? theme.colors.grey600 : theme.colors.grey300,
  },
  modalTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.bold,
    color: isDarkMode ? theme.colors.white : theme.colors.grey700,
  },
  modalCloseButton: {
    padding: theme.spacing.xs,
  },
  modalScrollView: {
    flex: 1,
    paddingVertical: theme.spacing.md,
  },
  inputLabel: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.medium,
    color: isDarkMode ? theme.colors.grey300 : theme.colors.grey600,
    marginBottom: theme.spacing.xs,
    marginTop: theme.spacing.md,
  },
  textInput: {
    backgroundColor: theme.colors.grey100,
    borderRadius: theme.borders.radius.md,
    padding: theme.spacing.md,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.grey700,
  },
  textInputDark: {
    backgroundColor: theme.colors.grey600,
    color: theme.colors.white,
  },
  dateButton: {
    backgroundColor: theme.colors.grey100,
    borderRadius: theme.borders.radius.md,
    padding: theme.spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateButtonDark: {
    backgroundColor: theme.colors.grey600,
  },
  dateButtonText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.grey700,
  },
  dateButtonTextDark: {
    color: theme.colors.white,
  },
  iconSelectionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: theme.spacing.sm,
  },
  iconOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: isDarkMode ? theme.colors.grey600 : theme.colors.grey100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  colorSelectionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: theme.spacing.sm,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedColorOption: {
    borderWidth: 2,
    borderColor: isDarkMode ? theme.colors.white : theme.colors.grey700,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: theme.spacing.lg,
  },
  toggleLabelContainer: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  toggleLabel: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.medium,
    color: isDarkMode ? theme.colors.white : theme.colors.grey700,
    marginBottom: theme.spacing.xs,
  },
  toggleDescription: {
    fontSize: theme.typography.fontSize.sm,
    color: isDarkMode ? theme.colors.grey300 : theme.colors.grey600,
  },
  createButton: {
    backgroundColor: theme.colors.primaryDarkGreen,
    borderRadius: theme.borders.radius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  createButtonText: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.white,
  },
  
  // Round-up modal styles
  roundUpGoalInfo: {
    marginTop: theme.spacing.md,
  },
  roundUpTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.bold,
    color: isDarkMode ? theme.colors.white : theme.colors.grey700,
    marginBottom: theme.spacing.xs,
  },
  roundUpDescription: {
    fontSize: theme.typography.fontSize.md,
    color: isDarkMode ? theme.colors.grey300 : theme.colors.grey600,
    marginBottom: theme.spacing.lg,
  },
  roundUpTotalContainer: {
    backgroundColor: isDarkMode ? 'rgba(0, 106, 77, 0.1)' : 'rgba(0, 106, 77, 0.05)',
    borderRadius: theme.borders.radius.md,
    padding: theme.spacing.lg,
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  roundUpTotalAmount: {
    fontSize: theme.typography.fontSize.xxl,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.primaryDarkGreen,
    marginBottom: theme.spacing.xs,
  },
  roundUpTotalLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: isDarkMode ? theme.colors.grey300 : theme.colors.grey600,
    textAlign: 'center',
  },
  roundUpTransactionsTitle: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.bold,
    color: isDarkMode ? theme.colors.white : theme.colors.grey700,
    marginBottom: theme.spacing.sm,
  },
  transactionsContainer: {
    marginBottom: theme.spacing.lg,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: isDarkMode ? theme.colors.grey600 : theme.colors.grey200,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionName: {
    fontSize: theme.typography.fontSize.md,
    color: isDarkMode ? theme.colors.white : theme.colors.grey700,
    marginBottom: 2,
  },
  transactionAmount: {
    fontSize: theme.typography.fontSize.sm,
    color: isDarkMode ? theme.colors.grey300 : theme.colors.grey600,
  },
  roundUpDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roundUpAmount: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.primaryDarkGreen,
    marginLeft: theme.spacing.xs,
  },
  applyRoundUpButton: {
    backgroundColor: theme.colors.primaryDarkGreen,
    borderRadius: theme.borders.radius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    marginVertical: theme.spacing.lg,
  },
  applyRoundUpText: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.white,
  }
});

export default BudgetingScreen;