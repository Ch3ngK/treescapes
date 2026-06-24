import React, { useState } from "react";
import { ActivityIndicator, Button, StyleSheet, Image, Text, TextInput, View } from "react-native";

import { loginRequest } from "../../api/auth";
import { useAuth } from "./AuthContext";

export function LoginScreen() {
    const { signIn } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleLogin() {
        try {
            setIsLoading(true); 
            setError(null);

            const result = await loginRequest( { email, password });
            signIn(result.access_token);
        } catch (err) {
            setError("Login failed. Check your email and password.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <Image 
                source={require("../../../assets/treescapes_pte_ltd_logo.jpg")}
                style={styles.logo}
                resizeMode="contain"
            />
            <Text style={styles.title}>Treescapes Login</Text>
        

            <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                autoCapitalize="none"
                keyboardType="email-address"
                style={styles.input}
            />

            <TextInput 
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                secureTextEntry
                style={styles.input}
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            {loading ? (
                <ActivityIndicator/> // React Native's loading spinner.
            ) : (
                <Button title="login" onPress={handleLogin} />
            )}
        </View>
    );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#f5f3ea",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 24,
    color: "#24412f",
  },
  input: {
    borderWidth: 1,
    borderColor: "#b7c2b8",
    backgroundColor: "#ffffff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
  },
  error: {
    color: "#b42318",
    marginBottom: 12,
  },
  logo: {
    width: 180,
    height: 80,
    alignSelf: "center",
    marginBottom: 20,
  },
});

