var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var request = require('request');

//update with user generated auth token
var auth = '';


/****************************************************************                                          
 * functions to reference date parameters in code throughout file*
 ****************************************************************/

var date = new Date();
var endMonth  = date.getMonth();
var endDay = date.getDate();
var endYear = date.getFullYear();

//sets end date parameter for calls to API
//end date in all calls is 7 days from the current date
var endDate = endYear + '-' + endMonth + '-' + endDay;

var d = new Date();
d.setDate(d.getDate() - 7);
var startMonth = d.getMonth();
var startDay = d.getDate();
var startYear = d.getFullYear();

//sets start date parameter for calls to API 
//start date is set to most current date
var startDate = startYear + '-' + startMonth + '-' + startDay;


//ensures that start and end date is formatted properly as API  calls require
function fixEndMonth() {
    endMonth = endMonth + 1;
    if (endMonth < 10) {
        endMonth = "0" + endMonth;
    } else {
        return endMonth;
    }
}

function fixEndDay() {
    if (endDay < 10) {
        endDay = "0" + endDay;
    } else {
        return endDay;
    }
}


function fixStartMonth() {
    startMonth = startMonth + 1;
    if (startMonth < 10) {
        startMonth = "0" + startMonth;
    } else {
        return startMonth;
    }
}

function fixStartDay() {
    if (startDay < 10) {
        startDay = "0" + startDay;
    } else {
        return startDay;
    }
}


fixEndMonth();
fixEndDay(); 
fixStartDay();
fixStartMonth();




/**************************************                                    
 * Collects gender data from monitor  *
 **************************************/

var genderCollect = function(callback) {

  var monitorId = '';
  var genderUrl = ('https://forsight.crimsonhexagon.com/api/monitor/demographics/gender?id=' + monitorId + '&start=' + startDate + '&end=' + endDate + '&auth=' + auth);



  var male = [];
  var female = [];
  var gender = {};


  request({
    url: genderUrl,
    method: 'GET'
  }, function(err, response, body) {
    if (!err && response.statusCode === 200) {
      var data = JSON.parse(body);
      for (var i = 0; i < data.genderCounts.length; i++) {
        male.push(data.genderCounts[i].genderCounts.percentFemale);
        female.push(data.genderCounts[i].genderCounts.percentMale);
      }
      gender = [male, female];
    }
    callback(gender);
  });
}

//sends data to client on connection
function logArray(gender) {
  io.on('connection', function(socket) {
    socket.emit('gender', gender);
  });
}

genderCollect(logArray);


/******************************************************                                                    
 * collects total activity metrics from facebook SAMs *
 ******************************************************/                                                   

var fbCollect = function(callback) {

  var monitorId = '';
  var facebookUrl = ('https://forsight.crimsonhexagon.com/api/monitor/facebook/totalactivity?id=' + monitorId + '&start=' + startDate + '&end=' + endDate + '&auth=' + auth);


  var likes = [];
  var comments = [];
  var shares = [];
  var totalActivity = {};

  request({
    url: facebookUrl,
    method: 'GET'
  }, function(err, response, body) {
    if (!err && response.statusCode === 200) {
      var data = JSON.parse(body);
      for (var i = 0; i < data.dailyResults.length; i++) {
        likes.push(data.dailyResults[i].admin.likesOnAdmin);
        comments.push(data.dailyResults[i].admin.commentsOnAdmin);
        shares.push(data.dailyResults[i].admin.sharesOnAdmin);
      }
      totalActivity = [likes, comments, shares];
    }
    callback(totalActivity);
  });
}


//sends data to client on connection
function logFb(totalActivity) {
  io.on('connection', function(socket) {
    socket.emit('totalActivity', totalActivity);
  });
}

fbCollect(logFb);


/**************************************************                                                
 * function to collect data from results endpoint *
 **************************************************/

var monitorResults = function(callback) {

  var monitorId = '';
  var resultsUrl = ('https://api.crimsonhexagon.com/api/monitor/results?id=' + monitorId + '&start=' + startDate + '&end=' + endDate + '&auth=' + auth);

  var neutralProportion = [];
  var positiveProportion = [];
  var negativeProportion = [];
  var resultsData = {};


  request({
    url: resultsUrl,
    method: 'GET'
  }, function(err, response, body) {
    if (!err && response.statusCode === 200) {
      var data = JSON.parse(body);
      for (var i = 0; i < data.results.length; i++) {
        neutralProportion.push(data.results[i].categories[0].proportion);
        positiveProportion.push(data.results[i].categories[1].proportion);
        negativeProportion.push(data.results[i].categories[2].proportion);
      }
      resultsData = [neutralProportion, positiveProportion, negativeProportion]
    }
    callback(resultsData);
  });
}

