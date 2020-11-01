const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config();
const { User } = require("../../db/models/user.model");
const jwt = require("jsonwebtoken");

// router.get("/", (req, res) => {
//   res.send("you have tried get methods");
// });
/**
 * url for handling GitHub OAuth callback and registering user
 */

router.get("/oauth-callback", (req, res) => {
  const client_id = process.env.GITHUB_CLIENT_ID;
  const client_secret = process.env.GITHUB_CLIENT_SECRET;
  const code = req.query.code;
  const website_url=process.env.WEBSITE_URL;
  // get OAuth access_token
  axios({
    method: "post",
    url: `https://github.com/login/oauth/access_token?client_id=${client_id}&client_secret=${client_secret}&code=${code}`,
    headers: {
      accept: "application/json",
    },
  })
    .then((response) => {
      const access_token = response.data.access_token;
      // console.log(access_token);
      // get user detail and check if already registered or not
      axios
        .get("https://api.github.com/user", {
          headers: {
            Authorization: `token ${access_token}`,
          },
        })
        .then((response) => {
          // console.log(response.data);
          // find user from database
          User.findOne({ username: response.data.login })
            .then((user) => {
              if (user) {
                // if user already register, just update its token as github generate new token
                User.updateOne(
                  { username: response.data.login },
                  { token: access_token }
                )
                  .then((result) => {
                    // console.log(result);
                    console.log("already signed up");
                    // generate encrypted token for further authentication

                    let isLoggedIn = "success";

                    // res.cookie("token", access_token);
                    res.redirect(
                      // 301,/
                      `${website_url}/user/${response.data.login}/${isLoggedIn}/${access_token}`
                    );
                  })
                  .catch((err) => {
                    console.error(err);
                    let isLoggedIn = "failure";
                    res.redirect(
                      // 301,
                      `${website_url}/user/${response.data.login}/${isLoggedIn}/${access_token}`
                    );
                  });
              } else {
                // if user not register, create account and save
                let userData = {
                  username: response.data.login,
                  token: access_token,
                };
                const user = new User(userData);
                user
                  .save()
                  .then((data) => {
                    // console.log(data);
                    console.log("New user created");

                    let isLoggedIn = "success";
                    // res.cookie("token", access_token);
                    res.redirect(
                      // 301,
                      `${website_url}/user/${response.data.login}/${isLoggedIn}/${access_token}`
                    );
                  })
                  .catch((error) => {
                    console.error(error);
                    let isLoggedIn = "failure";
                    res.redirect(
                      // 301,
                      `${website_url}/user/${response.data.login}/${isLoggedIn}/${access_token}`
                    );
                  });
              }
            })
            .catch((err) => console.err(err));
        })
        .catch((error) => {
          console.error(error);
        });
    })
    .catch((error) => {
      console.error(error);
    });
});

/**
 * Check if user is logged in or not
 */
router.post("/auth", (req, res) => {
  // console.log(req.body);
  let auth_token = req.body.auth_token;
  if (auth_token == null || auth_token == " " || auth_token == undefined) {
    console.log("user not logged in");
    res.send({ isLoggedIn: false });
  } else {
    // console.log(auth_token);
    User.findOne({ token: auth_token })
      .then((user) => {
        if (user) {
          console.log("user logged in");
          res.send({ isLoggedIn: true, username: user.username });
        } else {
          res.send({ isLoggedIn: false });
        }
      })
      .catch((err) => console.error(err));
  }
});

/**
 * handle logout action
 */
// router.get("/logout", (req, res) => {
//   const website_url=process.env.WEBSITE_URL;
//   console.log("logout");
//   res.clearCookie("token").redirect(`${website_url}`);
// });
module.exports = router;
