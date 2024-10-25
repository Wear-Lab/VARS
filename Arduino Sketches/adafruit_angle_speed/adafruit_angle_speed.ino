// 300 degrees is b10k potentiometer max degrees
// 1023 is max potentiometer value
// Assuming that the values are linear, this should work
#include <bluefruit.h>

#define POTENT_INPUT A4

// float DEADZONE = 30.4;
float DEADZONE = 30.8;

float SLOPE = 0.221556463;

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

// Pass in voltage
float calcAngle(int x){
  // Simple y = mx+b formula where
  // b = DEADZONE
  // m = SLOPE
  // x = potentValue
  float m = SLOPE;

  // TODO idea: Piecewise function??
  if(x  < 458){
  // if(x  < 365){
    m = 0.227316; // HIGHER SLOPE (potent trends show that first half-ish of data needs a higher slope)
  }
  else m = SLOPE; // LOWER SLOPE
  // m=SLOPE;


  return x  * m + DEADZONE;
  
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
  int speed =  1000 * abs(newAngle - prevAngle) / (newTime - prevTime);
  // print out the value you read:
  Serial.print(newAngle);
  Serial.print("\t");
  // Serial.print(speed);
  
  Serial.print("\t\t\t");
  Serial.print("POTENT_INPUT: ");
  Serial.print(potent_value);
  Serial.print("\t SLOPE: ");
  Serial.println(SLOPE, 5);
  prevAngle = newAngle;
  prevTime = newTime;
  //delay(1);  // delay in between reads for stability
}