//sends data to client on connection
function sendResultsData(resultsData) {
  io.on('connection', function(socket) {
    socket.emit('resultsChart', resultsData);
  });
}

monitorResults(sendResultsData);


/**************************************
 * function to collect volume metrics * 
 **************************************/

var twitterVolume = function(callback) {

  var monitorId = '';
  var volumeUrl = ('https://forsight.crimsonhexagon.com/api/monitor/dayandtime?id=' + monitorId + '&start=' + startDate + '&end=' + endDate + '&auth=' + auth);

  var weeklyVolume = [];
  var weeklyObject = {};

  request({
    url: volumeUrl,
    method: 'GET'
  }, function(err, response, body) {
    var weeklyVolume = [];
    if (!err && response.statusCode === 200) {
      var data = JSON.parse(body);
      for (var i = 0; i < data.volumes.length; i++) {
        weeklyVolume.push(data.volumes[i].numberOfDocuments);
      }
      weeklyObject = weeklyVolume;
    }
    callback(weeklyObject);
  });
}


//sends data to client on connection
function sendVolume(weeklyObject) {
  io.on('connection', function(socket) {
    socket.emit('weeklyVolume', weeklyObject);
  });
}

twitterVolume(sendVolume);


/****************************************                                      
 * function to gather instagram metrics *
 ****************************************/

var instagramActivity = function(callback) {

    var monitorId = '';
    var instagramUrl = ('https://forsight.crimsonhexagon.com/api/monitor/instagram/totalactivity?id=' + monitorId + '&start=' + startDate + '&end=' + endDate + '&auth=' + auth);


      var instaLikes = [];
      var instaComments = [];
      var instaData = {};

      request({
        url: instagramUrl,
        method: 'GET'
      }, function(err, response, body) {
        if (!err && response.statusCode === 200) {
          var data = JSON.parse(body);
          var instaLikes = [];
          var instaComments = [];
          for (var i = 0; i < data.dailyResults.length; i++) {
            instaLikes.push(data.dailyResults[i].admin.likesOnAdmin);
            instaComments.push(data.dailyResults[i].admin.commentsOnAdmin);
          }
          instaData = [instaLikes, instaComments];
        }
        callback(instaData);
      });
    }


    function sendInsta(instaData) {
      io.on('connection', function(socket) {
        socket.emit('instaMetrics', instaData);
      });
    }

    instagramActivity(sendInsta);


/************************************************************                                                          
 * function to collect total enagement metrics from twitter *
 ************************************************************/                                            

var twitterResults = function(callback) {


  var monitorId = '';
  var twitterUrl = ('https://forsight.crimsonhexagon.com/api/monitor/twittersocial/totalengagement?id=' + monitorId + '&start=' + startDate + '&end=' + endDate + '&auth=' + auth);



  var tweetMentions = [];
  var tweetReplies = [];
  var tweetRetweets = [];
  var tweetCollection = {};

  request({
    url: twitterUrl,
    method: 'GET'
  }, function(err, response, body) {
    if (!err && response.statusCode === 200) {
      var data = JSON.parse(body);
      for (var i = 0; i < data.dailyResults.length; i++) {
        tweetMentions.push(data.dailyResults[i].mentions);
        tweetReplies.push(data.dailyResults[i].replies);
        tweetRetweets.push(data.dailyResults[i].retweets);
      }
      tweetCollection = [tweetMentions, tweetReplies, tweetRetweets];
    }
    callback(tweetCollection);
  });
}

function sendTwitterData(tweetCollection) {
  io.on('connection', function(socket) {
    socket.emit('twitterData', tweetCollection);
  });
}



twitterResults(sendTwitterData);

/***********************************************************************                                                
 * sets up necessary middleware and express methods to initialie the app *
 ***********************************************************************/ 

//serves static files from the public directory
app.use(express.static('public'));

//sends our main inde.html file
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

//launches app, begins listening on port 3000
http.listen(3000, function(){
  console.log('listening on port:3000');
});


