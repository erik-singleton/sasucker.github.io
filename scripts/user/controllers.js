angular.module('blizzso.user.controllers', [
])

.controller('UserCtrl', UserCtrl);


function UserCtrl(userInfo, userBadges, userTimeline, userTags) {
    this.info = userInfo.items;
    this.badges = userBadges.items;
    this.timeline = userTimeline.items;
    this.tags = userTags.items;
}
