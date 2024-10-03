import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { fetchData } from "./ServiceAPI";



import axios from 'axios';
import LocalHost from '../../data/LocalHost';
import SampleData from '../../data/SampleData';

const folderIcon = require('./images/folder.png');
const addIcon = require('./images/plus.png');

const Libraries = () => {
  const [reading, setReading] = useState(false);
  const [dataFile, setDataFile] = useState({}); // Fixed the state declaration
  const [selectedProtocol, setSelectedProtocol] = useState(null);

  useEffect(() => {
    const continuouslyRead = async () => {
      if (!reading) return; // Only fetch data if reading is true
      try {
        const data =  await fetchData();
        setDataFile(data);
      } catch (error) {
        console.log("Error fetching data in Libraries page: ", error);
      }
    };

    continuouslyRead();

    const interval = setInterval(continuouslyRead, 350);
    return () => clearInterval(interval);
  }, [reading]);




  const handleButtonClick = (protocol) => {
    setReading(true);
    setSelectedProtocol(protocol);
  };

  const handleBackToMain = () => {
    setReading(false); // Stop reading when going back to the library
    setSelectedProtocol(null);
    console.log("Reading stopped:", reading); // This will log the current state
  };

  const renderProtocolContent = () => {
    switch (selectedProtocol) {
      case "Protocol 1":
        return (
          <View style={styles.protocolContainer}>
            <Text style={styles.protocolText}>15 Bicep Curls</Text>
            <ProgressBox angle={parseFloat(dataFile.angle)} />
            <StartButton text="Start Exercise" onPress={() => console.log("Next Exercise for Protocol 1 pressed")} />
            <BackToLibraryButton text="Back To Library" onPress={handleBackToMain} />
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

  const ProtocolButton = ({ text, icon, onPress }) => (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Image source={icon} style={styles.icon} />
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );

  const BackToLibraryButton = ({ text, onPress }) => (
    <TouchableOpacity onPress={onPress} style={styles.backButton}>
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );

  const StartButton = ({ text, onPress }) => (
    <TouchableOpacity onPress={onPress} style={styles.backButton}>
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );

  const ProgressBox = ({ angle }) => (
    <View style={styles.container}>
      <Text style={styles.progressText}>Progress</Text>
      <Text style={styles.progressValue}>x/10</Text>
      <Text style={styles.angleText}>Angle</Text>
      <Text style={styles.angleValue}>{angle}</Text>
    </View>
  );

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

  return (
    <View style={styles.page}>
      <Text style={styles.title}>{selectedProtocol}</Text>
      {renderProtocolContent()}
    </View>
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
    justifyContent: 'center',
  },
  backButton: {
    alignItems: 'center',
    padding: 20,
    marginVertical: 10,
    backgroundColor: '#d3d3d3',
    borderRadius: 5,
    width: '100%',
    justifyContent: 'center',
  },
  icon: {
    width: 32,
    height: 32,
    marginRight: 10,
  },
  text: {
    fontSize: 20,
  },
  protocolContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  protocolText: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  container: {
    width: 300,
    height: 300,
    backgroundColor: '#d3d3d3',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  progressText: {
    fontSize: 24,
    marginBottom: 10,
  },
  progressValue: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  angleText: {
    fontSize: 24,
    marginBottom: 10,
  },
  angleValue: {
    fontSize: 48,
    fontWeight: 'bold',
  },
});

export default Libraries;
