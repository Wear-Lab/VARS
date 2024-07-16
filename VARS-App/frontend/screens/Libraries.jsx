import React from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";

const folderIcon = require('./images/folder.png');
const addIcon = require('./images/plus.png');

const Libraries = () => {

  const ProtocolButton = ({ text, icon }) => {
    return (
      <View style={styles.button}>
        <Image source={icon} style={styles.icon} />
        <Text style={styles.text}>{text}</Text>
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <Text style={styles.title}>Library</Text>
      <ProtocolButton text="Ex Protocol" icon={folderIcon} />
      <ProtocolButton text="Ex Protocol" icon={folderIcon} />
      <ProtocolButton text="Ex Protocol" icon={folderIcon} />
      <ProtocolButton text="Ex Protocol" icon={folderIcon} />
      <ProtocolButton text="Add Protocol" icon={addIcon} />
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  page: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 32,
    marginBottom: 20,
    marginTop: 50,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    marginVertical: 10,
    backgroundColor: '#d3d3d3',
    borderRadius: 5,
    width: '120%',
    alignSelf: 'center',
  },
  icon: {
    width: 32,
    height: 32,
    marginRight: 10,
  },
  text: {
    fontSize: 20,
  },
});

export default Libraries;
