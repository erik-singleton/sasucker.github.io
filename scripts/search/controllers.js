angular.module('blizzso.search.controllers', [

])


.controller('SearchCtrl', SearchCtrl);


function SearchCtrl($stateParams) {
    var vm = this;
    vm.$stateParams = $stateParams;
}
