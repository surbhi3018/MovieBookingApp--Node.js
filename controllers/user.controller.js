const db = require("../models");
const jwt = require("jsonwebtoken");
const {atob,btoa}=require("b2a");


const User = db.users;

exports.signUp = (req, res) => {
  console.log(req.body)
  if (!req.body.email && !req.body.password) {
    res
      .status(400)
      .send({ message: "Please provide email and password to continue." });
    return;
  }
  const email = req.body.email;
  const filter = { email: email };
  User.findOne(filter, (err, user) => {
    if (err || user === null) {

      const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: email,
        password: req.body.password,
        role: req.body.role ? req.body.role : "user",
        isLoggedIn: true,
      });
      user
        .save(user)
        .then((data) => {
          res.send(data);
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message || "Some error occurred, please try again later.",
          });
        });
    } else {
      res.status(400).send({
        message: "User Already Exists.",
      });
    }
  });
};
exports.login = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const authHeader = req.headers.authorization.split(" ")[1];
  const uname=unamePwd.split(":")[0];
  const pwd =unamePwd.split(":")[1];

  
  if (!email && !password) {
    res
      .status(400)
      .send({ message: "Please provide email and password to continue." });
    return;
  }
  const filter = { email: email };
  User.findOne(filter, (err, user) => {
    if (err || user === null) {
      res.status(401).send({
        message: "Email or password not correct.",
      });
    } else {


      if (user.password === password) {
        user.isLoggedIn = true;
        const token = jwt.sign({ _id: user._id }, "myprivatekey");
        user.accesstoken = token;
        User.findOneAndUpdate(filter, user,  { useFindAndModify: false })
          .then((data) => {
            if (!data) {
              res.status(404).send({
                message: "Some error occurred, please try again later.",
              });
            } else {
              res.send(data);
            }
          })
          .catch((err) => {
            res.status(500).send({
              message: "Error updating.",
            });
          });
      } else {
        res.status(401).send({
          message: "Email or password not correct.",
        });
      }
    }
  });
};
exports.logout = (req, res) => {
  if (!req.body.id) {
    res.status(400).send({ message: "Please provide user Id." });
    return;
  }

  const id = req.body.id;
  const update = { isLoggedIn: false, accesstoken: "" };

  User.findByIdAndUpdate(id, update)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: "Some error occurred, please try again later.",
        });
      } else res.send({ message: "Logged Out successfully." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating.",
      });
    });
};

exports.getCouponCode = async (req, res) => {
    // if (!req.body.coupens) {
    //   res.status(400).send({ message: "Please provide a valid Coupon." });
    //   return;
    // }

    // const coupens = req.body.coupens;

    // User.findByCoupons(coupens, update)
    //   .then((data) => {
    //     if (!data) {
    //       res.status(404).send({
    //         message: "Some error occurred, please try again later.",
    //       });
    //     } else res.send({ message: "Coupen Passed Succesfully" });
    //   })
    //   .catch((err) => {
    //     res.status(500).send({
    //       message: "Error updating.",
    //     });
    //   });
    console.log("Start fatching coupones")
    const token = req.headers["x-access-token"] || req.headers["authorization"];
    console.log(token)
    User.find({accesstoken: token}).then(function(user){
        if(user[0].coupens)
            res.send(user[0].coupens);
        else
            res.send([])
    });

  };


  exports.bookShow = (req, res) => {
    const token = req.headers["x-access-token"] || req.headers["authorization"];
    console.log(token)
    User.find({accesstoken: token}).then(function(user){
        if(user[0].bookingRequests)
            res.send(user[0].bookingRequests);
        else
            res.send([])
    });

  };