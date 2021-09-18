

#include <DHT.h>


#define DHTPIN 4
#define DHTTYPE DHT22

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(9600);
}

char *ftoa(char *a, double f, int precision) {
  long p[] = {0,10,100,1000,10000,100000,1000000,10000000,100000000};

  char *ret = a;
  long heiltal = (long)f;
  itoa(heiltal, a, 10);
  while (*a != '\0') a++;
  *a++ = '.';
  long desimal = abs((long)((f - heiltal) * p[precision]));
  itoa(desimal, a, 10);
  return ret;
}

void loop() {
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();
  char temp[255], hum[255];
  Serial.print(ftoa(temp, temperature, 2));
  Serial.print(", ");
  Serial.println(ftoa(hum, humidity, 2));
  delay(60000);
}
