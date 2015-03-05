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
            params: {
                filter: '!-*f(6q9Yna_7'
            },
            transformResponse: function(data) {
                return JSON.parse(data).items[0];
            }
        },
        badges: {
            method: 'GET',
            cache: true,
            params: {
                verb: 'badges',
                pagesize: 50
            },
        },
        timeline: {
            method: 'GET',
            cache: true,
            params: {
                verb: 'timeline',
                pagesize: 5,
            },
        },
        tags: {
            method: 'GET',
            cache: true,
            params: {
                verb: 'tags',
                sort: 'name',
                order: 'asc',
                pagesize: 50
            }
        },
        favorites: {
            method: 'GET',
            cache: true,
            params: {
                verb: 'favorites',
                sort: 'activity',
                order: 'desc',
                filter: '!-*f(6pnzwZrc'
            }
        }

    });
});
