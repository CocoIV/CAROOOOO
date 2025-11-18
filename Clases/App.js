import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import RegisterScreen from './screens/RegisterScreen';
import ChoiceScreen from './screens/ChoiceScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import TiendasScreen from './screens/TiendasScreen';
import VerificationMethodScreen from './screens/VerificationMethodScreen';
import EmailCodeScreen from './screens/EmailCodeScreen';
import FingerprintScreen from './screens/FingerprintScreen';
import CreatePasswordScreen from './screens/CreatePasswordScreen';
import SuccessScreen from './screens/SuccessScreen';
import ProfileIntroScreen from './screens/ProfileIntroScreen';
import ProfileScreen from './screens/ProfileScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  // ...existing code...
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = async () => {
    // Guarda la sesión al iniciar (opcional, puedes quitar si no usas token)
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    setIsAuthenticated(false);
  };

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <>
                    <Stack.Screen 
                      name="ProfileIntro"
                      options={{ headerShown: false }}
                      component={ProfileIntroScreen}
                    />
                    <Stack.Screen 
                      name="Profile"
                      options={{ headerShown: false }}
                      component={ProfileScreen}
                    />
          <Stack.Screen 
            name="Welcome"
            options={{ headerShown: false }}
            component={WelcomeScreen}
          />
          <Stack.Screen 
            name="Choice"
            options={{ headerShown: false }}
            component={ChoiceScreen}
          />
          <Stack.Screen 
            name="Login"
            options={{ headerShown: false }}
          >
            {props => <LoginScreen {...props} onLogin={handleLogin} />}
          </Stack.Screen>
          <Stack.Screen 
            name="Register"
            options={{ headerShown: false }}
            component={RegisterScreen}
          />
          <Stack.Screen 
            name="VerificationMethod"
            options={{ headerShown: false }}
            component={VerificationMethodScreen}
          />
          <Stack.Screen 
            name="EmailCode"
            options={{ headerShown: false }}
            component={EmailCodeScreen}
          />
          <Stack.Screen 
            name="Fingerprint"
            options={{ headerShown: false }}
            component={FingerprintScreen}
          />
          <Stack.Screen 
            name="CreatePassword"
            options={{ headerShown: false }}
            component={CreatePasswordScreen}
          />
          <Stack.Screen 
            name="Home"
            options={{ headerShown: false }}
          >
            {props => <HomeScreen {...props} onLogout={handleLogout} />}
          </Stack.Screen>
          <Stack.Screen 
            name="TiendasScreen"
            options={{ headerShown: false }}
            component={TiendasScreen}
          />
          <Stack.Screen 
            name="Success"
            options={{ headerShown: false }}
            component={SuccessScreen}
          />
        </>
      </Stack.Navigator>
    </NavigationContainer>
  );
}