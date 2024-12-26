import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import commonStyles from "@/styles/commonStyles";

// Define types for the props
interface ActionButton {
  title: string;
  onPress: () => void;
}

interface EmptyStateProps {
  title: string;
  description: string;
  actionButton?: ActionButton; // Optional button prop
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionButton,
}) => {
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
};

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

export default EmptyState;
