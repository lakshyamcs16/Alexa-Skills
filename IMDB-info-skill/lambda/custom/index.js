
'use strict';

const Alexa = require('alexa-sdk');
const http = require('http');
const APP_ID = 'amzn1.ask.skill.b72692eb-2f5f-40c4-848e-b362a9b71265';  // TODO replace with your app ID (OPTIONAL).


let data = '';
var speech = "You didn't say anything", searchSpeech = "You didn't say anything";
var name = "", rating = '', search = '', InsideSearch = false, searchIndex = 0, searchData = '';
var year = null;
var movieTitle = '';
var whichIntent = 1;
var say = '';

const languageStrings = {
    'en-IN': {
        translation: {
            SKILL_NAME: 'IMDb Info',
            HELP_MESSAGE: 'You can ask me about the IMDB ratings, content rating, star cast, writers, director, box office collection, genre, release date and duration of the movie. You can also ask me the storyline of the movie.',
            HELP_REPROMPT: 'What can I help you with?',
            STOP_MESSAGE: 'IMDB info use karne ke liye aapka dhanyawaad! ',
            SORRY_MESSAGE: '<say-as interpret-as="interjection">uh oh!</say-as><break time="1s"/> I couldn\'t find this information',
        },
    },
    'en-US': {
        translation: {
            SKILL_NAME: 'IMDb Info',
            HELP_MESSAGE: 'You can ask me about the IMDB ratings, content rating, star cast, writers, director, box office collection, genre, release date and duration of the movie. You can also ask me the storyline of the movie.',
            HELP_REPROMPT: 'What can I help you with?',
            STOP_MESSAGE: 'Thank you for using IMDb info. Have a good day!',
            SORRY_MESSAGE: '<say-as interpret-as="interjection">uh oh</say-as> I couldn\'t find this information',

        },
    },
    'en-GB': {
        translation: {
           
            SKILL_NAME: 'IMDb Info',
            HELP_MESSAGE: 'You can ask me about the IMDB ratings, content rating, star cast, writers, director, box office collection, genre, release date and duration of the movie. You can also ask me the storyline of the movie.',
            HELP_REPROMPT: 'What can I help you with?',
            STOP_MESSAGE: 'Thank you for using IMDb info. Have a good day!',
            SORRY_MESSAGE: '<say-as interpret-as="interjection">uh oh</say-as> I couldn\'t find this information',
        
        },
    },
    'en-CA': {
        translation: {
            SKILL_NAME: 'IMDb Info',
            HELP_MESSAGE: 'You can ask me about the IMDB ratings, content rating, star cast, writers, director, box office collection, genre, release date and duration of the movie. You can also ask me the storyline of the movie.',
            HELP_REPROMPT: 'What can I help you with?',
            STOP_MESSAGE: 'Thank you friendly Canadians for using IMDb info. Have a wonderful day!',
            SORRY_MESSAGE: '<say-as interpret-as="interjection">uh oh</say-as> I couldn\'t find this information',
        },
    },
    
};

