import axios from 'axios';
import LocalHost from '../../data/LocalHost';

ipAddress = LocalHost.ipAddress;

// Function to fecth the data from the arduino
export const fetchData = async() => {
    try {
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
        return await response.data;
    }
    catch (error) {
        console.error('Fetch data failed:', error);
    }
}