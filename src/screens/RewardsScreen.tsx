import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  FlatList
} from 'react-native';
import { useTheme } from '../components/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';

type RewardCategory = 'coffee' | 'retail' | 'subscription' | 'entertainment' | 'travel' | 'mindfulness';

interface Reward {
  id: string;
  title: string;
  description: string;
  category: RewardCategory;
  points: number;
  expiryDate: string;
  icon: string;
  brand: string;
  unlocked: boolean;
  progress?: number; // progress from 0-100
}

interface Goal {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  progress: number; // progress from 0-100
  icon: string;
  type: 'financial' | 'health';
}

const RewardsScreen = ({ navigation }) => {
  const { theme, isDarkMode } = useTheme();
  const styles = createStyles(theme, isDarkMode);
  const [selectedTab, setSelectedTab] = useState<'available' | 'progress' | 'redeemed'>('available');
  const [selectedCategory, setSelectedCategory] = useState<RewardCategory | null>(null);
  
  // Mock user profile
  const userProfile = {
    name: 'Emma',
    points: 2750,
    level: 'Silver',
    streak: 12, // days
    nextLevelPoints: 5000,
  };

  // Mock financial goals
  const financialGoals: Goal[] = [
    {
      id: '1',
      title: 'Emergency Fund',
      description: 'Save £1,500 for emergencies',
      targetDate: '25 June 2025',
      progress: 65,
      icon: 'cash',
      type: 'financial'
    },
    {
      id: '2',
      title: 'Reduce Subscriptions',
      description: 'Cut monthly subscription costs by 20%',
      targetDate: '15 May 2025',
      progress: 80,
      icon: 'card',
      type: 'financial'
    },
    {
      id: '3',
      title: 'Pay off Credit Card',
      description: 'Clear £750 credit card balance',
      targetDate: '1 August 2025',
      progress: 30,
      icon: 'trending-down',
      type: 'financial'
    }
  ];

  // Mock health goals
  const healthGoals: Goal[] = [
    {
      id: '4',
      title: 'Daily Steps',
      description: 'Walk 10,000 steps daily',
      targetDate: 'Ongoing',
      progress: 85,
      icon: 'footsteps',
      type: 'health'
    },
    {
      id: '5',
      title: 'Mindfulness',
      description: 'Meditate for 10 minutes daily',
      targetDate: 'Ongoing',
      progress: 70,
      icon: 'leaf',
      type: 'health'
    },
    {
      id: '6',
      title: 'Sleep Schedule',
      description: 'Sleep 7+ hours for 30 days',
      targetDate: '30 May 2025',
      progress: 50,
      icon: 'moon',
      type: 'health'
    }
  ];
  
  // Combined goals
  const allGoals = [...financialGoals, ...healthGoals];

  // Mock rewards data
  const rewards: Reward[] = [
    {
      id: '1',
      title: 'Costa Coffee £5 Voucher',
      description: 'Fancy a little treat? You\'ve earned it! Grab a coffee on us.',
      category: 'coffee',
      points: 300,
      expiryDate: '30 June 2025',
      icon: 'cafe',
      brand: 'Costa Coffee',
      unlocked: true
    },
    {
      id: '2',
      title: 'Greggs Breakfast Deal',
      description: 'Sorted your bills this month? Brilliant! Enjoy a free breakfast sandwich and coffee.',
      category: 'coffee',
      points: 350,
      expiryDate: '15 May 2025',
      icon: 'cafe',
      brand: 'Greggs',
      unlocked: true
    },
    {
      id: '3',
      title: 'Tesco £10 Off Groceries',
      description: 'Save smart. Shop smart — £10 off when you spend £50 at Tesco.',
      category: 'retail',
      points: 700,
      expiryDate: '31 May 2025',
      icon: 'basket',
      brand: 'Tesco',
      unlocked: true
    },
    {
      id: '4',
      title: 'M&S £15 Gift Card',
      description: 'Balancing your budget deserves a proper treat at M&S!',
      category: 'retail',
      points: 1200,
      expiryDate: '30 June 2025',
      icon: 'basket',
      brand: 'M&S',
      unlocked: false,
      progress: 80
    },
    {
      id: '5',
      title: '1-Month Spotify Premium',
      description: 'Hit your meditation streak? Brilliant! Enjoy your favorite tunes ad-free.',
      category: 'subscription',
      points: 500,
      expiryDate: '15 July 2025',
      icon: 'musical-notes',
      brand: 'Spotify',
      unlocked: true
    },
    {
      id: '6',
      title: 'Audible Free Book Credit',
      description: 'Mind your money, expand your mind. Grab an audiobook on us!',
      category: 'subscription',
      points: 600,
      expiryDate: '30 May 2025',
      icon: 'book',
      brand: 'Audible',
      unlocked: false,
      progress: 50
    },
    {
      id: '7',
      title: 'Vue Cinema 2-for-1 Ticket',
      description: 'Budgeting doesn\'t mean missing out. Bring a mate to the movies!',
      category: 'entertainment',
      points: 400,
      expiryDate: '30 June 2025',
      icon: 'film',
      brand: 'Vue Cinema',
      unlocked: true
    },
    {
      id: '8',
      title: 'National Trust Day Pass',
      description: 'Hit your step goals? Jolly good! Explore Britain\'s beautiful landscapes on us.',
      category: 'entertainment',
      points: 800,
      expiryDate: '31 August 2025',
      icon: 'leaf',
      brand: 'National Trust',
      unlocked: false,
      progress: 30
    },
    {
      id: '9',
      title: 'TfL £10 Credit',
      description: 'Making your finances and carbon footprint greener! £10 on your Oyster card.',
      category: 'travel',
      points: 800,
      expiryDate: '15 July 2025',
      icon: 'train',
      brand: 'Transport for London',
      unlocked: true
    },
    {
      id: '10',
      title: 'National Express 20% Off',
      description: 'Going places with your finances? Go places with National Express too!',
      category: 'travel',
      points: 450,
      expiryDate: '31 May 2025',
      icon: 'bus',
      brand: 'National Express',
      unlocked: false,
      progress: 65
    },
    {
      id: '11',
      title: 'Headspace 3-Month Premium',
      description: 'Financial stress down, mindfulness up. Enjoy premium meditation.',
      category: 'mindfulness',
      points: 1500,
      expiryDate: '30 June 2025',
      icon: 'leaf',
      brand: 'Headspace',
      unlocked: false,
      progress: 90
    },
    {
      id: '12',
      title: 'Sleep Mask & Aromatherapy Set',
      description: 'Invest in your sleep like you invest in your savings. Sweet dreams!',
      category: 'mindfulness',
      points: 600,
      expiryDate: '15 May 2025',
      icon: 'moon',
      brand: 'The Body Shop',
      unlocked: true
    }
  ];

  // Filters
  const availableRewards = rewards.filter(reward => reward.unlocked);
  const inProgressRewards = rewards.filter(reward => !reward.unlocked);
  const redeemedRewards: Reward[] = []; // Mock empty for now

  // Filter by currently selected tab
  const getFilteredRewards = () => {
    let filtered;
    switch (selectedTab) {
      case 'available':
        filtered = availableRewards;
        break;
      case 'progress':
        filtered = inProgressRewards;
        break;
      case 'redeemed':
        filtered = redeemedRewards;
        break;
      default:
        filtered = availableRewards;
    }

    // Apply category filter if selected
    if (selectedCategory) {
      filtered = filtered.filter(reward => reward.category === selectedCategory);
    }
    
    return filtered;
  };

  // Category labels
  const categories = [
    { id: 'coffee', label: '☕ Coffee Vouchers', icon: 'cafe' },
    { id: 'retail', label: '🛍️ Retail Discounts', icon: 'basket' },
    { id: 'subscription', label: '🎧 Subscriptions', icon: 'musical-notes' },
    { id: 'entertainment', label: '🎟️ Entertainment', icon: 'film' },
    { id: 'travel', label: '🚂 Travel Offers', icon: 'train' },
    { id: 'mindfulness', label: '🛏️ Mindful Living', icon: 'leaf' }
  ];

  const renderRewardItem = ({ item }: { item: Reward }) => (
    <TouchableOpacity style={styles.rewardCard}>
      <View style={styles.rewardHeader}>
        <View style={styles.rewardIconContainer}>
          <Ionicons name={item.icon} size={28} color={theme.colors.white} />
        </View>
        <View style={styles.rewardBrandContainer}>
          <Text style={styles.rewardBrand}>{item.brand}</Text>
          <View style={styles.pointsContainer}>
            <Ionicons name="star" size={14} color={theme.colors.warning} />
            <Text style={styles.pointsText}>{item.points}</Text>
          </View>
        </View>
      </View>
      
      <Text style={styles.rewardTitle}>{item.title}</Text>
      <Text style={styles.rewardDescription}>{item.description}</Text>
      
      {!item.unlocked && item.progress !== undefined && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${item.progress}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>{item.progress}%</Text>
        </View>
      )}
      
      <View style={styles.rewardFooter}>
        <Text style={styles.expiryText}>Expires: {item.expiryDate}</Text>
        
        {item.unlocked ? (
          <TouchableOpacity style={styles.redeemButton}>
            <Text style={styles.redeemButtonText}>Redeem</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.unlockText}>Keep going!</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderGoalItem = ({ item }: { item: Goal }) => (
    <TouchableOpacity style={styles.goalCard}>
      <View style={styles.goalIconContainer}>
        <Ionicons 
          name={item.icon} 
          size={24} 
          color={theme.colors.white}
        />
      </View>
      <View style={styles.goalContent}>
        <Text style={styles.goalTitle}>{item.title}</Text>
        <Text style={styles.goalDescription}>{item.description}</Text>
        <View style={styles.goalProgress}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${item.progress}%` },
                item.type === 'health' ? styles.healthProgress : styles.financialProgress
              ]} 
            />
          </View>
          <Text style={styles.progressText}>{item.progress}%</Text>
        </View>
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
        <Text style={styles.headerTitle}>Rewards</Text>
        <View style={styles.pointsBadge}>
          <Ionicons name="star" size={16} color={theme.colors.warning} />
          <Text style={styles.pointsBadgeText}>{userProfile.points}</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* User Progress Section */}
        <View style={styles.userProgressCard}>
          <View style={styles.userInfoRow}>
            <View>
              <Text style={styles.welcomeText}>Nice one, {userProfile.name}!</Text>
              <Text style={styles.levelText}>
                <Ionicons name="trophy" size={16} color={theme.colors.warning} /> {userProfile.level} Level
              </Text>
            </View>
            <View style={styles.streakContainer}>
              <Ionicons name="flame" size={24} color={theme.colors.alert} />
              <Text style={styles.streakText}>{userProfile.streak} day streak</Text>
            </View>
          </View>
          
          <Text style={styles.nextLevelText}>
            {userProfile.nextLevelPoints - userProfile.points} points to Gold Level
          </Text>
          <View style={styles.levelProgressBar}>
            <View 
              style={[
                styles.levelProgressFill, 
                { width: `${(userProfile.points / userProfile.nextLevelPoints) * 100}%` }
              ]} 
            />
          </View>
        </View>

        {/* Goals progress section */}
        <Text style={styles.sectionTitle}>Your Goal Progress</Text>
        <Text style={styles.sectionSubtitle}>Complete goals to unlock more rewards</Text>
        
        <FlatList
          data={allGoals}
          renderItem={renderGoalItem}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.goalsList}
          contentContainerStyle={styles.goalsListContent}
        />

        {/* Rewards filter tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[
              styles.tab, 
              selectedTab === 'available' && styles.activeTab
            ]}
            onPress={() => setSelectedTab('available')}
          >
            <Text 
              style={[
                styles.tabText, 
                selectedTab === 'available' && styles.activeTabText
              ]}
            >
              Available ({availableRewards.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.tab, 
              selectedTab === 'progress' && styles.activeTab
            ]}
            onPress={() => setSelectedTab('progress')}
          >
            <Text 
              style={[
                styles.tabText, 
                selectedTab === 'progress' && styles.activeTabText
              ]}
            >
              In Progress ({inProgressRewards.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.tab, 
              selectedTab === 'redeemed' && styles.activeTab
            ]}
            onPress={() => setSelectedTab('redeemed')}
          >
            <Text 
              style={[
                styles.tabText, 
                selectedTab === 'redeemed' && styles.activeTabText
              ]}
            >
              Redeemed ({redeemedRewards.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Category filters */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesContent}
        >
          <TouchableOpacity 
            style={[
              styles.categoryChip,
              selectedCategory === null && styles.activeCategoryChip
            ]}
            onPress={() => setSelectedCategory(null)}
          >
            <Text 
              style={[
                styles.categoryChipText,
                selectedCategory === null && styles.activeCategoryChipText
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          
          {categories.map(category => (
            <TouchableOpacity 
              key={category.id} 
              style={[
                styles.categoryChip,
                selectedCategory === category.id && styles.activeCategoryChip
              ]}
              onPress={() => setSelectedCategory(category.id as RewardCategory)}
            >
              <Ionicons 
                name={category.icon} 
                size={16} 
                color={selectedCategory === category.id ? theme.colors.white : theme.colors.primaryDarkGreen} 
                style={styles.categoryIcon}
              />
              <Text 
                style={[
                  styles.categoryChipText,
                  selectedCategory === category.id && styles.activeCategoryChipText
                ]}
              >
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Rewards List */}
        <View style={styles.rewardsContainer}>
          {getFilteredRewards().map(reward => (
            <View key={reward.id} style={{marginBottom: theme.spacing.md}}>
              {renderRewardItem({item: reward})}
            </View>
          ))}
          
          {getFilteredRewards().length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={48} color={theme.colors.grey400} />
              <Text style={styles.emptyStateText}>No rewards found</Text>
              <Text style={styles.emptyStateSubtext}>
                {selectedTab === 'redeemed' 
                  ? 'You haven\'t redeemed any rewards yet' 
                  : 'Try a different category or check back later'}
              </Text>
            </View>
          )}
        </View>

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
  pointsBadge: {
    flexDirection: 'row',
    backgroundColor: isDarkMode ? theme.colors.grey600 : theme.colors.white,
    borderRadius: theme.borders.radius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    alignItems: 'center',
    ...theme.shadows.light,
  },
  pointsBadgeText: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.bold,
    color: isDarkMode ? theme.colors.white : theme.colors.grey700,
    marginLeft: theme.spacing.xs,
  },
  scrollView: {
    flex: 1,
    padding: theme.spacing.md,
  },
  userProgressCard: {
    backgroundColor: isDarkMode ? theme.colors.grey600 : theme.colors.white,
    borderRadius: theme.borders.radius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.light,
  },
  userInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  welcomeText: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.bold,
    color: isDarkMode ? theme.colors.white : theme.colors.grey700,
  },
  levelText: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.medium,
    color: isDarkMode ? theme.colors.grey300 : theme.colors.grey600,
    marginTop: theme.spacing.xs,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDarkMode ? theme.colors.grey500 : theme.colors.grey200,
    borderRadius: theme.borders.radius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  streakText: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.medium,
    color: isDarkMode ? theme.colors.white : theme.colors.grey700,
    marginLeft: theme.spacing.xs,
  },
  nextLevelText: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.medium,
    color: isDarkMode ? theme.colors.grey300 : theme.colors.grey600,
    marginBottom: theme.spacing.sm,
  },
  levelProgressBar: {
    height: 8,
    backgroundColor: isDarkMode ? theme.colors.grey500 : theme.colors.grey200,
    borderRadius: theme.borders.radius.sm,
    overflow: 'hidden',
  },
  levelProgressFill: {
    height: '100%',
    backgroundColor: theme.colors.warning,
    borderRadius: theme.borders.radius.sm,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.bold,
    color: isDarkMode ? theme.colors.grey200 : theme.colors.grey700,
    marginTop: theme.spacing.md,
  },
  sectionSubtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: isDarkMode ? theme.colors.grey400 : theme.colors.grey600,
    marginBottom: theme.spacing.md,
  },
  goalsList: {
    marginBottom: theme.spacing.md,
  },
  goalsListContent: {
    paddingRight: theme.spacing.md,
  },
  goalCard: {
    width: 250,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDarkMode ? theme.colors.grey600 : theme.colors.white,
    borderRadius: theme.borders.radius.md,
    padding: theme.spacing.md,
    marginRight: theme.spacing.md,
    ...theme.shadows.light,
  },
  goalIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.primaryDarkGreen,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  goalContent: {
    flex: 1,
  },
  goalTitle: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.medium,
    color: isDarkMode ? theme.colors.white : theme.colors.grey700,
    marginBottom: theme.spacing.xs,
  },
  goalDescription: {
    fontSize: theme.typography.fontSize.sm,
    color: isDarkMode ? theme.colors.grey300 : theme.colors.grey600,
    marginBottom: theme.spacing.sm,
  },
  goalProgress: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: isDarkMode ? theme.colors.grey500 : theme.colors.grey200,
    borderRadius: theme.borders.radius.sm,
    overflow: 'hidden',
    marginRight: theme.spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primaryDarkGreen,
    borderRadius: theme.borders.radius.sm,
  },
  healthProgress: {
    backgroundColor: theme.colors.suggestion,
  },
  financialProgress: {
    backgroundColor: theme.colors.saving,
  },
  progressText: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.medium,
    color: isDarkMode ? theme.colors.grey300 : theme.colors.grey600,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
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
    color: isDarkMode ? theme.colors.grey400 : theme.colors.grey600,
  },
  activeTabText: {
    color: theme.colors.primaryDarkGreen,
    fontFamily: theme.typography.fontFamily.bold,
  },
  categoriesContainer: {
    marginBottom: theme.spacing.md,
  },
  categoriesContent: {
    paddingRight: theme.spacing.md,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDarkMode ? theme.colors.grey600 : theme.colors.white,
    borderRadius: theme.borders.radius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginRight: theme.spacing.sm,
    ...theme.shadows.light,
  },
  activeCategoryChip: {
    backgroundColor: theme.colors.primaryDarkGreen,
  },
  categoryIcon: {
    marginRight: theme.spacing.xs,
  },
  categoryChipText: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.medium,
    color: isDarkMode ? theme.colors.white : theme.colors.grey700,
  },
  activeCategoryChipText: {
    color: theme.colors.white,
  },
  rewardsContainer: {
    marginTop: theme.spacing.sm,
  },
  rewardCard: {
    backgroundColor: isDarkMode ? theme.colors.grey600 : theme.colors.white,
    borderRadius: theme.borders.radius.md,
    padding: theme.spacing.md,
    ...theme.shadows.light,
  },
  rewardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  rewardIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.primaryDarkGreen,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  rewardBrandContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rewardBrand: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.medium,
    color: isDarkMode ? theme.colors.grey300 : theme.colors.grey500,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDarkMode ? theme.colors.grey500 : theme.colors.grey200,
    borderRadius: theme.borders.radius.sm,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  pointsText: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.bold,
    color: isDarkMode ? theme.colors.white : theme.colors.grey700,
    marginLeft: theme.spacing.xs,
  },
  rewardTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.bold,
    color: isDarkMode ? theme.colors.white : theme.colors.grey700,
    marginBottom: theme.spacing.sm,
  },
  rewardDescription: {
    fontSize: theme.typography.fontSize.md,
    color: isDarkMode ? theme.colors.grey300 : theme.colors.grey600,
    marginBottom: theme.spacing.md,
    lineHeight: theme.typography.lineHeight.normal,
  },
  progressContainer: {
    marginBottom: theme.spacing.md,
  },
  rewardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  expiryText: {
    fontSize: theme.typography.fontSize.sm,
    color: isDarkMode ? theme.colors.grey400 : theme.colors.grey500,
  },
  redeemButton: {
    backgroundColor: theme.colors.primaryDarkGreen,
    borderRadius: theme.borders.radius.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
  },
  redeemButtonText: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.white,
  },
  unlockText: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.suggestion,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  emptyStateText: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.bold,
    color: isDarkMode ? theme.colors.grey300 : theme.colors.grey600,
    marginTop: theme.spacing.md,
  },
  emptyStateSubtext: {
    fontSize: theme.typography.fontSize.md,
    color: isDarkMode ? theme.colors.grey400 : theme.colors.grey500,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
  },
  footerSpace: {
    height: 30,
  },
});

export default RewardsScreen;