const bcrypt = require('bcryptjs');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

exports.CreateUser = (req, res, next) => {
  console.log(req.body.password);
  bcrypt.hash(req.body.password, 10)
  .then(hash => {
    console.log(hash);
    const user = new User(
      {email : req.body.email,
      password : hash}
    );

    user.save()
    .then(result => {
      console.log("Use Created");
      console.log(result);
      res.status(201).json({
        message : 'User Created',
        result : result
      });
    })
    .catch(err => {
      console.log(err);
      return res.status(500).json({
        message : 'User Already Exists',
        error : err
      })
    })
  });
}

exports.userLogin = (req, res, next) => {
  console.log(req.body.email);
  let fetchedUser;
  User.findOne({email : req.body.email})
    .then(user => {
      if(!user) {
        return res.status(401).json({
          message : 'Invalid Authentication Credentials'
        });
      }
      fetchedUser = user;

      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {

      if(!result) {
        console.log("Password Mismatch");
        return res.status(401).json({
          message : 'Invalid Authentication Credentials'
        });
      }

      const token = jwt.sign({email : fetchedUser.email, userId : fetchedUser._id}, "blogtestprojectbyyasirurandikausingangular", {expiresIn:"1h"});

      res.status(200).json({
        token : token,
        expiresIn : 3600,
        userId : fetchedUser._id
      });
    })
    .catch(err => {
      res.status(401).json({
        error : err,
        message : 'Invalid Authentication Credentials'
      })
    })
  }
