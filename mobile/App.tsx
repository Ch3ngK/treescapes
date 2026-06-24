import React from "react";
import { Button, SafeAreaView, StyleSheet, Text, View } from "react-native";

import { AuthProvider, useAuth } from "./src/features/auth/AuthContext";
import { RootNavigator } from "./src/navigation/RootNavigator";

export default function App() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f3ea",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#f5f3ea",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#24412f",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#4c5d52",
    marginBottom: 20,
    textAlign: "center",
  },
});