import React, { useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity,
  Image,
  Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackScreenProps } from '@react-navigation/stack';
import { CommonActions } from '@react-navigation/native';

// Define the navigation param types
type RootStackParamList = {
  Login: undefined;
  MainTabs: undefined;
  Home: undefined;
  Success: { username?: string };
};

type SuccessScreenProps = StackScreenProps<RootStackParamList, 'Success'>;

const SuccessScreen = ({ navigation, route }: SuccessScreenProps) => {
  const { username } = route.params || { username: 'User' };
  const scaleAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 20,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[
        styles.successCard,
        { transform: [{ scale: scaleAnim }] }
      ]}>
        <Ionicons name="checkmark-circle" size={80} color="#4CAF50" style={styles.icon} />
        <Text style={styles.title}>Login Successful</Text>
        <Text style={styles.message}>Welcome back, {username}!</Text>
        <Text style={styles.subMessage}>You have successfully logged in to your account.</Text>
        
        <Image
          source={require('../../assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        
        <TouchableOpacity 
          style={styles.button}
          onPress={() => {
            // Set a global flag that a Home navigation is pending
            if (global) {
              global.pendingHomeNavigation = true;
            }
            
            // First navigate to MainTabs
            navigation.dispatch(
              CommonActions.navigate({
                name: 'MainTabs'
              })
            );
            
            // Then navigate to Home tab
            navigation.dispatch(
              CommonActions.navigate({
                name: 'Home'
              })
            );
          }}
        >
          <Text style={styles.buttonText}>Go to Home</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 20,
  },
  successCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  message: {
    fontSize: 20,
    fontWeight: '500',
    color: '#555',
    marginBottom: 10,
  },
  subMessage: {
    fontSize: 16,
    color: '#777',
    marginBottom: 30,
    textAlign: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#FF5722',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default SuccessScreen;