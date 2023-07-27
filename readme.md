# nuplant

General Recurring Billing System

# Domain

### What it does

Recurring Billing System is a software that manages customer's subscriptions. Different from one-time billing, recurring billing is a payment model that allows customers to pay for products or services on a pre-scheduled basis.

Nuplant is also a demo project to show how to use [Herbs](https://herbsjs.org) in a real world application.

### What it does not do

Nuplant does not process payments, it only generate bills. The payment process should be done by a third party system.

### Main features

**Products**: The ideia it to keep the basic information about the product, like name, description. For a detailed information about the product, it should be stored in a third party system.
<br><br>
**Customers**: The ideia it to keep the basic information about the customer, like name, email, etc. For a detailed information about the customer, it should be stored in a third party system.
<br><br>
**Subscriptions**: Manage subscriptions names and products prices for each subscription. A subscription can have multiple products.
<br><br>
**Customers Subscriptions**: Manage the subscriptions for each customer. A customer can have more than one subscription.
<br><br>
**Billing Cycles**: Manage the billing cycles for each customer subscription. A billing cycle is a period of time that the customer will be charged for the subscription. For example, a monthly subscription will have a billing cycle of 30 days. 


### Documentation

View all the use cases and its steps in just one place with Herbs Shelf:

```
http://localhost:3000/herbsshelf
```

## Herbs Demo - Technical Overview

### Intro

This project is a demo of how to use [Herbs](https://herbsjs.org) in a real world application. In order to do that, we are using a domain that is well known by everyone: Recurring Billing System. On some use cases we try to make things a bit more complex to show how to deal with it using Herbs.

### Using

To start the project for the first time:

```bash
$ npm install
$ npm run docker:run
$ npm run db:reset
$ npm start
```

### API Use and Test

It is possible to test the API using [Insomnia](https://insomnia.rest/) importing the file in: `/src/infra/api/Insomnia.json`

To test authenticated routes, use "Manage Enviroments" in Insomnia to set the JWT token.

To generate a JWT token, use [jwt.io](https://jwt.io/) with the following payload:

```json
{
    "userId": "37d2d6fc-0a26-496a-b97b-e48dad2ea25f1",
}
```

And the correct JWT secret. Be careful to not expose production secrets.
