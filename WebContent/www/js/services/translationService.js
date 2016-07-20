UZCampusWebMapApp.service('translationService', function($resource) {

    return ({
        getTranslation: getTranslation
    });

    function getTranslation($scope, language) {

        var languageFilePath = 'translations/translation_' + language + '.json';
        console.log(languageFilePath);

        $resource(languageFilePath).get(function (data) {
            $scope.translation = data;
        });
    };
});