#!/usr/bin/env node

// 1989202701362121
// dc390eed03078398e0d2d4c6d9e5f8a6
// 1989202701362121|dc390eed03078398e0d2d4c6d9e5f8a6

var request = require('request');
var axios = require('axios');

var facebook = require('./facebook.js');
var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;
var youtube = google.youtube('v3');
var youtubeApi = require('./youtube.js');

url = "https://graph.facebook.com/1442869752631838/feed?pretty=0&limit=10&access_token=1989202701362121|dc390eed03078398e0d2d4c6d9e5f8a6";

const express = require('express');
const app = express();


app.get('/', function (req, res) {
    //  ID client
    //  936260533817-chvk5da4qlbhsl1kb4u7ninv8fhspr3e.apps.googleusercontent.com
    //  Code secret du client
    //  PhPO22Q3XX3Y42mugDGQBzNm

    var oauth2Client = new OAuth2(
        '936260533817-chvk5da4qlbhsl1kb4u7ninv8fhspr3e.apps.googleusercontent.com',
        'PhPO22Q3XX3Y42mugDGQBzNm',
        'http://localhost:3000/youtube-return'
    );

    // generate a url that asks permissions for Google+ and Google Calendar scopes
    var scopes = [
        'https://www.googleapis.com/auth/youtubepartner'
    ];

    var url = oauth2Client.generateAuthUrl({
        // 'online' (default) or 'offline' (gets refresh_token)
        access_type: 'offline',

        // If you only need one scope you can pass it as a string
        scope: scopes,

        // Optional property that passes state parameters to redirect URI
        // state: 'foo'
    });

    // Redirect example using Express (see http://expressjs.com/api.html#res.redirect)
    res.redirect(url);


});

app.get('/youtube-return', function (req, res) {

    var oauth2Client = new OAuth2(
        '936260533817-chvk5da4qlbhsl1kb4u7ninv8fhspr3e.apps.googleusercontent.com',
        'PhPO22Q3XX3Y42mugDGQBzNm',
        'http://localhost:3000/youtube-return'
    );


    oauth2Client.getToken(req.query.code, function (err, tokens) {
        // Now tokens contains an access_token and an optional refresh_token. Save them.
        if (!err) {
            oauth2Client.setCredentials(tokens);
        }


        var params = {
                        part: "snippet",
                            channelId: 'UCoHdB1i3rXs2Sd42sqU6kIA',
                            auth: oauth2Client
                        };

        var playlistRemovr = youtube.playlists.list(params, function (err, response) {
            for (let item of response.items) {
                if (item.snippet.title.match(/Damn/)) {
                    youtube.playlists.delete({id: item.id, auth: oauth2Client}, function (err, response) {
                        console.log('Deleted '+ item.snippet.title);
                    });
                }
            }
        });
        res.send('Cleaned ...');
    });

    let vids = {};

    facebookContent = facebook.getContent(url, vids);

    facebookContent.then(function(resolve, reject){
<<<<<<< HEAD
        let years = Object.keys(vids);
        console.log();

        function populatePlaylist(year, months, index){
            console.log(year[months[index]]);

            //populate playlist
            if (year[months[index+1]]) {
                populatePlaylist(year, months, index+1);
            }
        }

        function handlePlaylist(vids, years, index){
            let months = Object.keys(vids[years[index]]);
            console.log(vids[years[index]]);

            // createPlaylist

            populatePlaylist(vids[years[index]], months, 0);



        }

        handlePlaylist(vids, years, 0);

=======

        youtubeCreation = youtubeApi.createPlaylists(vids);
>>>>>>> bebe0880e8ed73426bc19514a07d687789861816

    });

})

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
})
