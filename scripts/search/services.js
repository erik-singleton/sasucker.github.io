/**
 * @description
 * Factory for search model
 * Parses result data for tag list
 */
angular.module('blizzso.search.services', [
    'ngResource',
    'SEWrapper',
    'blizzso.user'
])


.factory('searchModel', function($resource, userConfig, SEConfig) {
    return $resource('https://api.stackexchange.com/2.2/search', {
        // This requires a separate filter from the config
        tagged: '@tagged',
        nottagged: '@nottagged',
        intitle: '@intitle',
        sort: '@sort',
        page: '@page',
        key: SEConfig.key,
        filter: '!9YdnSQVgz',
        site: userConfig.site
    }, {
        search: {
            method: 'GET',
            cache: true,
            transformResponse: function(data) {
                var data = JSON.parse(data);
                var temp = data.items;
                var tagList = {};
                var max = 0;
                var i, j, len, tlen; 

                // Iterate through each result item, and then its tags
                // If tag exists, add one, otherwise create new object
                // Also check for max while at it
                // 
                // Classic for loops used for speed
                for (i=0, len=temp.length; i<len; i++) {
                    var tagtemp = temp[i].tags;
                    for (j=0, tlen=tagtemp.length; j<tlen; j++) {
                        if (!tagList.hasOwnProperty(tagtemp[j])) {
                            tagList[tagtemp[j]] = 1;
                        } else {
                            tagList[tagtemp[j]]++;
                        }
                        max = (tagList[tagtemp[j]] > max) ? tagList[tagtemp[j]] : max;
                    }
                }
                data.tags = tagList; 
                data.maxTagCount = max;

                return data;
            }
        }
    });
});

