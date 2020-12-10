# gs-broker

### Overview

엣지 서비스 플랫폼인 'gedge-platform'에서 활용할 수 있는 엣지 서비스와  IoT 디바이스 간의 이종 프로토콜을 통합하여 중개할 수 있는 메시지 브로커이다. 

이 메시지 브로커는 MQTT(Message Queuing Telemetry Transport)와 REST(Representational State Transfer)의 통신 프로토콜의 사용을 지원하며, 해당 프로토콜을 통해 IoT 디바이스 및 애플리케이션과 엣지 서비스 사이의 실시간 통신이 가능하다.



### Architecture

엣지 서비스 플랫폼에서 사용할 수 있는 메시지 브로커의 구조는 다음과 같다. 이는 MQTT 브로커의 개념을 확장시켜 REST 프로토콜 또한 지원할 수 있도록 구성하였다.

![message-broker-architecture](https://user-images.githubusercontent.com/70132781/100324978-4bd5ac00-300b-11eb-87bd-eb0b787d040c.png)

- Message Subscription : 메시지를 구독하는 주체로, 다양한 디바이스에서부터 전달되는 MQTT와 RESTful 프로토콜의 메시지를 구독하는 역할을 한다.
- Message Broker : 전달된 메시지를 gRPC 프로토콜로 변경해 주는 중간 역할을 한다.
- Message Publication : 메시지를 발급하는 주체로, 엣지 서비스에 메시지를 전달하는 역할을 한다.

