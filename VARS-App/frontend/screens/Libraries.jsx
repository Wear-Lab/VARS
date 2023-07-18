import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Libraries = () => {
  
  return (
    <View style={styles.page}>
      <Text style={[{fontWeight: "bold"}]}>Libraries Page</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  }
});

export default Libraries;
