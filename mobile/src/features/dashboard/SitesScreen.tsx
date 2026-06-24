import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, SafeAreaView, Text, View } from "react-native";

import { getSites, Site } from  "../../api/sites";
import { useAuth } from "../auth/AuthContext";

import { Pressable } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

import { RootStackParamList } from "../../navigation/types";

type SitesScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList, 
    "Sites"
>;

export function SitesScreen() {
    const { token } = useAuth();

    const [sites, setSites] = useState<Site[]>([]);
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState<string | null>(null);
    const navigation = useNavigation<SitesScreenNavigationProp>();

    useEffect(() => {
        async function loadSites() {
            if (!token) return; 

            try {
                setLoading(true);
                setError(null);

                const result = await getSites(token);
                setSites(result);
            } catch (err) {
                setError("Failed to load sites.")
            } finally {
                setLoading(false);
            }
        }
        loadSites()
    }, [token]);
    
    return (
        <SafeAreaView style={{ flex: 1, padding: 24 }}>
            <FlatList
                data={sites}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => ( // For each item in data, render this UI.
                    <Pressable 
                     onPress={() => 
                        navigation.navigate("SiteDetail", {
                            siteId: item.id,
                            siteName: item.name,
                        })
                     }
                        style={{ paddingVertical: 12 }}
                    >
                        <Text>{item.name}</Text>
                        <Text>{item.code ?? "No code"}</Text>
                    </Pressable>
                )}
            /> 
            
            {loading ? <ActivityIndicator /> : false}
            {error ? <Text>{error}</Text> : null}
    
        </SafeAreaView>
    );
}