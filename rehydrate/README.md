#Twitter Post Rehydrator
This app is inteded to be used with the [Crimson Hexagon ForSight API](https://api.crimsonhexagon.com/api/chs/index.html). More specifically, it's intended to be used with the `GET monitor/posts` endpoint of the API. Usage of this app will allow users to rehydrate Twitter posts collected from the ForSight API, with Twitter posts and all their associated metadata returned in `GET statuses/show/:id` of the [Twitter API](https://dev.twitter.com/rest/reference/get/statuses/show/%3Aid). 

##A Few Notes
It will be necessary for those who wish to use this app to have access to the Twitter API. Specifics on gaining access and receiving tokens can be found, here.

Data returned has been limited to the body of the tweets queried, but this can be expanded to include all assocated metadata simply by returning `tweets` in place of `tweets.text` in the `sendIds()` function of the `app.js` file. 

Lastly, to conform with the Twitter API rate limits, a time out has been sent on our script returning a total of 180 posts every 15 minutes. This will run in perpetuity, until all collected Twitter ids have been rehydrated.


##Reporting Bugs/ Submitting User Feedback

Please report all bugs/ issues with this app via our [Help Center](https://crimsonhexagon.zendesk.com/hc/en-us) as you would with any other issue. Please be sure to indicate your reference to this demo within the ticket request.

Any feedback is welcomed and can be sent through the same channel mentioned above.
