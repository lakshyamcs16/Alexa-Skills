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
const awsSDK = require('aws-sdk');
const promisify = require('es6-promisify');


const APP_ID = 'amzn1.ask.skill.cbf3fa32-62fd-4062-960c-bb36e6982a0b';
var word = '', data = '', speech = '', say = '', generatedWord = '';
var http = require('http');
var spellPos = 0;
var defIteration = 0;

const SpellingBeeTable = 'SpellingBeeTable';
const docClient = new awsSDK.DynamoDB.DocumentClient();

// convert callback style functions to promises
const dbScan = promisify(docClient.scan, docClient);
const dbGet = promisify(docClient.get, docClient);
const dbPut = promisify(docClient.put, docClient);
const dbDelete = promisify(docClient.delete, docClient);

const languageStrings = {
    'en-US': {
        translation: {
            SKILL_NAME: 'Spelling Bee',
            HELP_MESSAGE: 'I will ask you a word. You need to spell it. If you need help, you may ask me the definitions, root word, part of speech or usage of the word.',
            HELP_REPROMPT: 'To spell a word like "apple", just begin spelling like "The letter a" or "A for Australia"',
            STOP_MESSAGE: 'Sad to see you go, spelling bee champ. See you later, alligator! ',
            SORRY_MESSAGE: '<say-as interpret-as="interjection">uh oh!</say-as><break time="1s"/> I couldn\'t find this information',
        },
    },
    'en-IN': {
        translation: {
            SKILL_NAME: 'Spelling Bee',
            HELP_MESSAGE: 'I will ask you a word. You need to spell it. If you need help, you may ask me the definitions, root word, part of speech or usage of the word.',
            HELP_REPROMPT: 'To spell a word like "apple", just begin spelling like "The letter a" or "A for Australia"',
            STOP_MESSAGE: 'Sad to see you go, spelling bee champ. See you in a while, crocodile! ',
            SORRY_MESSAGE: '<say-as interpret-as="interjection">uh oh!</say-as><break time="1s"/> I couldn\'t find this information',
        },
    },
};
const handlers = {
    'LaunchRequest': function () {
        
        
        this.emit('SpellgameIntent');
    },
    'SpellgameIntent': function() {
       /* this.response.speak('<audio src="https://s3.amazonaws.com/spellbeebackend/music.mp3" /> Welcome to the spelling bee game. Do you think you have what it takes to be a spelling bee champ? Let us find out! ');
        this.emit(':responseReady');*/
        data = '';
        word = '';
        spellPos = 0;
        generatedWord = '';
        http.get('http://api.wordnik.com:80/v4/words.json/randomWord?hasDictionaryDef=true&excludePartOfSpeech=family-name&minCorpusCount=0&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=-1&api_key=a06707d7bd3260985000e0089360907e93d2384b116b884c9', (resp) => {

            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
                data += chunk;
            });

            resp.on('end', () => {
                        speech = JSON.parse(data);

                        generatedWord = speech.word;
                        say = 'Your word is '+ generatedWord;
                        
                        
                        
                        
                        this.response.cardRenderer(say);
                        this.response.speak(say).listen(say);
                        this.emit(':responseReady');
            });
    });
},
    'LetterIntent': function () {

        var alphabet = this.event.request.intent.slots.alphabet.value;
        var alphabetAnimal = this.event.request.intent.slots.alphabetAnimal.value;
        var alphabetFood = this.event.request.intent.slots.alphabetFood.value
        var alphabetCountry = this.event.request.intent.slots.alphabetCountry.value;
        var alphabetColor = this.event.request.intent.slots.alphabetColor.value;
        var helpWord = this.event.request.intent.slots.helpWord;

        if(alphabetAnimal) {
                if(alphabetAnimal.toLowerCase().charAt(0) === generatedWord.toLowerCase().charAt(spellPos)) {
                    say = 'say next letter';
                    word += alphabetAnimal.charAt(0);
                    spellPos = spellPos + 1;
                }else{
                    say = 'Try again animal';
                }
        }else if(alphabetFood) {
                if(alphabetFood.toLowerCase().charAt(0) === generatedWord.toLowerCase().charAt(spellPos)) {
                    say = 'say next letter';
                    word += alphabetFood.charAt(0);
                    spellPos = spellPos + 1;
                }else{
                    say = 'Try again';
                }
        }else if(alphabetCountry) {
                if(alphabetCountry.toLowerCase().charAt(0) === generatedWord.toLowerCase().charAt(spellPos)) {
                    say = 'say next letter';
                    word += alphabetCountry.charAt(0);
                    spellPos = spellPos + 1;
                }else{
                    say = 'Try again';
                }
        }else if(alphabetColor) {
                if(alphabetColor.toLowerCase().charAt(0) === generatedWord.toLowerCase().charAt(spellPos)) {
                    say = 'say next letter';
                    word += alphabetColor.charAt(0);
                    spellPos = spellPos + 1;
                }else{
                    say = 'Try again';
                }
        }else if (alphabet) {
            if(alphabet.toLowerCase().charAt(0) === generatedWord.toLowerCase().charAt(spellPos)) {
                say = 'say next letter';
                word += alphabet.charAt(0);
                spellPos = spellPos + 1;
            }else{
                say = 'Try again alphabet' + generatedWord.charAt(spellPos) + ' ' + alphabet.charAt(0);
            }
        }else if(helpWord){
            if(helpWord.value.toLowerCase().charAt(0) === generatedWord.toLowerCase().charAt(spellPos)) {
                say = 'say next letter';
                word += helpWord.value.charAt(0);
                spellPos = spellPos + 1;
            }else{
                say = 'Try again alphabet' + generatedWord.charAt(spellPos) + ' ' +  helpWord.value.charAt(0);
            }
        }else{
            say = 'Say it again please';
        }

        if(say === 'say next letter' && spellPos == generatedWord.length) {
            say = 'you said ' + word + '. Which is correct! Bravo!';
            this.emit(':tellWithCard', say, this.t('SKILL_NAME'), word);
            word = '';
        }

        this.response.speak(say).listen(say);
        this.emit(':responseReady');
    },
    'FullWordIntent':function() {
            this.response.speak('Try saying the letter like "The letter a" or "A for apple"').listen('Try saying the letter like "The letter a" or "A for apple"');
            this.emit(':responseReady');
    },
    'DefinitionIntent': function() {
        data = '';
        defIteration = 0;
        var definition = '';
        http.get('http://api.wordnik.com:80/v4/word.json/'+generatedWord+'/definitions?limit=200&includeRelated=false&sourceDictionaries=all&useCanonical=true&includeTags=false&api_key=a06707d7bd3260985000e0089360907e93d2384b116b884c9', (resp) => {

            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
                data += chunk;
            });

            resp.on('end', () => {
                        speech = JSON.parse(data);

                        if(speech[defIteration] !== undefined) {
                            definition = generatedWord + ' is defined as ' + speech[defIteration].text + '. Can you spell it now?';
                        }else{
                            definition = 'I am sorry there are no definitions available. But can you spell it?';
                        }
                        this.response.cardRenderer(definition);
                        this.response.speak(definition).listen(definition);
                        this.emit(':responseReady');
            });
    });
    },
    'PartOfSpeechIntent': function() {
        data = '';
        var partOfSpeech = '';
        http.get('http://api.wordnik.com:80/v4/word.json/'+generatedWord+'/definitions?limit=200&includeRelated=false&sourceDictionaries=all&useCanonical=true&includeTags=false&api_key=a06707d7bd3260985000e0089360907e93d2384b116b884c9', (resp) => {

            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
                data += chunk;
            });

            resp.on('end', () => {
                        speech = JSON.parse(data);

                        if(speech[0] !== undefined) {
                            partOfSpeech = 'The part of speech for the word ' + generatedWord  + ' is ' + speech[0].partOfSpeech + '. Can you spell it now?';
                        }else{
                            partOfSpeech = 'I am sorry. I don\'t have any information about the part of speech for this word. But can you spell it?';
                        }
                        this.response.cardRenderer(partOfSpeech);
                        this.response.speak(partOfSpeech).listen(partOfSpeech);
                        this.emit(':responseReady');
            });
    });
    },
    'RootIntent': function() {
        
    },
    'UsageIntent': function() {
        data = '';
        var usage = '';
        http.get('        http://api.wordnik.com:80/v4/word.json/'+generatedWord+'/topExample?useCanonical=false&api_key=a06707d7bd3260985000e0089360907e93d2384b116b884c9', (resp) => {

            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
                data += chunk;
            });

            resp.on('end', () => {
                        speech = JSON.parse(data);

                        if(speech !== undefined) {
                            usage = speech.text + '. Can you spell it now?';
                        }else{
                            usage = 'I am sorry. I don\'t have any information about the part of speech for this word. But can you spell it?';
                        }
                        this.response.cardRenderer(usage);
                        this.response.speak(usage).listen(usage);
                        this.emit(':responseReady');
            });
    });
    },
    'AlternateDefinitionIntent': function() {
        var definition = '';
        defIteration++;
        if(speech[defIteration] !== undefined){
            definition = 'Alternate defintion for the word '+ generatedWord + ' is ' + speech[defIteration].text + '. Can you spell it now?';
        }else{
            definition = 'I am sorry there are no more definitions available. But can you spell it?';
        }
        
        this.response.cardRenderer(definition);
        this.response.speak(definition).listen(definition);
        this.emit(':responseReady');
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = this.t('HELP_MESSAGE');
        const reprompt = this.t('HELP_MESSAGE');
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
};

exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

//pass the constructor a config object with your key


//sample method
