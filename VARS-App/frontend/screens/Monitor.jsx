import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from "react-native";
import axios from 'axios';
import LocalHost from '../../data/LocalHost';
import SampleData from '../../data/SampleData';

const Monitor = () => {
  const ipAddress = LocalHost.ipAddress;

  const [dataFile, setDataFile] = useState({});

  // fetch the device data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // service and characteristic UUIDs
        const serviceCharacteristics = [
          // angle
          {
            service_uuid: '00000100-1212-efde-1523-785feabcd123',
            characteristic_uuid: '00000101-1212-efde-1523-785feabcd123'
          },
          // time
          {
            service_uuid: '00000100-1212-efde-1523-785feabcd123',
            characteristic_uuid: '00000102-1212-efde-1523-785feabcd123'
          },
        ];

        const response = await axios.post(`http://${ipAddress}:8000/data`, serviceCharacteristics);
        const data = await response.data;
        setDataFile(data);
      } catch (error) {
        console.error('Fetch data failed:', error);
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 100);

    return () => clearInterval(interval);
  }, []);
    
  console.log(dataFile);
  // assign data to constants
  const time = parseFloat(dataFile.time && dataFile.time[0]);
  const j_angle = parseFloat(dataFile.angle && dataFile.angle[0]);
  const j_velocity = parseFloat(dataFile.velocity && dataFile.velocity[0]);;
  const i_torque = 0;
  const k_torque = 0;
  const p_torque = 0;
  const avg_torque = 0;
  
  return (
    <View style={styles.pageContainer}>
      <View style={styles.container}>
        <Text style={styles.headerText}>Motion & Orientation</Text>
        <Text style={styles.text}>Time: { time }</Text>
        <Text style={styles.text}>Joint Angle: { j_angle }°</Text>
        <Text style={styles.text}>Joint Velocity: { j_velocity }</Text>
        <Text style={styles.text}>Isometric Torque: { i_torque }</Text>
        <Text style={styles.text}>Kinetic Torque: { k_torque }</Text>
        <Text style={styles.text}>Peak Torque: { p_torque }</Text>
        <Text style={styles.text}>Average Peak Torque: { avg_torque }</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // basic formatting
  pageContainer: {
    justifyContent: 'center',
    alignContent: 'center',
  },
  container: {
    width: 375,
    margin: 10,
    borderRadius: 15,
    backgroundColor: "#F2F2F2",
    padding: 15,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 24,
    alignSelf: 'center',
    marginBottom: 2,
  },
  text: {
    fontSize: 22,
    margin: 1,
  },
});

export default Monitor;