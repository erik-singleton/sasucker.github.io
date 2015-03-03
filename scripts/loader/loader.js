angular.module('blizzso.loader', [
    'blizzso.loader.directives',
    'blizzso.loader.services'
])

/**
 * @description
 * Registers our AJAX interceptor with $httpProvider
 */
.config(function($httpProvider) {
    $httpProvider.interceptors.push('blizzAjaxInterceptor');
});
