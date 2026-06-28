import React from "react";
import { NavigationContainer } from "@react-navigation/native"; //wrapper for whole navigation system.
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { useAuth } from "../features/auth/AuthContext";
import { LoginScreen } from "../features/auth/LoginScreen";
import { SitesScreen } from "../features/dashboard/SitesScreen";
import { SiteDetailScreen } from "../features/dashboard/SiteDetailScreen";
import { EvaluationDetailScreen } from "../features/dashboard/EvaluationDetailScreen";
import { CreateEvaluationScreen } from "../features/dashboard/CreateEvaluationsScreen";
import { RootStackParamList } from "./types";
import { colors, navigationTheme, typography } from "../theme/designSystem";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
    const { token } = useAuth();

    return (
        <NavigationContainer theme={navigationTheme}>
            <Stack.Navigator
                screenOptions={{
                    headerStyle: {
                        backgroundColor: colors.canvas,
                    },
                    headerTintColor: colors.ink,
                    headerTitleStyle: {
                        ...typography.heading3,
                        color: colors.ink,
                    },
                    headerShadowVisible: false,
                    contentStyle: {
                        backgroundColor: colors.surface,
                    },
                }}
            >
                {!token ? (
                    <Stack.Screen
                        name="Login"
                        component={LoginScreen}
                        options={{ headerShown: false }}
                    />
                ) : (
                    <>
                        <Stack.Screen
                            name="Sites"
                            component={SitesScreen}
                            options={{ title: "Field Dashboard" }}
                        />
                        
                        <Stack.Screen 
                            name="SiteDetail"
                            component={SiteDetailScreen}
                            options={({ route }) => ({ title: route.params.siteName })}
                        />

                        <Stack.Screen
                            name="EvaluationDetail"
                            component={EvaluationDetailScreen}
                            options={{ title: "Evaluation Overview" }}
                        />
                        
                        <Stack.Screen
                            name="CreateEvaluation"
                            component={CreateEvaluationScreen}
                            options={{ title: "Create Evaluation" }}
                        />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>

    )
}
