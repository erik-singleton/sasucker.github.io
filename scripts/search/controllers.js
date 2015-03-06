angular.module('blizzso.search.controllers', [

])


.controller('SearchCtrl', SearchCtrl);

function SearchCtrl($stateParams, $state, searchModel) {
    var vm = this;
    vm.terms = {
        nottags: '',
        sort: 'relevance',
        tags: ''
    };
    vm.$stateParams = $stateParams;
    vm.$state = $state;
    vm.results = searchModel;
    vm.currentPage = searchModel.page;
}

/**
 * @description
 * Submits to search endpoint certain parameters
 *
 * Splits tags/nottags and joins them with semi-colons, as
 * the api accepts semi-colon split list items
 */
SearchCtrl.prototype.submit = function() {
    var vm = this;
    var joinedTags = vm.terms.tags.split(' ').join(';');
    var joinedNotTags = vm.terms.nottags.split(' ').join(';');
    vm.$state.go('search.terms', {
        tagged: joinedTags,
        nottagged: joinedNotTags,
        intitle: vm.terms.title,
        page: null,
        sort: vm.terms.sort
    });
};
