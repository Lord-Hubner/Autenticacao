const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {

  console.log(req.user.profile)
  res.render('index', { title: 'Bem vindo!', userProfile: parseInt(req.user.profile)})
 
});

module.exports = router;
