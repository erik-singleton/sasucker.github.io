angular.module('blizzso.user.controllers', [
])

.controller('UserCtrl', UserCtrl);

/**
 * @description
 * Corral all of the user's information
 */
function UserCtrl(userProfile) {
    var vm = this;
    vm.badges = userProfile.badges();
    vm.favorites = userProfile.favorites();
    vm.info = userProfile.info();
    vm.tags = userProfile.tags();
    vm.timeline = userProfile.timeline();

    // Using this object to create verbs for
    // timeline as well as assign classes
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

/**
 * @description
 * Check to see if a timeline item is a badge
 */
UserCtrl.prototype.isBadge = function(timelineItem) {
    return timelineItem.timeline_type === 'badge';
};
