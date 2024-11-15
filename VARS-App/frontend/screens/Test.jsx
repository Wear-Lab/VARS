import React, { useEffect, useState ,  useCallback} from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { fetchData } from "./ServiceAPI";
import axios from 'axios';


const folderIcon = require('./images/folder.png');
const addIcon = require('./images/plus.png');

const Test = () => {
const [reading, setReading] = useState(true);
const [dataFile, setDataFile] = useState({});
const [selectedProtocol, setSelectedProtocol] = useState("Protocol 1");
const [repCount, setRepCount] = useState(0); // Track reps
const [isExercising, setIsExercising] = useState(false); // Check if exercise started
const [direction, setDirection] = useState(null); // Track angle movement direction

// useEffect(() => {
//     const continuouslyRead = async () => {
//     if (!reading || !isExercising) return;
//     try {
//         const data = await fetchData();
//         const angle = parseFloat(data.angle);

//         // Rep counting logic
//         if (angle > 170) {
//         setDirection("down");
//         } else if (angle < 100 && direction === "down") {
//         setRepCount(prevRepCount => prevRepCount + 1);
//         setDirection("up");
//         }

//         setDataFile(data);
//     } catch (error) {
//         console.log("Error fetching data in Libraries page: ", error);
//     }
//     };

//     continuouslyRead();

//     const interval = setInterval(continuouslyRead, 350);
//     return () => clearInterval(interval);
// }, [reading, isExercising, direction]);


// fetch the device data
useEffect(() => {
const fetchData = async () => {
    try {
    if(reading === false) return;
    // service and characteristic UUIDs
    const serviceCharacteristics = [
        // angle
        {
        service_uuid: '00000100-1212-efde-1523-785feabcd123', //VARS Service
        characteristic_uuid: '00000101-1212-efde-1523-785feabcd123' //Angle characteristic
        },
        // time
        {
        service_uuid: '00000100-1212-efde-1523-785feabcd123',
        characteristic_uuid: '00000102-1212-efde-1523-785feabcd123' //Time Characteristic
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
}, [reading]);

useEffect(()=>{
    if (repCount > 10-1){
        console.log("DONE WITH PROTOCOL");
        setReading(false);
        return;
    }
}, [repCount])

useEffect(()=>{
    
    // Rep counting logic
    if (dataFile.angle > 170) {
        setDirection("down");
    } else if (dataFile.angle < 100 && direction === "down") {
        setRepCount(prevRepCount => prevRepCount + 1);
        setDirection("up");
    }
} , [dataFile])



const handleButtonClick = (protocol) => {
    setReading(true);
    setSelectedProtocol(protocol);
    setRepCount(0);
    setDirection(null);
};

const toggleExercising = () => {
    setIsExercising((prevIsExercising) => !prevIsExercising);
    setReading((prevReading) => !prevReading);
    setRepCount(0);
    setDirection(null);
    console.log("Reading: ", !reading); // This will log the expected next state
};


const handleBackToMain = () => {
    setReading(false);
    setSelectedProtocol(null);
    setIsExercising(false);
    console.log("Reading stopped:", reading);
};

const renderProtocolContent = () => {
    return(
    <View style={styles.protocolContainer}>
        <Text style={styles.protocolText}>10 Bicep Curls</Text>
        <ProgressBox angle={parseFloat(dataFile.angle)} reps={repCount} />
        <StartButton text="Toggle Exercise" onPress={toggleExercising} />
        <BackToLibraryButton text="Back To Library" onPress={()=>{toggleExercising}} />
    </View>
    )
};


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

const ProgressBox = ({ angle, reps }) => (
    <View style={styles.container}>
    <Text style={styles.progressText}>Progress</Text>
    <Text style={styles.progressValue}>{reps}/10</Text>
    <Text style={styles.angleText}>Angle</Text>
    <Text style={styles.angleValue}>{angle}</Text>
    </View>
);

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

export default Test;
