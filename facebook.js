
var request = require('request');
var axios = require('axios');

function getContent(url, vids) {

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

                                    if (!vids[date.getFullYear()]) {
                                        vids[date.getFullYear()] = {};
                                    }
                                    if (!vids[date.getFullYear()][date.getMonth()]) {
                                        vids[date.getFullYear()][date.getMonth()] = [];
                                    }
                                    vids[date.getFullYear()][date.getMonth()].push(idYoutube);
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


module.exports = {
    getContent: getContent
};
