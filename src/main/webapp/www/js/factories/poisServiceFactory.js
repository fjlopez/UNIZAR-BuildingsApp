/**********************************************************************
 * infoService: Servicio que define todas las llamadas al web service para recoger los datos
 ***********************************************************************/

UZCampusWebMapApp.factory('poisService', function($http, $q, $timeout, $state, $rootScope, APP_CONSTANTS) {

        var createPOI = function (data) {
            var deferred = $q.defer();
            var request = {
                method: 'POST',
                url: APP_CONSTANTS.URI_API + 'pois/',
                data : JSON.stringify(data),
                contentType: 'application/json',
            };
            $timeout(function () {
                $http(request).then(
                    function (result) {
                        deferred.resolve(result.data);
                    },
                    function(err){
                        console.log("Error createPOI: ",err);
                        deferred.reject(err);
                    }
                );
            });
            return deferred.promise;
        };

        var getRoomPOIs = function (building, floor) {
            var deferred = $q.defer();
            var request = {
                method: 'GET',
                url: APP_CONSTANTS.URI_API + 'pois/'+building+'/'+floor+'/',
                contentType: 'application/json',
                dataType: "json"
            };
            console.log(request);
            $timeout(function () {
                $http(request).then(
                    function (result) {
                        deferred.resolve(result.data);
                    },
                    function(err){
                        console.log("Error getRoomPOIS: ",err);
                        deferred.reject(err);
                    }
                );
            });
            return deferred.promise;
        };

        var getInfoPOI = function (id) {
            var deferred = $q.defer();
            var request = {
                method: 'GET',
                url: APP_CONSTANTS.URI_API + 'pois/'+id+'/',
                contentType: 'application/json',
                dataType: "json"
            };
            console.log(request);
            $timeout(function () {
                $http(request).then(
                    function (result) {
                        deferred.resolve(result.data);
                    },
                    function(err){
                        console.log("Error getInfoPOI: ",err);
                        deferred.reject(err);
                    }
                );
            });
            return deferred.promise;
        };

        var modifyPOI = function (data) {
            var deferred = $q.defer();
            var request = {
                method: 'POST',
                url: APP_CONSTANTS.URI_API + 'pois/request',
                data : JSON.stringify(data),
                contentType: 'application/json',
            };
            $timeout(function () {
                $http(request).then(
                    function (result) {
                        deferred.resolve(result.data);
                    },
                    function(err){
                        console.log("Error modifyPOI: ",err);
                        deferred.reject(err);
                    }
                );
            });
            return deferred.promise;
        };

        //Definición de las funciones anteriores para poder ser utilizadas
        return {
            createPOI: createPOI,
            getRoomPOIs: getRoomPOIs,
            getInfoPOI: getInfoPOI,
            modifyPOI: modifyPOI
        };
    });