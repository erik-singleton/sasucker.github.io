/**
 * @description
 * Directive elements for Questions, Answers, and Comments
 */
angular.module('blizzso.question.directives', [
    'blizzso.nicenum'
])


.directive('blizzsoQuestion', function() {
    return {
        restrict: 'EA',
        replace: true,
        scope: {
            question: '='
        },
        templateUrl: 'template/question/blizzsoquestion.partial.html',
    };
})


.directive('blizzsoAnswer', function() {
    return {
        restrict: 'EA',
        replace: true,
        scope: {
            answer: '='
        },
        templateUrl: 'template/question/blizzsoanswer.partial.html'
    };
})


.directive('blizzsoComment', function() {
    return {
        restrict: 'EA',
        replace: true,
        scope: {
            comment: '=',
            commentLimit: '='
        },
        templateUrl: 'template/question/blizzsocomment.partial.html'
    };
});

