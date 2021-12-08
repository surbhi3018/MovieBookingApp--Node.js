
const auth = require("../middleware/auth"); 

module.exports = app => {
  const users = require("../controllers/user.controller");

    var router = require("express").Router();

    router.post("/login", users.login);

    router.post("/sign-up", users.signUp);

    router.post("/logout", auth, users.logout);

    router.get("/getCouponCode", auth, users.getCouponCode);

    router.get("/bookShow", auth, users.bookShow);

    app.use('/api', router);
  };