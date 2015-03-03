angular.module('blizzso.loader.services', [])


.factory('blizzAjaxInterceptor', function($q, $rootScope) {
    var num_loading = 0;

    return {
        request: function(config) {
            num_loading++;
            $rootScope.$broadcast('loader_show');
            return config || $q.when(config);
        },
        response: function(resp) {
            if ((--num_loading) === 0) {
                $rootScope.$broadcast('loader_hide');
            }
            return resp || $q.when(resp);
        },
        responseError: function(resp) {
            if (!(--num_loading)) {
                $rootScope.$broadcast('loader_hide');
            }
            return $q.reject(resp);
        }
    };
});
