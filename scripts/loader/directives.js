angular.module('blizzso.loader.directives', [])


.directive('loader', function($rootScope) {
    return function(scope, elem, attr) {
        scope.$on('loader_show', function() {
            return elem.removeClass('ng-hide');
        });

        return scope.$on('loader_hide', function() {
            return elem.addClass('ng-hide');
        });
    };
});
