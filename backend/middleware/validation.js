const validateBookingData = (req, res, next) => {
  const { bookingData, cartItems, totalPrice } = req.body;
  
  if (!bookingData || !cartItems || typeof totalPrice !== 'number') {
    return res.status(400).json({ error: 'Invalid booking data' });
  }

  // Validate date format
  if (isNaN(new Date(bookingData.date).getTime())) {
    return res.status(400).json({ error: 'Invalid date format' });
  }

  // Validate cart items
  if (!Array.isArray(cartItems) || cartItems.some(item => 
    typeof item.cost !== 'number' || !item.name
  )) {
    return res.status(400).json({ error: 'Invalid cart items' });
  }

  next();
};

module.exports = { validateBookingData };