angular.module('SEWrapper', [])


/**
 * Returns an object with some StackExchange config options
 * @constant
 * @type {Object}
 */
.constant('SEConfig', {
    clientId: 4378,
    key: 'Re3GNAs1lf8dHOTZn3S5Gw((',
    channelUrl: 'https://sasucker.github.io/blank/',
    filter: '!Wq.reBhTC*mybEAh961k3.)jNlZdP5g-wIcnBX6',
})

/**
 * Wraps the StackExchange JavaScript API
 * @function
 * @returns {Function}
 */
.factory('SE', function($window) {
    return $window.SE;
});
