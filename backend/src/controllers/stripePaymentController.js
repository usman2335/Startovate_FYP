// This is your test secret API key.
const stripe = require("stripe")(
  "sk_test_51RZWrsEQHPOtDYyWc12bG8t8ZuGsT3RvvtwJTskKgCCmsP01m1Bx1NRTzrVYe3zjMmow6qUnvhuFduTf2przWHDo00zOOp2L45"
);

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
      return_url: `http://localhost:5173/return?session_id={CHECKOUT_SESSION_ID}`,
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
