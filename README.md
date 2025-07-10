# H2O Level - Sistema de Monitoramento de Níveis de Água

![Badge em Desenvolvimento](https://img.shields.io/badge/Status-Concluído-brightgreen)

## 📝 Descrição

O **H2O Level** é um sistema de monitoramento de níveis de água em reservatórios domésticos, desenvolvido como Trabalho de Conclusão de Curso (TCC) de Análise e Desenvolvimento de Sistemas no IFBA.

### 💡 Funcionalidades Principais  
✔ Monitoramento em **tempo real** do volume e porcentagem de água  
✔ Histórico das **últimas 100 medições** com visualização em gráfico  
✔ Cálculo de **médias de consumo** (dia atual, 7 dias e 30 dias)  
✔ Alertas configuráveis por **e-mail**  
✔ Interface web responsiva  

## 🛠️ Tecnologias Utilizadas
- **Backend**: Node.js
- **Frontend**: React
- **Hardware**: ESP32 + Sensor Ultrassônico HC-SR04

## 📋 Requisitos de Hardware
Para execução do projeto, serão necessários:
- 1 Sensor Ultrassônico HC-SR04
- 1 Microcontrolador ESP32
- 1 Cabo USB-C para alimentação/comunicação
- 4 Jumpers fêmea-fêmea

## 🚀 Instalação e Configuração

### 1. Pré-requisitos
- Node.js instalado
- Arduino IDE (para programação do ESP32)
- Editor de código (VS Code recomendado)

### 2. Configuração Inicial
1. Faça o download do projeto e extraia em um diretório local.
2. Abra o projeto no editor de código.

### 3. Configurações Importantes

#### Backend (`/backend`)
- `measurementController.js`: Linha 17 - Ajuste a diferença de distância do sensor, substituindo o zero, para o sensor não ficar rente ao limite máximo do reservatório, caso necessário. 
- `emailSender.js`: Linhas 8-9 - Configure e-mail e senha para alertas, caso deseje recebê-los. Uma outra alternativa é criar uma senha de app, para o sistema acessar o e-mail, sem a necessidade de informar a senha real.

#### ESP32 (`/esp32_prog/esp32_prog.ino`)
- Linhas 5-6: Credenciais WiFi
- Linha 9: IP do servidor (substitua "localhost" pelo ip do servidor, caso queira que outros dispositivos da rede acessem o sistema).
- Linhas 12-13: Pinos do sensor (caso não siga o mesmo esquema, devem ser alterados para os pinos escolhidos).
- Linha 44: Intervalo de medição (padrão: 5 minutos). Se desejar aumentar ou diminuir, cada 1 minuto equivale a 60000.
- Linha 75: Substitua "SEU_TANK_ID" pelo id do reservatório, disponível no banco de dados, logo após criar o reservatório, após inicializar o Sistema.

#### Frontend (`/frontend`)
- `ConsumptionAverage.js`: Linha 61 - Altere 3.0 pela capacidade, em litros, do seu reservatório.
- `authService.js`, `measurementService.js`, `tankService.js`: Linha 1 - IP do servidor (substitua "localhost" pelo ip do servidor, caso queira que outros dispositivos da rede acessem o sistema).

### 4. Execução
1. Programe o ESP32 com o arquivo `esp32_prog.ino` via Arduino IDE
2. No editor de código, abra dois terminais (backend e frontend)
3. Em cada terminal, execute:
   ```bash
   npm install
   npm start
4. Aguarde alguns instantes e o Sistema será carregado e exibido no navegador principal.

### 🙌 Agradecimentos
Muito obrigado por utilizar o H2O Level! O Sistema foi desenvolvido com muita dedicação, para facilitar o monitoramento de reservatórios domésticos e oferecer uma alternativa gratuita para quem necessita.

Dúvidas ou sugestões? Entre em contato!