const handlers = {
    'LaunchRequest': function () {
        this.emit('GetMovieInfo');
    },
    'GetNewMovieInfoIntent': function () {
        this.emit('GetMovieInfo');
    },
    'GetMovieInfo': function () {
        
        whichIntent = 1;
        data = '';
        if (this.event.request.intent.slots.movieName.value) {
            name = this.event.request.intent.slots.movieName.value;
        }
        
        
        
            
                http.get('http://www.omdbapi.com/?apikey=f572d90e&t='+name+'&plot=full', (resp) => {
    
                    // A chunk of data has been recieved.
                    resp.on('data', (chunk) => {
                        data += chunk;
                    });
    
                    resp.on('end', () => {
                                var cardValue;
                                speech = JSON.parse(data);
                                
                                if(speech.Error !== undefined) {
                                    cardValue = 'Uh-oh! I don\'t have information for '+name+' movie';
                                    this.response.cardRenderer("Error 404: "+name+" not found", cardValue, null);
                                    this.response.speak('Sorry I could not find ' + name + '. Say again or to search for a movie you can say "search for Titanic"').listen('You can say "ask imdb info what is the rating of Titanic"');
                                    this.emit(':responseReady');
                                }else {
                                
                                    movieTitle = speech.Title;
                                    rating = speech.Ratings[0].Value.split('/')[0];
                                    say = movieTitle + ' released in the year of '+speech.Year+' has the IMDB rating of ' + rating + ', voted by <say-as interpret-as="cardinal">'+ speech.imdbVotes + '</say-as> people. <break time="1s"/> Would you like to know the ratings from more resources?';
                                    cardValue = 'Released Year: '+speech.Year+'\nRating: '+rating+'\nVoted by: '+speech.imdbVotes+' IMDB users.';
                                    this.response.cardRenderer(movieTitle, cardValue, speech.Poster.slice(0, -3)+'jpeg');
                                    this.response.speak(say).listen(say);
                                    this.emit(':responseReady');
                                }
                                
                                
    			    });
                });
    },
    'searchIntent':function() {
        whichIntent = 12;
        if (this.event.request.intent.slots.movieSearch.value) {
            search = this.event.request.intent.slots.movieSearch.value;
        }
        searchData = '';
        searchIndex = 0;
        http.get('http://www.omdbapi.com/?apikey=f572d90e&s='+search+'&plot=full', (resp) => {
    
                    // A chunk of data has been recieved.
                    resp.on('data', (chunk) => {
                        searchData += chunk;
                    });
    
                    resp.on('end', () => {
                                var cardValue;
                                searchSpeech = JSON.parse(searchData);
                                
                                if(searchSpeech.Error !== undefined) {
                                    cardValue = 'Uh-oh! I don\'t have information for '+name+' movie';
                                    this.response.cardRenderer("Error 404: "+name+" not found", cardValue, null);
                                    this.response.speak('Sorry I could not find ' + name + '. Say again').listen('You can say "ask imdb info what is the rating of Titanic" or to search for a movie you can say "search for Titanic"');
                                    this.emit(':responseReady');
                                }else {
                                
                                    InsideSearch = true;
                                    movieTitle = searchSpeech.Search[searchIndex].Title;
                                    say = movieTitle + ' released in the year of '+searchSpeech.Search[searchIndex].Year + '. Do you want to know about other results?' ;
                                    cardValue = 'Released Year: '+searchSpeech.Search[searchIndex].Year;
                                    this.response.cardRenderer(movieTitle, cardValue, searchSpeech.Search[searchIndex].Poster.slice(0, -3)+'jpeg');
                                    this.response.speak(say).listen(say);
                                    this.emit(':responseReady');
                                }
                                
                                
    			    });
                });
    },
    'GrossIntent': function() {
        
        var tell = '';
        var cardValue = '';
        whichIntent = 2;
    
        if(speech.BoxOffice == 'N/A') {
            tell = this.t('SORRY_MESSAGE');
            cardValue = 'Uh-oh! I don\'t have information about Box Office Collection for this movie';
        }else{
            tell = 'This movie made <say-as interpret-as="cardinal">'+speech.BoxOffice+'</say-as>';
            cardValue = 'Rating: '+rating+'\nBox Office Collection: '+speech.BoxOffice;
        }
        
        this.response.cardRenderer(movieTitle, cardValue, speech.Poster.slice(0, -3)+'png');
        this.response.speak(tell).listen(tell);
        this.emit(':responseReady');
    },
    'StarCastIntent': function () {
        whichIntent = 3;
        var cardValue;
        var stars = '';
        var item = '';
        var actors = speech.Actors.split(',');
        var len = actors.length;
        for(item = 0 ; item < len - 1; item++) {
			stars += actors[item]+', ';
		}
		
		if(len > 1) {
		    stars += ' and '+actors[len-1];
		}else{
		    stars += actors[len-1];
		}
		
		var tell = 'This movie has the star cast of '+stars;

        this.response.cardRenderer(movieTitle, 'Rating: '+rating+'\nStars: '+stars, speech.Poster.slice(0, -3)+'png');

		this.response.speak(tell).listen(tell);
        this.emit(':responseReady');
    },
    'StorylineIntent': function() {
        whichIntent = 4;

        var tell = 'The story of the movie goes like this: '+ speech.Plot;
        
        this.response.cardRenderer(movieTitle, 'Rating: '+rating+'\nStoryline\n '+speech.Plot, speech.Poster.slice(0, -3)+'png');

        this.response.speak(tell).listen(tell);
        this.emit(':responseReady');
    },
    'WritersIntent' : function() {
        whichIntent = 5;

        var writers = '';
        var item = '';
        var writersArray = speech.Writer.split(',');
        var len = writersArray.length;
        for(item = 0 ; item < len - 1; item++) {
			writers += writersArray[item]+', ';
		}
		
		if(len > 1) {
		    writers += ' and '+writersArray[len-1];
		}else{
		    writers += writersArray[len-1];
		}
		
		var tell = 'This movie was written by '+writers;

        this.response.cardRenderer(movieTitle, 'Rating: '+rating+'\nWriters: '+writers, speech.Poster.slice(0, -3)+'png');

		this.response.speak(tell).listen(tell);
        this.emit(':responseReady');
    },
    'DirectorIntent': function() {
        whichIntent = 6;

        var tell = 'The director of the movie is '+speech.Director;

        this.response.cardRenderer(movieTitle, 'Rating: '+rating+'\nDirector: '+speech.Director, speech.Poster.slice(0, -3)+'png');
        
        this.response.speak(tell).listen(tell);
        this.emit(':responseReady');
    },
    'GenreIntent':function() {
        whichIntent = 7;

        var genres = '';
        var item = '';
        var genresArray = speech.Genre.split(',');
        var len = genresArray.length;
        for(item = 0 ; item < len - 1; item++) {
			genres += genresArray[item]+', ';
		}
		
		if(len > 1) {
		    genres += ' and '+genresArray[len-1];
		}else{
		    genres += genresArray[len-1];
		}
		
		var tell = 'This movie has the genre of '+genres;

        this.response.cardRenderer(movieTitle, 'Rating: '+rating+'\nGenre: '+genres, speech.Poster.slice(0, -3)+'png');

		this.response.speak(tell).listen(tell);
        this.emit(':responseReady');
    },
    'ContentRatingIntent':function() {
        whichIntent = 8;

        var tell = 'The content rating of the movie is '+ speech.Rated;
        this.response.cardRenderer(movieTitle, 'Rating: '+rating+'\nContent Rating: '+speech.Rated, speech.Poster.slice(0, -3)+'png');
        
        this.response.speak(tell).listen(tell);
        this.emit(':responseReady');
    },
    'MovieLengthIntent' : function() {
        whichIntent = 9;

         var len = speech.Runtime.split(' ')[0];
         var tell = '';
         if(len <= 90) {
             tell = 'The movie is '+ len + ' minutes long. <say-as interpret-as="interjection"> That should be quick! </say-as>';
         }else if(len >90 && len<= 150) {
             tell = 'The movie is '+ len + ' minutes long. <say-as interpret-as="interjection"> That won\'t take long! </say-as>';

         }else if(len > 150) {
                tell = 'The movie is '+ len + ' minutes long.';
                if(speech.Ratings[0].Value.split('/')[0]>8) {
                    tell += ' But based on the ratings, I suggest you to watch it.';
                }else{
                    tell += ' Wow that\'s a long movie. <say-as interpret-as="interjection"> But I hope you enjoy it! </say-as>';
                }

         }
        this.response.cardRenderer(movieTitle, 'Rating: '+rating+'\nDuration: '+len+' minutes', speech.Poster.slice(0, -3)+'png');
        this.response.speak(tell).listen(tell);
        this.emit(':responseReady');
    },
    'ReleaseDateIntent' : function() {
        whichIntent = 10;

         var tell = 'Release date of the movie is <say-as interpret-as="date">'+ speech.Released + ' </say-as>';
        this.response.cardRenderer(movieTitle, 'Rating: '+rating+'\nReleased Date: '+speech.Released, speech.Poster.slice(0, -3)+'png');
        
        this.response.speak(tell).listen(tell);
        this.emit(':responseReady');
    },
    'NumberIntent': function() { 
            
        whichIntent = 13;
        data = '';
        var searchNumber = 0;
        speech = "You did not say anything";
        if (this.event.request.intent.slots.searchNumber.value) {
            searchNumber = this.event.request.intent.slots.searchNumber.value;
            searchNumber = parseInt(searchNumber, 10);
        }
        
        if(searchNumber > searchIndex){
            this.response.speak('Hold on there tiger! I don\'t even have that many results. trying saying a number between 0 and '+searchIndex).listen('Say a number between 0 and '+searchIndex);
            this.emit(':responseReady');
        }else{
            http.get('http://www.omdbapi.com/?apikey=f572d90e&t='+searchSpeech.Search[searchNumber].Title+'&plot=full', (resp) => {
    
                    // A chunk of data has been recieved.
                    resp.on('data', (chunk) => {
                        data += chunk;
                    });
    
                    resp.on('end', () => {
                                var cardValue;
                                speech = JSON.parse(data);
                                
                                if(speech.Error !== undefined) {
                                    cardValue = 'Uh-oh! I don\'t have information for '+name+' movie';
                                    this.response.cardRenderer("Error 404: "+name+" not found", cardValue, null);
                                    this.response.speak('Sorry I could not find ' + name + '. Say again').listen('You can say "ask imdb info what is the rating of Titanic" or to search for a movie you can say "search for Titanic"');
                                    this.emit(':responseReady');
                                }else {
                                    InsideSearch = false;
                                    movieTitle = speech.Title;
                                    rating = speech.Ratings[0].Value.split('/')[0];
                                    say = movieTitle + ' released in the year of '+speech.Year+' has the IMDB rating of ' + rating + ', voted by <say-as interpret-as="cardinal">'+ speech.imdbVotes + '</say-as> people. <break time="1s"/> Would you like to know the ratings from more resources?';
                                    cardValue = 'Released Year: '+speech.Year+'\nRating: '+rating+'\nVoted by: '+speech.imdbVotes+' IMDB users.';
                                    this.response.cardRenderer(movieTitle, cardValue, speech.Poster.slice(0, -3)+'jpeg');
                                    this.response.speak(say).listen(say);
                                    this.emit(':responseReady');
                                }
                                
                                
    			    });
                });
        }
    },
    
    'AMAZON.HelpIntent': function () {
        
        
        var cardValue = 
         'To ask the rating of a movie say "ask imdb info, what is the rating of movie_name" (Always start with this question)'
        +'\nGenre: "ask imdb info, what kind of movie is it'
        +'\nBox Office Collection: "ask imdb info, How much did the movie make'
        +'\nWriter: "ask imdb info, who wrote that movie'
        +'\nDirectors: "ask imdb info, who directed that movie'
        +'\nContent rating: "ask imdb info, what is the content rating of the movie'
        +'\nDuration: "ask imdb info, what is the duration of the movie'
        +'\nRelease date: "ask imdb info, what is the release date of the movie'
        +'\nStoryline: "ask imdb info, what is the storyline of the movie'
        +'\nMore Ratings "tell imdb info, yes'
        +'\nTo repeat the last speech, just say "tell imdb info to repeat';
        
        this.response.cardRenderer(movieTitle, 'Rating: '+rating+'\nHelp\n '+cardValue, speech.Poster.slice(0, -3)+'png');

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
    'AMAZON.YesIntent': function () {
        whichIntent = 11;

        var say;
        if(InsideSearch) { 
            searchIndex = searchIndex + 1;
            
            if(searchSpeech.totalResults >= searchIndex) {
                movieTitle = searchSpeech.Search[searchIndex].Title;
                say = movieTitle + ' released in the year of '+searchSpeech.Search[searchIndex].Year + 'Do you want to know about other results?' ;
                cardValue = 'Released Year: '+searchSpeech.Search[searchIndex].Year;
                this.response.cardRenderer(movieTitle, cardValue, searchSpeech.Search[searchIndex].Poster.slice(0, -3)+'jpeg');
                this.response.speak(say).listen(say);
                this.emit(':responseReady');  
            }else{
                this.response.speak('Those are all the results. Now you can say for example "number 2" to search for second result or you can say stop to end the session').listen('Say a result number or say stop');
                this.emit(':responseReady');
                
            }
        }else{
            if(speech.Ratings.length<3) {
                say = ' Sorry! It is not rated on other famous resources.'
            }else {
                say = 'The movie has a rating of '+speech.Ratings[0].Value.split('/')[0]+' on IMDB. '
                            + ' while rotten tomatoes has given the rating of '+speech.Ratings[1].Value
                            + ' and Metacritic gave '+speech.Ratings[2].Value.split('/')[0]+' out of 100.';
                
                var cardValue = 'IMDB: '+speech.Ratings[0].Value
                                +'\nRotten Tomatoes: '+speech.Ratings[1].Value
                                +'\nMetacritic: '+speech.Ratings[2].Value;
                this.response.cardRenderer(movieTitle, cardValue, speech.Poster.slice(0, -3)+'jpeg');
            }
            this.emit(':tell', say);
        }
    },
    'AMAZON.NoIntent': function () {
      if(InsideSearch){
          InsideSearch = false;
          say = 'Okay. But if you want to know more about the movie from the search results you can say the search result number. Now, if you have a number in mind you can say it now or you can say stop to say goodbye';
          var reprompt = "Please say a number to search for";
          this.response.speak(say).listen(reprompt);
          this.emit(':responseReady');
      }  
    },
    'AMAZON.RepeatIntent':function() {
        switch(whichIntent){
            case 1: this.response.speak(say).listen(say);
                    this.emit(':responseReady');
                    break;
            case 2: this.emit('GrossIntent');
                    break;
            case 3: this.emit('StarCastIntent');
                    break;
            case 4: this.emit('StorylineIntent');
                    break;
            case 5: this.emit('WritersIntent');
                    break;
            case 6: this.emit('DirectorIntent');
                    break;
            case 7: this.emit('GenreIntent');
                    break;
            case 8: this.emit('ContentRatingIntent');
                    break;
            case 9: this.emit('MovieLengthIntent');
                    break;
            case 10:this.emit('ReleaseDateIntent');
                    break;
            case 11:this.emit('AMAZON.YesIntent');
                    break;
            default:
                    this.emit(':tell', 'Please ask me about the rating of a movie.');
        }
    }
};

exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
