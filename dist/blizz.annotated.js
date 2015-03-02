'use strict'

angular.module('blizzso', [
    'blizzso.login',
    'blizzso.user',
    'SEWrapper'
])

.run(['$window', 'SE', 'SEConfig', 'userConfig', function($window, SE, SEConfig, userConfig) {
    SE.init({
        clientId: SEConfig.clientId,
        key: SEConfig.key,
        channelUrl: SEConfig.channelUrl,
        redirect_url: SEConfig.redirect_url,
        complete: function(data) {
            if (typeof $window.localStorage === 'object') {
                userConfig.accessToken = $window.localStorage.getItem('accessToken');
            }
        }
    });
}]);
;angular.module('blizzso.login.directives', [
    'blizzso.user',
    'SEWrapper',
])



.directive('blizzsoLogin', ['SEConfig', 'SE', 'userConfig', function(SEConfig, SE, userConfig) {
    function link(scope, ele, attr) {
        scope.login = function() {
            SE.authenticate({
                success: function(data) {
                    console.log(data);
                    localStorage.setItem('accessToken', data.accessToken);
                    localStorage.setItem('expirationDate', data.expirationDate);
                    userConfig.accessToken = data.accessToken;
                },
                error: function(data) {
                    console.log(data);
                },
                scope: [
                    'read_inbox',
                    'write_access',
                    'private_info',
                ]
            });
        };
    }

    return {
        scope: {},
        restrict: 'EA',
        templateUrl: 'template/login/blizzsologin.partial.html',
        replace: true,
        link: link
    }
}]);
;angular.module('blizzso.login', [
    'blizzso.login.directives'
]);
;;angular.module('SEWrapper', [])

.constant('SEConfig', {
    clientId: 4378,
    key: 'Re3GNAs1lf8dHOTZn3S5Gw((',
    channelUrl: 'https://sasucker.github.io/blank/',
    redirect_uri: 'https://sasucker.github.io',
})

.factory('SE', ['$window', function($window) {
    return $window.SE;
}]);
;;;angular.module('blizzso.user.services', [
    'ngResource',
    'SEWrapper',
])

.factory('userConfig', function() {
    return {
        accessToken: null,
        site: 'stackoverflow' 
    }
})

.factory('userProfile', ['$resource', 'userConfig', 'SEConfig', function($resource, userConfig, SEConfig) {
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
}]);


;angular.module('blizzso.user', [
    'blizzso.user.services',
//    'user.directives',
]);
