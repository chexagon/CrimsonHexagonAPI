var request = require('request');
var Twitter = require('twitter');

var client = new Twitter({
  consumer_key: '9gB7szny2kHOb4R7a4yWlGjDQ',
  consumer_secret: '3xNVjeq6nwsTtoCVcSbwU6J33e0hHqNFoDJ2icKyqRyBD2DD65',
  access_token_key: '232719208-V9eMSc5m9uOiF3pKt1vE2mChDxozGLIo2JpZeLzx',
  access_token_secret: 'PesywDLgI1sSMiHgvKldI3gRZW9yhW6p4FZwXqvr2zShn'
});

/**************************************************
 *make request to forsight api, collect monitor ids*
 ***************************************************/

var runQuery = function(callback) {

  var auth = 'tPfAG7dwHWS_Aj-Xz0Nm2VJ5c2FA2Lk8U_pi5H5mIYA';
  var startDate = '2015-10-01';
  var endDate = '2016-01-01';
  var id = '2645325059';

  var url = ('https://api.crimsonhexagon.com/api/monitor/posts?id=' + id + '&start=' + startDate + '&end=' + endDate + '&auth=' + auth);

  request({
    url: url,
    method: 'GET'
  }, function (err, response, body) {
    if (!err && response.statusCode === 200) {
      var data = JSON.parse(body);
      var arr = [];

      for (var i = 0; i < data.posts.length; i++) {
        if (data.posts[i].type === 'Twitter') {

          //create array of urls
          arr.push(data.posts[i].url);
        }
      }

      var ids = [];
      var str = [];

      for (var i = 0; i < arr.length; i++) {

        //create array of urls split on the backslash in the url 
        str = arr[i].split("/");

        //loop through array, find ids and push to new array
        for (var k = 0; k < str.length; k++) {
          if (k === str.length - 1) {
            ids.push(str[k]);
          }
        }
      }
    }
    callback(ids);
  });
};

/*************************************
 *call twitter api, log body of tweets*
 **************************************/

function sendIds(ids) {

  //send request if there are
  // less than 180 ids in our array
  if (ids.length < 180) {
    for (var i = 0; i < ids.length; i++) {
      client.get('statuses/show/' + ids[i], function (error, tweets, response) {
        //do work
        console.log(tweets.text);
      });
    }
  } else {

    //create nested array/s if more than
    //180 ids gathered
    var batch = [];
    var j = 0;
    var n = ids.length;
    var len = 180;

    while (j < n) {
      batch.push(ids.slice(j, j += len));
    }
  }

  //run off first batch
  for (var l = 0; l < batch[0].length; l++) {
    client.get('statuses/show/' + batch[0][l], function (error, tweets, response) {
      //do work
      console.log(tweets.text);
    });
  }

  //set 15 minute delay on all subsquent calls
  //to conform with twitter rate limits 

  var counter = batch.length;
  var batchDelay = setInterval(function() {
    counter--
    for (var j = 1; j < batch.length; j++) {
      for (var k = 0; k < batch[j].length; k++) {
        client.get('statuses/show/' + batch[j][k], function (error, tweets, response) {
          //do work
          console.log(tweets.text);
        });
      }
    }
    if (counter === 0) {
      console.log('fin');
      clearInterval(batchDelay);
    }
  }, 900000);
};



runQuery(sendIds);