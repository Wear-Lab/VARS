import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Monitor from "./Monitor";
import Libraries from "./Libraries";
import RawData from "./RawData";
import About from "./About";
import Connect from "./Connect"

// Define an array of objects representing each navigation image
const navItems = [
  { name: "Monitoring", image: require("./images/monitor.png") },
  { name: "Libraries", image: require("./images/libraries.png") },
  { name: "Raw Data", image: require("./images/rawdata.png") },
  { name: "About", image: require("./images/about.png") },
];

// This const is responsible for outputting the navigation bar to the screen
const Navigation = () => {
  // Change this line later is we want to select the device page before
  // using other app pages
  const [activeTab, setActiveTab] = useState(null);
  const [deviceIndex, setDeviceIndex] = useState(null);

  // Allows us to switch between components on the navbar
  const handlePress = (tabName) => {
    setActiveTab(tabName);
  };

  // Inside Navigation component
  const handleExitConnect = (deviceIndex) => {
    setActiveTab("Monitoring");
    setDeviceIndex(deviceIndex);
  };

  // Inside Navigation component
  const handleEnterConnect = () => {
    setActiveTab("Connect");
  };

  return (
    <View style={styles.container}>
      {/* Render the Connect component if no activeTab is set */}
      {activeTab === null || activeTab === "Connect" ? (
        <Connect exitConnect={handleExitConnect} enterConnect={handleEnterConnect}/>
      ) : (
        <View style={styles.contentContainer}>
          {activeTab === "Monitoring" && <Monitor />}
          {activeTab === "Libraries" && <Libraries />}
          {activeTab === "Raw Data" && <RawData />}
          {activeTab === "About" && (<About enterConnect={handleEnterConnect}/>)}
          {activeTab === "Connect" && (<Connect exitConnect={handleExitConnect}/>)}
        </View>
      )}

      {/* Searches and assigns image for each navigation icon */}
      {activeTab !== null && activeTab !== "Connect" && (
        <View style={styles.navContainer}>
          {navItems.map((item) => (
            <TouchableOpacity
              key={item.name}
              style={[
                styles.navItem,
                activeTab === item.name && styles.activeNavItem,
              ]}
              onPress={() => handlePress(item.name)}
            >
              <Image source={item.image} style={styles.navItemImage} />
              <Text style={styles.navItemText}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

// Styles used for navigation bar
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  navContainer: {
    flexDirection: "row",
    backgroundColor: "#F2F2F2",
    height: '7%',
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  navItemImage: {
    width: 24,
    height: 24,
  },
  navItemText: {
    color: "black",
    fontSize: 10,
  },
  activeNavItem: {
    backgroundColor: "#74D2FA",
  },
});

export default Navigation;