const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config();
const { User } = require("../../db/models/user.model");

router.get("/", (req, res) => {
  res.send("you have tried get methods");
});
/**
 * url for handling GitHub OAuth callback
 */

router.get("/oauth-callback", (req, res) => {
  const client_id = process.env.GITHUB_CLIENT_ID;
  const client_secret = process.env.GITHUB_CLIENT_SECRET;
  const code = req.query.code;
  axios({
    method: "post",
    url: `https://github.com/login/oauth/access_token?client_id=${client_id}&client_secret=${client_secret}&code=${code}`,
    headers: {
      accept: "application/json",
    },
  })
    .then((response) => {
      const accessToken = response.data.access_token;
      console.log(accessToken);
      // res.send("You've signed up successfully");
      res.redirect(`/users/signup?token=${accessToken}`);
    })
    .catch((error) => {
      console.error(error);
    });
});

/**
 * After oauth from GitHub, register user
 */
router.get("/signup", (req, res) => {
  const access_token = req.query.token;
  axios
    .get("https://api.github.com/user", {
      headers: {
        Authorization: `token ${access_token}`,
      },
    })
    .then((res) => {
      console.log(res.data);
      let userData = { username: res.data.login, token: access_token };
      if (!User.find({ username: res.data.username })) {
        var user = new User(userData);
        user
          .save()
          .then((data) => console.log(data))
          .catch((error) => console.error(error));
      } else {
        console.log("user already signed up");
      }
    })
    .catch((error) => {
      console.error(error);
    });
});

module.exports = router;
