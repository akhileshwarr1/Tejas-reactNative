import React, { useRef } from 'react';
import { NavigationContainer, CommonActions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import LloydsHomeScreen from '../screens/LloydsHomeScreen';
import LoginScreen from '../screens/LoginScreen';
import SuccessScreen from '../screens/SuccessScreen';
import MindMoneyScreen from '../screens/MindMoneyScreen';
import ChatTherapyScreen from '../screens/ChatTherapyScreen';
import BudgetingScreen from '../screens/BudgetingScreen';
import WellnessDashboardScreen from '../screens/WellnessDashboardScreen';
import RewardsScreen from '../screens/RewardsScreen';

// Create navigation stacks
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Main stack navigator including authentication flow
const MainStack = () => {
  return (
    <Stack.Navigator initialRouteName="MainTabs">
      <Stack.Screen 
        name="MainTabs" 
        component={MainTabs} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Login" 
        component={LoginScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Success" 
        component={SuccessScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="MindMoney" 
        component={MindMoneyScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="ChatTherapy" 
        component={ChatTherapyScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Budgeting" 
        component={BudgetingScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="WellnessDashboard" 
        component={WellnessDashboardScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Rewards" 
        component={RewardsScreen} 
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

// Bottom tab navigator
const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'LloydsHome') {
            iconName = focused ? 'wallet' : 'wallet-outline';
          } else if (route.name === 'Payments') {
            iconName = focused ? 'money' : 'money-outline';
          } else if (route.name === 'Speakers') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'More') {
            iconName = focused ? 'menu' : 'menu-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#006A4D', // Using Lloyds primary green
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5
        }
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={LloydsHomeScreen}
        options={{ 
          headerShown: false,
          title: 'Home'
        }}
      />
      <Tab.Screen 
        name="LloydsHome" 
        component={LloydsHomeScreen}
        options={{ 
          headerShown: false,
          title: 'Wallet'
        }}
      />
      <Tab.Screen 
        name="Payments" 
        component={PlaceholderScreen}
        options={{ 
          title: 'Payments',
          headerStyle: {
            backgroundColor: '#006A4D', // Lloyds green instead of #FF5722
          },
          headerTintColor: '#fff'
        }}
      />
      <Tab.Screen 
        name="More" 
        component={PlaceholderScreen}
        options={{ 
          title: 'More',
          headerStyle: {
            backgroundColor: '#006A4D', // Lloyds green instead of #FF5722
          },
          headerTintColor: '#fff'
        }}
      />
    </Tab.Navigator>
  );
};

// Placeholder screen component for tabs that are not yet implemented
const PlaceholderScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Coming Soon!</Text>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  text: {
    fontSize: 20,
    color: '#333',
  },
};

// Main app navigator
const AppNavigator = () => {
  const navigationRef = useRef(null);

  // Custom navigation action to navigate to Home from anywhere
  const navigateToHome = () => {
    if (navigationRef.current) {
      // First navigate to MainTabs
      navigationRef.current.dispatch(
        CommonActions.navigate({
          name: 'MainTabs',
        })
      );
      
      // Then navigate to the Home tab
      navigationRef.current.dispatch(
        CommonActions.navigate({
          name: 'LloydsHome',
        })
      );
    }
  };

  // Register the custom navigation action globally
  React.useEffect(() => {
    // Make the navigation function available globally
    if (global) {
      global.navigateToHome = navigateToHome;
    }
    return () => {
      if (global) {
        global.navigateToHome = undefined;
      }
    };
  }, []);

  return (
    <NavigationContainer 
      ref={navigationRef}
      onStateChange={(state) => {
        // Handle navigation events here
        const routes = state?.routes;
        if (routes) {
          // Check if there's a pending action to navigate to Home
          const currentRoute = routes[state.index];
          if (currentRoute.state?.routes) {
            const nestedRoutes = currentRoute.state.routes;
            // If we are in MainTabs but not on Home tab, and there's a pending Home action
            if (currentRoute.name === 'MainTabs' && 
                nestedRoutes[currentRoute.state.index]?.name !== 'LloydsHome' && 
                global.pendingHomeNavigation) {
              // Reset the flag and navigate to Home tab
              global.pendingHomeNavigation = false;
              setTimeout(() => {
                navigationRef.current?.dispatch(
                  CommonActions.navigate('LloydsHome')
                );
              }, 0);
            }
          }
        }
      }}
    >
      <MainStack />
    </NavigationContainer>
  );
};

export default AppNavigator;