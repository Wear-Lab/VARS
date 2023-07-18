import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import React, { useEffect, useState } from "react";
import LocalHost from '../../data/LocalHost';

const About = ({ enterConnect }) => {
  const ipAddress = LocalHost.ipAddress;

  const [deviceName, setDeviceName] = useState("");
  const [deviceStatus, setDeviceStatus] = useState("");
  const [buttonText, setButtonText] = useState("Change Device");
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [dotCount, setDotCount] = useState(0);

  /// fetch the devices information
  useEffect(() => {
    const fetchDeviceInfo = async () => {
      try {

        const response = await fetch(`http://${ipAddress}:8000/address`);
        const data = await response.json();
        setDeviceName(data.device_address);
      } catch (error) {
        console.error("Fetch device failed:", error);
      }
    };

    fetchDeviceInfo();
  }, []);

  /// fetch the devices connection status
  useEffect(() => {
    const fetchDeviceStatus = async () => {
      try {
        const response = await fetch(
          `http://${ipAddress}:8000/check_connection`
        );
        const data = await response.json();
        setDeviceStatus(Boolean(data.status));
      } catch (error) {
        console.error("Fetch device failed:", error);
      }
    };

    fetchDeviceStatus();
  }, []);

  // dot animation while attempting to disconnect to device
  useEffect(() => {
    const dotTimer = setInterval(() => {
      setDotCount((prevDotCount) => (prevDotCount + 1) % 4);
    }, 500);

    return () => clearInterval(dotTimer);
  }, []);

  const getButtonDisplayText = () => {
    if (buttonText === "Disconnecting") {
      const dots = ".".repeat(dotCount);
      return `Disconnecting${dots}`;
    }
    return buttonText;
  };

  // exit navigation back to connect page
  const handleEnterConnect = async () => {
    if (!buttonDisabled) {
      try {
        // disable the connect button and update the text and color
        setButtonDisabled(true);
        setButtonText("Disconnecting");

        // Call the disconnect_device endpoint to disconnect from the device
        const response = await fetch(
          `http://${ipAddress}:8000/disconnect_device`
        );
        const data = await response.json();
        const connection = data.status;

        if (connection === true) enterConnect();
        else console.log("Error disconnecting to device.");
      } catch (error) {
        console.error("Disconnect device failed:", error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.text}>Bluetooth Address:</Text>
        <Text style={[styles.text, { width: 220, textAlign: "center" }]}>
          {deviceName}
        </Text>
      </View>

      <View
        style={[
          styles.box,
          deviceStatus ? styles.connectedBox : styles.disconnectedBox,
        ]}
      >
        <Text style={styles.text}>Bluetooth Status:</Text>
        <Text style={[styles.text, { width: 220, textAlign: "center" }]}>
          {deviceStatus ? "Connected!" : "Disconnected!"}
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.button, buttonDisabled && { backgroundColor: "gray" }]}
        onPress={handleEnterConnect}
        disabled={buttonDisabled}
      >
        <Text style={[styles.text, { color: "white" }]}>
          {getButtonDisplayText()}
        </Text>
      </TouchableOpacity>

      <Image
        source={require("./images/WEAR_Lab_Logo.png")}
        style={styles.image}
      />
      <Text>Wearable Engineering and Assistive Robotics Lab</Text>
      <Text>University of Central Florida</Text>
      <Text> </Text>
      <Text style={[{ fontWeight: "bold" }]}>VARS</Text>
      <Text>Variable Resistance Suit</Text>
      <Text> </Text>
      <Text style={[{ fontWeight: "bold" }]}>Developed By:</Text>
      <Text>Ibrahim Kadhim</Text>
      <Text>Vi Dang</Text>
      <Text>Son Van</Text>
      <Text> </Text>
      <Text style={[{ fontWeight: "bold" }]}>Version 0717</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "F1F1F1",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    height: 60,
    width: 220,
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: "#F2F2F2",
    justifyContent: "center",
  },
  connectedBox: {
    backgroundColor: "#8BFF8E",
  },
  disconnectedBox: {
    backgroundColor: "#FF4754",
  },
  button: {
    width: 220,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    marginBottom: 10,
    backgroundColor: "#62C0FF",
  },
  text: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
    alignSelf: "center",
  },
  image: {
    marginTop: 10,
  },
});

export default About;
