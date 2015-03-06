'use strict'

angular.module('blizzso', [
    'ngAnimate',
    'ui.router',
    'blizzso.loader',
    'blizzso.login',
    'blizzso.question',
    'blizzso.search',
    'blizzso.user',
    'blizzso.utils',
    'hljsWrapper',
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
                    controller: 'UserCtrl',
                    controllerAs: 'user'
                }
            },
            onEnter: function($state, userConfig) {
                if (!userConfig.loggedIn()) {
                    $state.go('login');
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
        .state('search', {
            url: '/search',
            views: {
                'bodycontent@': {
                    templateUrl: 'template/search/main.partial.html',
                    controller: 'SearchCtrl',
                    controllerAs: 'search'
                }
            }
        })
        .state('search.terms', {
            url: '/?q&sort&intitle&tagged&nottagged',
            views: {
                'searchview': {
                    templateUrl: 'template/search/searchterms.partial.html',
                    controller: 'SearchCtrl',
                    controllerAs: 'search'
                }
            }
        })
        .state('question', {
            url: '/question/:id',
            resolve: {
                question: function($stateParams, questionModel) {
                    var id = $stateParams.id;
                    return questionModel.get({ id: id }).$promise;
                }
            },
            views: {
                'bodycontent@': {
                    templateUrl: 'template/question/main.partial.html',
                    controller: 'QuestionCtrl',
                    controllerAs: 'qc'
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
            if (toState.name !== 'login') {
                $location.path('/login');
            }
        }
    });
});
