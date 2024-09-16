// 300 degrees is b10k potentiometer max degrees
// 1023 is max potentiometer value
// Assuming that the values are linear, this should work

#define POTENT_INPUT A5

float DEADZONE = 90-78.34;
float SLOPE = 90/355.00;

// // GOOD
// float DEADZONE = 90 - 82.86; //90 - measured angle at 90 degrees
// float SLOPE = 90/330.00; //Real 90 degrees and potentiometer value

// float SLOPE = 82.86/304.00;
/*
float SLOPE = .2772;
float DEADZONE = 13.041;
*/
void setup() {
  // initialize serial communication at 9600 bits per second:
  Serial.begin(115200);


}

float calcAngle(int potentValue){
  // Simple y = mx+b formula where
  // b = DEADZONE
  // m = SLOPE
  // x = potentValue
  return potentValue  * SLOPE + DEADZONE;
  
}

float prevAngle = 0;
float prevTime = millis();

float newAngle = 0;
float newTime = 0;


// the loop routine runs over and over again forever:
void loop() {
  // read the input on analog pin 0:
  int potent_value = analogRead(POTENT_INPUT);
  newAngle = calcAngle(potent_value);
  newTime = millis();

  // Maybe do potent value instead
  int res =  1000 * abs(newAngle - prevAngle) / (newTime - prevTime);
  // print out the value you read:
  Serial.print(newAngle);
  Serial.print("\t");
  Serial.print(res);
  
  Serial.print("\t POTENT_INPUT: ");
  Serial.print(potent_value);
  Serial.print("\t SLOPE: ");
  Serial.println(SLOPE);
  prevAngle = newAngle;
  prevTime = newTime;
  //delay(1);  // delay in between reads for stability
}