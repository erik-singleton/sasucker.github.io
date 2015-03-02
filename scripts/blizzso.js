'use strict'

angular.module('blizzso', [
    'blizzso.login',
    'blizzso.user',
    'SEWrapper'
])

.run(function($window, SE, SEConfig, userConfig) {
    SE.init({
        clientId: SEConfig.clientId,
        key: SEConfig.key,
        channelUrl: SEConfig.channelUrl,
        redirect_url: SEConfig.redirect_url,
        complete: function(data) {
            if (typeof $window.localStorage === 'object') {
                userConfig.accessToken = $window.localStorage.getItem('accessToken');
            }
        }
    });
});
