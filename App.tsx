import React from 'react';
import { Platform, View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// Mobile navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Web navigation
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

// Simple placeholder components
const Login = () => (
  <View style={styles.center}>
    <Text style={styles.title}>Login Page</Text>
  </View>
);

const Dashboard = () => (
  <View style={styles.center}>
    <Text style={styles.title}>Dashboard</Text>
  </View>
);

const Clients = () => (
  <View style={styles.center}>
    <Text style={styles.title}>Clients</Text>
  </View>
);

const Employees = () => (
  <View style={styles.center}>
    <Text style={styles.title}>Employees</Text>
  </View>
);

const Products = () => (
  <View style={styles.center}>
    <Text style={styles.title}>Products</Text>
  </View>
);

// Mobile stack navigator
const Stack = createNativeStackNavigator();

const MobileApp = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Dashboard" component={Dashboard} />
      <Stack.Screen name="Clients" component={Clients} />
      <Stack.Screen name="Employees" component={Employees} />
      <Stack.Screen name="Products" component={Products} />
    </Stack.Navigator>
  </NavigationContainer>
);

// Web router
const WebApp = () => (
  <BrowserRouter>
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.navBar}>
        <Link to="/login" style={styles.navLink}>Login</Link>
        <Link to="/dashboard" style={styles.navLink}>Dashboard</Link>
        <Link to="/clients" style={styles.navLink}>Clients</Link>
        <Link to="/employees" style={styles.navLink}>Employees</Link>
        <Link to="/products" style={styles.navLink}>Products</Link>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/products" element={<Products />} />
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </ScrollView>
    </SafeAreaView>
  </BrowserRouter>
);

export default function App() {
  return Platform.OS === 'web' ? (
    <>
      <WebApp />
      <StatusBar style="auto" />
    </>
  ) : (
    <>
      <MobileApp />
      <StatusBar style="auto" />
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#f8f9fa',
  },
  navLink: {
    color: '#007bff',
    fontSize: 16,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});