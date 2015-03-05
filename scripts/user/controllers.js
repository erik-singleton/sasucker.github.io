angular.module('blizzso.user.controllers', [
])

.controller('UserCtrl', UserCtrl);


function UserCtrl(userProfile) {
    var vm = this;
    vm.badges = userProfile.badges();
    vm.favorites = userProfile.favorites();
    vm.info = userProfile.info();
    vm.tags = userProfile.tags();
    vm.timeline = userProfile.timeline();

    vm.badgeConverter = {
        accepted: {
            slug: 'accepted-wrapper',
            verb: 'accepted'
        },
        answered: {
            slug: 'answered-wrapper',
            verb: 'answered'
        },
        asked: {
            slug: 'asked-wrapper',
            verb: 'asked'
        },
        badge: {
            slug: 'individual-badge',
            verb: 'earned'
        },
        revision: {
            slug: 'revision-wrapper',
            verb: 'revised'
        },
        reviewed: {
            slug: 'reviewed-wrapper',
            verb: 'reviewed'
        },
        suggested: {
            slug: 'suggested-wrapper',
            verb: 'suggested'
        },
    }
}

UserCtrl.prototype.isBadge = function(timelineItem) {
    return timelineItem.timeline_type === 'badge';
};
