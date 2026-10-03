import React from 'react';
import { ActivityIndicator, SafeAreaView, StatusBar as RNStatusBar, Platform, LogBox } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import useAuth from './src/hooks/useAuth';
import { colors } from './src/theme';

// React Native's built-in SafeAreaView still works; hide its deprecation notice.
LogBox.ignoreLogs(['SafeAreaView has been deprecated']);

export default function App() {
  const { user, loading, login, loginAsGuest, logout } = useAuth();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.bg,
        paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0,
      }}
    >
      <StatusBar style="dark" />
      {loading ? (
        <ActivityIndicator style={{ marginTop: 80 }} color={colors.primary} />
      ) : user ? (
        <HomeScreen user={user} onLogout={logout} />
      ) : (
        <LoginScreen onLogin={login} onGuest={loginAsGuest} />
      )}
    </SafeAreaView>
  );
}
