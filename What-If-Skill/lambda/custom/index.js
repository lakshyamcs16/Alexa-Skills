/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/

/**
 *  
 * 
 * this.event.context.System.device.deviceId
 **/

'use strict';
const regexp = /<[^>]*>/g;
const Alexa = require('alexa-sdk');
const AWS = require('aws-sdk');  
const AWSregion = 'us-east-1';   
var persistenceEnabled;

AWS.config.update({
      region: AWSregion
});

const APP_ID = "amzn1.ask.skill.ad1eba4b-f4f8-43b2-9d6a-99281a53e303";  // TODO replace with your app ID (OPTIONAL).

var randomQuestion, speechOutput, cardOutputQues, cardOutput, say, currentStep;

const speechConsYes = ["Booya", "All righty", "Bam", "Bazinga", "Bingo", "Boom", "Bravo", "Cha Ching", "Cheers", "Dynomite",
"Hip hip hooray", "Hurrah", "Hurray", "Huzzah", "Oh my", "oh la la", "Kaboom", "Kaching", "Oh snap", "Phew",
"Boing", "Dun Dun Dun", "Whee", "Woo hoo", "Yay", "Wowza", "Yowsa"];

const speechConsNo = ["Argh", "Aw man", "Blarg", "Blast", "Boo", "Bummer", "Darn", "D'oh", "Eek", "Honk", "Le sigh",
"Mamma mia", "Oh boy", "Oh dear", "Oof", "Ouch", "Ruh roh", "Shucks", "Uh oh", "Wah wah", "Whoops a daisy", "Yikes"];

const speechConsNoComments = ["But really?", "well, there's nothing wrong in being different", "what's up with people these days?", 
"But I am with you", "I know! Even I am shocked!", "but don't you worry, you seem completely normal to me", 
"but if you will think about what people might think of you, then what the people would think of? Very smart! I know right?",
"well, this is interesting to know", "but hey what's wrong with that?", "I think you should ask your friends and see what they think?",
"but I thought it would be the other way round!", "Haha you are different! I like you!"];

const speechConsYesComments = [". You're certainly normal", "Going with the flow! hmm?",
"you're definitely not gonna have any problem in mixing with people", "I like the way you think", "sweet! why don't you ask your friends the same question?",
"You are such a positive person", "you are so wise", "Isn't that amazing?", "you're doing so well, keep playing"];

const stopStrings = [ "No duty is more urgent than that of returning thanks.", 
"I feel a very unusual sensation – if it is not indigestion, I think it must be gratitude.",
"When we were children we were grateful to those who filled our stockings at Christmas time. Why are we not grateful to the developer for making this app?",
"If you can't be content with what you have received, be thankful for what you have escaped.",
"I am thankful for you and laughter, except when milk comes out of my nose.",
"You are one of my favourite people to spend an time with; I enjoy asking questions to you.",
"I admire your excellent taste.", 
"You have outdone yourself. Of course, you always do.",
"Give thanks for a little and you will find a lot.",
"We can only be said to be alive in those moments when our hearts are conscious of our treasures.",
"Be thankful for what you have and you’ll end up having more.",
"Forget injuries, never forget kindnesses."
];

const help = ["You can say \"yes\" if you agree or you can say \"No\" if you don't",
"Do you agree? you can say \"yes\" or \"no\".", "What do you think? \"yes\" or \"No\"?", "Is that a \"yes\" or a \"No\"?"];

