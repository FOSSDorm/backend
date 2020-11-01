const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const users = require("./routers/users/users");
const cookieParser = require("cookie-parser");
require("dotenv").config();
/**
 * Initialise constants
 */
const app = express();
const PORT = process.env.PORT || 8086;
const HOST = process.env.HOSTNAME || "127.0.0.1";

/**
 * Middleware
 *
 */
// app.use(cors({ origin: process.env.WEBSITE_URL }));
app.use(cors());

app.use(
  cookieParser({
    httpOnly: false,
    secure: false,
    signed: true,
    secret: process.env.SECRET_KEYWORD,
    path:"/"
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/users", users);

/**
 * Define API at root path
 * @param {string} path - relative path.
 * @method {string} author - The author of the book.
 */
app.get("/", (req, res) => {
  res.send("Welcome to FOSSDorm!!");
});

/**
 * Listen server request at port number
 * @param {number} PORT - port number
 * @callback
 * @returns {void}
 */
app.listen(PORT, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
