/**
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