const languageStrings = {
    'en': {
        translation: {
            DATA: [
                {first: "Pokemon is for real", but: "all the normal animals are extinct", Yes: "40" },
                {first: "you never sleep longer than 5 hours a night", but: "you could craft and control your dreams every night", Yes: "69" },
                {first: "you could have any one super hero's powers", but: "a super villain will always be looking to get you killed", Yes: "57" },
                {first: "the sun shines when you are happy", but: "it rains when you are sad", Yes: "78" },
                {first: "you could make an app developer very happy", but: "you have to rate 5 stars", Yes: "48" },
                {first: "you can read anybody's mind", but: "you fart continuously for as long as you do so", Yes: "42" },
                {first: "you become a world famous athlete and earn 5 million dollars a year", but: "you become super fat", Yes: "71" },
                {first: "you never get fat", but: "but never get hungry", Yes: "70" },
                {first: "you get your dream job", but: "you get paid in chocolate bars", Yes: "32" },
                {first: "you become twice as attractive", but: "half as smart", Yes: "31" },
                {first: "you can never catch a cold", but: "you may never have matching shoes", Yes: "34" },
                {first: "you are twice as attractive ", but: "every Friday you are transformed into an equally attractive person of opposite gender", Yes: "69" },
                {first: "there was a always a new hundred dollar bill in your pocket", but: "every time you pick one up an animal dies on the other side of the world", Yes: "64" },
                {first: "what you say can never bring you negative consequences", but: "you must always speak with a rough Scottish accent", Yes: "58" },
                {first: "you can never lose", but: "you never fall in love", Yes: "82" },
                {first: "the first thing you hear every morning is <break time = '1s' /> I love you", but: "it is always different person who says it", Yes: "37" },
                {first: "you have a bag of chips that never gets empty", but: "you will never be loved", Yes: "10" },
                {first: "you got a magic printer which could print real money", but: "you need to wear a kilt for the rest of your life", Yes: "46" },
                {first: "you point out five people that along with yourself would be terribly successful", but: "you also need to point out five people whose lives will be destroyed", Yes: "54" },
                {first: "your home was always sparkly clean, and all duties at home were done automatically", but: "you must always wear dirty boots wherever you are", Yes: "35" },
                {first: "you are always in good shape", but: "you have to exercise a few times a week", Yes: "85", },
                {first: "you live happily ever after", but: "you have to kiss and marry the person closet to you", Yes: "45" },
                {first: "you could accomplish anything", but: "you had to sacrifice time, sweat and tears to make it", Yes: "76" },
                {first: "you sleep well every night and wake up very happy and refreshed every morning", but: "you'll have to sleep alone for the rest of your life", Yes: "78" },
                {first: "your lifespan is increased by fifty healthy years", but: "you step on a lego brick when you least expect it a couple of times a day for the rest of your life", Yes: "48" },
                {first: "you become a Jedi Knight", but: "your best friend becomes a Sith Lord", Yes: "41" },
                {first: "you get 10000 dollars per month of 25 years", but: "for the next 5 years you may never change your clothes", Yes: "31" },
                {first: "you could take anything without being caught for it", but: "every time you took something someone innocent was accused and convicted for it", Yes: "33" },
                {first: "you got over a hundred likes on every photo you post on Facebook", but: "you have to squint excessively and have you finger up your nose in all the pictures", Yes: "12" },
                {first: "time passes after your watch", but: "when your watch stops working, time stops forever <break time = '3s' />", Yes: "29" },
                {first: "your salary tripled", but: "you had to work at McDonalds", Yes: "62" },
                {first: "you got a clone of yourself that obeys your orders", but: "it falls in love with the same person you fall in love with", Yes: "30" },
                {first: "you can never fail", but: "you can never give up", Yes: "80" },
                {first: "you learned everything there is to know about any two programming languages", but: "you inherit twelve chickens, a horse and a pair of pigs on a farm, that you have to take care of all by yourself", Yes: "42" },
                {first: "you got to hang out with Justin Beiber for three days", but: "you had to sing in his next single", Yes: "26" },
                {first: "you could play the accordion", but: "you have to brag about it, <emphasis level = 'strong'> every day! </emphasis>", Yes: "21" },
                {first: "you will be the next president and will be paid 200000 dollars per month", but: "you must represent the party, you certainly would not want to vote for", Yes: "42" },
                {first: "all people were black", but: "you were white", Yes: "28" },
                {first: "aliens came to earth", but: "a war started between us that lasted for ten years", Yes: "20" },
                {first: "your farts are always 100 percent silent", but: "they smell twice as bad", Yes: "29" },
                {first: "you were lucky and happy every day", but: "you turned into an animal of your choice", Yes: "49" },
                {first: "you get to know when and how you die", but: "you can't affect it in any way what so ever", Yes: "41" },
                {first: "you got to design your partners looks and personality", but: "your partner gets to design yours as well", Yes: "59" },
                {first: "all your meals were cooked by the best master chef", but: "you must always eat with your hands only", Yes: "66" },
                {first: "you could see a year into the future", but: "you forget two of your earliest years of life each year", Yes: "22" },
                {first: "you and everyone you know live 100 youthful years longer", but: "you may never change socks or underwear", Yes: "27" },
                {first: "you could change gender whenever you wanted", but: "you become slightly uglier every time you did", Yes: "14" },
                {first: "you could be any animal", but: "never be human again", Yes: "26" },
                {first: "you get infinite money", but: "everyone in the world, except you, who are over 30 years die", Yes: "18" },
                {first: "you could turn water into Coca-cola", but: "you only get to drink that for the rest of your life", Yes: "26" },
                {first: "everyone in the world lived good lives", but: "you get to sleep for only 4 hours in a day for next 10 years", Yes: "24" },
                {first: "your biggest fear disappeared", but: "you had to give it to your closest friend", Yes: "40" },
                {first: "heaven and hell existed", but: "if you answer \"yes\" you are commiting an unforgivable sin and will go to hell", Yes: "28" },
                {first: "your hair changed color everyday", but: "every day you get $100", Yes: "81" },
                {first: "you got a luxury villa just by the beach", but: "all sand you walk on is quicksand", Yes: "18" },
                {first: "you got to hand with any celebrity for a whole week", but: "paparazii followed you all week", Yes: "72" },
                {first: "you get to be any disney prince or princess", but: "you won\'t live happily ever after", Yes: "13" },
                {first: "you became best friends with Bill Gates", but: "he gets jealous if you hand out with other people for too long", Yes: "40" },
                {first: "you die 15 years earlier", but: "you are always in ideal physical shape", Yes: "29" },
                {first: "you got to travel 500 years into the future for a day, then back again", but: "your right hand became a foot", Yes: "14" },
                {first: "it is always the perfect temperature wherever you go", but: "your bed is always freezing", Yes: "35" },
                {first: "you had a tree that grew money as leaves", but: "when you took money from it, 5000 other trees die", Yes: "22" },
                {first: "you received a magical window whiper that could make anything invisible", but: "you had to use it on all your shoes and socks", Yes: "35" },
                {first: "in a contest, the odds are 1 in 24 that you win $10000000", but: "it is the Hunger Games", Yes: "34" },
                {first: "you owned an underwater city", but: "you may never surface again", Yes: "35" },
                {first: "you found out when you will die", but: "you die instantly if you tell someone", Yes: "38" },
                {first: "your fridge was always full of good food", but: "you must go to church every Sunday morning", Yes: "66" },
                {first: "you could be in a movie", but: "it was kids movie", Yes: "44" },
                {first: "a restaurant opened in your honor where you chose the menu and always got free food", but: "you may never eat at any other restaurant", Yes: "61" },
                {first: "you tripple your salary", but: "you shorten your length by half", Yes: "22" },
                {first: "you could become the next king or queen of Sweden", but: "you had to marry a person of royal blood", Yes: "56" },
                {first: "you could be just as long as you want to be", but: "your partner will always be 50cm shorter than you", Yes: "32" },
                {first: "your farts are oderless", but: "they sounded twice as loud", Yes: "24" },
                {first: "you could go 50 years in the future", but: "you die 20 years later", Yes: "19" },
                {first: "you could look like whoever you wanted", but: "you never got to wear underwear again", Yes: "56" },
                {first: "you had your personal driver who drove you whenever and wherever you wanted", but: "he always drove you in a rusty old greaser car with a trailing exhaust pipe", Yes: "31" },
                {first: "you got any clothes from any store for free", but: "you can never wear matching shoes or socks again", Yes: "48" },
                {first: "you got to pick any one person to be your best friend", but: "you can be friends only with each other", Yes: "50" },
                {first: "you can go 50 years back in time", but: "you can never talk to someone you know today ever again", Yes: "18" },
                {first: "you got free access to all games, movies, books and comics, and free food every day!", but: "you may not leave your home for 10 years", Yes: "42" },
                {first: "you get $500 everyday", but: "every year you will be 1cm shorter", Yes: "39" },
                {first: "you could go down into split without problem", but: "once a year you get kicked between your legs", Yes: "31" },
                {first: "the next person you kiss will be crazy in love with you and never be able to leave you", but: "you had to kiss a person within 24 hours, otherwise you'll be forever alone", Yes: "55" },
                {first: "you could get the house of your dreams which contains everything you'll ever need", but: "you never get to leave it", Yes: "39" },
                {first: "you could know any person's name, age and gender", but: "nobody remembers your name", Yes: "22" },
                {first: "you got anglewings that let you fly", but: "they were 7 feet long, 3 feet wide and was part of your body", Yes: "54" },
                {first: "you become a hero and get a lot of things named after you", but: "you die 40 years prematurely", Yes: "13" },
                {first: "you got a free 10 million dollar worth yatch", but: "it rains everyday for the rest of your life", Yes: "25" },
                {first: "you became twice as smart", but: "half as pretty", Yes: "27" },
                {first: "you could convince anyone to anything", but: "you could always be convinced of anything by anyone", Yes: "18" },
                {first: "you had an USB connection in your neck, where you could save and read information", but: "you dreamed only in the form of ones and zeroes", Yes: "43" },
                {first: "you are sick half as often", but: "when you are, you are two times as sick", Yes: "24" },
                {first: "you could magically make cats appear", but: "each cat died 7 days later", Yes: "23" },
                {first: "any religion of your choice becomes the truth", but: "you must spend the rest of your life with persuading everyone that it really was", Yes: "31" },
                {first: "you had four arms", but: "only one leg", Yes: "10" },
                {first: "you could have the soulmate of your dreams", but: "never have your dream job", Yes: "59" },
                {first: "you could live 1000 years in the future", but: "had to stay frozen until that time", Yes: "32" },
                {first: "you could live 100 years longer in the body of a 25 years old", but: "you got buried alive", Yes: "19" },
                {first: "you had to live on a deserted island for 10 years", but: "when you came you got $1000000", Yes: "41" },
                {first: "you get together with the partner of your dreams", but: "you will never be happy with your job", Yes: "51" },
                {first: "you became twice as popular", but: "you lose half of your teeth", Yes: "9" },
                {first: "you could speak to yourself 10 years in the past", but: "eveything you say must be lies", Yes: "24" },
                {first: "your farts smell like candy", but: "is deadly if one takes 2 deep breaths of it", Yes: "23" },
                {first: "you could get the haircut you always wanted", but: "you could never change it", Yes: "39" },
                {first: "you could jump twice as high", but: "run half as slow", Yes: "23" },
                {first: "you could read twice as fast", but: "had to talk twice as fast", Yes: "38" },
                {first: "you could teleport yourself anywhere you wanted", but: "when you did, someone swapped places with you", Yes: "54" },
                {first: "you could eat as much ice-cream as you wanted without it affecting your health", but: "you had to drive an ice-cream van for the rest of your life", Yes: "29" },
                {first: "you could get 4 inches taller", but: "your arms came 2 inches shorter", Yes: "21" },
               
                

            ],
            WELCOME: 'Welcome to the "what if" game',
            SKILL_NAME: 'What if...',
            GET_WHAT_IF_MESSAGE: "what <emphasis level = 'strong' >if... </emphasis>",
            GET_BUT_MESSAGE: "<break time = '1s' /><emphasis level = 'strong' >but... </emphasis>",
            HELP_MESSAGE: 'I will ask you what if... kind of questions, you can reply with a "Yes" if you agree or "no" if you do not agree. You can also say begin, pause, or, you can say stop at any point in time... What can I help you with?',
            HELP_REPROMPT: 'What can I help you with?',
            STOP_MESSAGE: 'So, thank you for playing the game "what if...". I hope to see you again. <say-as interpret-as = "interjection">au revoir</say-as>',
        },
    },
    'en-US': {
        translation: {
            DATA: [
                {first: "Pokemon is for real", but: "all the normal animals are extinct", Yes: "40" },
                {first: "you never sleep longer than 5 hours a night", but: "you could craft and control your dreams every night", Yes: "69" },
                {first: "you could have any one super hero's powers", but: "a super villain will always be looking to get you killed", Yes: "57" },
                {first: "the sun shines when you are happy", but: "it rains when you are sad", Yes: "78" },
                {first: "you could make an app developer very happy", but: "you have to rate 5 stars", Yes: "48" },
                {first: "you can read anybody's mind", but: "you fart continuously for as long as you do so", Yes: "42" },
                {first: "you become a world famous athlete and earn 5 million dollars a year", but: "you become super fat", Yes: "71" },
                {first: "you never get fat", but: "but never get hungry", Yes: "70" },
                {first: "you get your dream job", but: "you get paid in chocolate bars", Yes: "32" },
                {first: "you become twice as attractive", but: "half as smart", Yes: "31" },
                {first: "you can never catch a cold", but: "you may never have matching shoes", Yes: "34" },
                {first: "you are twice as attractive ", but: "every Friday you are transformed into an equally attractive person of opposite gender", Yes: "69" },
                {first: "there was a always a new hundred dollar bill in your pocket", but: "every time you pick one up an animal dies on the other side of the world", Yes: "64" },
                {first: "what you say can never bring you negative consequences", but: "you must always speak with a rough Scottish accent", Yes: "58" },
                {first: "you can never lose", but: "you never fall in love", Yes: "82" },
                {first: "the first thing you hear every morning is <break time = '1s' /> I love you", but: "it is always different person who says it", Yes: "37" },
                {first: "you have a bag of chips that never gets empty", but: "you will never be loved", Yes: "10" },
                {first: "you got a magic printer which could print real money", but: "you need to wear a kilt for the rest of your life", Yes: "46" },
                {first: "you point out five people that along with yourself would be terribly successful", but: "you also need to point out five people whose lives will be destroyed", Yes: "54" },
                {first: "your home was always sparkly clean, and all duties at home were done automatically", but: "you must always wear dirty boots wherever you are", Yes: "35" },
                {first: "you are always in good shape", but: "you have to exercise a few times a week", Yes: "85", },
                {first: "you live happily ever after", but: "you have to kiss and marry the person closet to you", Yes: "45" },
                {first: "you could accomplish anything", but: "you had to sacrifice time, sweat and tears to make it", Yes: "76" },
                {first: "you sleep well every night and wake up very happy and refreshed every morning", but: "you'll have to sleep alone for the rest of your life", Yes: "78" },
                {first: "your lifespan is increased by fifty healthy years", but: "you step on a lego brick when you least expect it a couple of times a day for the rest of your life", Yes: "48" },
                {first: "you become a Jedi Knight", but: "your best friend becomes a Sith Lord", Yes: "41" },
                {first: "you get 10000 dollars per month of 25 years", but: "for the next 5 years you may never change your clothes", Yes: "31" },
                {first: "you could take anything without being caught for it", but: "every time you took something someone innocent was accused and convicted for it", Yes: "33" },
                {first: "you got over a hundred likes on every photo you post on Facebook", but: "you have to squint excessively and have you finger up your nose in all the pictures", Yes: "12" },
                {first: "time passes after your watch", but: "when your watch stops working, time stops forever <break time = '3s' />", Yes: "29" },
                {first: "your salary tripled", but: "you had to work at McDonalds", Yes: "62" },
                {first: "you got a clone of yourself that obeys your orders", but: "it falls in love with the same person you fall in love with", Yes: "30" },
                {first: "you can never fail", but: "you can never give up", Yes: "80" },
                {first: "you learned everything there is to know about any two programming languages", but: "you inherit twelve chickens, a horse and a pair of pigs on a farm, that you have to take care of all by yourself", Yes: "42" },
                {first: "you got to hang out with Justin Beiber for three days", but: "you had to sing in his next single", Yes: "26" },
                {first: "you could play the accordion", but: "you have to brag about it, <emphasis level = 'strong'> every day! </emphasis>", Yes: "21" },
                {first: "you will be the next president and will be paid 200000 dollars per month", but: "you must represent the party, you certainly would not want to vote for", Yes: "42" },
                {first: "all people were black", but: "you were white", Yes: "28" },
                {first: "aliens came to earth", but: "a war started between us that lasted for ten years", Yes: "20" },
                {first: "your farts are always 100 percent silent", but: "they smell twice as bad", Yes: "29" },
                {first: "you were lucky and happy every day", but: "you turned into an animal of your choice", Yes: "49" },
                {first: "you get to know when and how you die", but: "you can't affect it in any way what so ever", Yes: "41" },
                {first: "you got to design your partners looks and personality", but: "your partner gets to design yours as well", Yes: "59" },
                {first: "all your meals were cooked by the best master chef", but: "you must always eat with your hands only", Yes: "66" },
                {first: "you could see a year into the future", but: "you forget two of your earliest years of life each year", Yes: "22" },
                {first: "you and everyone you know live 100 youthful years longer", but: "you may never change socks or underwear", Yes: "27" },
                {first: "you could change gender whenever you wanted", but: "you become slightly uglier every time you did", Yes: "14" },
                {first: "you could be any animal", but: "never be human again", Yes: "26" },
                {first: "you get infinite money", but: "everyone in the world, except you, who are over 30 years die", Yes: "18" },
                {first: "you could turn water into Coca-cola", but: "you only get to drink that for the rest of your life", Yes: "26" },
                {first: "everyone in the world lived good lives", but: "you get to sleep for only 4 hours in a day for next 10 years", Yes: "24" },
                {first: "your biggest fear disappeared", but: "you had to give it to your closest friend", Yes: "40" },
                {first: "heaven and hell existed", but: "if you answer \"yes\" you are commiting an unforgivable sin and will go to hell", Yes: "28" },
                {first: "your hair changed color everyday", but: "every day you get $100", Yes: "81" },
                {first: "you got a luxury villa just by the beach", but: "all sand you walk on is quicksand", Yes: "18" },
                {first: "you got to hand with any celebrity for a whole week", but: "paparazii followed you all week", Yes: "72" },
                {first: "you get to be any disney prince or princess", but: "you won\'t live happily ever after", Yes: "13" },
                {first: "you became best friends with Bill Gates", but: "he gets jealous if you hand out with other people for too long", Yes: "40" },
                {first: "you die 15 years earlier", but: "you are always in ideal physical shape", Yes: "29" },
                {first: "you got to travel 500 years into the future for a day, then back again", but: "your right hand became a foot", Yes: "14" },
                {first: "it is always the perfect temperature wherever you go", but: "your bed is always freezing", Yes: "35" },
                {first: "you had a tree that grew money as leaves", but: "when you took money from it, 5000 other trees die", Yes: "22" },
                {first: "you received a magical window whiper that could make anything invisible", but: "you had to use it on all your shoes and socks", Yes: "35" },
                {first: "in a contest, the odds are 1 in 24 that you win $10000000", but: "it is the Hunger Games", Yes: "34" },
                {first: "you owned an underwater city", but: "you may never surface again", Yes: "35" },
                {first: "you found out when you will die", but: "you die instantly if you tell someone", Yes: "38" },
                {first: "your fridge was always full of good food", but: "you must go to church every Sunday morning", Yes: "66" },
                {first: "you could be in a movie", but: "it was kids movie", Yes: "44" },
                {first: "a restaurant opened in your honor where you chose the menu and always got free food", but: "you may never eat at any other restaurant", Yes: "61" },
                {first: "you tripple your salary", but: "you shorten your length by half", Yes: "22" },
                {first: "you could become the next king or queen of Sweden", but: "you had to marry a person of royal blood", Yes: "56" },
                {first: "you could be just as long as you want to be", but: "your partner will always be 50cm shorter than you", Yes: "32" },
                {first: "your farts are oderless", but: "they sounded twice as loud", Yes: "24" },
                {first: "you could go 50 years in the future", but: "you die 20 years later", Yes: "19" },
                {first: "you could look like whoever you wanted", but: "you never got to wear underwear again", Yes: "56" },
                {first: "you had your personal driver who drove you whenever and wherever you wanted", but: "he always drove you in a rusty old greaser car with a trailing exhaust pipe", Yes: "31" },
                {first: "you got any clothes from any store for free", but: "you can never wear matching shoes or socks again", Yes: "48" },
                {first: "you got to pick any one person to be your best friend", but: "you can be friends only with each other", Yes: "50" },
                {first: "you can go 50 years back in time", but: "you can never talk to someone you know today ever again", Yes: "18" },
                {first: "you got free access to all games, movies, books and comics, and free food every day!", but: "you may not leave your home for 10 years", Yes: "42" },
                {first: "you get $500 everyday", but: "every year you will be 1cm shorter", Yes: "39" },
                {first: "you could go down into split without problem", but: "once a year you get kicked between your legs", Yes: "31" },
                {first: "the next person you kiss will be crazy in love with you and never be able to leave you", but: "you had to kiss a person within 24 hours, otherwise you'll be forever alone", Yes: "55" },
                {first: "you could get the house of your dreams which contains everything you'll ever need", but: "you never get to leave it", Yes: "39" },
                {first: "you could know any person's name, age and gender", but: "nobody remembers your name", Yes: "22" },
                {first: "you got anglewings that let you fly", but: "they were 7 feet long, 3 feet wide and was part of your body", Yes: "54" },
                {first: "you become a hero and get a lot of things named after you", but: "you die 40 years prematurely", Yes: "13" },
                {first: "you got a free 10 million dollar worth yatch", but: "it rains everyday for the rest of your life", Yes: "25" },
                {first: "you became twice as smart", but: "half as pretty", Yes: "27" },
                {first: "you could convince anyone to anything", but: "you could always be convinced of anything by anyone", Yes: "18" },
                {first: "you had an USB connection in your neck, where you could save and read information", but: "you dreamed only in the form of ones and zeroes", Yes: "43" },
                {first: "you are sick half as often", but: "when you are, you are two times as sick", Yes: "24" },
                {first: "you could magically make cats appear", but: "each cat died 7 days later", Yes: "23" },
                {first: "any religion of your choice becomes the truth", but: "you must spend the rest of your life with persuading everyone that it really was", Yes: "31" },
                {first: "you had four arms", but: "only one leg", Yes: "10" },
                {first: "you could have the soulmate of your dreams", but: "never have your dream job", Yes: "59" },
                {first: "you could live 1000 years in the future", but: "had to stay frozen until that time", Yes: "32" },
                {first: "you could live 100 years longer in the body of a 25 years old", but: "you got buried alive", Yes: "19" },
                {first: "you had to live on a deserted island for 10 years", but: "when you came you got $1000000", Yes: "41" },
                {first: "you get together with the partner of your dreams", but: "you will never be happy with your job", Yes: "51" },
                {first: "you became twice as popular", but: "you lose half of your teeth", Yes: "9" },
                {first: "you could speak to yourself 10 years in the past", but: "eveything you say must be lies", Yes: "24" },
                {first: "your farts smell like candy", but: "is deadly if one takes 2 deep breaths of it", Yes: "23" },
                {first: "you could get the haircut you always wanted", but: "you could never change it", Yes: "39" },
                {first: "you could jump twice as high", but: "run half as slow", Yes: "23" },
                {first: "you could read twice as fast", but: "had to talk twice as fast", Yes: "38" },
                {first: "you could teleport yourself anywhere you wanted", but: "when you did, someone swapped places with you", Yes: "54" },
                {first: "you could eat as much ice-cream as you wanted without it affecting your health", but: "you had to drive an ice-cream van for the rest of your life", Yes: "29" },
                {first: "you could get 4 inches taller", but: "your arms came 2 inches shorter", Yes: "21" },
        
            ],
             WELCOME: 'Welcome to the "what if" game',
            SKILL_NAME: 'What if...',
            GET_WHAT_IF_MESSAGE: "what <emphasis level = 'strong' >if... </emphasis>",
            GET_BUT_MESSAGE: "<break time = '1s' /><emphasis level = 'strong' >but... </emphasis>",
            HELP_MESSAGE: 'I will ask you what if... kind of questions, you can reply with a "Yes" if you agree or "no" if you do not agree. You can also say begin, pause, or, you can say stop at any point in time... What can I help you with?',
            HELP_REPROMPT: 'What can I help you with?',
            STOP_MESSAGE: 'So, thank you for playing the game "what if...". I hope to see you again. <say-as interpret-as = "interjection">au revoir</say-as>',
        
        },
    },
    'en-GB': {
        translation: {
            DATA: [
                {first: "Pokemon is for real", but: "all the normal animals are extinct", Yes: "40" },
                {first: "you never sleep longer than 5 hours a night", but: "you could craft and control your dreams every night", Yes: "69" },
                {first: "you could have any one super hero's powers", but: "a super villain will always be looking to get you killed", Yes: "57" },
                {first: "the sun shines when you are happy", but: "it rains when you are sad", Yes: "78" },
                {first: "you could make an app developer very happy", but: "you have to rate 5 stars", Yes: "48" },
                {first: "you can read anybody's mind", but: "you fart continuously for as long as you do so", Yes: "42" },
                {first: "you become a world famous athlete and earn 5 million dollars a year", but: "you become super fat", Yes: "71" },
                {first: "you never get fat", but: "but never get hungry", Yes: "70" },
                {first: "you get your dream job", but: "you get paid in chocolate bars", Yes: "32" },
                {first: "you become twice as attractive", but: "half as smart", Yes: "31" },
                {first: "you can never catch a cold", but: "you may never have matching shoes", Yes: "34" },
                {first: "you are twice as attractive ", but: "every Friday you are transformed into an equally attractive person of opposite gender", Yes: "69" },
                {first: "there was a always a new hundred dollar bill in your pocket", but: "every time you pick one up an animal dies on the other side of the world", Yes: "64" },
                {first: "what you say can never bring you negative consequences", but: "you must always speak with a rough Scottish accent", Yes: "58" },
                {first: "you can never lose", but: "you never fall in love", Yes: "82" },
                {first: "the first thing you hear every morning is <break time = '1s' /> I love you", but: "it is always different person who says it", Yes: "37" },
                {first: "you have a bag of chips that never gets empty", but: "you will never be loved", Yes: "10" },
                {first: "you got a magic printer which could print real money", but: "you need to wear a kilt for the rest of your life", Yes: "46" },
                {first: "you point out five people that along with yourself would be terribly successful", but: "you also need to point out five people whose lives will be destroyed", Yes: "54" },
                {first: "your home was always sparkly clean, and all duties at home were done automatically", but: "you must always wear dirty boots wherever you are", Yes: "35" },
                {first: "you are always in good shape", but: "you have to exercise a few times a week", Yes: "85", },
                {first: "you live happily ever after", but: "you have to kiss and marry the person closet to you", Yes: "45" },
                {first: "you could accomplish anything", but: "you had to sacrifice time, sweat and tears to make it", Yes: "76" },
                {first: "you sleep well every night and wake up very happy and refreshed every morning", but: "you'll have to sleep alone for the rest of your life", Yes: "78" },
                {first: "your lifespan is increased by fifty healthy years", but: "you step on a lego brick when you least expect it a couple of times a day for the rest of your life", Yes: "48" },
                {first: "you become a Jedi Knight", but: "your best friend becomes a Sith Lord", Yes: "41" },
                {first: "you get 10000 dollars per month of 25 years", but: "for the next 5 years you may never change your clothes", Yes: "31" },
                {first: "you could take anything without being caught for it", but: "every time you took something someone innocent was accused and convicted for it", Yes: "33" },
                {first: "you got over a hundred likes on every photo you post on Facebook", but: "you have to squint excessively and have you finger up your nose in all the pictures", Yes: "12" },
                {first: "time passes after your watch", but: "when your watch stops working, time stops forever <break time = '3s' />", Yes: "29" },
                {first: "your salary tripled", but: "you had to work at McDonalds", Yes: "62" },
                {first: "you got a clone of yourself that obeys your orders", but: "it falls in love with the same person you fall in love with", Yes: "30" },
                {first: "you can never fail", but: "you can never give up", Yes: "80" },
                {first: "you learned everything there is to know about any two programming languages", but: "you inherit twelve chickens, a horse and a pair of pigs on a farm, that you have to take care of all by yourself", Yes: "42" },
                {first: "you got to hang out with Justin Beiber for three days", but: "you had to sing in his next single", Yes: "26" },
                {first: "you could play the accordion", but: "you have to brag about it, <emphasis level = 'strong'> every day! </emphasis>", Yes: "21" },
                {first: "you will be the next president and will be paid 200000 dollars per month", but: "you must represent the party, you certainly would not want to vote for", Yes: "42" },
                {first: "all people were black", but: "you were white", Yes: "28" },
                {first: "aliens came to earth", but: "a war started between us that lasted for ten years", Yes: "20" },
                {first: "your farts are always 100 percent silent", but: "they smell twice as bad", Yes: "29" },
                {first: "you were lucky and happy every day", but: "you turned into an animal of your choice", Yes: "49" },
                {first: "you get to know when and how you die", but: "you can't affect it in any way what so ever", Yes: "41" },
                {first: "you got to design your partners looks and personality", but: "your partner gets to design yours as well", Yes: "59" },
                {first: "all your meals were cooked by the best master chef", but: "you must always eat with your hands only", Yes: "66" },
                {first: "you could see a year into the future", but: "you forget two of your earliest years of life each year", Yes: "22" },
                {first: "you and everyone you know live 100 youthful years longer", but: "you may never change socks or underwear", Yes: "27" },
                {first: "you could change gender whenever you wanted", but: "you become slightly uglier every time you did", Yes: "14" },
                {first: "you could be any animal", but: "never be human again", Yes: "26" },
                {first: "you get infinite money", but: "everyone in the world, except you, who are over 30 years die", Yes: "18" },
                {first: "you could turn water into Coca-cola", but: "you only get to drink that for the rest of your life", Yes: "26" },
                {first: "everyone in the world lived good lives", but: "you get to sleep for only 4 hours in a day for next 10 years", Yes: "24" },
                {first: "your biggest fear disappeared", but: "you had to give it to your closest friend", Yes: "40" },
                {first: "heaven and hell existed", but: "if you answer \"yes\" you are commiting an unforgivable sin and will go to hell", Yes: "28" },
                {first: "your hair changed color everyday", but: "every day you get $100", Yes: "81" },
                {first: "you got a luxury villa just by the beach", but: "all sand you walk on is quicksand", Yes: "18" },
                {first: "you got to hand with any celebrity for a whole week", but: "paparazii followed you all week", Yes: "72" },
                {first: "you get to be any disney prince or princess", but: "you won\'t live happily ever after", Yes: "13" },
                {first: "you became best friends with Bill Gates", but: "he gets jealous if you hand out with other people for too long", Yes: "40" },
                {first: "you die 15 years earlier", but: "you are always in ideal physical shape", Yes: "29" },
                {first: "you got to travel 500 years into the future for a day, then back again", but: "your right hand became a foot", Yes: "14" },
                {first: "it is always the perfect temperature wherever you go", but: "your bed is always freezing", Yes: "35" },
                {first: "you had a tree that grew money as leaves", but: "when you took money from it, 5000 other trees die", Yes: "22" },
                {first: "you received a magical window whiper that could make anything invisible", but: "you had to use it on all your shoes and socks", Yes: "35" },
                {first: "in a contest, the odds are 1 in 24 that you win $10000000", but: "it is the Hunger Games", Yes: "34" },
                {first: "you owned an underwater city", but: "you may never surface again", Yes: "35" },
                {first: "you found out when you will die", but: "you die instantly if you tell someone", Yes: "38" },
                {first: "your fridge was always full of good food", but: "you must go to church every Sunday morning", Yes: "66" },
                {first: "you could be in a movie", but: "it was kids movie", Yes: "44" },
                {first: "a restaurant opened in your honor where you chose the menu and always got free food", but: "you may never eat at any other restaurant", Yes: "61" },
                {first: "you tripple your salary", but: "you shorten your length by half", Yes: "22" },
                {first: "you could become the next king or queen of Sweden", but: "you had to marry a person of royal blood", Yes: "56" },
                {first: "you could be just as long as you want to be", but: "your partner will always be 50cm shorter than you", Yes: "32" },
                {first: "your farts are oderless", but: "they sounded twice as loud", Yes: "24" },
                {first: "you could go 50 years in the future", but: "you die 20 years later", Yes: "19" },
                {first: "you could look like whoever you wanted", but: "you never got to wear underwear again", Yes: "56" },
                {first: "you had your personal driver who drove you whenever and wherever you wanted", but: "he always drove you in a rusty old greaser car with a trailing exhaust pipe", Yes: "31" },
                {first: "you got any clothes from any store for free", but: "you can never wear matching shoes or socks again", Yes: "48" },
                {first: "you got to pick any one person to be your best friend", but: "you can be friends only with each other", Yes: "50" },
                {first: "you can go 50 years back in time", but: "you can never talk to someone you know today ever again", Yes: "18" },
                {first: "you got free access to all games, movies, books and comics, and free food every day!", but: "you may not leave your home for 10 years", Yes: "42" },
                {first: "you get $500 everyday", but: "every year you will be 1cm shorter", Yes: "39" },
                {first: "you could go down into split without problem", but: "once a year you get kicked between your legs", Yes: "31" },
                {first: "the next person you kiss will be crazy in love with you and never be able to leave you", but: "you had to kiss a person within 24 hours, otherwise you'll be forever alone", Yes: "55" },
                {first: "you could get the house of your dreams which contains everything you'll ever need", but: "you never get to leave it", Yes: "39" },
                {first: "you could know any person's name, age and gender", but: "nobody remembers your name", Yes: "22" },
                {first: "you got anglewings that let you fly", but: "they were 7 feet long, 3 feet wide and was part of your body", Yes: "54" },
                {first: "you become a hero and get a lot of things named after you", but: "you die 40 years prematurely", Yes: "13" },
                {first: "you got a free 10 million dollar worth yatch", but: "it rains everyday for the rest of your life", Yes: "25" },
                {first: "you became twice as smart", but: "half as pretty", Yes: "27" },
                {first: "you could convince anyone to anything", but: "you could always be convinced of anything by anyone", Yes: "18" },
                {first: "you had an USB connection in your neck, where you could save and read information", but: "you dreamed only in the form of ones and zeroes", Yes: "43" },
                {first: "you are sick half as often", but: "when you are, you are two times as sick", Yes: "24" },
                {first: "you could magically make cats appear", but: "each cat died 7 days later", Yes: "23" },
                {first: "any religion of your choice becomes the truth", but: "you must spend the rest of your life with persuading everyone that it really was", Yes: "31" },
                {first: "you had four arms", but: "only one leg", Yes: "10" },
                {first: "you could have the soulmate of your dreams", but: "never have your dream job", Yes: "59" },
                {first: "you could live 1000 years in the future", but: "had to stay frozen until that time", Yes: "32" },
                {first: "you could live 100 years longer in the body of a 25 years old", but: "you got buried alive", Yes: "19" },
                {first: "you had to live on a deserted island for 10 years", but: "when you came you got $1000000", Yes: "41" },
                {first: "you get together with the partner of your dreams", but: "you will never be happy with your job", Yes: "51" },
                {first: "you became twice as popular", but: "you lose half of your teeth", Yes: "9" },
                {first: "you could speak to yourself 10 years in the past", but: "eveything you say must be lies", Yes: "24" },
                {first: "your farts smell like candy", but: "is deadly if one takes 2 deep breaths of it", Yes: "23" },
                {first: "you could get the haircut you always wanted", but: "you could never change it", Yes: "39" },
                {first: "you could jump twice as high", but: "run half as slow", Yes: "23" },
                {first: "you could read twice as fast", but: "had to talk twice as fast", Yes: "38" },
                {first: "you could teleport yourself anywhere you wanted", but: "when you did, someone swapped places with you", Yes: "54" },
                {first: "you could eat as much ice-cream as you wanted without it affecting your health", but: "you had to drive an ice-cream van for the rest of your life", Yes: "29" },
                {first: "you could get 4 inches taller", but: "your arms came 2 inches shorter", Yes: "21" },
        
            ],
             WELCOME: 'Welcome to the "what if" game',
            SKILL_NAME: 'What if...',
            GET_WHAT_IF_MESSAGE: "what <emphasis level = 'strong' >if... </emphasis>",
            GET_BUT_MESSAGE: "<break time = '1s' /><emphasis level = 'strong' >but... </emphasis>",
            HELP_MESSAGE: 'I will ask you what if... kind of questions, you can reply with a "Yes" if you agree or "no" if you do not agree. You can also say begin, pause, or, you can say stop at any point in time... What can I help you with?',
            HELP_REPROMPT: 'What can I help you with?',
            STOP_MESSAGE: 'So, thank you for playing the game "what if...". I hope to see you again. Bye-bye',
        
        },
    },
};

