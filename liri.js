var key = require('./key.js');
var fs = require("fs");
var request = require("request");
var Spotify = require("node-spotify-api");

var spotify = new Spotify(key.spotify);

console.log(spotify);

var argument = process.argv;
var input = process.argv[2];

var search = process.argv.slice(3).join(" ");

switch(input){
    case "concert-this":
      planConcert();
    break;
  
    case "spotify-this-song":
      if(search){
        spotify(search);
      } else{
        spotify("The Sign");
      }
    break;
  
    case "movie-this":
      if(search){
        movie(search)
      } else{
        movie("Mr. Nobody")
      }
      movie();
    break;
  
    case "do-what-it-says":
      doThing();
    break; 
}

function planConcert () {
    request("https://rest.bandsintown.com/artists/" + search + "/events?app_id=codingbootcamp", function(error, response, body) {

    // console.log(JSON.parse(body));

    

    console.log(JSON.parse(body).offers.name);
    console.log(JSON.parse(body).offers.region + JSON.parse(body).offers.city);
    console.log(JSON.parse(body).offers.datetime);



});
}


function spotify(song){ 
    spotify.search({ type: 'track', query: song}, function(error, data){
      if(!error){
        for(var i = 0; i < data.tracks.items.length; i++){
          var songData = data.tracks.items[i];
          //artist
          console.log("Artist: " + songData.artists[0].name);
          //song name
          console.log("Song: " + songData.name);
          //spotify preview link
          console.log("Preview URL: " + songData.preview_url);
          //album name
          console.log("Album: " + songData.album.name);
          console.log("-----------------------");
          
          //adds text to log.txt
          fs.appendFile('log.txt', songData.artists[0].name);
          fs.appendFile('log.txt', songData.name);
          fs.appendFile('log.txt', songData.preview_url);
          fs.appendFile('log.txt', songData.album.name);
          fs.appendFile('log.txt', "-----------------------");
        }
      } else{
        console.log('Error occurred.');
      }
    });
  }

  function movie() {
    // use request package to grab data from omd api
    request("http://www.omdbapi.com/?t=" + search + "&y=&plot=short&tomatoes=true&apikey=40e9cece", function(error, response, body) {

        // if the request was successful 
        if (!error && response.statusCode === 200) {

            // log body from the omdb
            console.log("\nTitle of the movie: " + JSON.parse(body).Title);
            console.log("Year the movie came out: " + JSON.parse(body).Year);
            console.log("IMDB Rating of the movie: " + JSON.parse(body).imdbRating);
            console.log("Country where the movie was produced: " + JSON.parse(body).Country);
            console.log("Language of the movie: " + JSON.parse(body).Language);
            console.log("Plot of the movie: " + JSON.parse(body).Plot);
            console.log("Actors in the movie: " + JSON.parse(body).Actors);
            console.log("Rotten Tomatoes URL: " + JSON.parse(body).tomatoURL + "\n");


            //append data to log.txt file
            fs.appendFileSync('log.txt', `\nTitle of the movie: ${JSON.parse(body).Title}\n Year the movie came out: ${JSON.parse(body).Year}\n IMDB Rating of the movie: ${JSON.parse(body).imdbRating}\n Country where the movie was produced: ${JSON.parse(body).Country}\n Language of the movie:  ${JSON.parse(body).Language}\n Plot of the movie:  ${JSON.parse(body).Plot}\n Actors in the movie:  ${JSON.parse(body).Actors}\n Rotten Tomatoes URL: ${JSON.parse(body).tomatoURL}\n\n`)
        }
    });
}

function doThing() {
    //run readFile and store the read information into the variable "data"
    fs.readFile("random.txt", "utf8", function(err, data) {
        if (err) {
            return console.log(err);
        } else {
            var dataArr = data.split(",")
            var command = dataArr[0];
            var song = dataArr[1];

            spotify(song);
        }

    })
}

