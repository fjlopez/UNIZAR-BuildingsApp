/**********************************************************************
 * infoService: Servicio que define todas las llamadas al web service para recoger los datos
 ***********************************************************************/

UZCampusWebMapApp.factory('infoService', function($http, $q, $timeout, $state, $rootScope, APP_CONSTANTS) {

        //Llamada AJAX al web service para recoger los codigos de espacio para rellenar el SELECT de busqueda
        var getEspacios = function () {
            var deferred = $q.defer();
            var request = {
                method: 'GET',
                url: APP_CONSTANTS.URI_busquedas + '/codigoespacios',
                contentType: 'application/json',
                dataType: "json"
            };
            $timeout(function () {
                $http(request).then(
                    function (result) {
                        deferred.resolve(result.data);
                    },
                    function(err){
                        console.log(err.status);
                        $rootScope.resultadoEspacioError = true;
                    }
                );
            });
            return deferred.promise;
        };

        //Llamada AJAX al web service para recoger los campus segun la ciudad del SELECT de busqueda
        var getCampus = function (ciudad) {
            var deferred = $q.defer();
            var request = {
                method: 'GET',
                url: APP_CONSTANTS.URI_busquedas + '/campus?ciudad='+ciudad,
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
                        console.log(err.status);
                        $rootScope.resultadoCampusError = true;
                    }
                );
            });
            return deferred.promise;
        };

        //Llamada AJAX al web service para recoger los edificios segun el campus del SELECT de busqueda
        var getEdificio = function (campus) {
            var deferred = $q.defer();
            var request = {
                method: 'GET',
                url: APP_CONSTANTS.URI_busquedas + '/edificio?campus='+campus,
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
                        console.log(err.status);
                        $rootScope.resultadoEdificioError = true;
                    }
                );
            });
            return deferred.promise;
        };

        //Llamada AJAX al web service para recoger el plano segun la planta escogida en el SELECT
        var getPlano = function (planta) {
            var deferred = $q.defer();
            var request = {
                method: 'GET',
                url: URI + '/edificio?campus='+campus,
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
                        console.log(err.status);
                        $rootScope.resultadoEdificioError = true;
                    }
                );
            });
            return deferred.promise;
        };

        //Llamada AJAX al web service para recoger la informacion del edificio(nombre, direccion y numero de plantas)
        var getInfoEdificio = function (edificio) {
            var deferred = $q.defer();
            var request = {
                method: 'GET',
                url: APP_CONSTANTS.URI_busquedas + '/infoedificio?edificio='+edificio,
                contentType: 'application/json',
                dataType: "json"
            };
            $timeout(function () {
                $http(request).then(
                    function (result) {
                        deferred.resolve(result.data);
                    },
                    function(err){
                        console.log(err.status);
                        $rootScope.resultadoEdificioError = true;
                    }
                );
            });
            return deferred.promise;
        };

        var getInfoEstancia = function (estancia) {
            var deferred = $q.defer();
            var request = {
                method: 'GET',
                url: APP_CONSTANTS.URI_estancias + '/id_estancia?estancia='+estancia,
                contentType: 'application/json',
                dataType: "json"
            };
            $timeout(function () {
                $http(request).then(
                    function (result) {
                        deferred.resolve(result.data);
                    },
                    function(err){
                        console.log(err.status);
                        $rootScope.resultadoEdificioError = true;
                    }
                );
            });
            return deferred.promise;
        };

        var getEstancia = function (estancia) {
            var deferred = $q.defer();
            var request = {
                method: 'GET',
                url: APP_CONSTANTS.URI_estancias + '/getEstancia?estancia='+estancia,
                contentType: 'application/json',
                dataType: "json"
            };
            $timeout(function () {
                $http(request).then(
                    function (result) {
                        deferred.resolve(result.data);
                    },
                    function(err){
                        console.log(err.status);
                        $rootScope.resultadoEdificioError = true;
                    }
                );
            });
            return deferred.promise;
        };

        var getAllEstancias = function (estancia) {
            var deferred = $q.defer();
            var request = {
                method: 'GET',
                url: APP_CONSTANTS.URI_estancias + '/getAllEstancias?estancia='+estancia,
                contentType: 'application/json',
                dataType: "json"
            };
            $timeout(function () {
                $http(request).then(
                    function (result) {
                        deferred.resolve(result.data);
                    },
                    function(err){
                        console.log(err.status);
                        $rootScope.resultadoEdificioError = true;
                    }
                );
            });
            return deferred.promise;
        };

        //Definición de las funciones anteriores para poder ser utilizadas
        return {
            getEspacios: getEspacios,
            getCampus: getCampus,
            getEdificio: getEdificio,
            getInfoEdificio:getInfoEdificio,
            getInfoEstancia:getInfoEstancia,
            getEstancia:getEstancia,
            getAllEstancias:getAllEstancias
        };
    });