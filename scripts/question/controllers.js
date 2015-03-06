/**
 * @description
 * Controllers for Question module
 */
angular.module('blizzso.question.controllers', [])


.controller('QuestionCtrl', QuestionCtrl);



function QuestionCtrl($http, userConfig, SEConfig, question) {
    var vm = this;
    vm.$http = $http;
    vm.userConfig = userConfig;
    vm.SEConfig = SEConfig;
    vm.question = question;
    vm.commentLimit = 5;
    vm.answerLimit = 10;
}


/**
 * @description
 * Favoriting has to be done without $resource due to how the 
 * data is returned.  I couldn't get it to transformResponse in
 * a format that was useable
 *
 * I spent longer than I care to admit trying to get that to work
 */
QuestionCtrl.prototype.favorite = function() {
    var vm = this;
    var favorited = vm.question.favorited ? 'undo' : '';

    // Payload for either favoriting or unfavoriting
    var payload = {
        method: 'POST',
        url: 'https://api.stackexchange.com/2.2/questions/'+vm.question.question_id+'/favorite/'+favorited,
        data: {
            access_token: vm.userConfig.accessToken,
            key: vm.SEConfig.key,
            site: vm.userConfig.site,
            filter: vm.SEConfig.filter
        },
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        transformResponse: function(data) {
            return JSON.parse(data).items[0];
        },
        // Transform data payload to shallow serialize
        // As required by StackExchange API for POST-style endpoints
        transformRequest: function(obj) {
            var str = [];

            for (var p in obj) {
                if (obj.hasOwnProperty(p)) {
                    str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
                }
            }
            return str.join('&');
        }
    };
    vm.$http(payload).then(function(resp) {
        // Overwrite old question data with new question data
        vm.question = angular.copy(resp.data);
    }, function(resp) {
        console.log(resp);
    });
};
