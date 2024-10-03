import React, { useState } from "react";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from "react-native";

const folderIcon = require('./images/folder.png');
const addIcon = require('./images/plus.png');

const Libraries = () => {

  //create states to track which protocol im on
  const [selectedProtocol, setSelectedProtocol] = useState(null);

  //handle button clicks
  const handleButtonClick = (protocol) => {
    setSelectedProtocol(protocol);
  }

  //reset to protocol list
  const handleBackToMain = () => {
    setSelectedProtocol(null);
  }

  // Define the unique content for each protocol
  const renderProtocolContent = () => {
    switch (selectedProtocol) {
      case "Protocol 1":
        return <Text>Test unique content</Text>;
      case "Protocol 2":
        return <Text>This is unique content for Protocol 2. You can add specific actions here.</Text>;
      case "Protocol 3":
        return <Text>Protocol 3 has different content, maybe even an API call or data display here.</Text>;
      case "Add Protocol":
        return <Text>Add new protocol content goes here.</Text>;
      default:
        return <Text>Invalid protocol selection.</Text>;
    }
  };

  //create button component
  const ProtocolButton = ({ text, icon, onPress }) => {
    return (
      <TouchableOpacity onPress={onPress} style={styles.button}>
        <Image source={icon} style={styles.icon} />
        <Text style={styles.text}>{text}</Text>
      </TouchableOpacity>
    );
  };

  const BackToLibraryButton = ({ text, onPress }) => {
    return (
      <TouchableOpacity onPress={onPress} style={styles.backbutton}>
        <Text style={styles.text}>{text}</Text>
      </TouchableOpacity>
    );
  };
  //main page protocol list
  
  if (!selectedProtocol) {
    return (
      <ScrollView contentContainerStyle={styles.page}>
        <Text style={styles.title}>Library</Text>
        <ProtocolButton text="Ex Protocol 1" icon={folderIcon} onPress={() => handleButtonClick("Protocol 1")} />
        <ProtocolButton text="Ex Protocol 2" icon={folderIcon} onPress={() => handleButtonClick("Protocol 2")} />
        <ProtocolButton text="Ex Protocol 3" icon={folderIcon} onPress={() => handleButtonClick("Protocol 3")} />
        <ProtocolButton text="Add Protocol" icon={addIcon} onPress={() => handleButtonClick("Add Protocol")} />
      </ScrollView>
    );
  }
  //implement render protocol-specific content based on the selected button
  return (
    <View style={styles.page}>
      <Text style={styles.title}>{selectedProtocol}</Text>
      {renderProtocolContent()}
      <BackToLibraryButton text="Back To Library" onPress = {handleBackToMain} ></BackToLibraryButton>

    </View>
  );
};


//implemented basic css stylings
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
    justifyContent: 'center',
    textAlign: 'center',
  },

    backButton: {
    alignItems: 'center',
    padding: 20,
    marginVertical: 10,
    backgroundColor: '#d3d3d3',
    borderRadius: 5,
    width: '100%',
    justifyContent: 'center',
    textAlign: 'center',
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
