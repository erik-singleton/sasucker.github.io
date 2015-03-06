'use strict'

// Load all required modules
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

/**
 * @description
 * I like to have all of my states defined under one config, but if
 * the app was larger, I would probably define each module's states
 * within itself; not sure how effective that would be though for 
 * formatting purposes.
 */
.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider
        .state('user', {
            url: '/',
            views: {
                'bodycontent': {
                    templateUrl: 'template/user/main.partial.html',
                    controller: 'UserCtrl',
                    controllerAs: 'user'
                }
            },
        })
        .state('user.logout', {
            url: 'logout',
            views: {
                'bodycontent@': {
                    template: '<div></div>'
                }
            },
            onEnter: function($state, $window, userConfig) {
                $window.localStorage.removeItem('accessToken');
                $window.localStorage.removeItem('expirationToken');
                userConfig.accessToken = null;
                $state.go('user.login');
            }
        })
        .state('user.login', {
            url: 'login',
            views: {
                'bodycontent@': {
                    templateUrl: 'template/login/main.partial.html',
                }
            },
            onEnter: function($state, userConfig) {
                console.log('hi im login');
                if (userConfig.loggedIn()) {
                    $state.go('^');
                }
            }
        })
        .state('search', {
            url: '/search',
            views: {
                'bodycontent': {
                    templateUrl: 'template/search/main.partial.html',
                    controller: 'SearchCtrl',
                    controllerAs: 'search'
                }
            }
        })
        .state('search.terms', {
            url: '/?q&sort&intitle&tagged&nottagged&page',
            resolve: {
                searchModel: function($stateParams, searchModel) {
                    var s = $stateParams;
                    return searchModel.search({
                        intitle: s.intitle,
                        nottagged: s.nottagged,
                        page: s.page,
                        sort: s.sort,
                        tagged: s.tagged,
                    }).$promise;
                }
            },
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
                'bodycontent': {
                    templateUrl: 'template/question/main.partial.html',
                    controller: 'QuestionCtrl',
                    controllerAs: 'qc'
                }
            }
        })
})
                    
/**
 * @description
 * On run, initialize the StackExchange API with the proper config
 * Check if there's an active session in Storage, if so set it to 
 * userConfig.
 *
 * Listen on every state change, if user isn't logged in redirect to 
 * login path.  Couldn't use $state here because it's not initialized on
 * app.run I guess.
 */
.run(function($rootScope, $location, $window, SE, SEConfig, userConfig) {
    SE.init({
        clientId: SEConfig.clientId,
        key: SEConfig.key,
        channelUrl: SEConfig.channelUrl,
        complete: function(data) {
        }
    });

    if (typeof $window.localStorage === 'object') {
        userConfig.accessToken = $window.localStorage.getItem('accessToken');
    }

    $rootScope.$on('$stateChangeStart', function(event, toState, toStateParams) {
        if (!userConfig.loggedIn()) {
            if (toState.name !== 'login') {
                $timeout(function() {
                    $location.path('/login');
                });
            }
        }
    });
});