const handlers = {
    'LaunchRequest': function () {
        var speak;
        if (!this.attributes['currentStep'] ) {

              speak = this.t('WELCOME') + ' ' + this.t('HELP_MESSAGE');
              this.response.cardRenderer(this.t('SKILL_NAME'), this.t('WELCOME'),null);
              currentStep = 1;
          } else {
              
              speak = '<say-as interpret-as = "interjection"> Welcome back!</say-as> To continue with the game say begin or say stop to end the game';
              var card = 'Welcome back. Let\'s continue with the game, say, begin';
              currentStep = this.attributes['currentStep'];
              this.response.cardRenderer(card);
              
          }
          
          this.response.speak(speak).listen(speak);
          this.emit(':responseReady');
    },
    'AskQuestion': function () {
        this.emit('GetQuestion');
    },
    'Reset':function() {
      if(this.attributes['currentStep']) {
          say = '';
          this.attributes['currentStep'] = 1;
          currentStep = 1;
      } else {
          this.emit('LaunchRequest');
      } 
      var speak = 'Game has been reset. Say begin to begin again';
      var result = speak.replace(regexp, '');

      this.response.cardRenderer(this.t('SKILL_NAME'), result, null);
      this.response.speak(speak).listen(speak);
      this.emit(':responseReady');
    },
    'GetQuestion': function () {
        // Get a random space fact from the space facts list
        // Use this.t() to get corresponding language data
        
        const QuesArr = this.t('DATA');
        const QuesIndex = currentStep;
            
        randomQuestion = QuesArr[QuesIndex - 1];

        speechOutput = this.t('GET_WHAT_IF_MESSAGE') + randomQuestion.first + this.t('GET_BUT_MESSAGE') + randomQuestion.but;
        cardOutputQues = 'What if ' + randomQuestion.first + ' but ' + randomQuestion.but + '?';

        // Create speech output
        if(say !== undefined && cardOutput !== undefined ) {
            speechOutput = say + speechOutput;
            cardOutputQues = cardOutput + 'Next Question: \n' + cardOutputQues;
        }
        
        var result = cardOutputQues.replace(regexp, '');

        speechOutput = speechOutput + '<break time = "1s" />' + help[getRandom(0, help.length-1)];
        this.response.cardRenderer(this.t('SKILL_NAME'), result, null);
        this.response.speak(speechOutput).listen(speechOutput);
        this.emit(":responseReady");
        console.log('Listening...');
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = this.t('HELP_MESSAGE');
        const reprompt = this.t('HELP_MESSAGE');
        var result = speechOutput.replace(regexp, '');
        
        this.response.cardRenderer(this.t('SKILL_NAME'), result);
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'AMAZON.StopIntent': function () {
          say = '';
          this.emit('SessionEndedRequest');
    },
    'SessionEndedRequest': function () {
          console.log('session ended!');
          say = '';
          var randomGoodbye = getRandom(0, stopStrings.length - 1);
          
          this.response.cardRenderer(this.t('SKILL_NAME'), stopStrings[randomGoodbye], null);
          this.response.speak(stopStrings[randomGoodbye] + ' ' +this.t('STOP_MESSAGE'));
          this.emit(':responseReady');
     },
    'AMAZON.YesIntent' : function() {
        var yes = parseInt(randomQuestion.Yes);

        if( yes >= 50) {
            say = getSpeechCon('Yes') + randomQuestion.Yes + ' percent people think just like you!' + getSpeechCon('YesComments')+ '<break time = "2s" />';
        }else {
            say = getSpeechCon('No') + randomQuestion.Yes + ' percent people think just like you!' + getSpeechCon('NoComments') + '<break time = "2s" />';
        }
        
        cardOutput = '\n' + randomQuestion.Yes + '% people also said yes and agree with you!\n';
        randomQuestion.Yes = (Math.round(yes + 0.01)).toString();
        currentStep = incrementStep.call(this, 1);
        this.emit('GetQuestion');
    },
    'AMAZON.NoIntent' : function() {
        var yes = parseInt(randomQuestion.Yes);
         var noPercent = 100 - yes;

        if( noPercent > 50) {
            say = getSpeechCon('Yes') + noPercent + ' percent people think just like you!' + getSpeechCon('YesComments') + '<break time = "2s" />';
        }else {
            say = getSpeechCon('No') + noPercent + ' percent people think just like you!' + getSpeechCon('NoComments') + '<break time = "2s" />';
        }

         cardOutput = '\n' + noPercent + '% people also said No.\n';
         randomQuestion.Yes = (Math.round(yes - 0.01)).toString();
         currentStep = incrementStep.call(this, 1);
         this.emit('GetQuestion');
    },
    'AMAZON.RepeatIntent':function() {
        say = '';
        cardOutput = '';
        this.emit('GetQuestion');
    },
    'AMAZON.PauseIntent':function() {
        var wait =
        'You have 10 seconds to make up your mind. Say "begin" to play or say "stop" to exit. 10\
        <break time="500ms" />9<break time="500ms" />8<break time="500ms" />7<break time="500ms" />6<break time="500ms" />5\
        <break time="500ms" />4<break time="500ms" />3<break time="500ms" />2<break time="500ms" />1<break time="500ms" />0.\
        Say "begin" or "stop"';
        say = '';
        
        var result = 'You have 10 seconds to make up your mind. Say "begin" to play or say "stop" to exit after 10 seconds.';

        this.response.cardRenderer(this.t('SKILL_NAME'), result);
        this.response.speak(wait).listen(wait);
        this.emit(':responseReady');
        
        
    },
    'Unhandled': function() {
        this.response.speak('Sorry, I didn\'t get that. Try saying "yes" or "no".')
                    .listen('Try saying "yes" or "no".');
        this.emit(':responseReady');
    }
};

exports.handler = function (event, context, callback) {
     var alexa = Alexa.handler(event, context);
      // alexa.appId = 'amzn1.echo-sdk-ams.app.1234';
       alexa.dynamoDBTableName = 'WhatIfTable'; // creates new table for session.attributes
      if (alexa.dynamoDBTableName == 'WhatIfTable' ){
        persistenceEnabled=true;
      } else {
        persistenceEnabled=false;
      }
      alexa.resources = languageStrings;
      alexa.registerHandlers(handlers);
      alexa.execute();
};

function getSpeechCon(type)
{
    if (type === 'Yes') return "<say-as interpret-as='interjection'>" + speechConsYes[getRandom(0, speechConsYes.length-1)] + "! </say-as><break strength='strong'/>";
    else if (type === 'No') return "<say-as interpret-as='interjection'>" + speechConsNo[getRandom(0, speechConsNo.length-1)] + " </say-as><break strength='strong'/>";
    else if (type === 'NoComments') return "<say-as interpret-as='interjection'>" + speechConsNoComments[getRandom(0, speechConsNoComments.length-1)] + " </say-as><break strength='strong'/>";
    else return "<say-as interpret-as='interjection'>" + speechConsYesComments[getRandom(0, speechConsYesComments.length-1)] + " </say-as><break strength='strong'/>";
}

function getRandom(min, max)
{
    return Math.floor(Math.random() * (max-min+1)+min);
}

 function incrementStep(increment){
    if (!this.attributes['currentStep'] ) {
        this.attributes['currentStep'] = 1;
        currentStep = 1;

    } else {
        this.attributes['currentStep'] = this.attributes['currentStep'] + increment;
        if (this.attributes['currentStep'] < 1 || this.attributes['currentStep'] > this.t('DATA').length) {
          this.attributes['currentStep'] = 1;
          currentStep = 1;
        }
    }
    return this.attributes['currentStep'];
  }
