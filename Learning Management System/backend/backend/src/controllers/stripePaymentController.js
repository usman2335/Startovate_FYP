const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

exports.createSession = async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      ui_mode: "embedded",
      line_items: [
        {
          price: "price_1RZXrNEQHPOtDYyWIRF7ERJv", // Replace with real price ID
          quantity: 1,
        },
      ],
      mode: "subscription",
      return_url: `http://localhost:5174/payment-success?session_id={CHECKOUT_SESSION_ID}`,
    });

    res.send({ clientSecret: session.client_secret });
  } catch (err) {
    console.error("Stripe Session Error:", err.message);
    res.status(500).send({ error: err.message });
  }
};

exports.getSession = async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(
      req.query.session_id
    );

    res.send({
      status: session.status,
      customer_email: session.customer_details.email,
    });
  } catch (err) {
    console.error("Get Session Error:", err.message);
    res.status(500).send({ error: err.message });
  }
};
