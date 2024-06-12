
#include <bluefruit.h>
#include <BLEService.h>

#define VARS_UUID_SERV "00000100-1212-efde-1523-785feabcd123" // Service for sending data to server
#define POT_UUID_CHAR "00000101-1212-efde-1523-785feabcd123" // Characteristic for Potentiometer value 
#define TIME_UUID_CHAR "00000102-1212-efde-1523-785feabcd123" // Characteristic for time passed

BLEService varsService = BLEService(VARS_UUID_SERV);
BLECharacteristic potentiometerChar = BLECharacteristic(POT_UUID_CHAR); 
BLECharacteristic timeChar = BLECharacteristic(TIME_UUID_CHAR);


#define sensorPin A3
#define bufferMax 1000

bool running = false;
int buffer[bufferMax];
int timestamps[bufferMax];
int iterator = 0;
unsigned long timeStart = 0; // Use unsigned long for time variables

void setup() {
  Serial.begin(115200);
  Serial.println("Hello World");
  setupBLE();
  timeStart = millis(); // Initialize timeStart at the beginning
}

void loop() {
  if(Bluefruit.connected()){
    Serial.println("Connected");
    iterator = 0;
    unsigned long timeStart = millis(); // Current time
    while(iterator < bufferMax){

      char potentiometer_res[16]; //python server accepts utf-8 strings, these are the values we are sending
      char time_res[16];

      int sensorValue = analogRead(sensorPin);
      unsigned long timeDelta = millis() - timeStart; // current time

      snprintf(potentiometer_res, sizeof(potentiometer_res), ".2f", sensorValue); // Formats the numbers and turns them into strings
      snprintf(time_res, sizeof(time_res), ".2f", timeDelta);


      Serial.printf("iterator: \t%d, potentiometer_res: \t%s, time_res: \t%s\n", iterator, potentiometer_res, time_res);
      // When we update these characteristics, they will go to the Python backend
      potentiometerChar.write(potentiometer_res);
      timeChar.write(time_res);
    }
  }
  else{
    Serial.println("BT not connected");
  }

}

void setupBLE(){

  Serial.println(F("Adafruit Bluefruit52 Controller App Example"));
  Serial.println(F("-------------------------------------------"));

  Bluefruit.begin();
  varsService.begin();

  potentiometerChar.setProperties(BLERead | BLENotify);
  potentiometerChar.begin(); // Adds to prev service that was began

  timeChar.setProperties(BLERead | BLENotify);
  timeChar.begin(); // Adds to prev service that was began


  
  //Bluefruit.addService(varsService);

  //Bluefruit.setTxPower(4);   // Check bluefruit.h for supported values


  // To be consistent OTA DFU should be added first if it exists
  //bledfu.begin();

  // Configure and start the BLE Uart service
  //bleuart.begin();

  // Set up and start advertising
  startAdv(); // Will advertise the VARS service, which will send the potentiometer value and the time value
  Serial.println("Started Advertising");

}


void startAdv(void)
{
  // Advertising packet
  Bluefruit.Advertising.addFlags(BLE_GAP_ADV_FLAGS_LE_ONLY_GENERAL_DISC_MODE);
  Bluefruit.Advertising.addTxPower();
  
  // Include the BLE UART (AKA 'NUS') 128-bit UUID
  Bluefruit.Advertising.addService(varsService);
  //Bluefruit.Advertising.addService(bleuart);

  // Secondary Scan Response packet (optional)
  // Since there is no room for 'Name' in Advertising packet
  Bluefruit.ScanResponse.addName();

  /* Start Advertising
   * - Enable auto advertising if disconnected
   * - Interval:  fast mode = 20 ms, slow mode = 152.5 ms
   * - Timeout for fast mode is 30 seconds
   * - Start(timeout) with timeout = 0 will advertise forever (until connected)
   * 
   * For recommended advertising interval
   * https://developer.apple.com/library/content/qa/qa1931/_index.html   
   */
  Bluefruit.Advertising.restartOnDisconnect(true);
  //Bluefruit.Advertising.setInterval(32, 244);    // in unit of 0.625 ms
  //Bluefruit.Advertising.setFastTimeout(30);      // number of seconds in fast mode
  Bluefruit.Advertising.start(0);                // 0 = Don't stop advertising after n seconds  
}


void sendToPython(unsigned long duration){

    Serial.print("duration (ms): ");
    Serial.println(duration); // Use println to move to a new line
  
    delay(5000); // Simulate a delay to process or send the data elsewhere
    return;
}

