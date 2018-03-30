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
const Alexa = require('alexa-sdk');
const fs = require('fs');
const mkdirp = require('mkdirp');
const readline = require('readline');
const {google} = require('googleapis');
const OAuth2Client = google.auth.OAuth2;
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];


APP_ID = '';
const APP_ID = undefined;
var speechOutput = '';


var token = '';
const handlers = {
    'LaunchRequest': function () {
            this.emit('GetBirthdays');
        
         
        
        
    },
    'GetBirthdays': function () {
        token = this.event.session.user.accessToken;
           const oauth2Client = new OAuth2Client(
                'CLIENT_ID',
                'CLIENT_SECRET',
                'REDIRECT_URI'
            );

            // Retrieve tokens via token exchange explained above or set them:
            oauth2Client.setCredentials({
                 access_token: token,
            });

        const calendar = google.calendar({version: 'v3', auth: oauth2Client});
        
          
        calendar.events.list({
            calendarId: 'primary',
            timeMin: (new Date()).toISOString(),
            maxResults: 5,
            singleEvents: true,
            orderBy: 'startTime',
        }, (err, {data}) => {
            if(err) speechOutput = "Err!";
            
            const events = data.items;
            if (events.length) {
                   
                    events.map((event, i) => {
                    const start = event.start.dateTime || event.start.date;
                    speechOutput += `${start} - ${event.summary}` + ". \n";
            });
            } else {
                    speechOutput = 'No upcoming events found.';
            }
            this.response.speak(speechOutput);
            this.emit(':responseReady');
        });
    },

//Changes required below this ----
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
};

exports.handler = function (event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

