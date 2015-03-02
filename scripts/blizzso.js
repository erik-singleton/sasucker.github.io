'use strict'

angular.module('blizzso', [
    'ui.router',
    'blizzso.login',
    'blizzso.user',
    'blizzso.search',
    'SEWrapper'
])

.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider
        .state('user', {
            url: '/',
            views: {
                'bodycontent@': {
                    templateUrl: 'template/user/main.partial.html',
                }
            }
        })
        .state('login', {
            url: '/login',
            views: {
                'bodycontent@': {
                    templateUrl: 'template/login/main.partial.html',
                }
            },
            onEnter: function($state, userConfig) {
                if (userConfig.loggedIn()) {
                    $state.go('user');
                }
            }
        })

})
                    

.run(function($rootScope, $location, $window, SE, SEConfig, userConfig) {
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
            console.log(toState.name !== 'login');
            if (toState.name !== 'login') {
                $location.path('/login');
            }
        }
    });
});
