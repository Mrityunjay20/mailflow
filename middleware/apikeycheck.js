module.exports = (req, res, next) => {
    const apiKey = req.body.params;
    console.log(apiKey);
  
    // Check if API key is valid
    if (apiKey === '54321') {
      next(); // API key is valid, continue to the next middleware or route handler
    } else {
      res.status(401).json({ error: 'Invalid API key' });
      console.log('invalid api key');
    }
  };