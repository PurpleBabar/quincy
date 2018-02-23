
var axios = require('axios');

function createPlaylists(url, vids) {

    return new Promise((resolve,reject)=>{

        function populate(url, vids){
            axios.get(url).then(function(response) {
                // if error
                // reject(false)
                var body = response.data;
                var content = body.data;

                for (post of content) {
                    if (post.message) {
                        let bitly = post.message.match(/(http|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?/);
                        let date = new Date(post.created_time);
                        if (bitly) {

                            axios.get(bitly[0]).then(function(response) {

                                if (response.request.path) {
                                    let matcher = response.request.path.match(/v=([\w-_]*)&?/);
                                    if (!matcher[0]) {
                                        return;
                                    }
                                    let idYoutube = matcher[1];
                                    let year = parseInt(date.getFullYear());
                                    let month = parseInt(date.getMonth()+1);

                                    if (!vids[year]) {
                                        vids[year] = {};
                                    }
                                    if (!vids[year][month]) {
                                        vids[year][month] = [];
                                    }
                                    vids[year][month].push(idYoutube);
                                }
                            }).catch(function (error) {
                            });
                        }
                    }
                }

                if(!!body.paging.next){
                    populate(body.paging.next, vids);
                    return;
                }
                resolve(vids);

            });
        }
        populate(url, vids);
    });
}

function createPlaylist(oauth2Client, title){

    var addParams = {
        part: "snippet, status",
        resource: {"status":{"privacyStatus":"public"},"snippet":{"title":title}},
        auth: oauth2Client
    };
    var playlistAdd = youtube.playlists.insert(addParams, function (err, response) {

    });
}


function addingVideo(oauth2Client,playlistId,video){

    var paramsLinker = {
        part: "snippet",
        resource: {"snippet":{"playlistId": playlistId, "resourceId":{"videoId":video,"kind":"youtube#video"}}},
        auth: oauth2Client
    };
    var playlistAdd = youtube.playlistItems.insert(paramsLinker, function (err, response) {
        console.log(response);
    });
}
module.exports = {
    getContent: getContent
};
