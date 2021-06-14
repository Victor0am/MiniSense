# Cenário do MiniSense

Um produto na área de Internet das Coisas (IoT) e Sensoreamento Remoto está sendo desenvolvido. Trata-se de um serviço para **gerenciar** o estado de dispositivos IoT instalados pelos clientes e **alertar**, através de um aplicativo, sobre situações ou emergências condicionadas aos objetos, mercadorias, ou locais monitorados por esses sensores.

Por exemplo, um cliente pode ser alertado através de seu smartphone sobre o superaquecimento de um equipamento ou produto sensível que estava sendo monitorado através de um sensor previamente instalado e conectado ao serviço. Ao adquirir um sensor compatível com o serviço e instalá-lo, é possível associá-lo à conta de usuário do dono, assim, ele estará disponível no dashboard do app para acompanhamento, sendo informado de quais tipos de dados estão sendo monitorados e seus valores medidos mais recentes. Em outra área do app (fora do escopo deste cenário) seria possível configurar alertas combinando condições sobre os valores medidos, ex: alertar usuário quando a temperatura do  sensor `985bf2cde9b54a54b8fcd3423d89ad89` (rotulado como Freezer do depósito) ultrapassar -4 ºC.

## [API](https://app.swaggerhub.com/apis-docs/Victor0am/MiniSense/1.0.0)

As rotas implementadas e suas informações estão na documentação contida no link acima.

## Rodando localmente

Para rodar a api localmente primeiro clone o repositório com um `git clone`.
Tendo o gerenciador de pacotes npm, use `npm install` para baixar as dependencias.
Caso tenha o gerenciador yarn, use `yarn install` no lugar do npm.

Antes de começar a rodar o a API localmente, é necessário inicializar o banco de dados. Para isso, pode-se usar o script knex:migrate com yarn `yarn knex:migrate` ou com npm `npm run knex:migrate`.

Agora para rodar a API localmente, use o script dev com yarn(`yarn dev`) ou com npm (`npm run dev`)

## Regras e Modelagem de Domínio

O domínio estabelece que cada usuário (`User`) possui um conjunto de gateways sensores (representações de um dispositivo físico de coleta de dados) e tais sensores (`SensorDevice`) podem apresentar diferentes streams de dados coletados (`DataStream`) como temperatura, umidade, pressão atmosférica, luminosidade, etc (`label`), cada um com sua unidade pré-estabelecida (`MeasurementUnit`: **ºC, hPa, %, lux**, etc). Espera-se que para uma stream ativa (`enabled`), novos dados de leitura (`SensorData`), realizadas num determinado instante de tempo, sejam publicadas ao longo da atividade do gateway sensor, de modo que, novos objetos `SensorData` cheguem à stream na ordem de segundos ou minutos. Cada `SensorData` também apresenta a unidade de medida referente a sua *Stream* no momento de seu recebimento. O diagrama abaixo representa parte do modelo conceitual da plataforma IoT proposta:

![](https://hackmd.io/_uploads/SyPYP2DqO.png)

<!--

@startuml
!theme plain
skinparam shadowing false
class User {
 -username : string
 -email : string
}
class SensorDevice {
 -key : string
 -label : string
 -description : string
}
class DataStream {
 -key : string
 -label : string
 -enabled : boolean
}

class MeasurementUnit {
-symbol : string
-description: string
}

class SensorData {
-timestamp : datetime
-value : double
}

User "1" *-> "devices *" SensorDevice : has >
SensorDevice "1" *-> "streams *" DataStream : has >
DataStream "*" -up-> "unit 1" MeasurementUnit
DataStream "1" *-> "*" SensorData : collects >
SensorData "*" -up-> "unit 1" MeasurementUnit
@enduml

-->
