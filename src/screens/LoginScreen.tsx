import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ImageBackground, 
  Image,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../components/ThemeProvider';

const LoginScreen = ({ navigation }) => {
  const { theme, isDarkMode } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Create dynamic styles that use the theme
  const dynamicStyles = createDynamicStyles(theme, isDarkMode);

  const handleLogin = () => {
    // In a real app, you would implement authentication logic here
    console.log('Login with:', email, password);
    // After successful login, navigate to Home
    navigation.navigate('Home');
  };

  return (
    <ImageBackground
      source={require('../../assets/images/reboot.png')}
      style={dynamicStyles.backgroundImage}
      blurRadius={2}
    >
      <TouchableOpacity 
        style={dynamicStyles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={28} color={theme.colors.white} />
      </TouchableOpacity>
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={dynamicStyles.container}
      >
        <View style={dynamicStyles.overlay}>
          <View style={dynamicStyles.logoContainer}>
            <Image
              source={require('../../assets/images/logo.png')}
              style={dynamicStyles.logo}
              resizeMode="contain"
            />
          </View>

          <Text style={dynamicStyles.title}>Event Login</Text>
          
          <View style={dynamicStyles.inputContainer}>
            <TextInput
              style={dynamicStyles.input}
              placeholder="Email"
              placeholderTextColor={theme.colors.grey500}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            
            <TextInput
              style={dynamicStyles.input}
              placeholder="Password"
              placeholderTextColor={theme.colors.grey500}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <TouchableOpacity style={dynamicStyles.loginButton} onPress={handleLogin}>
              <Text style={dynamicStyles.loginButtonText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

// Create dynamic styles that use theme tokens
const createDynamicStyles = (theme: any, isDarkMode: boolean) => StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: theme.borders.radius.lg,
    width: '85%',
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  logo: {
    width: 150,
    height: 150,
  },
  title: {
    fontSize: theme.typography.fontSize.xxxl,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.white,
    marginBottom: theme.spacing.xl,
  },
  inputContainer: {
    width: '100%',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: theme.borders.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.grey700,
  },
  loginButton: {
    ...theme.components.button.primary,
    marginTop: theme.spacing.sm,
  },
  loginButtonText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.medium,
    textAlign: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    padding: theme.spacing.sm,
  },
});

export default LoginScreen;