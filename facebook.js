
var request = require('request');

function getContent(url) {

    let vids = {};

    while(url) {
        request.get({url: url}, function(err, resp, body) {
            if (err) {
                console.error(err)
                return;
            }
            body = JSON.parse(body);

            if (body.error) {
                var error = body.error.message;
                console.error("Error returned from facebook: "+ body.error.message);
                if (body.error.code == 341) {
                    error = "You have reached the post limit for facebook. Please wait for 24 hours before posting again to facebook."
                    console.error(error);
                }
            }

            url = null;
            if(body.paging.next){
                url = body.paging.next;
            }

            var content = body.data;

            for (post of content) {
                let bitly = post.message.match(/(http|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?/);
                let date = new Date(post.created_time);
                if (bitly) {

                    request.get(bitly[0], function (err, res, body) {
                         if (res.statusCode == '200') {
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
        });
    }

    return vids;
}

module.exports = {
    getContent: getContent
};
