let mongoose = require('mongoose');
let {Tips, User} = require('./models');
const bodyParser = require('body-parser');

mongoose.Promise = global.Promise;

//the closure for the module exporting
module.exports = (app) => {
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  //GET ENDPOINTS-------------------------------------------------------
  //get all tips
  app.get('/', (req,res) => {
      if(req.query.lat !== undefined && req.query.lon !== undefined){
        const lat = parseFloat(req.query.lat);
        const lon = parseFloat(req.query.lon);
        Tips.find({
          location: {
            $near: {
              $geometry: {
                type: 'point',
                coordinates: [lat,lon]
              },
              //in meters
              $maxDistance:500000
            }
          }
        }).then((data) => {
          res.status(200).send(data);
        }).catch(err => console.error(err));
        return res.body;
      }
      Tips.find().then((data) => {
        res.status(200).send(data);
      }).catch(err => console.error(err));
      return res.body;
  });

  //find an individual post
  app.get('/find_post/:id', (req,res)=>{
    Tips.findById(req.params.id).then((val)=>{
      res.send(val);
    });
  });

  //voting endpoint
  app.get('/posts/vote/:id', (req,res)=>{
    Tips.findById(req.params.id).then((tip)=>{
      if(tip && !(tip.points.includes(req.user.username))){
        tip.points.push(req.user.username);
        Tips.findByIdAndUpdate(req.params.id,{$set: tip})
        .then(()=>res.status(204).end())
        .catch(()=>res.status(500).json({message: 'there was a problem with the server on vote.'}));
      }else{
        res.status(403).json({message: "You already voted, cheater!"});
      }
    });
  });

  //POST ENDPOINTS-------------------------------------------------------
  //create post endpoint
  app.post('/posts', (req, res)=>{
      console.log("....here's what's coming in:");
      console.log(req.body);
      let data = new Tips(req.body);
      data.save().then((val) => {
        console.log(val);
        res.status(201).send(val);})
        .catch(err => {
          res.status(400).end();
          console.error(err);
        });
  });

  //DELETE ENDPOINTS-------------------------------------------------------
  app.delete('/posts/:id', (req, res) => {
    Tips
      .findByIdAndRemove(req.params.id)
      .then(() => res.status(204).end())
      .catch(() => res.status(500).json({message: 'Internal server error on delete'}));
  });
};
