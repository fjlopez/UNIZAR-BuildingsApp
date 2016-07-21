/**********************************************************************
 * MapCtrl: Controlador de Leaflet
 ***********************************************************************/

UZCampusWebMapApp.controller('MapCtrl',function($scope, $rootScope, geoService, infoService, sharedProperties) {

	//Map is created only once
  
	var mapa = geoService.crearMapa($scope, infoService);
  sharedProperties.setMapa(mapa);

  //This code will be executed every time the controller view is loaded
	$scope.$on('$ionicView.beforeEnter', function(){ 
		//Check if the map view must be changed
    if (sharedProperties.getReloadMap() === true) {
    	switch (sharedProperties.getOpcion()) {
    		case 0: geoService.localizarHuesca(); break;
    		case 1: geoService.localizarZaragoza(); break;
    		case 2: geoService.localizarTeruel(); break;
    	}
	  }
  });
});