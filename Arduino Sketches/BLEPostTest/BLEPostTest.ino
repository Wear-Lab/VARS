

#include <bluefruit.h>
#include <BLEService.h>
// BLE STUFF
// OTA DFU service
BLEDfu bledfu; // For firmware updates wirelessly, optional
BLEUart bleuart; // UART, used to send data over ble

#define VARS_UUID_SERV "00000100-1212-efde-1523-785feabcd123"
#define ANGLE_UUID_CHAR "00000101-1212-efde-1523-785feabcd123"

BLEService angleService = BLEService(VARS_UUID_SERV);
BLECharacteristic angleCharacteristic = BLECharacteristic(ANGLE_UUID_CHAR); //  BLERead | BLENotify, sizeof(float));

float currentAngle = 0.0;


void setup(void)
{
  Serial.begin(9600);
  while ( !Serial ) delay(10);   // for nrf52840 with native usb not needed probably?

  Serial.println(F("Adafruit Bluefruit52 Controller App Example"));
  Serial.println(F("-------------------------------------------"));

  Bluefruit.begin(); // creates an instance of the board
  angleService.begin(); // Attach the service to the board

  angleCharacteristic.setProperties(BLERead | BLENotify);
  angleCharacteristic.begin(); // Adds to prev service that was began
  angleCharacteristic.setProperties(BLERead | BLENotify);
  
  //Bluefruit.addService(angleService);

  //Bluefruit.setTxPower(4);   // Check bluefruit.h for supported values


  // To be consistent OTA DFU should be added first if it exists
  //bledfu.begin();

  // Configure and start the BLE Uart service
  //bleuart.begin();

  // Set up and start advertising
  startAdv();
  Serial.println("Started Advertising");

}

void startAdv(void)
{
  // Advertising packet
  Bluefruit.Advertising.addFlags(BLE_GAP_ADV_FLAGS_LE_ONLY_GENERAL_DISC_MODE);
  Bluefruit.Advertising.addTxPower();
  
  // Include the BLE UART (AKA 'NUS') 128-bit UUID
  Bluefruit.Advertising.addService(angleService);
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

/**************************************************************************/
/*!
    @brief  Constantly poll for new command or response data
*/
/**************************************************************************/
void loop(void)
{
  if(Bluefruit.connected()){
    Serial.println("Starting Now!");
    currentAngle = currentAngle + 1 % 20;
    float x = .456789;

    Serial.print("Sending angle: ");
    Serial.println(x);

    char res[16];
    snprintf(res, sizeof(res), ".4f", x);
    
    angleCharacteristic.write(res);
    delay(1000);
    /*
    running = true;
    iterator = 0; // Reset iterator
    unsigned long timeStart = millis(); // Current time as of starting
    */
  }

  delay(1000); // Delay for stability
  
}
