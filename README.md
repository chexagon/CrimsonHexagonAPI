##Building and Running the Site Locally

The ForSight API visualization demo was built with [node.js](https://nodejs.org/en/), the [express.js](http://expressjs.com/) web application framework, and employs the [c3.js](http://c3js.org/) library to format and generate all data visualizations. Naturally, users wishing to install and run locally will need to have Node installed on their machine before continuing. For users currently without Node, please refer to the [Node docs](https://nodejs.org/en/download/) on instructions on how to install. 

Once this has been completed, please follow the steps below to begin the build process:

```
git clone https://github.com/chexagon/crimsonhexagon_api_demo.git
cd crimsonhexagon_api_demo/

npm install
```

Note that in order to have the demo run locally, you will have to pass in values throughout the code where auth-token and monitor ID’s are queried. These areas have been visibly commented in the source code for your convenience.

Along with this, it is important to note that certain dependency files from the `c3.js` and `d3.js` folders have been copied to the `public` folder in our directory. This is so that our express middleware can serve the static files appropriately to our app.

 from the root of the `crimsonhexagon_api_demo/directory`, it is now possible to run:

```
node app.js
```

After initializing the connection to port 3000, you can point your browser at `http://localhost:3000` and examine the site live; note that ending the terminal process will terminate the site. 


#Reporting Bugs/ Submitting User Feedback

Please report all bugs/ issues with this app via our Help Center as you would with any other issue. Please be sure to indicate your reference to this demo within the ticket request.

Any feedback is welcomed and can be sent through the same channel mentioned above.

#Source Code

The app is constructed through a series of callback functions which query various ForSight API endpoints and feed the returned data to our c3.js visualization charts. Specifics on JSON structure and data returned from the endpoints can be researched within our [API docs](https://api.crimsonhexagon.com/api/chs/index.html). As mentioned above, both express.js and the socket.io library are used to serve the generated data to our client side web page. 

In our source code, the basis of all functions which generate and send our data are constructed similar to the following: 

```javascript
var twitterResults = function(callback) {

  var monitorId = "2086809677";

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

//sends collected data to client
function sendTwitterData(tweetCollection) {
  io.on('connection', function(socket) {
    socket.emit('twitterData', tweetCollection);
  });
}

twitterResults(sendTwitterData);
```

To briefly explain the process here: we have our function expression, twitterResults() which using the request module places a call to our API for total engagement metrics on the Twitter content source. This function then generates a series of arrays storing the data needed to run our visualizations on the client side. 

Once this request is completed and our arrays have been formed, we invoke our callback function, sendTwitterData() which sends the object to our web page via socket once a user connection has been established.  

Most functions throughout our app.js file are built in this fashion. 










