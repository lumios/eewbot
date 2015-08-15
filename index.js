var twitter = require("twitter");
var trans = require("./epicenter.json");

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

var userID = 214358709; // eewbot
//var userID = 3313238022; // LighterBot1
//var userID = 1875425748; // kurisubrooks

if(userID == 214358709){
    var userName = 'eewbot';}
else if(userID == 3313238022){
    var userName = 'lighterbot1';}
else {var userName = userID;}

client.stream('statuses/filter', {follow: userID, filter_level: 'low'}, function(stream) {
    console.log('Connected to ' + userName);
    console.log('Monitor Started, Waiting for Earthquake.')
    slackBot.send({
        username: "Earthquake Bot",
        text: "Connected."
    });

    stream.on('data', function(tweet) {
        if (tweet.delete != undefined) {
            return;
        }

        if (tweet.user.id_str == userID) {
            console.log("Earthquake Detected, Triggering Event:");

            dataParse(tweet.text);
        }
    });

    stream.on('error', function(error) {
        console.log(error);
    });
});

function dataParse(inputData) {
    var parsedInput = inputData.split(',');

    var i, item, j, len, ref;
    ref = ["type", "training_mode", "announce_time", "situation", "revision", "earthquake_id", "earthquake_time", "latitude", "longitude", "epicenter", "depth", "magnitude", "seismic", "geography", "alarm"];

    for (i = j = 0, len = ref.length; j < len; i = ++j) {
        item = ref[i];
        global[item] = parsedInput[i];
    }

    for (var i = 0; i < trans.length; i++) {
        var item =  trans[i];
        if (item.jp == epicenter){
             epicenterJP = item.jp;
             epicenterEN = item.en;
        }
    }

    var lang = 'en';
    switch (lang) {
        case 'en':
            var titleString = 'Earthquake Early Warning';
            var subtitleString = 'Earthquake occurred';
            var magnitudeString = 'Magnitude';
            var seismicString = 'Max Seismic';
            var cancelledString = 'This Earthquake Warning has been cancelled.'
            var epicenterLocale = epicenterEN;
            break;
        case 'jp':
            var titleString = '緊急地震速報（強い揺れに警戒して下さい）';
            var subtitleString = 'Earthquake occurred';
            var magnitudeString = 'マグニチュド';
            var seismicString = '最大震度';
            var cancelledString = '先ほどの地震速報は誤報です。';
            var epicenterLocale = epicenterJP;
            break;
        default:
            var titleString = 'error - no lang selected';
            var subtitleString = 'error - no lang selected';
            var magnitudeString = 'error';
            var seismicString = 'error';
            var cancelledString = 'error - no lang selected';
            var epicenterLocale = epicenterJP;
            break;
    }

    if (situation == 9){
        var situationString = "Final";}
    else {
        var situationString = "#" + revision;}

    if (seismic == '不明') {
        var seismicLocale = "Unknown";}
    else {
        var seismicLocale = seismic;}

    console.log(
        "Time: " + earthquake_time + ", " +
        "Update: " + situationString);
    console.log(
        "Epicenter: " + epicenterLocale + " " +
        "(" + latitude + "," + longitude + "), " +
        "Magnitude: " + magnitude + ", " +
        "Seismic: " + seismic);

    var sendString =
        "Time: " + earthquake_time + ", " + "Update: " + situationString + "\n" +
        "Occurred: " + epicenterLocale + ", " + "Magnitude: " + magnitude + ", " + "Seismic: " + seismic;

    if (revision == 1) {
        var output = "*An Earthquake has Occurred.*\n" + sendString;
    } else {var output = sendString;}

    slackBot.send({
        username: "Earthquake Bot",
        text: output
    });
}
