angular.module('blizzso.exploremenu', [])


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
