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
        return(
          <View style={styles.protocolContainer}>
            <Text style = {styles.protocolText}>15 Bicep Curls</Text>
            <ProgressBox />
            <StartButton text="Start Exercise" onPress={() => console.log("Next Exercise for Protocol 1 pressed")} />
            <BackToLibraryButton text="Back To Library" onPress = {handleBackToMain} ></BackToLibraryButton>
          </View>
        );
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

  //back to library button
  const BackToLibraryButton = ({ text, onPress }) => {
    return (
      <TouchableOpacity onPress={onPress} style={styles.backbutton}>
        <Text style={styles.text}>{text}</Text>
      </TouchableOpacity>
    );
  };
  //start button
  const StartButton = ({ text, onPress }) => {
    return (
      <TouchableOpacity onPress={onPress} style={styles.backButton}>
        <Text style={styles.text}>{text}</Text>
      </TouchableOpacity>
    );
  };
  
  //progress box
  const ProgressBox = () => {
    return (
      <View style={styles.container}>
        <Text style={styles.progressText}>Progress</Text>
        <Text style={styles.progressValue}>x/10</Text>
        <Text style={styles.angleText}>Angle</Text>
        <Text style={styles.angleValue}>0</Text>
      </View>
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

  //protocol css
  protocolContainer: {
    flex: 1,               // Ensures the container takes up the full screen height
    alignItems: 'center',     // Centers items horizontally
    justifyContent: 'flex-start',
  },

  protocolText: {
    fontSize: 30, // Larger font size for the "0"
    fontWeight: 'bold',
  },

  //Progress box
  container: {
    width: 300, // Adjust the size as per your layout
    height: 300, // Adjust the size as per your layout
    backgroundColor: '#d3d3d3', // Gray background color
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10, // Rounded corners, adjust if necessary
  },
  progressText: {
    fontSize: 24, // Adjust font size
    marginBottom: 10,
  },
  progressValue: {
    fontSize: 48, // Larger font size for the "x/10"
    fontWeight: 'bold',
    marginBottom: 20,
  },
  angleText: {
    fontSize: 24, // Adjust font size for "Angle"
    marginBottom: 10,
  },
  angleValue: {
    fontSize: 48, // Larger font size for the "0"
    fontWeight: 'bold',
  },
});

export default Libraries;
