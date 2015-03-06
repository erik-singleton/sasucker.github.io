/**
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
