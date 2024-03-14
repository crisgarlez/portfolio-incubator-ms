# Portfolio Incubator Microservice

![Cover Image](./public/images/incubator-ms.svg)

This is the microservice responsible for handling monster-incubation data in the application.

## Installation

1. Clone this repository to your local machine:

```
git clone https://github.com/crisgarlez/portfolio-incubator-ms.git
```

2. Install project dependencies:

```
cd portfolio-monsters-ms
npm install
```

## Configuration

Before running the microservice, you need to configure some environment variables. Create a .env file at the root of the project and set the following variables:

```
PORT=3004
DATABASE_URL=
KAFKA_BROKER=
KAFKA_CLIENT_ID=
KAFKA_CONSUMER_ID=
MONSTER_TYPES_ENDPOINT=
```

## Usage

To run the microservice, simply execute the following command:

```
npm start
```
