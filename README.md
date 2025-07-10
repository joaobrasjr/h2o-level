Sistema H2O Level

O H2O Level é um sistema de monitoramento de níveis de água em reservatórios domésticos.

O sistema foi desenvolvido em Node.js e React, como Trabalho de Conclusão de Curso (TCC) de Análise e Desenvolvimento de Sistemas, no IFBA.
Foi concebido para ser executado no localhost e permitir o monitoramento de um reservatório por residência.

Além do Sistema, serão necessários os seguintes hardwares, para execução do projeto:

1 Sensor Ultrassônico HC-SR04.
1 Microcontrolador ESP32.
1 Cabo USB-C para alimentação e/ou comunicação com a ArduinoIDE.
4 Jumpers fêmea-fêmea.

Instruções de uso:

1) Faça o download do diretório e extraia o conteúdo em qualquer diretório do computador.
2) Carregue o diretório num editor de código, como por exemplo o VS Code.
3) Após isso, faça as seguintes modificações nos arquivos listados:

Pasta backend

measurrementController.js
Linha 17 - Caso não queira deixar o sensor rente ao limite do reservatório, substitua o zero pela diferença de distância do sensor ao limite do reservatório.

emailSender.js
Linhas 8 e 9 - Caso deseje receber os alertas de nível do reservatório, por e-mail, altere as linhas inserindo seu e-mail e senha (para melhorar a segurança e não expor a sua senha, crie uma senha de app. Esta senha servirá apenas para o sistema acessar o seu e-mail, sem precisar fornecer sua senha real).

Pasta esp32_prog

esp32_prog.ino
Linha 5 - Insira o nome da sua rede Wi-Fi.
Linha 6 - Insira a senha da sua rede Wi-Fi.
Linha 9 - Caso queira acessar o Sistema por outro dispositivo conectado a rede Wi-Fi, substitua "localhost" pelo ip do computador que está rodando o servidor (A máquina onde você descompactou a pasta dos arquivos).
Linha 12 - Caso não use o pino 4 do ESP32 para conectar o pino “Trigger” do sensor, altere para o número do pino escolhido.
Linha 13 - Caso não use o pino 2 do ESP32 para conectar o pino “Echo” do sensor, altere para o número do pino escolhido.
Linha 44 - O sensor está configurado para realizar medições a cada 5 min. Para alterar, basta adicionar ou subtrair, ao valor presente, 60000, que equivale a 1 minuto.
Linha 75 - Substitua "SEU_TANK_ID" pelo id do reservatório, disponível no banco de dados, logo após criar o reservatório, após inicializar o Sistema.

Pasta frontend

ConsumptionAverage.js
Linha 61 - Altere 3.0 pela capacidade, em litros, do seu reservatório.

authService.js
measurementService.js
tankService.js
Nas linhas 1 de todos esses arquivos, caso deseje acessar o Sistema por outros dispositivos na rede, substitua "localhost" pelo ip do computador que está rodando o servidor (A máquina onde você descompactou a pasta dos arquivos).

4) esp32_prog deve ser inserido no microcontrolador ESP32 através de uma IDE, como a ArduinoIDE.
5) No VS Code ou outro editor de código, abra dois terminais: um selecionando a pasta backend e outro, na frontend.
6) Digite em ambos os terminais o comando "npm install". Após inserir o comando, sem as aspas, e clicar em Enter, todas as dependências serão instaladas para o Backend e Frontend.
7) Digite "npm start", em ambos os terminais, para executar o servidor backend e o frontend. Aguarde alguns instantes e o Sistema será carregado e exibido no navegador principal.

O Sistema possibilita o monitoramento do reservatório em tempo real, exibindo o volume total, o volume atual e a porcentagem do reservatório. Também permite visualizar o histórico das 100 últimas medições e a exibição destas num gráfico. Possibilita também o acesso às médias de consumo do dia atual, últimos 7 dias e últimos 30 dias.

Muito obrigado por usar o H2O Level e espero que ele supra a sua necessidade!
