const express = require('express');
const router = express.Router();
const { query, matchedData, validationResult } = require('express-validator');

router.get('/hello', query('person').notEmpty().escape(), (req, res) => {
  const result = validationResult(req);
  if (result.isEmpty()) {
    const data = matchedData(req);
    return res.send(`Hello, ${data.person}!`);
  }

  res.send({ errors: result.array() });
});

module.exports = router;