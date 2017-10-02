/* INCLUDES */
const router = require('express').Router();
const async = require('async');
const Snapshot = require('../models/snapshot');
const User = require('../models/user');
const request = require('request'); // for making API calls
const apiKey = ('54DT686OZ7VOWX8K&datatype=csv');

const logger           = require('morgan'),
      busboyBodyParser = require('busboy-body-parser')

/* INDEX ROUTE */
router.get('/', (req, res, next) => {
  if (req.user) {
    Snapshot.find({ owner: req.user._id }, function(err, snapshots) {
      if(err) {"You have not saved any snapshots"}
      User.find({}, function (err, users) {
        if(err) {"You must sign-in"}
        res.render('main/home', { snapshots: snapshots, users: users });
      });
    });
  }else{res.redirect('/login');}
});

/* ADD SNAPSHOT ROUTE */
router.route('/add-new-snapshot')
  .get((req, res, next) => {
  })
  
  .post((req, res, next) => {
    async.waterfall([
      function(callback) {
        var snapshot = new Snapshot();
        var APIcall = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=" + req.body.snapshot_ticker + '&apikey=' + apiKey;
        console.log(APIcall);
        request.get(APIcall, function(err, res){
          // snapshot.owner = req.user._id
          snapshot.ticker = req.body.snapshot_ticker.toUpperCase();
          snapshot.data = res.body;
          newsnapshot = snapshot.data.split('\n').map(function(line) {
            var columns = line.split(',');
            columns.splice(5, 5); // remove volume for testing
            return columns;
          }).join('\n');
          snapshot.data = newsnapshot
          snapshot.data = snapshot.data.replace(/(?:\\[r]|[\r]+)+/g, ''); // Parse data for frontend
          //TODO move save to seperate route
          snapshot.save(
            function(err) {
              callback(err, snapshot);
          });
        });
      },

      function(snapshot, callback) {
        res.redirect('/snapshot/' + snapshot._id);
      }
    ]);
  });

/* GET SNAPSHOT ROUTE */
  router.get('/snapshot/:id', (req, res, next) => {
  Snapshot.findOne({ _id: req.params.id })
    .populate('owner')
    .exec(function(err, snapshot) {
      res.render('main/snapshot', { snapshot: snapshot });
    });
});

/* SAVE SNAPSHOT ROUTE */
router.get('/save/:id', (req, res, next) => {
  Snapshot.findOne({_id: req.params.id}, function(err, snapshot) {
  if (err) throw err;
  snapshot.owner = req.user._id;
  snapshot.save(
    function(err) {
      console.log(err);
    });
  res.redirect('/');
  });
});

/* DELETE SNAPSHOT ROUTE */
router.get('/delete/:id', (req, res, next) => {
  Snapshot.findOneAndRemove({ _id: req.params.id }, function (err, snapshot){
        res.redirect('/');
      });
});

module.exports = router;