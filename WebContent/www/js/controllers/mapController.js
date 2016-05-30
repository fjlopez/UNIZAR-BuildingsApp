/**********************************************************************
 * MapCtrl: Controlador de Leaflet
 ***********************************************************************/

UZCampusWebMapApp.controller('MapCtrl',function($scope, $rootScope, geoService, infoService, sharedProperties, $ionicPopup, $ionicModal) {

    var mapa = geoService.crearMapa($scope, infoService);
    sharedProperties.setMapa(mapa);

    console.log(mapa);

    /*$scope.showPopup = function() {
        $scope.POI_data = {};
            var myPopup = $ionicPopup.show({
                templateUrl: 'templates/searchPOI.html',
                cssClass: 'my-popup',
                title: 'Buscar puntos de interés',
                subTitle: 'Por favor, selecciona una categoría',
                scope: $scope,
                buttons: [
                    //{text: 'Cancelar'},
                    {
                        text: '<b>Buscar</b>',
                        type: 'button-positive',
                        onTap: function (e) {
                            return $scope.POI_data.nombre;
                        }
                    }
                ]
            });

         myPopup.then(function (res) {
            console.log('Tapped!', res);
         });
     };*/

    /*$ionicModal.fromTemplateUrl('templates/filterPOIs.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });

    $scope.openPOIModal = function() {
        $scope.modal.show();
    };
    $scope.closePOIModal = function() {
        $scope.modal.hide();
    };
    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
        $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
        // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
        // Execute action
    });

    //On double-clik or long-tap click in the map --> Open POI modal
    mapa.on('contextmenu', function(e){
        $scope.data = {
            city: 'Zaragoza',
            campus: 'Campus Río Ebro',
            building: 'Ada Byron',
            floor: 'Planta 0',
            name: 'Panel de anuncios',
            category: 'Otros',
            comments: 'Panel con anuncios de alquileres de pisos y eventos varios relacionados con la Universidad.'
        };
        $scope.openPOIModal();
    });

    $scope.createPOI = function(data) {
        console.log("Data", data);
        console.log("Create POI",$scope.data);
    }*/
});