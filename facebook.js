
var request = require('request');
var axios = require('axios');

function getContent(url, vids) {

    return new Promise((resolve,reject)=>{

        axios.get(url).then(function(response) {
            console.log("call");
            // if error
            // reject(false)
            var body = response.data;
            var content = body.data;

            for (post of content) {
                if (post.message) {
                    let bitly = post.message.match(/(http|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?/);
                    let date = new Date(post.created_time);
                    if (bitly) {

                        request.get(bitly[0], function (err, res, body) {
                            if (res.statusCode == '200' && res.req.path) {
                                let idYoutube = res.req.path.match(/v=([\w-_]*)&?/);

                                if ( typeof vids[date.getFullYear()] == 'undefined' ) {
                                    vids[date.getFullYear()] = {};
                                }
                                if ( typeof vids[date.getFullYear()][date.getMonth()] == 'undefined' ) {
                                    vids[date.getFullYear()][date.getMonth()] = [];
                                }
                                vids[date.getFullYear()][date.getMonth()].push(idYoutube);
                            }
                        });
                    }
                }
            }

            if(body.paging.next){
                getContent(body.paging.next, vids);
                return;
            }
            resolve(vids);

        });

    });
}


module.exports = {
    getContent: getContent
};
