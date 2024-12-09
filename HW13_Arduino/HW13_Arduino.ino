// Potentiometer
int a0Val = 0;

void setup() {
  Serial.begin(9600);
  while (!Serial) {}
}

void loop() {
  a0Val = analogRead(A0);

  // check if there was a request for data, and if so, send new data
  if (Serial.available() > 0) {
    int byteIn = Serial.read();
    if (byteIn == 0xAB) {
      Serial.println(a0Val);
    }
  }

  delay(2);
}