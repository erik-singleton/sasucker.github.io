angular.module('blizzso.user.services', [
    'ngResource',
    'SEWrapper',
])

.factory('userConfig', function() {
    return {
        accessToken: null,
        site: 'stackoverflow' 
    }
})

.factory('userProfile', function($resource, userConfig, SEConfig) {
    return $resource('https://api.stackexchange.com/2.2/:verb', {}, {
        info: {
            method: 'GET',
            params: {
                verb: 'me',
                access_token: userConfig.accessToken,
                site: userConfig.site,
                key: SEConfig.key,
            }
        }
    });
});


