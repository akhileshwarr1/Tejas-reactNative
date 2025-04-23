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
  FlatList,
  TextInput,
  Modal,
  Alert
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

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
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [suggestionInput, setSuggestionInput] = useState('');
  const [suggestionResponse, setSuggestionResponse] = useState('');
  const [suggestionLoading, setSuggestionLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

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

  const renderItem = ({ item }: { item: Item }) => (
    <View style={styles.itemCard}>
      <Text style={styles.itemId}>Item ID: {item.id}</Text>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemDescription}>{item.description}</Text>
      <Text style={styles.itemPrice}>Price: ${item.price.toFixed(2)}</Text>
      <Text style={styles.itemCategory}>Category: {item.category}</Text>
    </View>
  );

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
    <ScrollView style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/reboot.png')}
        style={styles.headerImage}
      >
        <View style={styles.overlay}>
          <Image 
            source={require('../../assets/images/logo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.eventTitle}>REBOOT 2025</Text>
          <Text style={styles.eventTagline}>The Ultimate Tech Revival</Text>
        </View>
      </ImageBackground>

      <View style={styles.contentContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Event Details</Text>
          <Text style={styles.sectionText}>
            Join us for the most anticipated tech event of the year! REBOOT 2025 brings together industry leaders, 
            innovators, and tech enthusiasts for three days of inspiring talks, workshops, and networking opportunities.
          </Text>
          
          <Text style={styles.infoLabel}>Date & Time:</Text>
          <Text style={styles.infoText}>April 15-17, 2025 | 9:00 AM - 6:00 PM</Text>
          
          <Text style={styles.infoLabel}>Location:</Text>
          <Text style={styles.infoText}>Tech Convention Center, Silicon Valley</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Event Highlights</Text>
          <View style={styles.highlightItem}>
            <Text style={styles.highlightTitle}>• Keynote Speeches</Text>
            <Text style={styles.highlightDescription}>Hear from top tech visionaries about the future of technology</Text>
          </View>

          <View style={styles.keynoteSection}>
            <Text style={styles.keynoteHeader}>Featured Keynote Speakers:</Text>
            <View style={styles.speakerItem}>
              <Text style={styles.speakerName}>Maneesha Rachakonda</Text>
              <Text style={styles.speakerRole}>Chief Innovation Officer, Tech Futures</Text>
              <Text style={styles.speakerTopic}>"AI-Powered Business Transformation in 2025"</Text>
            </View>
          </View>
          
          <View style={styles.highlightItem}>
            <Text style={styles.highlightTitle}>• Interactive Workshops</Text>
            <Text style={styles.highlightDescription}>Get hands-on experience with cutting-edge technologies</Text>
          </View>
          
          <View style={styles.highlightItem}>
            <Text style={styles.highlightTitle}>• Networking Opportunities</Text>
            <Text style={styles.highlightDescription}>Connect with industry professionals and potential collaborators</Text>
          </View>
          
          <View style={styles.highlightItem}>
            <Text style={styles.highlightTitle}>• Tech Expo</Text>
            <Text style={styles.highlightDescription}>Experience the latest innovations and product demonstrations</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Event Merchandise</Text>
          <Text style={styles.sectionText}>
            Explore the exclusive merchandise available at REBOOT 2025. Pre-order now and pick up your items at the event!
          </Text>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FF5722" />
              <Text style={styles.loadingText}>Loading merchandise...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={fetchItems}>
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : items.length === 0 ? (
            <Text style={styles.noItemsText}>No merchandise available at the moment.</Text>
          ) : (
            <View style={styles.itemsContainer}>
              {getCurrentItems().map((item: Item) => (
                <View key={item.id.toString()} style={styles.itemCard}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemDescription}>{item.description}</Text>
                  <View style={styles.itemFooter}>
                    <Text style={styles.itemPrice}>${item.price?.toFixed(2) || '0.00'}</Text>
                    <Text style={styles.itemCategory}>{item.category}</Text>
                  </View>
                </View>
              ))}
              <View style={styles.paginationContainer}>
                <TouchableOpacity 
                  style={[styles.paginationButton, currentPage === 1 && styles.disabledButton]} 
                  onPress={goToPrevPage}
                  disabled={currentPage === 1}
                >
                  <Text style={styles.paginationButtonText}>Previous</Text>
                </TouchableOpacity>
                <Text style={styles.pageIndicator}>{currentPage} / {totalPages}</Text>
                <TouchableOpacity 
                  style={[styles.paginationButton, currentPage === totalPages && styles.disabledButton]} 
                  onPress={goToNextPage}
                  disabled={currentPage === totalPages}
                >
                  <Text style={styles.paginationButtonText}>Next</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Get AI Suggestions</Text>
          <Text style={styles.sectionText}>
            Ask our AI for creative suggestions related to tech, events, or anything else you'd like to know!
          </Text>
          
          <TextInput
            style={styles.suggestionInput}
            placeholder="Enter your suggestion prompt"
            value={suggestionInput}
            onChangeText={setSuggestionInput}
            multiline={false}
          />
          
          <TouchableOpacity 
            style={styles.suggestionButton} 
            onPress={submitSuggestion}
            disabled={suggestionLoading}
          >
            {suggestionLoading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text style={styles.suggestionButtonText}>Get Suggestion</Text>
            )}
          </TouchableOpacity>
        </View>

        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>AI Suggestion</Text>
              <ScrollView style={styles.modalScrollView}>
                <Text style={styles.modalText}>{suggestionResponse}</Text>
              </ScrollView>
              <TouchableOpacity 
                style={styles.modalButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <TouchableOpacity 
          style={styles.loginButton} 
          onPress={navigateToLogin}
        >
          <Text style={styles.loginButtonText}>Login to Event Portal</Text>
        </TouchableOpacity>

        <View style={styles.imageGallery}>
          <Image 
            source={require('../../assets/images/ticket.png')} 
            style={styles.galleryImage}
            resizeMode="cover"
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
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
    padding: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  eventTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  eventTagline: {
    fontSize: 18,
    color: '#ffffff',
    fontStyle: 'italic',
  },
  contentContainer: {
    padding: 20,
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FF5722',
    marginBottom: 15,
  },
  sectionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 15,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#444',
    marginTop: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  highlightItem: {
    marginBottom: 12,
  },
  highlightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  highlightDescription: {
    fontSize: 14,
    color: '#666',
    marginLeft: 15,
  },
  keynoteSection: {
    marginTop: 10,
    marginBottom: 15,
    backgroundColor: 'rgba(255, 87, 34, 0.05)',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#FF5722',
  },
  keynoteHeader: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  speakerItem: {
    marginLeft: 15,
    marginBottom: 8,
  },
  speakerName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FF5722',
  },
  speakerRole: {
    fontSize: 13,
    fontStyle: 'italic',
    color: '#555',
  },
  speakerTopic: {
    fontSize: 14,
    color: '#444',
    marginTop: 3,
  },
  loginButton: {
    backgroundColor: '#FF5722',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  imageGallery: {
    marginBottom: 20,
  },
  galleryImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  itemCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    borderLeftWidth: 3,
    borderLeftColor: '#FF5722',
  },
  itemId: {
    fontSize: 14,
    color: '#666',
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    lineHeight: 20,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF5722',
  },
  itemCategory: {
    fontSize: 14,
    color: '#666',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  errorContainer: {
    alignItems: 'center',
    padding: 20,
  },
  retryButton: {
    backgroundColor: '#FF5722',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  noItemsText: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 20,
  },
  itemsContainer: {
    marginTop: 10,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  paginationButton: {
    backgroundColor: '#FF5722',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  paginationButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  pageIndicator: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  suggestionInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  suggestionButton: {
    backgroundColor: '#FF5722',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  suggestionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF5722',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalScrollView: {
    maxHeight: 200,
  },
  modalText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    lineHeight: 24,
  },
  modalButton: {
    backgroundColor: '#FF5722',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen;