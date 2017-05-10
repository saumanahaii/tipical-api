const express = require('express');
const mongoose = require('mongoose');
const {DATABASE, PORT} = require('./config');
const bodyParser = require('body-parser');
const cors = require('cors');
mongoose.Promise = global.Promise;
const app = express();

require('./router')(app);
app.set('view engine', 'ejs');


app.use(bodyParser);
app.use(cors());
app.use(express.static('views'));

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
