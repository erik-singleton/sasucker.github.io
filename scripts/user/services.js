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
        key: SEConfig.key,
        filter: SEConfig.filter
    }, {
        info: {
            method: 'GET',
            cache: true,
            transformResponse: function(data) {
                var temp = JSON.parse(data);
                if (temp.items) {
                    return temp.items[0];
                } else {
                    return temp;
                }
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
            }
        }
    });
});
