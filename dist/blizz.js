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
.run(function($rootScope, $timeout, $location, $window, SE, SEConfig, userConfig) {
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
;/**
 * @description
 * Wrapper for highlight.js
 * https://highlightjs.org/
 */
angular.module('hljsWrapper', [])

// Returns the hljs object and makes it injectable
.factory('hljs', function($window) {
    return $window.hljs;
})

// Transcludes and replaces, runs highlighting and auto digests
.directive('hljsSnippet', function($timeout, $interpolate, hljs) {
    function link(scope, elem, attrs) {
        $timeout(function() {
            hljs.initHighlighting();
        });
    }
    return {
        restrict: 'A',
        template: '<div ng-transclude></div>',
        replace: true,
        transclude: true,
        link: link
    }
});
;/**
 * @description
 * Define the directive for the loader element
 *
 * Listen for broadcasted loader events and show/hide as necessary
 */
angular.module('blizzso.loader.directives', [])


.directive('loader', function($rootScope) {
    return function(scope, elem, attr) {
        scope.$on('loader_show', function() {
            return elem.removeClass('ng-hide');
        });

        return scope.$on('loader_hide', function() {
            return elem.addClass('ng-hide');
        });

        scope.$on('event:auth-loginRequired', function() {
            console.log('auth req');
        })
    };
});
;angular.module('blizzso.loader', [
    'blizzso.loader.directives',
    'blizzso.loader.services'
])

/**
 * @description
 * Registers our AJAX interceptor with $httpProvider
 */
.config(function($httpProvider) {
    $httpProvider.interceptors.push('blizzAjaxInterceptor');
});
;/**
 * @description
 * Define factory to register with AJAX requests
 * For each request, add to the number of loading elements
 * for each response (error or not) reduce the number of 
 * loading elements
 */
angular.module('blizzso.loader.services', [])


.factory('blizzAjaxInterceptor', function($q, $rootScope) {
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
})



;/**
 * @description
 * Login directive that utilizes the StackExchange API
 * to retrieve a new token from SE
 *
 * Once complete, place token in Storage and set userConfig
 * accessToken equal to it as well
 */
angular.module('blizzso.login.directives', [
    'ui.router',
    'blizzso.user',
    'SEWrapper',
])


.directive('blizzsoLogin', function($state, $window, SEConfig, SE, userConfig) {
    function link(scope, ele, attr) {
        scope.login = function() {
            SE.authenticate({
                success: function(data) {
                    $window.localStorage.setItem('accessToken', data.accessToken);
                    $window.localStorage.setItem('expirationDate', data.expirationDate);
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
    };
});
;angular.module('blizzso.login', [
    'blizzso.login.directives'
]);
;/**
 * @description
 * Controllers for Question module
 */
angular.module('blizzso.question.controllers', [])


.controller('QuestionCtrl', QuestionCtrl);



function QuestionCtrl($http, userConfig, SEConfig, question) {
    var vm = this;
    vm.$http = $http;
    vm.userConfig = userConfig;
    vm.SEConfig = SEConfig;
    vm.question = question;
    vm.commentLimit = 5;
    vm.answerLimit = 10;
}


/**
 * @description
 * Favoriting has to be done without $resource due to how the 
 * data is returned.  I couldn't get it to transformResponse in
 * a format that was useable
 *
 * I spent longer than I care to admit trying to get that to work
 */
QuestionCtrl.prototype.favorite = function() {
    var vm = this;
    var favorited = vm.question.favorited ? 'undo' : '';

    // Payload for either favoriting or unfavoriting
    var payload = {
        method: 'POST',
        url: 'https://api.stackexchange.com/2.2/questions/'+vm.question.question_id+'/favorite/'+favorited,
        data: {
            access_token: vm.userConfig.accessToken,
            key: vm.SEConfig.key,
            site: vm.userConfig.site,
            filter: vm.SEConfig.filter
        },
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        transformResponse: function(data) {
            return JSON.parse(data).items[0];
        },
        // Transform data payload to shallow serialize
        // As required by StackExchange API for POST-style endpoints
        transformRequest: function(obj) {
            var str = [];

            for (var p in obj) {
                if (obj.hasOwnProperty(p)) {
                    str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
                }
            }
            return str.join('&');
        }
    };
    vm.$http(payload).then(function(resp) {
        // Overwrite old question data with new question data
        vm.question = angular.copy(resp.data);
    }, function(resp) {
        console.log(resp);
    });
};
;/**
 * @description
 * Directive elements for Questions, Answers, and Comments
 */
angular.module('blizzso.question.directives', [
    'blizzso.nicenum'
])


.directive('blizzsoQuestion', function() {
    return {
        restrict: 'EA',
        replace: true,
        scope: {
            question: '='
        },
        templateUrl: 'template/question/blizzsoquestion.partial.html',
    };
})


.directive('blizzsoAnswer', function() {
    return {
        restrict: 'EA',
        replace: true,
        scope: {
            answer: '='
        },
        templateUrl: 'template/question/blizzsoanswer.partial.html'
    };
})


.directive('blizzsoComment', function() {
    return {
        restrict: 'EA',
        replace: true,
        scope: {
            comment: '=',
            commentLimit: '='
        },
        templateUrl: 'template/question/blizzsocomment.partial.html'
    };
});

;angular.module('blizzso.question', [
    'blizzso.question.controllers',
    'blizzso.question.directives',
    'blizzso.question.services'
])


;
;/**
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
;angular.module('SEWrapper', [])


/**
 * Returns an object with some StackExchange config options
 * @constant
 * @type {Object}
 */
.constant('SEConfig', {
    clientId: 4378,
    key: 'Re3GNAs1lf8dHOTZn3S5Gw((',
    channelUrl: 'http://dev.eriksingleton.com/blizzard/sasucker.github.io/blank/',
    filter: '!Wq.reBhTC*mybEAh961k3.)jNlZdP5g-wIcnBX6',
})

/**
 * Wraps the StackExchange JavaScript API
 * @function
 * @returns {Function}
 */
.factory('SE', function($window) {
    return $window.SE;
});
;angular.module('blizzso.search.controllers', [

])


.controller('SearchCtrl', SearchCtrl);

function SearchCtrl($stateParams, $state, searchModel) {
    var vm = this;
    vm.terms = {
        nottags: '',
        sort: 'relevance',
        tags: ''
    };
    vm.$stateParams = $stateParams;
    vm.$state = $state;
    vm.results = searchModel;
    vm.currentPage = searchModel.page;
}

/**
 * @description
 * Submits to search endpoint certain parameters
 *
 * Splits tags/nottags and joins them with semi-colons, as
 * the api accepts semi-colon split list items
 */
SearchCtrl.prototype.submit = function() {
    var vm = this;
    var joinedTags = vm.terms.tags.split(' ').join(';');
    var joinedNotTags = vm.terms.nottags.split(' ').join(';');
    vm.$state.go('search.terms', {
        tagged: joinedTags,
        nottagged: joinedNotTags,
        intitle: vm.terms.title,
        page: null,
        sort: vm.terms.sort
    });
};
;angular.module('blizzso.search.directives', [])


.directive('blizzsoResultCloud', function($timeout) {
    function link(scope, elem, attr) {
        scope.baseSize = 11;
        scope.maxSize = 24;
        scope.maxNum = scope.results.maxTagCount;
        scope.tags = scope.results.tags;
    }
    return {
        restrict: 'EA',
        transclude: true,
        replace: true,
        scope: {
            results: '=' 
        },
        templateUrl: 'template/search/blizzsoresultcloud.partial.html',
        link: link
    };
})
;angular.module('blizzso.search', [
    'blizzso.search.controllers',
    'blizzso.search.directives',
    'blizzso.search.services'
])
;/**
 * @description
 * Factory for search model
 * Parses result data for tag list
 */
angular.module('blizzso.search.services', [
    'ngResource',
    'SEWrapper',
    'blizzso.user'
])


.factory('searchModel', function($resource, userConfig, SEConfig) {
    return $resource('https://api.stackexchange.com/2.2/search', {
        // This requires a separate filter from the config
        tagged: '@tagged',
        nottagged: '@nottagged',
        intitle: '@intitle',
        sort: '@sort',
        page: '@page',
        key: SEConfig.key,
        filter: '!9YdnSQVgz',
        site: userConfig.site
    }, {
        search: {
            method: 'GET',
            cache: true,
            transformResponse: function(data) {
                var data = JSON.parse(data);
                var temp = data.items;
                var tagList = {};
                var max = 0;
                var i, j, len, tlen; 

                // Iterate through each result item, and then its tags
                // If tag exists, add one, otherwise create new object
                // Also check for max while at it
                // 
                // Classic for loops used for speed
                for (i=0, len=temp.length; i<len; i++) {
                    var tagtemp = temp[i].tags;
                    for (j=0, tlen=tagtemp.length; j<tlen; j++) {
                        if (!tagList.hasOwnProperty(tagtemp[j])) {
                            tagList[tagtemp[j]] = 1;
                        } else {
                            tagList[tagtemp[j]]++;
                        }
                        max = (tagList[tagtemp[j]] > max) ? tagList[tagtemp[j]] : max;
                    }
                }
                data.tags = tagList; 
                data.maxTagCount = max;

                return data;
            }
        }
    });
});

;angular.module('blizzso.user.controllers', [
])

.controller('UserCtrl', UserCtrl);

/**
 * @description
 * Corral all of the user's information
 */
function UserCtrl(userProfile) {
    var vm = this;
    vm.badges = userProfile.badges();
    vm.favorites = userProfile.favorites();
    vm.info = userProfile.info();
    vm.tags = userProfile.tags();
    vm.timeline = userProfile.timeline();

    // Using this object to create verbs for
    // timeline as well as assign classes
    vm.badgeConverter = {
        accepted: {
            slug: 'accepted-wrapper',
            verb: 'accepted'
        },
        answered: {
            slug: 'answered-wrapper',
            verb: 'answered'
        },
        asked: {
            slug: 'asked-wrapper',
            verb: 'asked'
        },
        badge: {
            slug: 'individual-badge',
            verb: 'earned'
        },
        revision: {
            slug: 'revision-wrapper',
            verb: 'revised'
        },
        reviewed: {
            slug: 'reviewed-wrapper',
            verb: 'reviewed'
        },
        suggested: {
            slug: 'suggested-wrapper',
            verb: 'suggested'
        },
    }
}

/**
 * @description
 * Check to see if a timeline item is a badge
 */
UserCtrl.prototype.isBadge = function(timelineItem) {
    return timelineItem.timeline_type === 'badge';
};
;/**
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
;angular.module('blizzso.user', [
    'blizzso.user.services',
    'blizzso.user.controllers',
//    'user.directives',
]);
;angular.module('blizzso.exploremenu', [])


.directive('blizzsoExplore', function($timeout) {
    function link(scope, ele, attr) {
        scope.showMenu = false;
        scope.toggleMenu = function() {
            $timeout(function() {
                ele.toggleClass('active');
                angular.element(ele.children()[1]).toggleClass('ng-hide');
            });
        }
    }
    return {
        scope: {},
        restrict: 'EA',
        templateUrl: 'template/core/blizzsoexplore.partial.html',
        replace: true,
        link: link
    };
});
;/**
 * @description
 * StackExchange api returns timestamps in seconds,
 * javascript utilizes milliseconds to conver to 
 * Date object
 */
angular.module('blizzso.milliseconds', [])


.filter('milli', function() {
    return function(inp) {
        return parseInt(inp) * 1000;
    }
});
;/**
 * @description
 * Creates a filter to make numbers more readable up to billions
 */
angular.module('blizzso.nicenum', [])


.filter('nicenum', function() {
    return function(input) {
        var abbreviations = ['k', 'm', 'b'];
        var num = input;

        // Start counting from billions
        for (var i=abbreviations.length-1; i>=0; i--) {
            var size = Math.pow(10, (i+1)*3);

            if (num >= size) {
                num = Math.round(num/size);

                // Handle edge case where 999,950 gets rounded to 1000k
                if ((num === 1000) && (i<abbreviations.length-1)) {
                    num = 1;
                    i++;
                }
                // Append suffix to number
                num += abbreviations[i];
                // All done, leave loop
                break;
            }
        }
        return num;
    };
});
;/**
 * @description
 * Create filter to process unsafe elements
 *
 * (Trusting you SE!)
 *
 * Ideally I'd include a markdown processor and use the body_markdown
 * information instead
 */
angular.module('blizzso.unsafe', [])

.filter('unsafe', function($sce) {
    return function(val) {
        return $sce.trustAsHtml(val);
    };
});
;/**
 * @description
 * Groups up all of the utility modules into one utils module
 */
angular.module('blizzso.utils', [
    'blizzso.exploremenu',
    'blizzso.milliseconds',
    'blizzso.nicenum',
    'blizzso.tagcloud',
    'blizzso.unsafe'
]); 
;/**
 * @description
 * Directive that takes in a stackexchange tag list 
 * promise, waits for it to finish resolving, and
 * converts it into a word cloud
 *
 * https://api.stackexchange.com/docs/tags-on-users
 */
angular.module('blizzso.tagcloud', [])


.directive('blizzsoTagCloud', function() {
    function link(scope, elem, attr) {
        scope.baseSize = 11;
        scope.maxSize = 24;
        scope.tags.$promise.then(function(data) {
            scope.tags.items = data.items;
            scope.maxNum = 0;

            // Vanilla for loop used for speed
            for (var i=0, len=scope.tags.items.length; i<len; i++) {
                if (scope.maxNum < scope.tags.items[i].count) {
                    scope.maxNum = scope.tags.items[i].count;
                }
            }
        });
    }
    return {
        restrict: 'EA',
        transclude: true,
        replace: true,
        scope: {
            tags: '='
        },
        templateUrl: 'template/tag/blizzsotagcloud.partial.html',
        link: link
    };

});
