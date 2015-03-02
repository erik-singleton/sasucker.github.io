angular.module('blizzso.login.directives', [
    'ui.router',
    'blizzso.user',
    'SEWrapper',
])



.directive('blizzsoLogin', function($state, SEConfig, SE, userConfig) {
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
});
