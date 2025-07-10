#include <WiFi.h>
#include <HTTPClient.h>

// Configurações do WiFi
const char* ssid = "NOME_DA_REDE_WIFI";
const char* password = "SENHA_DO_WIFI";

// Configurações do servidor
const char* serverUrl = "http://localhost:5000/api/measurements";

// Configurações do sensor HC-SR04
const int trigPin = 4;
const int echoPin = 2;
const float soundSpeed = 0.034; // cm/µs

void setup() {
  Serial.begin(115200);
  
  // Inicializa o sensor HC-SR04
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  
  // Conecta ao WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Conectando ao WiFi...");
  }
  Serial.println("Conectado ao WiFi");
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    // Mede a distância com o HC-SR04
    float distance = measureDistance();
    Serial.print("Distancia: ");
    Serial.print(distance);
    Serial.println(" cm");
    
    // Envia a medição para o servidor
    sendMeasurement(distance);
    
    // Espera antes da próxima medição
    delay(300000); // 5 minutos
  } else {
    Serial.println("WiFi desconectado. Reconectando...");
    WiFi.begin(ssid, password);
    delay(5000);
  }
}

float measureDistance() {
  // Limpa o trigger
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  
  // Define o trigger para HIGH por 10µs
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  
  // Lê o echoPin e calcula a duração em µs
  long duration = pulseIn(echoPin, HIGH);
  
  // Calcula a distância em cm
  float distance = duration * soundSpeed / 2;
  
  return distance;
}

void sendMeasurement(float distance) {
  HTTPClient http;
  
  // Substitua TANK_ID pelo ID do seu reservatório
  String payload = "{\"tankId\":\"SEU_TANK_ID\",\"distance\":" + String(distance) + "}";
  
  http.begin(serverUrl);
  http.addHeader("Content-Type", "application/json");
  
  int httpResponseCode = http.POST(payload);
  
  if (httpResponseCode > 0) {
    String response = http.getString();
    Serial.println(httpResponseCode);
    Serial.println(response);
  } else {
    Serial.print("Erro ao enviar o POST: ");
    Serial.println(httpResponseCode);
  }
  
  http.end();
}