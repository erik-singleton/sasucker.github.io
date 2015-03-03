angular.module('blizzso.user.controllers', [
])

.controller('UserCtrl', UserCtrl);


function UserCtrl(userProfile) {
    var vm = this;
    vm.info = userProfile.info();
    vm.badges = userProfile.badges();
    vm.timeline = userProfile.timeline();
    vm.tags = userProfile.tags();
}
