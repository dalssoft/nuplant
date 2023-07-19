exports.seed = async function (knex) {
    // Deletes ALL existing entries
    await knex('users').del()
    await knex('users').insert([

        // admin
        {
            id: '27d2d6fc-0a26-496a-b97b-e48dad2ea25f',
            permissions: [
                // Product
                'CreateProduct', 'DeleteProduct', 'FindAllProduct', 'FindProduct', 'UpdateProduct',

                // Customer
                'CreateCustomer', 'DeleteCustomer', 'FindAllCustomer', 'FindCustomer', 'UpdateCustomer',

                // Price
                'CreatePrice', 'DeletePrice', 'FindAllPrice', 'FindPrice', 'UpdatePrice',

                // Subscription plan
                'CreateSubscriptionPlan', 'DeleteSubscriptionPlan', 'FindAllSubscriptionPlan', 'FindSubscriptionPlan', 'UpdateSubscriptionPlan',

                // Customer subscription
                'CreateCustomerSubscription', 'DeleteCustomerSubscription', 'FindAllCustomerSubscription',
                'FindCustomerSubscription', 'UpdateCustomerSubscription', 'DeleteCustomerSubscription', 'FindCustomerSubscriptionByCustomer',

                // Billing cycle
                'CreateBillingCycle', 'DeleteBillingCycle', 'FindAllBillingCycle', 'FindBillingCycle', 'UpdateBillingCycle', 'PayBillingCycle',
            ]
        },

        // read only
        {
            id: '37d2d6fc-0a26-496a-b97b-e48dad2ea25f',
            permissions: [
                // Product
                'FindAllProduct', 'FindProduct',

                // Customer
                'FindAllCustomer', 'FindCustomer',

                // price
                'FindAllPrice', 'FindPrice',

                // subscription plan
                'FindAllSubscriptionPlan', 'FindSubscriptionPlan',

                // customer subscription
                'FindAllCustomerSubscription', 'FindCustomerSubscription', 'FindCustomerSubscriptionByCustomer',

                // billing cycle
                'FindAllBillingCycle', 'FindBillingCycle',
            ]
        }
    ])
}
