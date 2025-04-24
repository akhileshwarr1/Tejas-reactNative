import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Image
} from 'react-native';
import { useTheme } from '../components/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { LineChart, BarChart, ProgressChart } from 'react-native-chart-kit';

// Get screen dimensions for responsive layouts
const { width } = Dimensions.get('window');

// Interface for health metrics
interface HealthMetric {
  id: string;
  name: string;
  value: string;
  icon: string;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  trendLabel: string;
  trendGood: boolean;
}

// Interface for activity data
interface ActivityData {
  steps: number;
  distance: number;
  calories: number;
  standHours: number;
  exerciseMinutes: number;
}

// Interface for sleep data
interface SleepData {
  date: string;
  totalHours: number;
  deepSleepHours: number;
  remSleepHours: number;
  lightSleepHours: number;
  awakeHours: number;
}

// Interface for stress data
interface StressData {
  date: string;
  stressLevel: number; // 0-100 where 0 is calm and 100 is very stressed
  heartRate: number;
  hrvScore: number;
}

// Interface for wellness recommendation
interface Recommendation {
  id: string;
  title: string;
  description: string;
  icon: string;
  intensity: 'easy' | 'moderate' | 'challenging';
  category: 'sleep' | 'activity' | 'mindfulness' | 'nutrition';
}

