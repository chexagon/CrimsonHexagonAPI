var request = require('request');
var moment = require('moment');
var twix = require('twix');



function runDate(callback) {
  var past = moment().subtract(7, 'd');
  var itr = moment.twix(new Date(past),new Date()).iterate("days");
  var range=[];
    while(itr.hasNext()){
      range.push(itr.next().format('YYYY-MM-DD'));
  }
    callback(range);
}


function runSocket(range) {
    console.log("this is the range" + range);
        var socket = io();

        //gender chart
        socket.on('gender', function(data) {
          console.log(data);

          //code to run c3 charts
          var chart = c3.generate({
            bindto: '#chart',
            size: {
              height: 350,
              width: 680
            },
            data: {
              columns: [
                ['Male'].concat(data[0]), ['Female'].concat(data[1]),
              ],
              type: 'donut',
            },
            color: {
              pattern: ['#C32735', '#999']
            }
          });
        });


        //total activity chart
        socket.on('totalActivity', function(data) {
          console.log(data);

          //code to run c3 charts
          var chart = c3.generate({
            bindto: '#chart2',
            data: {
              x: 'x',
              columns: [
                ['x', range[0], range[1], range[2], range[3], range[4], range[5], range[6]],
                ['Likes'].concat(data[0]), ['Comments'].concat(data[1]), ['Shares', ].concat(data[2]),
              ],
              type: 'bar',
            },
            color: {
              pattern: ['#C32735', '#999', '#009494']
            },
            axis: {
              x: {
                type: 'timeseries',
              }
            }
          });
        });


        //sentiment results chart
        socket.on('resultsChart', function(data) {
          console.log(data);

          //code to run c3 chart
          var chart = c3.generate({
            bindto: '#chart3',
            size: {
              height: 350,
              width: 680
            },
            data: {
              columns: [
                ['Neutral'].concat(data[0]), ['Positive'].concat(data[1]), ['Negative'].concat(data[2]),
              ],
              type: 'pie',
            },
            color: {
              pattern: ['#C32735', '#999', '#009494']
            }
          });
        });


        //volume chart
        socket.on('weeklyVolume', function(data) {
          console.log(data);

          var chart = c3.generate({
            bindto: '#chart4',
            data: {
              x: 'x',
              columns: [
                ['x', range[0], range[1], range[2], range[3], range[4], range[5], range[6]],
                ['Volume'].concat(data),
              ],
              types: {
                Volume: 'area-spline'
              }
            },
            axis: {
              x: {
                type: 'timeseries',
              }
            }
          });
        });


        //twitter metrics chart
        socket.on('twitterData', function(data) {
          console.log(data);

          //c3 chart data
          var chart = c3.generate({
            bindto: '#chart6',
            data: {
              x: 'x',
              columns: [
                ['x', range[0], range[1], range[2], range[3], range[4], range[5], range[6]],
                ['Replies'].concat(data[1]), ['Retweets'].concat(data[2]),
              ],
              types: {
                Replies: 'area-spline',
                Retweets: 'area-spline'
                  // 'line', 'spline', 'step', 'area', 'area-step' are also available to stack
              },
              groups: [
                ['Replies', 'Retweets']
              ]
            },
            color: {
              pattern: ['#C32735', '#999', '#009494']
            },
            axis: {
              x: {
                type: 'timeseries',
              }
            }
          });
        });

        //instagram metircs chart
        socket.on('instaMetrics', function(data) {
          console.log(data);

          //c3 chart data
          var chart = c3.generate({
            bindto: '#chart5',
            data: {
              x: 'x',
              columns: [
                ['x', range[0], range[1], range[2], range[3], range[4], range[5], range[6]],
                ['Likes'].concat(data[0]), ['Comments'].concat(data[1]),
              ]
            },
            color: {
              pattern: ['#C32735', '#999', '#009494']
            },
            axis: {
              x: {
                type: 'timeseries',
              }
            }
          });
        });
      }


runDate(runSocket);

