# nuplant

Recurring Billing Software

## What it does

Nuplant is a recurring billing software that manages customer's subscriptions.

It is a demo project to show how to use [Herbs](https://herbsjs.org) in a real world application.

## What it does not do

Nuplant does not process payments, it only generate bills. The payment process is done by a third party system.

## Main features

Nuplant magages the following entities and its use cases:

- Products 

- Customers 

- Subscriptions 

- Customer's Subscriptions 

- Price 

- Billing 

## Using

To start the project for the first time:

```bash
$ npm install
$ npm run knex:migrate 
$ npm start
```

## Documentation

View all the use cases and its steps in just one place with Herbs Shelf:

```
http://localhost:3000/herbsshelf
```

## API Testing

To test the API, you can use the Insomnia and import the file in `/src/infra/api/Insomnia.json`.