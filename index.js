var twitter = require("twitter");

// Slack Webhook Key
var slackURL = "";
var slackBot = require("slack-bot")(slackURL);

// Twitter oauth key
var client = new twitter({
    consumer_key: '',
    consumer_secret: '',
    access_token_key: '',
    access_token_secret: ''
});

// Twitter User to Follow
var userID = '214358709';

if(userID == 214358709){
    var userName = 'eewbot';}
else {var userName = userID;}

client.stream('statuses/filter', {follow: userID, filter_level: 'low'}, function(stream) {
    console.log('Connected to ' + userName);
    console.log('Monitor Started, Waiting for Earthquake.')

    stream.on('data', function(tweet) {
        if (tweet.delete != undefined) {
            return;
        }

        if (tweet.user.id_str == userID) {
            dataParse(tweet.text);
        }
    });

    stream.on('error', function(error) {
        console.log(error);
    });
});

function dataParse(inputData) {
    console.log("Earthquake Detected, Triggering Event");
    console.log(sendString);

    var parsedInput = inputData.split(',');
    var i, item, j, len, ref;
    ref = ["type", "training_mode", "announce_time", "situation", "revision", "earthquake_id", "earthquake_time", "latitude", "longitude", "epicenter", "depth", "magnitude", "seismic", "geography", "alarm"];
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
        item = ref[i];
        global[item] = parsedInput[i];
    }

    if (situation == 9){var situationString = "Final";}
    else {var situationString = "#" + revision;}

    if (type == 39 || situation == 7) {
        var sendString = "The Earthquake Warning was cancelled.";}
    else {
        var sendString =
            "Time: " + earthquake_time + ", Update: " + situationString + "\n" +
            "Epicenter: " + epicenter + " (" + latitude + "," + longitude + "), Magnitude: " + magnitude + ", Seismic: " + seismic;
    }

    if (revision == 1) {
        var output = "*An Earthquake has Occurred.*\n" + sendString;
    } else {var output = sendString;}

    slackBot.send({
        username: "Earthquake Bot",
        text: output
    });
}
