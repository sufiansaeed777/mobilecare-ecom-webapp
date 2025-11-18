// routes/stripeCheckout.js
const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Set your domain—if no environment variable is provided, it falls back to your live domain.
const YOUR_DOMAIN = process.env.YOUR_DOMAIN || 'https://mobilecare.org.uk';

// POST /api/create-checkout-session
router.post('/create-checkout-session', async (req, res) => {
  try {
    // For demonstration, we’re using one hard-coded line item.
    // In a real app, update this with details from your database or request body.
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'], // Apple Pay/Google Pay are automatically available if configured
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: { name: 'Your Repair Service' },
            unit_amount: 1000, // Amount in pence (i.e. £10)
          },
          quantity: 1,
        },
      ],
      success_url: `${YOUR_DOMAIN}/success`,
      cancel_url: `${YOUR_DOMAIN}/cancel`,
    });

    // Return the Checkout Session URL so the frontend can redirect the customer.
    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
