import socket
import asyncio
from typing import Dict, List, Union
import bleak
from bleak import BleakScanner
from bleak import BleakClient
from fastapi import FastAPI, Request
import uvicorn # Server that runs FastAPI


# We want to scan for devices then connect to the MAC address or UUID 
# we specify. After that, we scan for that device's services and access 
# the characteristics of specified service(s)

# Current Issues:
# - feather sense device connection goes in and out

# Bluetooth device data
bluetoothData = {
    "devices": [],
    "device_name": [],
    "uuids": []
}



# Feather Sense UUIDs 
VARS_UUID_CHAR = "00000100-1212-efde-1523-785feabcd123"
ANGLE_UUID_CHAR = "00000101-1212-efde-1523-785feabcd123"
TIME_UUID_CHAR = "00000102-1212-efde-1523-785feabcd123"

# create a global variable of the feathersense device
client = None

# create a global variable of the angle variable for simulator
ANGLE_GLOBAL = 0
MULT_GLOBAL = -1

# API
app = FastAPI() 

# application scans for devices on startup
@app.on_event("startup")
async def startup_event():
    await find_devices()
    await getDevices()

# scanning available devices that contain a feathersense UUID and saving as a list
@app.get("/find_devices")
async def find_devices():
    print("\n--------------------------------------------")
    print("SCANNING FOR DEVICES...")

    bluetoothData["devices"] = ["BLEDevice(None, None)"]
    bluetoothData["device_name"] = ["BLE_Simulator"]
    bluetoothData["uuids"] = [["00000100-1212-efde-1523-785feabcd123", "00000101-1212-efde-1523-785feabcd123", "00000102-1212-efde-1523-785feabcd123"]]

# returns list of available bluetooth devices
@app.get("/devices")
async def getDevices(): 
    print("\n--------------------------------------------")
    print("RETRIEVING SCANNED DEVICES LIST...")
    print(bluetoothData["device_name"], "\n")
    return bluetoothData["device_name"]

# establish connection with selected feather sense device
@app.get("/connect_device")
async def connect_device(device_index: int):
    global client

    print("\n--------------------------------------------")
    print("CONNECTING TO DEVICE...")

    if 0 <= device_index < len(bluetoothData["devices"]):
        device_info = bluetoothData["devices"][device_index]
        device_uuid = bluetoothData["uuids"][device_index]
        client = BleakClient(device_info)

        return {"status" : True}
        

    
# disconnect feathersense device
@app.get("/disconnect_device")
async def disconnect_device():
    global client

    print("\n--------------------------------------------")
    print("DISCONNECTING FROM DEVICE...")

    if client is not None and client.is_connected:
        try:
            await client.disconnect()
            print("Disconnected from the device!")
            return {"status": True}
        
        except Exception as e:
            print("Failed to disconnect: ", {e})
            return {"status": False}
    else:
        print("No device connected!")
        return {"status": True}
    
@app.post("/data")
async def get_data(request: List[Dict[str, str]]):
    print("\n--------------------------------------------")
    print("GETTING DATA...")

    try:
        data = {}

        for req in request:
            
            service_uuid = req.get("service_uuid")
            characteristic_uuid = req.get("characteristic_uuid")
            print("REQUEST UUIDs....................")
            print("Req service: ", service_uuid);
            print("Req characteristic: ", characteristic_uuid);

            value = await update_angle()
            print(value);               
            name = data_name(characteristic_uuid)
            if name:
                data[name] = value
                print(data[name]);
        print(data)
        return data
    except Exception as e:
        print("Failed to get data:", e)
        return {"error": str(e)}
    
async def update_angle() -> int:
    global ANGLE_GLOBAL
    global MULT_GLOBAL
    if ANGLE_GLOBAL > 300 or ANGLE_GLOBAL <= 0:
        MULT_GLOBAL *= -1
    ANGLE_GLOBAL += .1 * MULT_GLOBAL

    return str(ANGLE_GLOBAL)

async def read_data(service_uuid: str, characteristic_uuid: str) -> Union[str, None]:
    try:
        for service in client.services:
            print("COMPARISON\n---------------------")
            print("service_uuid: ", service_uuid);
            print("Service.uuid: ", service.uuid);
            if str(service.uuid) == service_uuid:
                for char in service.characteristics:
                    print("char.uuid: ", char.uuid);
                    print("char_uuid: ", characteristic_uuid);
                    if str(char.uuid) == characteristic_uuid:
                        try:
                            value = await client.read_gatt_char(char)
                            string_value = value.decode()
                            print("Received data: ", string_value)
                            return { string_value}
                        except Exception as e:
                            print("Failed to read data:", e)

        return None

    except Exception as e:
        print("Failed to read data:", e)
        return None
    
# assigns a name to the characteristic
def data_name(characteristic_uuid: str):
    if characteristic_uuid == "00000101-1212-efde-1523-785feabcd123":
        return "angle"
    elif characteristic_uuid == "00000102-1212-efde-1523-785feabcd123":
        return "time"
    else:
        return None

# returns the bluetooth address of the feathersense device
@app.get("/address")
async def get_address():
    print("\n--------------------------------------------")
    print("RETRIEVING DEVICE ADDRESS...")

    global client
    
    if client is not None and client.is_connected:
        device_address = client.address
        print("Device address", device_address)
        return {"device_address": device_address}
    else:
        return {"Address request error": "Device not connected or client is None"}
    
# checking if connection exists with feather sense device
@app.get("/check_connection")
async def check_connection():
    print("\n--------------------------------------------")
    print("CHECKING CONNECTION...")

    global client

    if client is not None and client.is_connected:
        print("Device connected!")
        return {"status": True}
    else:
        print("Device not connected!")
        return {"status": False}
    

if __name__ == "__main__":
    ip_address = socket.gethostbyname(socket.gethostname())
    uvicorn.run(app, host=ip_address, port=8000)