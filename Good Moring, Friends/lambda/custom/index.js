/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills
 * nodejs skill development kit.
 * This sample supports multiple lauguages. (en-US, en-GB, de-DE).
 * The Intent Schema, Custom Slots and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-fact
 **/

'use strict';
const Alexa   = require('alexa-sdk');
const AWS = require('aws-sdk');
var axios = require('axios');
var moment = require('moment-timezone');
const AWSregion = 'us-east-1';
var persistenceEnabled;

AWS.config.update({
      region: AWSregion
});

var Twitter = require('twitter');
const http    = require('http');
var stringSimilarity = require('string-similarity');
var client;

const APP_ID = undefined;

const SKILL_NAME = 'Good Morning, Friends';
const HELP_MESSAGE = 'You can say good morning and then you can say ask good morning to post it... What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Too bad! But I will see you later, aligator!';

var speechOutput = "";
var followerName, map  = {}, name, screenName, names = [], intent = 0, index = 0, currentStep, matches;

var nightTime = ['Should I say Good Morning?','Oh my, why are you still awake at this ungodly hour?',
'Isn\'t it too late? you should sleep.','Nothing good happens after 2 AM, you know that right?','Good Nigh, no wait, Good Morning',
'Well, hello there!'];

var sunriseTime = ['Aren\'t you awake even before the sun?','Wow, someone is an early bird','You are awake already? How did you do that?',
'An early start of a day, this should be exciting!','You woke up so early!','Morning is here! Sunshine is here!',
'You\'re the first one to get up, aren\'t you?'];

var morningTime = ['Good Morning, friend','Heey! Good Morning. I hope you have a great day!','Morning! And I just want to say, stay positive, you will have a great day',
'Good Morning, good to see you!','I am so happy to see you!','Aren\'t you sweet? You always wish me first.'];

var afterNoon = ['Oh no! It is afternoon already?','Good afternoon! This seems to be a long day','I really needed that, thank you!',
'I get so lazy at this time of the day. But I hope your day is more active.','Uh-oh! You caught me again. I admit I was taking a nap.'];

var eveningTime = ['Just a few more hours of work! You can do it!', 'Good evening!','Isn\'t evening time the most wonderful time of the day?',
'I was hoping you would come! Thank you!','And just like that one more day is about to get over','What are you still doing inside a room? Go out and look at the sunset!'];

var completeNight = ["Good night mighty owl!",'Good Night!',"Good Night! Sweet Dreams","Good Night! Dream about me, okay?",
"Good night! It is time to sleep or for people with messed up sleep patterns like me, can have dinner.","Where were you for so long? I missed you! Good Night buddy!"];

var but = [" But here's your compliment: "," And now I wanna give you a compliment: "," And for this, you deserve a compliment: ",
" And I also wanna say "," And do you know what I think about you? Here it goes... "];

