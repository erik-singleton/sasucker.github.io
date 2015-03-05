angular.module('blizzso.question.directives', [
    'blizzso.nicenum'
])


.directive('blizzsoQuestion', function() {
    return {
        restrict: 'EA',
        transclude: true,
        replace: true,
        scope: {
            question: '='
        },
        templateUrl: 'template/question/blizzsoquestion.partial.html',
    };
});

