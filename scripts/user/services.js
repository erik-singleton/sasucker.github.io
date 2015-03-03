/**
 * @module blizzso.user
 */
angular.module('blizzso.user.services', [
    'ngResource',
    'SEWrapper',
])

/**
 * User Config factory to inject accessToken where necessary
 */
.factory('userConfig', function() {
    return {
        accessToken: null,
        expirationDate: null,
        site: 'stackoverflow',
        loggedIn: function() {
           return !!this.accessToken; 
        }
    }
})

/**
 * @returns {Resource}
 */
.factory('userProfile', function($resource, userConfig, SEConfig) {
    return $resource('https://api.stackexchange.com/2.2/me/:verb', {
        access_token: userConfig.accessToken,
        site: userConfig.site,
        key: SEConfig.key
    }, {
        info: {
            method: 'GET',
            cache: true,
            transformResponse: function(data) {
                return JSON.parse(data).items[0];
            }
        },
        badges: {
            method: 'GET',
            cache: true,
            params: {
                verb: 'badges'
            },
        },
        timeline: {
            method: 'GET',
            cache: true,
            params: {
                verb: 'timeline'
            },
        },
        tags: {
            method: 'GET',
            cache: true,
            params: {
                verb: 'tags',
                sort: 'popular'
            }
        }
    });
});
