angular.module('SEWrapper', [])


/**
 * Returns an object with some StackExchange config options
 * @constant
 * @type {Object}
 */
.constant('SEConfig', {
    clientId: 4378,
    key: 'Re3GNAs1lf8dHOTZn3S5Gw((',
    channelUrl: 'http://dev.eriksingleton.com/blizzard/sasucker.github.io/blank/',
    redirect_uri: 'http://dev.eriksingleton.com/blizzard/sasucker.github.io/#/',
})

/**
 * Wraps the StackExchange JavaScript API
 * @function
 * @returns {Function}
 */
.factory('SE', function($window) {
    return $window.SE;
});
