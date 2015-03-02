angular.module('SEWrapper', [])

.constant('SEConfig', {
    clientId: 4378,
    key: 'Re3GNAs1lf8dHOTZn3S5Gw((',
    channelUrl: 'https://sasucker.github.io/blank/',
    redirect_uri: 'https://sasucker.github.io',
})

.factory('SE', function($window) {
    return $window.SE;
});
