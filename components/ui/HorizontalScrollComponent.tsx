import React from "react";
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";

const HorizontalScrollComponent = ({ data, onPress, selectedRoom }) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        horizontal
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.itemContainer,
              item.id !== selectedRoom && styles.dimmedItem, // Dim non-selected items
            ]}
            onPress={() => onPress(item)}
          >
            <Text style={styles.text}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  contentContainer: {
    paddingHorizontal: 10,
  },
  itemContainer: {
    padding: 10,
    backgroundColor: "#fff",
    marginHorizontal: 5,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 110,
    borderWidth: 1, // Thickness of the border
    borderColor: "#ccc", //
  },
  dimmedItem: {
    opacity: 0.5, // Dim the non-selected items
  },
  text: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
});

export default HorizontalScrollComponent;
