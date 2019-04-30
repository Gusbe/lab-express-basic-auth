const express = require('express');
const router = express.Router();
const User = require('./../models/user');
const zxcvbn = require('zxcvbn');
const bcrypt = require('bcrypt');



//GET '/signup
router.get('/signup', (req, res, next) => {
  res.render('signup');
});

//GET '/signup
router.post('/signup', (req, res, next) => {

  const theUsername = req.body.username;
  const thePassword = req.body.password;

  if(theUsername === "" || thePassword === ""){
    
    res.render('signup', {errorMessage: 'Fill all the fields of the form'});
  }
  else{

    User.findOne({ username: theUsername} )
      .then(user => {
        if(!user) {

          if(zxcvbn(thePassword).score < 3){

            res.render('signup', {errorMessage: 'The password choosen is too weak'});
          }
          else{

            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(thePassword, salt);

            User.create({ username: theUsername, password: hashedPassword })
              .then( () => res.redirect('/'))
              .catch( (err) => console.log(err));
          }
        }
        else{

          res.render('signup', {errorMessage: 'The username is already taken'})
        }
      })
      
  }

});

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

module.exports = router;
