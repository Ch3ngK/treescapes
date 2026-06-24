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

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
    const { token } = useAuth();

    return (
        <NavigationContainer>
            <Stack.Navigator>
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
                            options={{ title: "Sites" }}
                        />
                        
                        <Stack.Screen 
                            name="SiteDetail"
                            component={SiteDetailScreen}
                            options={{ title: "Site Detail" }}
                        />

                        <Stack.Screen
                            name="EvaluationDetail"
                            component={EvaluationDetailScreen}
                            options={{ title: "Evaluation Detail" }}
                        />
                        
                        <Stack.Screen
                            name="CreateEvaluation"
                            component={CreateEvaluationScreen}
                            options={{ title: "Create evaluation" }}
                        />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>

    )
}