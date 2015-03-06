/**
 * @description
 * Services for question module 
 */
angular.module('blizzso.question.services', [
    'ngResource',
    'blizzso.user',
    'SEWrapper'
])

/**
 * @description
 * Returns questionModel factory that has methods associated with it
 *
 * Any method that requires a POST was not included due to the way 
 * $resource handles its return response (as well as the payload it
 * was sending.)
 */
.factory('questionModel', function($resource, userConfig, SEConfig) {
    return $resource('https://api.stackexchange.com/2.2/questions/:id', {
        access_token: userConfig.accessToken,
        key: SEConfig.key,
        filter: SEConfig.filter,
        site: userConfig.site
    }, {
        get: {
            method: 'GET',
            cache: true,
            transformResponse: function(data) {
                return JSON.parse(data).items[0];
            }
        },
    });
});
