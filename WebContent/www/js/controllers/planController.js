/**********************************************************************
 * PlanCtrl: Controlador del plano del edificio en  Leaflet
 ***********************************************************************/

UZCampusWebMapApp.controller('PlanCtrl',function($scope, $http, geoService, infoService) {

        //mapa=geoService.crearMapa($scope,miFactoria,opcion, infoService);
        geoService.crearPlano($scope, $http, infoService);

    });