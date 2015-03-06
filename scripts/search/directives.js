angular.module('blizzso.search.directives', [])


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
