// payment-server.js
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Add your key in .env

const app = express();
app.use(express.static('public')); // For frontend
app.use(express.json());

app.post('/create-checkout-session', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Premium Access to My GitHub Repo Tool',
              description: 'One-time payment for lifetime access',
            },
            unit_amount: 1999, // $19.99
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'https://yourdomain.com/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://yourdomain.com/cancel',
    });

    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log('Payment server running on http://localhost:3000'));
