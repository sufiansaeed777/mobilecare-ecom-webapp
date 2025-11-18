// Example: routes/paymentIntent.js
const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.post('/create-payment-intent', async (req, res) => {
  const { amount } = req.body; // Amount should be in the smallest currency unit (e.g., pence)

  if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount specified.' });
  }

  try {
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'gbp',
      automatic_payment_methods: {
        enabled: true, // Recommended: Let Stripe handle payment method types
      },
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Error creating PaymentIntent:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;