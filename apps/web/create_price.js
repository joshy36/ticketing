const stripe = require('stripe')(
  'sk_test_51O7hLgFsne4uARGMEwo2YrJQsPCMrnwXTENntV6wj1OAUEngRRW6Zvtt0I0P2JXXOYFceOxRJMYTSzhJn3Y7Un8u00o6ZEumaE',
);

stripe.products
  .create({
    name: 'Starter Subscription',
    description: '$12/Month subscription',
  })
  .then((product) => {
    stripe.prices
      .create({
        unit_amount: 1200,
        currency: 'usd',
        recurring: {
          interval: 'month',
        },
        product: product.id,
      })
      .then((price) => {
        console.log(
          'Success! Here is your starter subscription product id: ' +
            product.id,
        );
        console.log(
          'Success! Here is your starter subscription price id: ' + price.id,
        );
      });
  });