var userTime = "";
const handlers = {
    'LaunchRequest': function () {
           //Get twitter access token and access secret

            //get consent token for device address to get the time using google maps api
            let countryCode = ''
            let postalCode = ''
            let lat = 0
            let lng = 0
            let city = ''
            let state = ''
            let timeZoneId = ''

            console.log(JSON.stringify(this.event));

            if (this.event.context.System.user.permissions) {
                const token = this.event.context.System.user.permissions.consentToken;
                const apiEndpoint = this.event.context.System.apiEndpoint;
                const deviceId = this.event.context.System.device.deviceId;
                const das = new Alexa.services.DeviceAddressService();

                das.getFullAddress(deviceId, apiEndpoint, token)
                .then((data) => {
                  countryCode = data.countryCode;
                  postalCode = data.postalCode;

                  return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${countryCode},${postalCode}&key=AIzaSyD_Jv1apXTjx9Ij9ObGo2OVZouXt6kveSA`);
                })
                .then((response) => {
                  city = response.data.results[0].address_components[1].short_name
                  state = response.data.results[0].address_components[3].short_name
                  lat = response.data.results[0].geometry.location.lat
                  lng = response.data.results[0].geometry.location.lng
                  console.log("IDHARRRRRRRR "+city+  " " + state + " " + lat + " " + lng);

                  return axios.get(`https://maps.googleapis.com/maps/api/timezone/json?location=${lat},${lng}&timestamp=${moment().unix()}&key=AIzaSyD_Jv1apXTjx9Ij9ObGo2OVZouXt6kveSA`)
            })
            .then((response) => {
              timeZoneId = response.data.timeZoneId;
              const currDate = new moment();
              userTime = currDate.tz(timeZoneId).format('HH');
	            this.emit('TwitterIntent');
              })
            .catch((error) => {
                    this.emit(':tellWithLinkAccountCard', 'To use this skill, please go to the companion app to link your twitter account');
                });
            } else {
                this.response.speak('Please grant skill permissions to access your device address.');
                const permissions = ['read::alexa:device:all:address'];
                this.response.askForPermissionsConsentCard(permissions);
                console.log("Response: " + JSON.stringify(this.response));
                this.emit(':responseReady');
            }
    },
    'TwitterIntent':function() {
      var token = this.event.session.user.accessToken;

      //setup twitter using token fetched from skill's session
      var tokenDetails = token.split(',');
      speechOutput = "";
      client = new Twitter({
                        consumer_key: CONSUMER_KEY,
                        consumer_secret: CONSUMER_SECRET,
                        access_token_key: tokenDetails[0],
                        access_token_secret: tokenDetails[1]

                      });


      let data = '';
      var urlTagStart = 0, urlTagEnd = 0;

      //scrap complimengenrator website and get a new compliment. Also, save the state of compliment.
      var complimentMap = [ "large","medium","small" ];
      var str = "";
      http.get('http://www.complimentgenerator.co.uk/', (resp) => {
          // A chunk of data has been recieved.
          resp.on('data', (chunk) => {
            data += chunk;
          });

          resp.on('end', () => {

                  if(typeof this.attributes['currentStep'] == 'undefined') {

                      currentStep = 0;
                      this.attributes['currentStep'] = currentStep;
                  }else{

                      currentStep = this.attributes['currentStep'];
                      currentStep = ( currentStep + 1 ) % 3;
                      this.attributes['currentStep'] = currentStep;
                  }
                      str = complimentMap[currentStep];

                      var len = 5;
                      if(typeof str !== 'undefined')
                        len = str.length;
                      else {
                        str = "large";
                      }

                      urlTagStart = data.indexOf("<p class=\""+str+"\">");
                      urlTagEnd = data.indexOf("</p>", urlTagStart);
                      var url = data.substring(urlTagStart + len + 12, urlTagEnd);
                      speechOutput = unescapeHtml(url);
                      this.response.speak(greetings()+" "+speechOutput);
                      this.response.cardRenderer(speechOutput);
                      this.emit(':responseReady');

          });
      });
    },
    'PostCompliment': function () {

          if(typeof client != 'undefined') {

            var post = "";
            if(speechOutput.length == 0){
              this.emit(':tell',"Come on! Don't be rude. Please greet me first");
            }else if(typeof screenName != 'undefined') {
                post = " @"+screenName;
            }
             client.post('statuses/update', {status: speechOutput + post},  function(error, tweet, response) {
            });
                 this.response.speak("I have posted the status on twitter!");
                 this.response.cardRenderer(speechOutput+post);
                 this.emit(':responseReady');
          }else{
            this.emit(':tellWithLinkAccountCard', 'To use this skill, please go to the companion app to link your twitter account');
          }


    },
    'AddFriend':function() {

      if(typeof client != 'undefined') {


                  intent = 2;
                  var params = {screen_name: ''};
                  followerName = "", map = {}, names = [];
                  client.get('followers/list', params, function(err, t, r){
                  if(err) {
                    this.response.speak("Uh-oh! Try to wish me again.");
                    this.emit(":responseReady");
                  };
                  var i = 0 ;
                  while(i < t.users.length) {
                      var user = t.users[i];
                      var infoArray = [user.screen_name, user.name];
                      map[user.name.toLowerCase()] = infoArray;
                      names.push(user.name.toLowerCase());
                      i++;
                  }
              });

                  this.response.speak("Do you wanna add a friend?").listen("Why don't you tag a friend?");
                  this.emit(":responseReady");
      }else{

                  this.emit(':tellWithLinkAccountCard', 'To use this skill, please go to the companion app to link your twitter account');

      }
    },
    'TagFriendIntent' : function () {

      if(typeof client != 'undefined') {

        if(intent == 4){
            intent = 3;
            if(matches.ratings.length <= index) {
                this.response.speak('These are all your followers. Why don\'t you try again?').listen("Try to tag a friend one more time");
                this.emit(':responseReady');
            }

            screenName = map[matches.ratings[index].target][0];
            this.response.speak('Do you want to tag '+map[matches.ratings[index].target][1]+'?').listen("You can say yes or no");
            this.emit(':responseReady');
        }else if (this.event.request.intent.slots.firstName.value) {
            intent = 3;
            index = 0;
            name = this.event.request.intent.slots.firstName.value;
            console.log(name+ " \n " + names);
            matches = stringSimilarity.findBestMatch(name.toLowerCase(), names);

            if(matches.bestMatch.rating == 0) {
                this.emit(':ask','I could not find anybody with the name '+name+'. Please say the name again.', 'Say the name of the person to tag');
            }

            matches.ratings.sort(compare);
            screenName = map[matches.ratings[index].target][0];
            this.response.speak('Do you want to tag '+map[matches.ratings[index].target][1]+'?').listen("You can say yes or no");
            this.emit(':responseReady');

        }


         this.response.speak("I couldn't find "+ name+". Please say the name again.").listen("Please say the first name again");
         this.emit(":responseReady");
       }else{

         this.emit(':tellWithLinkAccountCard', 'To use this skill, please go to the companion app to link your twitter account');

       }

    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = HELP_MESSAGE;
        const reprompt = HELP_REPROMPT;

        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
    'AMAZON.YesIntent' : function () {

        if(intent == 2){
            this.emit(':ask', "Tell me the first name of your friend followed by the word <emphasis level=\"strong\"> TAG </emphasis> ","For instance, You can say <emphasis level=\"strong\"> TAG Micheal </emphasis>");
        }else if(intent == 3) {
            this.emit('PostCompliment');
        }else{
            this.emit('Unhandled');
        }
    },
    'AMAZON.NoIntent' : function() {

        if(intent == 3) {
            index++;
            intent = 4;
            this.emit('TagFriendIntent');
        }

        this.emit('Unhandled');
    },
    'Unhandled': function() {
        this.emit(':ask', 'Something went wrong. Try again!');
    }
};

exports.handler = function (event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.APP_ID = APP_ID;

     alexa.dynamoDBTableName = 'TABLE_NAME'; // creates new table for session.attributes
      if (alexa.dynamoDBTableName == 'TABLE_NAME' ){
        persistenceEnabled = true;
      } else {
        persistenceEnabled = false;
}
    alexa.registerHandlers(handlers);
    alexa.execute();
};



function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function unescapeHtml(safe) {
return safe.replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'");
  }

function compare(a,b) {
  if (a.rating > b.rating)
    return -1;
  if (a.rating < b.rating)
    return 1;
  return 0;
}


function greetings() {
    var current_hour = userTime;
    var greet = "";

    console.log("PURRRNAAAAAA GHANTAAAA: "+ current_hour);
    if(current_hour >=0 && current_hour <= 4) {
        greet = nightTime[getRandomInt(0,nightTime.length-1)];
    }else if(current_hour >=5 && current_hour <= 8) {
        greet = sunriseTime[getRandomInt(0,sunriseTime.length-1)];
    }else if(current_hour >=9 && current_hour <= 12) {
        greet = morningTime[getRandomInt(0,morningTime.length-1)];
    }else if(current_hour >=13 && current_hour <= 16) {
        greet = afterNoon[getRandomInt(0,afterNoon.length-1)];
    }else if(current_hour >=17 && current_hour <= 20) {
        greet = eveningTime[getRandomInt(0,eveningTime.length-1)];
    }else if(current_hour >=21 && current_hour <= 23){
        greet = completeNight[getRandomInt(0,completeNight.length-1)];
    }

    console.log(greet + but[getRandomInt(0,but.length-1)]);
    return (greet + but[getRandomInt(0,but.length-1)]);
}
