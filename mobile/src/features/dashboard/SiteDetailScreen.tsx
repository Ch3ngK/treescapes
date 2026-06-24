import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, SafeAreaView, Text, View, Pressable } from "react-native";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";


import { RootStackParamList } from "../../navigation/types";
import { useAuth } from "../auth/AuthContext";
import { Evaluation, getEvaluationsForSite } from "../../api/evaluations";

// For Route object: describes what screen this is, and what params were passed into it.
// route.params.siteId
// route.params.siteName
// "What came into this screen"
type SiteDetailScreenRouteProp = RouteProp<
  RootStackParamList, 
  "SiteDetail"
>;
type Props = {
    route: SiteDetailScreenRouteProp;
};

// For Navigation object: describes what navigation methods exist, what screens this screen can navigate to, and what params those destination screens require.
// route: incoming data, navigation: outgoing movement. 
type SiteDetailScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "SiteDetail"
>;

export function SiteDetailScreen({ route }: Props) {
  const { siteId, siteName } = route.params; // Takes the siteId and siteName out of route.params

  const { token } = useAuth();
  
  const navigation = useNavigation<SiteDetailScreenNavigationProp>();

  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function loadEvaluations() {
      if (!token) {
        setLoading(false); 
        return; 
      }

      try {
        setLoading(true);
        setError(null);

        const result = await getEvaluationsForSite(token, siteId);
        setEvaluations(result);
      } catch (err) {
        setError("Failed to load evaluations.");
      } finally {
        setLoading(false);
      }
    }

    loadEvaluations()
  }, [token, siteId]);

  if (loading) {
    return (
      <SafeAreaView style = {{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </SafeAreaView>
    )
  }

  if (error) {
    return (
    <SafeAreaView style={{ flex: 1, padding: 24 }}>
      <Text>{error}</Text>
    </SafeAreaView>
    );
  }

  return (
  <SafeAreaView style={{ flex: 1, padding: 24 }}>
    <View style={{ marginBottom: 20 }}>
      <Text style={{ fontSize: 28, fontWeight: "700" }}>{siteName}</Text>
      <Text style={{ marginTop: 8 }}>Site ID: {siteId}</Text>
    </View>

    <Pressable
      onPress={() =>
        navigation.navigate("CreateEvaluation", {
          siteId,
          siteName,
        })
      }
      style={{
        marginBottom: 20,
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: "#2f7d32",
        borderRadius: 8,
      }}
    >
      <Text style={{ color: "white", fontWeight: "700" }}>
        Create Evaluation
      </Text>
    </Pressable>
    
    <FlatList
      data={evaluations}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <Pressable
          onPress={() =>
            navigation.navigate("EvaluationDetail", {
              evaluationId: item.id,
            })
          }
          style={{ paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#ddd" }}
        >
          <Text>Evaluation #{item.id}</Text>
          <Text>Date: {item.evaluation_date}</Text>
          <Text>Score: {item.percentage}%</Text>
          <Text>Status: {item.status}</Text>
        </Pressable>
      )}
      ListEmptyComponent={<Text>No evaluations found for this site.</Text>}
    />
  </SafeAreaView>
  );
}