const WellnessDashboardScreen = ({ navigation }) => {
  const { theme, isDarkMode } = useTheme();
  
  // Create dynamic styles using the theme
  const styles = createStyles(theme, isDarkMode);

  // Today's date
  const today = "24 April 2025";
  
  // Mock health metrics data
  const [healthMetrics] = useState<HealthMetric[]>([
    {
      id: '1',
      name: 'Resting Heart Rate',
      value: '68',
      icon: 'heart',
      unit: 'bpm',
      trend: 'down',
      trendLabel: '2 bpm lower than average',
      trendGood: true
    },
    {
      id: '2',
      name: 'Sleep Quality',
      value: '86',
      icon: 'bed',
      unit: '%',
      trend: 'up',
      trendLabel: '12% higher than last week',
      trendGood: true
    },
    {
      id: '3',
      name: 'Stress Level',
      value: '32',
      icon: 'pulse',
      unit: '%',
      trend: 'down',
      trendLabel: '8% lower than yesterday',
      trendGood: true
    },
    {
      id: '4',
      name: 'Blood Oxygen',
      value: '98',
      icon: 'water',
      unit: '%',
      trend: 'stable',
      trendLabel: 'Consistent with your average',
      trendGood: true
    },
  ]);
  
  // Mock activity data for today
  const [todayActivity] = useState<ActivityData>({
    steps: 8532,
    distance: 5.8,
    calories: 385,
    standHours: 9,
    exerciseMinutes: 42
  });
  
  // Mock activity data for the week (steps per day)
  const [weeklySteps] = useState({
    labels: ["18 Apr", "19 Apr", "20 Apr", "21 Apr", "22 Apr", "23 Apr", "Today"],
    datasets: [
      {
        data: [6834, 9231, 7530, 10235, 8102, 7324, 8532],
        color: (opacity = 1) => `rgba(0, 106, 77, ${opacity})`,
        strokeWidth: 2
      }
    ],
  });
  
  // Mock sleep data for the past week
  const [weeklySleep] = useState<SleepData[]>([
    {
      date: "18 Apr",
      totalHours: 7.2,
      deepSleepHours: 1.5,
      remSleepHours: 1.8,
      lightSleepHours: 3.3,
      awakeHours: 0.6
    },
    {
      date: "19 Apr",
      totalHours: 6.8,
      deepSleepHours: 1.2,
      remSleepHours: 1.6,
      lightSleepHours: 3.5,
      awakeHours: 0.5
    },
    {
      date: "20 Apr",
      totalHours: 8.1,
      deepSleepHours: 1.9,
      remSleepHours: 2.1,
      lightSleepHours: 3.8,
      awakeHours: 0.3
    },
    {
      date: "21 Apr",
      totalHours: 7.5,
      deepSleepHours: 1.7,
      remSleepHours: 1.8,
      lightSleepHours: 3.6,
      awakeHours: 0.4
    },
    {
      date: "22 Apr",
      totalHours: 6.9,
      deepSleepHours: 1.3,
      remSleepHours: 1.7,
      lightSleepHours: 3.4,
      awakeHours: 0.5
    },
    {
      date: "23 Apr",
      totalHours: 7.8,
      deepSleepHours: 1.8,
      remSleepHours: 2.0,
      lightSleepHours: 3.7,
      awakeHours: 0.3
    },
    {
      date: "24 Apr",
      totalHours: 8.3,
      deepSleepHours: 2.0,
      remSleepHours: 2.2,
      lightSleepHours: 3.9,
      awakeHours: 0.2
    }
  ]);
  
  // Mock stress data for the past week
  const [weeklyStress] = useState<StressData[]>([
    { date: "18 Apr", stressLevel: 58, heartRate: 72, hrvScore: 45 },
    { date: "19 Apr", stressLevel: 62, heartRate: 75, hrvScore: 42 },
    { date: "20 Apr", stressLevel: 51, heartRate: 69, hrvScore: 51 },
    { date: "21 Apr", stressLevel: 47, heartRate: 67, hrvScore: 54 },
    { date: "22 Apr", stressLevel: 44, heartRate: 68, hrvScore: 56 },
    { date: "23 Apr", stressLevel: 38, heartRate: 66, hrvScore: 59 },
    { date: "24 Apr", stressLevel: 32, heartRate: 68, hrvScore: 62 }
  ]);
  
  // Format stress data for chart
  const stressChartData = {
    labels: weeklyStress.map(d => d.date.substring(0, 5)),
    datasets: [
      {
        data: weeklyStress.map(d => d.stressLevel),
        color: (opacity = 1) => `rgba(220, 53, 69, ${opacity})`,
        strokeWidth: 2
      }
    ]
  };
  
  // Format sleep data for chart
  const sleepChartData = {
    labels: weeklySleep.map(d => d.date.substring(0, 5)),
    datasets: [
      {
        data: weeklySleep.map(d => d.totalHours),
        color: (opacity = 1) => `rgba(0, 77, 110, ${opacity})`,
        strokeWidth: 2
      }
    ]
  };

  // Activity rings data (percentage completed of daily goals)
  const activityRingsData = {
    labels: ["Steps", "Exercise", "Stand"],
    data: [
      todayActivity.steps / 10000, // 10,000 steps goal
      todayActivity.exerciseMinutes / 60, // 60 minutes goal
      todayActivity.standHours / 12 // 12 hours goal
    ]
  };
  
  // Personalized recommendations based on health data
  const [recommendations] = useState<Recommendation[]>([
    {
      id: '1',
      title: 'Morning Meditation',
      description: "Awesome job lowering your stress levels! Keep the momentum going with a 5-minute morning meditation. Your heart rate variability is improving - this quick session will boost it even more! 🧘‍♂️✨",
      icon: 'flame',
      intensity: 'easy',
      category: 'mindfulness'
    },
    {
      id: '2',
      title: 'Evening Wind Down',
      description: "You're crushing it with sleep this week! 🌟 Your deep sleep is up 15%! Maintain this stellar streak with a 10-minute evening routine: dim lights, limit screen time, and try the new 'Tranquil Dreams' audio guide!",
      icon: 'moon',
      intensity: 'easy',
      category: 'sleep'
    },
    {
      id: '3',
      title: 'Step Challenge',
      description: "You're only 1,468 steps away from your 10K goal! 🚶‍♂️💨 A quick 15-minute walk will get you there AND boost your mood. Your consistency is paying off - your resting heart rate is down 2 bpm from last week!",
      icon: 'walk',
      intensity: 'moderate',
      category: 'activity'
    },
    {
      id: '4',
      title: 'Hydration Boost',
      description: "Your sleep quality jumps 23% on days you drink 8+ glasses of water! 💧 Amazing connection discovered! You're at 5 glasses today - just 3 more to go for optimal sleep tonight!",
      icon: 'water',
      intensity: 'easy',
      category: 'nutrition'
    }
  ]);

  // Chart configuration
  const chartConfig = {
    backgroundColor: isDarkMode ? theme.colors.grey700 : theme.colors.white,
    backgroundGradientFrom: isDarkMode ? theme.colors.grey700 : theme.colors.white,
    backgroundGradientTo: isDarkMode ? theme.colors.grey700 : theme.colors.white,
    decimalPlaces: 1,
    color: (opacity = 1) => isDarkMode ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => isDarkMode ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2"
    }
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
        <Text style={styles.headerTitle}>Wellness Dashboard</Text>
        <View style={styles.headerIconPlaceholder} />
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Date and greeting */}
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>{today}</Text>
        </View>
        
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Hello, Maneesha!</Text>
          <Text style={styles.welcomeSubtext}>Your wellness insights are ready</Text>
        </View>
        
        {/* Health metrics cards */}
        <View style={styles.metricsContainer}>
          {healthMetrics.map(metric => (
            <View key={metric.id} style={styles.metricCard}>
              <View style={styles.metricIconContainer}>
                <Ionicons 
                  name={metric.icon} 
                  size={24} 
                  color={theme.colors.white} 
                />
              </View>
              <Text style={styles.metricValue}>{metric.value}<Text style={styles.metricUnit}>{metric.unit}</Text></Text>
              <Text style={styles.metricName}>{metric.name}</Text>
              <View style={styles.trendContainer}>
                <Ionicons 
                  name={metric.trend === 'up' ? 'arrow-up' : metric.trend === 'down' ? 'arrow-down' : 'remove'} 
                  size={14} 
                  color={metric.trendGood ? theme.colors.success : theme.colors.error} 
                />
                <Text style={[
                  styles.trendText, 
                  {color: metric.trendGood ? theme.colors.success : theme.colors.error}
                ]}>
                  {metric.trendLabel}
                </Text>
              </View>
            </View>
          ))}
        </View>
        
        {/* Activity summary */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Today's Activity</Text>
          
          <View style={styles.activitySummaryContainer}>
            <View style={styles.activityRingsContainer}>
              <ProgressChart
                data={activityRingsData}
                width={width * 0.4}
                height={160}
                strokeWidth={12}
                radius={32}
                chartConfig={{
                  ...chartConfig,
                  color: (opacity = 1, index) => {
                    const colors = [
                      `rgba(0, 106, 77, ${opacity})`, // Steps - Green
                      `rgba(255, 182, 0, ${opacity})`, // Exercise - Yellow
                      `rgba(0, 119, 179, ${opacity})` // Stand - Blue
                    ];
                    return colors[index];
                  }
                }}
                hideLegend={true}
              />
            </View>
            <View style={styles.activityStatsContainer}>
              <View style={styles.activityStat}>
                <View style={[styles.activityStatDot, {backgroundColor: theme.colors.primaryDarkGreen}]} />
                <Text style={styles.activityStatLabel}>Steps</Text>
                <Text style={styles.activityStatValue}>{todayActivity.steps.toLocaleString()}</Text>
              </View>
              <View style={styles.activityStat}>
                <View style={[styles.activityStatDot, {backgroundColor: theme.colors.accentYellow}]} />
                <Text style={styles.activityStatLabel}>Exercise</Text>
                <Text style={styles.activityStatValue}>{todayActivity.exerciseMinutes} min</Text>
              </View>
              <View style={styles.activityStat}>
                <View style={[styles.activityStatDot, {backgroundColor: theme.colors.mediumBlue}]} />
                <Text style={styles.activityStatLabel}>Stand Hours</Text>
                <Text style={styles.activityStatValue}>{todayActivity.standHours}/12</Text>
              </View>
              <View style={styles.activityStat}>
                <View style={[styles.activityStatDot, {backgroundColor: theme.colors.accentAmber}]} />
                <Text style={styles.activityStatLabel}>Distance</Text>
                <Text style={styles.activityStatValue}>{todayActivity.distance} km</Text>
              </View>
              <View style={styles.activityStat}>
                <View style={[styles.activityStatDot, {backgroundColor: theme.colors.error}]} />
                <Text style={styles.activityStatLabel}>Calories</Text>
                <Text style={styles.activityStatValue}>{todayActivity.calories} cal</Text>
              </View>
            </View>
          </View>
          
          {/* Weekly Steps Chart */}
          <Text style={styles.chartTitle}>Weekly Steps</Text>
          <LineChart
            data={weeklySteps}
            width={width - 64}
            height={180}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </View>
        
        {/* Sleep insights */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Sleep Insights</Text>
          
          <View style={styles.sleepSummaryContainer}>
            <View style={styles.sleepQualityContainer}>
              <Text style={styles.sleepQualityLabel}>Last Night</Text>
              <Text style={styles.sleepQualityValue}>{weeklySleep[6].totalHours} hrs</Text>
              <View style={styles.sleepQualityChart}>
                <View style={styles.sleepPhaseRow}>
                  <View style={[styles.sleepPhase, {flex: weeklySleep[6].deepSleepHours / weeklySleep[6].totalHours, backgroundColor: theme.colors.primaryDarkGreen}]} />
                  <Text style={styles.sleepPhaseLabel}>Deep</Text>
                </View>
                <View style={styles.sleepPhaseRow}>
                  <View style={[styles.sleepPhase, {flex: weeklySleep[6].remSleepHours / weeklySleep[6].totalHours, backgroundColor: theme.colors.accentYellow}]} />
                  <Text style={styles.sleepPhaseLabel}>REM</Text>
                </View>
                <View style={styles.sleepPhaseRow}>
                  <View style={[styles.sleepPhase, {flex: weeklySleep[6].lightSleepHours / weeklySleep[6].totalHours, backgroundColor: theme.colors.mediumBlue}]} />
                  <Text style={styles.sleepPhaseLabel}>Light</Text>
                </View>
                <View style={styles.sleepPhaseRow}>
                  <View style={[styles.sleepPhase, {flex: weeklySleep[6].awakeHours / weeklySleep[6].totalHours, backgroundColor: theme.colors.grey400}]} />
                  <Text style={styles.sleepPhaseLabel}>Awake</Text>
                </View>
              </View>
            </View>
          </View>
          
          {/* Weekly Sleep Chart */}
          <Text style={styles.chartTitle}>Sleep Duration (Past Week)</Text>
          <LineChart
            data={sleepChartData}
            width={width - 64}
            height={180}
            chartConfig={{
              ...chartConfig,
              color: (opacity = 1) => `rgba(0, 77, 110, ${opacity})`
            }}
            bezier
            style={styles.chart}
          />
        </View>
        
        {/* Stress insights */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Stress Management</Text>
          
          {/* Weekly Stress Chart */}
          <Text style={styles.chartTitle}>Stress Levels (Past Week)</Text>
          <LineChart
            data={stressChartData}
            width={width - 64}
            height={180}
            chartConfig={{
              ...chartConfig,
              color: (opacity = 1) => `rgba(220, 53, 69, ${opacity})`
            }}
            bezier
            style={styles.chart}
          />
          
          <View style={styles.stressInsightContainer}>
            <Ionicons 
              name="trending-down" 
              size={24} 
              color={theme.colors.success} 
            />
            <Text style={styles.stressInsightText}>
              Your stress levels have decreased by 47% over the past week! Your mindfulness practice is paying off.
            </Text>
          </View>
        </View>
        
        {/* Personalized recommendations */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Your Personalized Plan</Text>
          <Text style={styles.recommendationsSubtitle}>Tailored recommendations based on your health data</Text>
          
          {recommendations.map(rec => (
            <View key={rec.id} style={styles.recommendationCard}>
              <View style={styles.recommendationHeader}>
                <View style={styles.recommendationIconContainer}>
                  <Ionicons 
                    name={rec.icon} 
                    size={22} 
                    color={theme.colors.white} 
                  />
                </View>
                <View style={styles.recommendationHeaderContent}>
                  <Text style={styles.recommendationTitle}>{rec.title}</Text>
                  <View style={[
                    styles.intensityBadge, 
                    rec.intensity === 'easy' ? styles.easyBadge : 
                    rec.intensity === 'moderate' ? styles.moderateBadge : 
                    styles.challengingBadge
                  ]}>
                    <Text style={styles.intensityText}>
                      {rec.intensity === 'easy' ? 'Easy' : 
                       rec.intensity === 'moderate' ? 'Moderate' : 
                       'Challenging'}
                    </Text>
                  </View>
                </View>
              </View>
              
              <Text style={styles.recommendationDescription}>
                {rec.description}
              </Text>
              
              <TouchableOpacity style={styles.startButton}>
                <Text style={styles.startButtonText}>Start Now</Text>
                <Ionicons name="arrow-forward" size={16} color={theme.colors.white} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
        
        {/* Mood check-in button */}
        <TouchableOpacity style={styles.moodCheckButton}>
          <Ionicons name="happy" size={22} color={theme.colors.white} />
          <Text style={styles.moodCheckButtonText}>Check In Your Mood</Text>
        </TouchableOpacity>

        {/* Spacing at the bottom for better scrolling */}
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
    marginBottom: theme.spacing.sm,
  },
  dateText: {
    fontSize: theme.typography.fontSize.sm,
    color: isDarkMode ? theme.colors.grey400 : theme.colors.grey600,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  welcomeText: {
    fontSize: theme.typography.fontSize.xxl,
    fontFamily: theme.typography.fontFamily.bold,
    color: isDarkMode ? theme.colors.white : theme.colors.grey700,
  },
  welcomeSubtext: {
    fontSize: theme.typography.fontSize.md,
    color: isDarkMode ? theme.colors.grey300 : theme.colors.grey600,
    marginTop: theme.spacing.xs,
  },
  metricsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
  },
  metricCard: {
    width: '48%',
    backgroundColor: isDarkMode ? theme.colors.grey600 : theme.colors.white,
    borderRadius: theme.borders.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    alignItems: 'center',
    ...theme.shadows.light,
  },
  metricIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primaryDarkGreen,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  metricValue: {
    fontSize: theme.typography.fontSize.xxl,
    fontFamily: theme.typography.fontFamily.bold,
    color: isDarkMode ? theme.colors.white : theme.colors.grey700,
  },
  metricUnit: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.medium,
    color: isDarkMode ? theme.colors.grey400 : theme.colors.grey600,
  },
  metricName: {
    fontSize: theme.typography.fontSize.sm,
    color: isDarkMode ? theme.colors.grey300 : theme.colors.grey600,
    marginVertical: theme.spacing.xs,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendText: {
    fontSize: theme.typography.fontSize.xs,
    marginLeft: 2,
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
    marginBottom: theme.spacing.md,
  },
  activitySummaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  activityRingsContainer: {
    width: '40%',
    alignItems: 'center',
  },
  activityStatsContainer: {
    width: '55%',
  },
  activityStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  activityStatDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: theme.spacing.sm,
  },
  activityStatLabel: {
    flex: 1,
    fontSize: theme.typography.fontSize.sm,
    color: isDarkMode ? theme.colors.grey300 : theme.colors.grey600,
  },
  activityStatValue: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.medium,
    color: isDarkMode ? theme.colors.white : theme.colors.grey700,
  },
  chartTitle: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.medium,
    color: isDarkMode ? theme.colors.grey200 : theme.colors.grey700,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  chart: {
    borderRadius: theme.borders.radius.md,
    marginVertical: theme.spacing.sm,
  },
  sleepSummaryContainer: {
    marginBottom: theme.spacing.md,
  },
  sleepQualityContainer: {
    padding: theme.spacing.md,
    backgroundColor: isDarkMode ? 'rgba(0, 77, 110, 0.1)' : 'rgba(0, 77, 110, 0.05)',
    borderRadius: theme.borders.radius.md,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.deepBlue,
  },
  sleepQualityLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: isDarkMode ? theme.colors.grey300 : theme.colors.grey600,
  },
  sleepQualityValue: {
    fontSize: theme.typography.fontSize.xl,
    fontFamily: theme.typography.fontFamily.bold,
    color: isDarkMode ? theme.colors.white : theme.colors.grey700,
    marginVertical: theme.spacing.xs,
  },
  sleepQualityChart: {
    marginTop: theme.spacing.sm,
  },
  sleepPhaseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  sleepPhase: {
    height: 12,
    borderRadius: 6,
    marginRight: theme.spacing.sm,
  },
  sleepPhaseLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: isDarkMode ? theme.colors.grey300 : theme.colors.grey600,
    width: 40,
  },
  stressInsightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: isDarkMode ? 'rgba(40, 167, 69, 0.1)' : 'rgba(40, 167, 69, 0.05)',
    borderRadius: theme.borders.radius.md,
    marginTop: theme.spacing.md,
  },
  stressInsightText: {
    fontSize: theme.typography.fontSize.md,
    color: isDarkMode ? theme.colors.grey200 : theme.colors.grey700,
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  recommendationsSubtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: isDarkMode ? theme.colors.grey300 : theme.colors.grey600,
    marginBottom: theme.spacing.md,
  },
  recommendationCard: {
    backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
    borderRadius: theme.borders.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  recommendationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primaryDarkGreen,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  recommendationHeaderContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recommendationTitle: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.bold,
    color: isDarkMode ? theme.colors.white : theme.colors.grey700,
  },
  intensityBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: 12,
  },
  easyBadge: {
    backgroundColor: 'rgba(40, 167, 69, 0.1)',
  },
  moderateBadge: {
    backgroundColor: 'rgba(255, 182, 0, 0.1)',
  },
  challengingBadge: {
    backgroundColor: 'rgba(220, 53, 69, 0.1)',
  },
  intensityText: {
    fontSize: theme.typography.fontSize.xs,
    fontFamily: theme.typography.fontFamily.medium,
    color: isDarkMode ? theme.colors.grey300 : theme.colors.grey600,
  },
  recommendationDescription: {
    fontSize: theme.typography.fontSize.md,
    color: isDarkMode ? theme.colors.grey300 : theme.colors.grey600,
    lineHeight: theme.typography.lineHeight.normal,
    marginBottom: theme.spacing.md,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primaryDarkGreen,
    borderRadius: theme.borders.radius.md,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    alignSelf: 'flex-start',
  },
  startButtonText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.medium,
    marginRight: theme.spacing.xs,
  },
  moodCheckButton: {
    flexDirection: 'row',
    backgroundColor: theme.colors.primaryDarkGreen,
    borderRadius: theme.borders.radius.md,
    padding: theme.spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  moodCheckButtonText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.medium,
    marginLeft: theme.spacing.sm,
  },
  footerSpace: {
    height: 40,
  },
});

export default WellnessDashboardScreen;