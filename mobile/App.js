import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, PlayCircle, User } from 'lucide-react-native';

import CadastroScreen from './src/screens/CadastroScreen';
import LoginScreen from './src/screens/LoginScreen';
import AnamneseScreen from './src/screens/AnamneseScreen';
import HomeScreen from './src/screens/HomeScreen';
import VideosScreen from './src/screens/VideosScreen';
import PerfilScreen from './src/screens/PerfilScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#030712',
          borderTopWidth: 2,
          borderTopColor: '#1F2937',
          height: 76,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: { fontSize: 14, fontWeight: 'bold' },
        tabBarActiveTintColor: '#4ADE80',
        tabBarInactiveTintColor: '#9CA3AF',
      }}
    >
      <Tab.Screen
        name="Início"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => <Home size={28} color={color} />,
        }}
      />
      <Tab.Screen
        name="Vídeos"
        component={VideosScreen}
        options={{
          tabBarIcon: ({ color }) => <PlayCircle size={28} color={color} />,
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={PerfilScreen}
        options={{
          tabBarIcon: ({ color }) => <User size={28} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Cadastro">
        <Stack.Screen name="Cadastro" component={CadastroScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Anamnese" component={AnamneseScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}