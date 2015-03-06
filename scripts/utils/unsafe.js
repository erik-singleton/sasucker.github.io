/**
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
