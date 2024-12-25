import commonStyles from "@/styles/commonStyles";
import React from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";

export default function EmptyState({ title, description, actionButton }) {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {actionButton && (
        <TouchableOpacity
          style={commonStyles.button}
          onPress={actionButton.onPress}
        >
          <Text style={commonStyles.buttonText}>{actionButton.title}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
});
