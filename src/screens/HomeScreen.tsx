import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  ScrollView, 
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  ActivityIndicator,
  TextInput,
  Modal,
  Alert
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { useTheme } from '../components/ThemeProvider';

// Define navigation types
type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  MainTabs: undefined;
  Success: { username?: string };
};

type HomeScreenProps = StackScreenProps<RootStackParamList, 'Home'>;

// Define the interface for items from API
interface Item {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
}

const { width } = Dimensions.get('window');
const ITEMS_PER_PAGE = 3; // Number of items to display per page

const HomeScreen = ({ navigation }: HomeScreenProps) => {
  const { theme, isDarkMode } = useTheme();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [suggestionInput, setSuggestionInput] = useState('');
  const [suggestionResponse, setSuggestionResponse] = useState('');
  const [suggestionLoading, setSuggestionLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // Create dynamic styles that use the theme
  const dynamicStyles = createDynamicStyles(theme, isDarkMode);

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    // Update total pages whenever items array changes
    setTotalPages(Math.ceil(items.length / ITEMS_PER_PAGE));
  }, [items]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://ordermgmt-flaskapi.azurewebsites.net/items');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setItems(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching items:', err);
      setError('Failed to load items. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const navigateToLogin = () => {
    navigation.navigate('Login');
  };

  // Get current items for pagination
  const getCurrentItems = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return items.slice(startIndex, endIndex);
  };

  // Handle page navigation
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const submitSuggestion = async () => {
    if (!suggestionInput.trim()) {
      Alert.alert('Error', 'Please enter a suggestion prompt');
      return;
    }

    try {
      setSuggestionLoading(true);
      const response = await fetch('https://ordermgmt-flaskapi.azurewebsites.net/suggestion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: suggestionInput
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (data.response && 
          data.response.choices && 
          data.response.choices.length > 0 && 
          data.response.choices[0].message && 
          data.response.choices[0].message.content) {
        setSuggestionResponse(data.response.choices[0].message.content);
        setModalVisible(true);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error submitting suggestion:', err);
      Alert.alert('Error', 'Failed to get suggestion. Please try again later.');
    } finally {
      setSuggestionLoading(false);
    }
  };

  return (
    <ScrollView style={dynamicStyles.container}>
      <ImageBackground
        source={require('../../assets/images/reboot.png')}
        style={dynamicStyles.headerImage}
      >
        <View style={dynamicStyles.overlay}>
          <Image 
            source={require('../../assets/images/logo.png')} 
            style={dynamicStyles.logo}
            resizeMode="contain"
          />
          <Text style={dynamicStyles.eventTitle}>REBOOT 2025</Text>
          <Text style={dynamicStyles.eventTagline}>The Ultimate Tech Revival</Text>
        </View>
      </ImageBackground>

      <View style={dynamicStyles.contentContainer}>
        <View style={dynamicStyles.section}>
          <Text style={dynamicStyles.sectionTitle}>Event Details</Text>
          <Text style={dynamicStyles.sectionText}>
            Join us for the most anticipated tech event of the year! REBOOT 2025 brings together industry leaders, 
            innovators, and tech enthusiasts for three days of inspiring talks, workshops, and networking opportunities.
          </Text>
          
          <Text style={dynamicStyles.infoLabel}>Date & Time:</Text>
          <Text style={dynamicStyles.infoText}>April 15-17, 2025 | 9:00 AM - 6:00 PM</Text>
          
          <Text style={dynamicStyles.infoLabel}>Location:</Text>
          <Text style={dynamicStyles.infoText}>Tech Convention Center, Silicon Valley</Text>
        </View>

        <View style={dynamicStyles.section}>
          <Text style={dynamicStyles.sectionTitle}>Event Highlights</Text>
          <View style={dynamicStyles.highlightItem}>
            <Text style={dynamicStyles.highlightTitle}>• Keynote Speeches</Text>
            <Text style={dynamicStyles.highlightDescription}>Hear from top tech visionaries about the future of technology</Text>
          </View>

          <View style={dynamicStyles.keynoteSection}>
            <Text style={dynamicStyles.keynoteHeader}>Featured Keynote Speakers:</Text>
            <View style={dynamicStyles.speakerItem}>
              <Text style={dynamicStyles.speakerName}>Maneesha Rachakonda</Text>
              <Text style={dynamicStyles.speakerRole}>Chief Innovation Officer, Tech Futures</Text>
              <Text style={dynamicStyles.speakerTopic}>"AI-Powered Business Transformation in 2025"</Text>
            </View>
          </View>
          
          <View style={dynamicStyles.highlightItem}>
            <Text style={dynamicStyles.highlightTitle}>• Interactive Workshops</Text>
            <Text style={dynamicStyles.highlightDescription}>Get hands-on experience with cutting-edge technologies</Text>
          </View>
          
          <View style={dynamicStyles.highlightItem}>
            <Text style={dynamicStyles.highlightTitle}>• Networking Opportunities</Text>
            <Text style={dynamicStyles.highlightDescription}>Connect with industry professionals and potential collaborators</Text>
          </View>
          
          <View style={dynamicStyles.highlightItem}>
            <Text style={dynamicStyles.highlightTitle}>• Tech Expo</Text>
            <Text style={dynamicStyles.highlightDescription}>Experience the latest innovations and product demonstrations</Text>
          </View>
        </View>

        <View style={dynamicStyles.section}>
          <Text style={dynamicStyles.sectionTitle}>Event Merchandise</Text>
          <Text style={dynamicStyles.sectionText}>
            Explore the exclusive merchandise available at REBOOT 2025. Pre-order now and pick up your items at the event!
          </Text>
          
          {loading ? (
            <View style={dynamicStyles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.primaryDarkGreen} />
              <Text style={dynamicStyles.loadingText}>Loading merchandise...</Text>
            </View>
          ) : error ? (
            <View style={dynamicStyles.errorContainer}>
              <Text style={dynamicStyles.errorText}>{error}</Text>
              <TouchableOpacity style={dynamicStyles.retryButton} onPress={fetchItems}>
                <Text style={dynamicStyles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : items.length === 0 ? (
            <Text style={dynamicStyles.noItemsText}>No merchandise available at the moment.</Text>
          ) : (
            <View style={dynamicStyles.itemsContainer}>
              {getCurrentItems().map((item: Item) => (
                <View key={item.id.toString()} style={dynamicStyles.itemCard}>
                  <Text style={dynamicStyles.itemName}>{item.name}</Text>
                  <Text style={dynamicStyles.itemDescription}>{item.description}</Text>
                  <View style={dynamicStyles.itemFooter}>
                    <Text style={dynamicStyles.itemPrice}>${item.price?.toFixed(2) || '0.00'}</Text>
                    <Text style={dynamicStyles.itemCategory}>{item.category}</Text>
                  </View>
                </View>
              ))}
              <View style={dynamicStyles.paginationContainer}>
                <TouchableOpacity 
                  style={[dynamicStyles.paginationButton, currentPage === 1 && dynamicStyles.disabledButton]} 
                  onPress={goToPrevPage}
                  disabled={currentPage === 1}
                >
                  <Text style={dynamicStyles.paginationButtonText}>Previous</Text>
                </TouchableOpacity>
                <Text style={dynamicStyles.pageIndicator}>{currentPage} / {totalPages}</Text>
                <TouchableOpacity 
                  style={[dynamicStyles.paginationButton, currentPage === totalPages && dynamicStyles.disabledButton]} 
                  onPress={goToNextPage}
                  disabled={currentPage === totalPages}
                >
                  <Text style={dynamicStyles.paginationButtonText}>Next</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        <View style={dynamicStyles.section}>
          <Text style={dynamicStyles.sectionTitle}>Get AI Suggestions</Text>
          <Text style={dynamicStyles.sectionText}>
            Ask our AI for creative suggestions related to tech, events, or anything else you'd like to know!
          </Text>
          
          <TextInput
            style={dynamicStyles.suggestionInput}
            placeholder="Enter your suggestion prompt"
            value={suggestionInput}
            onChangeText={setSuggestionInput}
            multiline={false}
            placeholderTextColor={theme.colors.grey500}
          />
          
          <TouchableOpacity 
            style={dynamicStyles.suggestionButton} 
            onPress={submitSuggestion}
            disabled={suggestionLoading}
          >
            {suggestionLoading ? (
              <ActivityIndicator size="small" color={theme.colors.white} />
            ) : (
              <Text style={dynamicStyles.suggestionButtonText}>Get Suggestion</Text>
            )}
          </TouchableOpacity>
        </View>

        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={dynamicStyles.modalOverlay}>
            <View style={dynamicStyles.modalContent}>
              <Text style={dynamicStyles.modalTitle}>AI Suggestion</Text>
              <ScrollView style={dynamicStyles.modalScrollView}>
                <Text style={dynamicStyles.modalText}>{suggestionResponse}</Text>
              </ScrollView>
              <TouchableOpacity 
                style={dynamicStyles.modalButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={dynamicStyles.modalButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <TouchableOpacity 
          style={dynamicStyles.loginButton} 
          onPress={navigateToLogin}
        >
          <Text style={dynamicStyles.loginButtonText}>Login to Event Portal</Text>
        </TouchableOpacity>

        <View style={dynamicStyles.imageGallery}>
          <Image 
            source={require('../../assets/images/ticket.png')} 
            style={dynamicStyles.galleryImage}
            resizeMode="cover"
          />
        </View>
      </View>
    </ScrollView>
  );
};

// Create dynamic styles that use theme tokens
const createDynamicStyles = (theme: any, isDarkMode: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDarkMode ? theme.colors.grey700 : theme.colors.background,
  },
  headerImage: {
    width: '100%',
    height: 280,
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: theme.spacing.sm,
  },
  eventTitle: {
    fontSize: theme.typography.fontSize.xxxl,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.white,
    marginBottom: theme.spacing.xs,
  },
  eventTagline: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.white,
    fontStyle: 'italic',
  },
  contentContainer: {
    padding: theme.spacing.lg,
  },
  section: {
    ...theme.components.card.container,
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.xxl,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.primaryDarkGreen,
    marginBottom: theme.spacing.md,
  },
  sectionText: {
    fontSize: theme.typography.fontSize.md,
    lineHeight: theme.typography.lineHeight.normal,
    color: isDarkMode ? theme.colors.grey300 : theme.colors.grey700,
    marginBottom: theme.spacing.md,
  },
  infoLabel: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.bold,
    color: isDarkMode ? theme.colors.grey300 : theme.colors.grey700,
    marginTop: theme.spacing.sm,
  },
  infoText: {
    fontSize: theme.typography.fontSize.md,
    color: isDarkMode ? theme.colors.grey400 : theme.colors.grey600,
    marginBottom: theme.spacing.xs,
  },
  highlightItem: {
    marginBottom: theme.spacing.sm,
  },
  highlightTitle: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.medium,
    color: isDarkMode ? theme.colors.grey300 : theme.colors.grey700,
  },
  highlightDescription: {
    fontSize: theme.typography.fontSize.sm,
    color: isDarkMode ? theme.colors.grey400 : theme.colors.grey600,
    marginLeft: theme.spacing.md,
  },
  keynoteSection: {
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    backgroundColor: isDarkMode ? 'rgba(0, 106, 77, 0.1)' : 'rgba(0, 106, 77, 0.05)',
    padding: theme.spacing.sm,
    borderRadius: theme.borders.radius.md,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.primaryDarkGreen,
  },
  keynoteHeader: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.bold,
    color: isDarkMode ? theme.colors.grey300 : theme.colors.grey700,
    marginBottom: theme.spacing.sm,
  },
  speakerItem: {
    marginLeft: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  speakerName: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.primaryDarkGreen,
  },
  speakerRole: {
    fontSize: theme.typography.fontSize.sm,
    fontStyle: 'italic',
    color: isDarkMode ? theme.colors.grey400 : theme.colors.grey600,
  },
  speakerTopic: {
    fontSize: theme.typography.fontSize.sm,
    color: isDarkMode ? theme.colors.grey300 : theme.colors.grey700,
    marginTop: theme.spacing.xs,
  },
  loginButton: {
    ...theme.components.button.primary,
    marginBottom: theme.spacing.lg,
  },
  loginButtonText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.medium,
    textAlign: 'center',
  },
  imageGallery: {
    marginBottom: theme.spacing.lg,
  },
  galleryImage: {
    width: '100%',
    height: 200,
    borderRadius: theme.borders.radius.lg,
  },
  itemCard: {
    backgroundColor: isDarkMode ? theme.colors.grey600 : theme.colors.grey100,
    borderRadius: theme.borders.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.primaryDarkGreen,
  },
  itemName: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.bold,
    color: isDarkMode ? theme.colors.white : theme.colors.grey700,
    marginBottom: theme.spacing.xs,
  },
  itemDescription: {
    fontSize: theme.typography.fontSize.sm,
    color: isDarkMode ? theme.colors.grey300 : theme.colors.grey600,
    marginBottom: theme.spacing.sm,
    lineHeight: theme.typography.lineHeight.normal,
  },
  itemPrice: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.primaryDarkGreen,
  },
  itemCategory: {
    fontSize: theme.typography.fontSize.sm,
    color: isDarkMode ? theme.colors.grey300 : theme.colors.grey600,
    backgroundColor: isDarkMode ? theme.colors.grey500 : theme.colors.grey200,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.borders.radius.sm,
  },
  errorText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.error,
    textAlign: 'center',
    marginTop: theme.spacing.lg,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  loadingText: {
    fontSize: theme.typography.fontSize.md,
    color: isDarkMode ? theme.colors.grey300 : theme.colors.grey600,
    marginTop: theme.spacing.sm,
  },
  errorContainer: {
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  retryButton: {
    ...theme.components.button.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: 25,
  },
  retryButtonText: {
    color: theme.colors.white,
    fontFamily: theme.typography.fontFamily.medium,
  },
  noItemsText: {
    fontSize: theme.typography.fontSize.md,
    color: isDarkMode ? theme.colors.grey300 : theme.colors.grey600,
    fontStyle: 'italic',
    textAlign: 'center',
    padding: theme.spacing.lg,
  },
  itemsContainer: {
    marginTop: theme.spacing.sm,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: isDarkMode ? theme.colors.grey500 : theme.colors.grey300,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.lg,
  },
  paginationButton: {
    ...theme.components.button.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: 25,
  },
  paginationButtonText: {
    color: theme.colors.white,
    fontFamily: theme.typography.fontFamily.medium,
  },
  disabledButton: {
    backgroundColor: theme.colors.grey400,
  },
  pageIndicator: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.medium,
    color: isDarkMode ? theme.colors.grey300 : theme.colors.grey700,
  },
  suggestionInput: {
    ...theme.components.input.container,
    marginBottom: theme.spacing.md,
    color: isDarkMode ? theme.colors.white : theme.colors.grey700,
  },
  suggestionButton: {
    ...theme.components.button.primary,
    marginBottom: theme.spacing.sm,
  },
  suggestionButtonText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.medium,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  modalContent: {
    backgroundColor: isDarkMode ? theme.colors.grey700 : theme.colors.white,
    borderRadius: theme.borders.radius.lg,
    padding: theme.spacing.lg,
    width: '90%',
    ...theme.shadows.medium,
  },
  modalTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.primaryDarkGreen,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  modalScrollView: {
    maxHeight: 200,
  },
  modalText: {
    fontSize: theme.typography.fontSize.md,
    color: isDarkMode ? theme.colors.grey300 : theme.colors.grey700,
    marginBottom: theme.spacing.lg,
    lineHeight: theme.typography.lineHeight.normal,
  },
  modalButton: {
    ...theme.components.button.primary,
  },
  modalButtonText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.medium,
    textAlign: 'center',
  },
});

export default HomeScreen;