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

### Technical details

### Using

To start the project for the first time:

```bash
$ npm install
$ npm run knex:migrate 
$ npm start
```


### API Use and Test

To test the API, you can use the Insomnia and import the file in `/src/infra/api/Insomnia.json`.