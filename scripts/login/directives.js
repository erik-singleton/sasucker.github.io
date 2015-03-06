/**
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
    }
});
