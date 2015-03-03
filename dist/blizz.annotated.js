'use strict'

angular.module('blizzso', [
    'ui.router',
    'blizzso.loader',
    'blizzso.login',
    'blizzso.user',
    'blizzso.search',
    'SEWrapper'
])

.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider
        .state('user', {
            url: '/',
            resolve: {
            },
            views: {
                'bodycontent@': {
                    templateUrl: 'template/user/main.partial.html',
                    controller: 'UserCtrl',
                    controllerAs: 'user'
                }
            },
            onEnter: ['$state', 'userConfig', function($state, userConfig) {
                if (!userConfig.loggedIn()) {
                    $state.go('login');
                }
            }]
        })
        .state('login', {
            url: '/login',
            views: {
                'bodycontent@': {
                    templateUrl: 'template/login/main.partial.html',
                }
            },
            onEnter: ['$state', 'userConfig', function($state, userConfig) {
                if (userConfig.loggedIn()) {
                    $state.go('user');
                }
            }]
        })

}])
                    

.run(['$rootScope', '$location', '$window', 'SE', 'SEConfig', 'userConfig', function($rootScope, $location, $window, SE, SEConfig, userConfig) {
    SE.init({
        clientId: SEConfig.clientId,
        key: SEConfig.key,
        channelUrl: SEConfig.channelUrl,
        redirect_url: SEConfig.redirect_url,
        complete: function(data) {
        }
    });

    if (typeof $window.localStorage === 'object') {
        userConfig.accessToken = $window.localStorage.getItem('accessToken');
    }

    $rootScope.$on('$stateChangeStart', function(event, toState, toStateParams) {
        if (!userConfig.loggedIn()) {
            if (toState.name !== 'login') {
                $location.path('/login');
            }
        }
    });
}]);
;angular.module('blizzso.loader.directives', [])


.directive('loader', ['$rootScope', function($rootScope) {
    return function(scope, elem, attr) {
        scope.$on('loader_show', function() {
            return elem.removeClass('ng-hide');
        });

        return scope.$on('loader_hide', function() {
            return elem.addClass('ng-hide');
        });
    };
}]);
;angular.module('blizzso.loader', [
    'blizzso.loader.directives',
    'blizzso.loader.services'
])

/**
 * @description
 * Registers our AJAX interceptor with $httpProvider
 */
.config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('blizzAjaxInterceptor');
}]);
;angular.module('blizzso.loader.services', [])


.factory('blizzAjaxInterceptor', ['$q', '$rootScope', function($q, $rootScope) {
    var num_loading = 0;

    return {
        request: function(config) {
            num_loading++;
            $rootScope.$broadcast('loader_show');
            return config || $q.when(config);
        },
        response: function(resp) {
            if ((--num_loading) === 0) {
                $rootScope.$broadcast('loader_hide');
            }
            return resp || $q.when(resp);
        },
        responseError: function(resp) {
            if (!(--num_loading)) {
                $rootScope.$broadcast('loader_hide');
            }
            return $q.reject(resp);
        }
    };
}]);
;angular.module('blizzso.login.directives', [
    'ui.router',
    'blizzso.user',
    'SEWrapper',
])



.directive('blizzsoLogin', ['$state', 'SEConfig', 'SE', 'userConfig', function($state, SEConfig, SE, userConfig) {
    function link(scope, ele, attr) {
        scope.login = function() {
            SE.authenticate({
                success: function(data) {
                    localStorage.setItem('accessToken', data.accessToken);
                    localStorage.setItem('expirationDate', data.expirationDate);
                    userConfig.accessToken = data.accessToken;
                    $state.go('user');

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


/**
 * Returns an object with some StackExchange config options
 * @constant
 * @type {Object}
 */
.constant('SEConfig', {
    clientId: 4378,
    key: 'Re3GNAs1lf8dHOTZn3S5Gw((',
    channelUrl: 'http://dev.eriksingleton.com/blizzard/sasucker.github.io/blank/',
    redirect_uri: 'http://dev.eriksingleton.com/blizzard/sasucker.github.io/#/',
})

/**
 * Wraps the StackExchange JavaScript API
 * @function
 * @returns {Function}
 */
.factory('SE', ['$window', function($window) {
    return $window.SE;
}]);
;angular.module('blizzso.search', [
    'blizzso.search.services'
])
;angular.module('blizzso.search.services', [
    'ngResource',
    'SEWrapper',
    'blizzso.user'
])


.factory('searchModel', ['$resource', 'userConfig', 'SEConfig', function($resource, userConfig, SEConfig) {
    return $resource('https://api.stackexchange.com/2.2/search', {
        tagged: '@tagged',
        nottagged: '@nottagged',
        intitle: '@intitle',
        sort: '@sort',
        site: userConfig.site
    }, {
        search: {
            method: 'GET',
            cache: true,
        }
    });
}]);

;angular.module('blizzso.user.controllers', [
])

.controller('UserCtrl', UserCtrl);


function UserCtrl(userProfile) {
    var vm = this;
    vm.info = userProfile.info();
    vm.badges = userProfile.badges();
    vm.timeline = userProfile.timeline();
    vm.tags = userProfile.tags();
}
UserCtrl.$inject = ['userProfile'];
;;/**
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
.factory('userProfile', ['$resource', 'userConfig', 'SEConfig', function($resource, userConfig, SEConfig) {
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
}]);
;angular.module('blizzso.user', [
    'blizzso.user.services',
    'blizzso.user.controllers',
//    'user.directives',
]);
