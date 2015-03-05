/**
 * @description
 * Directive that takes in a stackexchange tag list, and
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
