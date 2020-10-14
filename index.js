/**
 * import libraries/packages/functions 
 */
const express = require('express')
const bodyParser=require('body-parser')
const cors=require('cors')
require('dotenv').config()
/**
 * Initialise constants
 */
const app = express();
const PORT = process.env.PORT || 8086 ;
const HOST = process.env.HOSTNAME;

/**
 * Middleware
 *
*/
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

/**
 * Define API at root path
 * @param {string} path - relative path.
 * @method {string} author - The author of the book.
 */
app.get('/api', (req, res) => {
  res.send('FOSSDorm')
});

/**
 * Listen server request at port number
 * @param {number} PORT - port number
 * @callback
 * @returns {void}
 */
app.listen(PORT, () => {
  console.log(`Server running on http://${HOST}:${PORT}`)
});