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
const APP_ID = 'amzn1.ask.skill.cbf3fa32-62fd-4062-960c-bb36e6982a0b';
var word = '', data = '', speech = '', say = '', generatedWord = '';
var http = require('http');
var spellPos = 0;
var defIteration = 0;
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
        data = '';
        word = '';
        spellPos = 0;
        generatedWord = '';
        http.get('http://api.wordnik.com:80/v4/words.json/randomWord?hasDictionaryDef=true&excludePartOfSpeech=family-name&minCorpusCount=0&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=-1&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5', (resp) => {

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
        }else{
            say = 'Say it again please';
        }

        if(say === 'say next letter' && spellPos == generatedWord.length) {
            say = 'you said ' + word + '. Which is correct!';
        }

        this.response.speak(say).listen(say);
        this.emit(':responseReady');
    },
    'FullwordIntent': function () {
        var say = 'you said ' + word;
        word = word.split('.').join('').toLowerCase();
        if(word === generatedWord) {
            say += ' bravo!';
        }
        this.emit(':tellWithCard', say, this.t('SKILL_NAME'), word);
        word = '';
    },
    'DefinitionIntent': function() {
        data = '';
        defIteration = 0;
        var definition = '';
        http.get('http://api.wordnik.com:80/v4/word.json/'+generatedWord+'/definitions?limit=200&includeRelated=false&sourceDictionaries=all&useCanonical=true&includeTags=false&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5', (resp) => {

            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
                data += chunk;
            });

            resp.on('end', () => {
                        speech = JSON.parse(data);

                        if(speech[defIteration] !== undefined) {
                            definition = generatedWord + ' is defined as ' + speech[defIteration].text + '. Can you spell it now?';
                        }else{
                            definition = 'I am sorry there are no more definitions available. But can you spell it?';
                        }
                        this.response.cardRenderer(definition);
                        this.response.speak(definition).listen(definition);
                        this.emit(':responseReady');
            });
    });
    },
    'PartOfSpeechIntent': function() {
        
    },
    'RootIntent': function() {
        
    },
    'UsageIntent': function() {
        
    },
    'DefineWordIntent': function() {
        
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
