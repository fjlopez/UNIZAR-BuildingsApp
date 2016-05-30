/**********************************************************************
 * AppCtrl: Controlador principal de la aplicación.
 ***********************************************************************/

UZCampusWebMapApp.controller('AppCtrl',function($scope, $rootScope, geoService, sharedProperties, $window) {

        var userAgent = $window.navigator.userAgent;

        if (/firefox/i.test(userAgent)) {
            alert($scope.translation.NAVEGADORNOCOMPATIBLE);
        }

        // Si la pulsación ha sido en la vista de inicio
        $scope.Huesca = function() {
            console.log("Huesca map selected");
            sharedProperties.setOpcion(1);
            var mapa = sharedProperties.getMapa();
            if(!(typeof mapa == 'undefined')){
                $scope.mapa=mapa;
                geoService.localizarHuesca($scope.mapa);
            }
        };

        $scope.Zaragoza = function() {
            console.log("Zaragoza map selected");
            sharedProperties.setOpcion(0);
            var mapa = sharedProperties.getMapa();
            if(!(typeof mapa == 'undefined')){
                $scope.mapa=mapa;
                geoService.localizarZaragoza($scope.mapa);
            }
        };

        $scope.Teruel = function() {
            console.log("Teruel map selected");
            sharedProperties.setOpcion(2);
            var mapa = sharedProperties.getMapa();
            if(!(typeof mapa == 'undefined')){
                $scope.mapa=mapa;
                geoService.localizarTeruel($scope.mapa);
            }
        }
    });
