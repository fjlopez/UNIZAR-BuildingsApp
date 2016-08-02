/**********************************************************************
 * AppCtrl: Controlador principal de la aplicación.
 ***********************************************************************/

UZCampusWebMapApp.controller('AppCtrl',function($scope, $rootScope, geoService, sharedProperties, $window, $state, $stateParams) {

        var userAgent = $window.navigator.userAgent;

        $scope.provincia = "";

        if (/firefox/i.test(userAgent)) {
            alert($scope.translation.NAVEGADORNOCOMPATIBLE);
        }

        $scope.loadMap = function(option, menu) {
            var currentMap = sharedProperties.getMapa();
            var currentOption = sharedProperties.getOpcion();

            if (typeof currentMap === 'undefined' || currentOption !== option) {
                sharedProperties.setOpcion(option);
                sharedProperties.setReloadMap(true);
            }
            else sharedProperties.setReloadMap(false);
            
            if (menu === true && currentOption != option) {
                switch (sharedProperties.getOpcion()) {
                    case 0: geoService.localizarHuesca(); break;
                    case 1: geoService.localizarZaragoza(); break;
                    case 2: geoService.localizarTeruel(); break;
                }
            }
        };
    });
