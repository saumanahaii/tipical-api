const express = require('express');
const mongoose = require('mongoose');
const {DATABASE, PORT} = require('./config');
const bodyParser = require('body-parser');
const cors = require('cors');
mongoose.Promise = global.Promise;
const app = express();
let {Tips, User} = require('./models');

app.use(cors());

app.use('/app',express.static('views'));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", req.get('origin'));
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


require('./router')(app);


let server;

function startServer(databaseUrl=DATABASE, port=PORT) {
  console.log(databaseUrl);
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        console.log("test");
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);

        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}

function stopServer() {
  return mongoose.disconnect().then(() => {
     return new Promise((resolve, reject) => {
       console.log('Closing server');
       server.close(err => {
           if (err) {
               return reject(err);
           }
           resolve();
       });
     });
  });
}
if(require.main === module){startServer().catch(err=>console.error("There's an error there, "+err));}
module.exports = {app,startServer,stopServer};
