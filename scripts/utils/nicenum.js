/**
 * @description
 * Creates a filter to make numbers more readable up to billions
 */
angular.module('blizzso.nicenum', [])


.filter('nicenum', function() {
    return function(input) {
        var abbreviations = ['k', 'm', 'b'];
        var num = input;

        // Start counting from billions
        for (var i=abbreviations.length-1; i>=0; i--) {
            var size = Math.pow(10, (i+1)*3);

            if (num >= size) {
                num = Math.round(num/size);

                // Handle edge case where 999,950 gets rounded to 1000k
                if ((num === 1000) && (i<abbreviations.length-1)) {
                    num = 1;
                    i++;
                }
                // Append suffix to number
                num += abbreviations[i];
                // All done, leave loop
                break;
            }
        }
        return num;
    };
});
