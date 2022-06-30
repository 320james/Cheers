const express = require('express');
const bodyParser = require('body-parser');

// Connect database
// var mysqlPool = require("./mysqlPool");
// mysqlPool.getConnection(function(err, mclient) {
//     if (err) {
//       throw err;
//     }
//     let sql = "SELECT user_name FROM users";
//     mclient.query(sql, (err, resp) => {
//         if (err) {
//             throw err;
//         }
//         console.log(resp);
//     })
// });


const app = express();

// Init Middleware
app.use(express.json({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hi there');
});

// Define Routes
app.use('https://cheers-application.herokuapp.com/api/users', require('./routeshttps://cheers-application.herokuapp.com/api/users'));   // makes https://cheers-application.herokuapp.com/api/users pertain to '/' in users.js
app.use('https://cheers-application.herokuapp.com/api/auth', require('./routeshttps://cheers-application.herokuapp.com/api/auth'));
app.use('https://cheers-application.herokuapp.com/api/posts', require('./routeshttps://cheers-application.herokuapp.com/api/posts'));
app.use('https://cheers-application.herokuapp.com/api/drink_categories', require('./routeshttps://cheers-application.herokuapp.com/api/drink_categories'));
app.use('https://cheers-application.herokuapp.com/api/recipes', require('./routeshttps://cheers-application.herokuapp.com/api/recipes'));
app.use('https://cheers-application.herokuapp.com/api/messages', require('./routeshttps://cheers-application.herokuapp.com/api/messages'));
app.use('https://cheers-application.herokuapp.com/api/ingredients', require('./routeshttps://cheers-application.herokuapp.com/api/ingredients'));
app.use('https://cheers-application.herokuapp.com/api/uses', require('./routeshttps://cheers-application.herokuapp.com/api/uses'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('Listening on port ' + PORT);
});

// mysql://ba1eb85c79ea5f:f85ccbfe@us-cdbr-east-05.cleardb.net/heroku_8cc1c05f95fd889?reconnect=true