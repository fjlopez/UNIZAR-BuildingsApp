/**********************************************************************
 * PlanCtrl: Controlador del plano del edificio en  Leaflet
 ***********************************************************************/

UZCampusWebMapApp.controller('PlanCtrl',function($scope, $http, $ionicModal, $ionicLoading, $ionicPopup, geoService, infoService, poisService, sharedProperties, APP_CONSTANTS) {

    function isValidEmailAddress(emailAddress) {
        var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
        return pattern.test(emailAddress);
    };

    //This code will be executed every time the controller view is loaded
    $scope.$on('$ionicView.beforeEnter', function(){
	
	geoService.crearPlano($scope, $http, infoService, sharedProperties, poisService, $scope.openCreatePOIModal);

        if (typeof(sharedProperties.getPlano()) !== 'undefined')
            geoService.updatePOIs(sharedProperties, poisService);
    });

    $scope.pois = APP_CONSTANTS.pois;

    //Define Ionic Modal for add a new POI
    $ionicModal.fromTemplateUrl('templates/addPOI.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modalCreatePOI = modal;
    });

    $ionicModal.fromTemplateUrl('templates/editPOI.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modalEditPOI = modal;
    });

    $scope.ev = {
        email: '',
        emailChecked: false
    };

    //Open the modal for add a POI and load data in the modal form
    $scope.openCreatePOIModal = function(e) {
        $ionicLoading.show({template: 'Cargando...'});
        console.log("openCreatePOIModal", e, JSON.parse(localStorage.floor));
        var info = JSON.parse(localStorage.floor),
            floor = info.floor,
            id = e.target.feature.properties.et_id;

        infoService.getInfoEstancia(id).then(
            function (data) {
                if (data.length === 0) $ionicLoading.hide();
                else {
                    $scope.existsCity = (data.ciudad != null && typeof data.ciudad !== 'undefined') ? true : false;
                    $scope.existsCampus = (data.campus != null && typeof data.campus !== 'undefined') ? true : false;
                    $scope.existsBuilding = (data.edificio != null && typeof data.edificio !== 'undefined') ? true : false;
                    $scope.existsAddress = (data.dir != null && typeof data.dir !== 'undefined') ? true : false;
                    $scope.existsFloor = (floor != null && typeof floor !== 'undefined') ? true : false;

                    var city = data.ciudad.toLowerCase();

                    $scope.data = {
                        city: city.substr(0, 1).toUpperCase() + city.substr(1),
                        campus: data.campus,
                        building: data.edificio,
                        roomId: data.ID_espacio,
                        roomName: data.ID_centro,
                        address: data.dir,
                        floor: info.floor,
                        latitude: e.latlng.lat,
                        longitude: e.latlng.lng
                    };
                    console.log("Data to modal",$scope.data);
                    $ionicLoading.hide();
                    $scope.modalCreatePOI.show();
                } 
            },
            function(err){
                console.log("Error on getInfoEstancia", err);
                $ionicLoading.hide();
                var errorMsg = '<div class="text-center">Ha ocurrido un error recuperando<br>';
                errorMsg += 'la información de la estancia</div>';
                $scope.showInfoPopup('¡Error!', errorMsg);
            }
        );
    };

    $scope.$on('modalEditPOI.hidden', function() {
        console.log("Modal hide");
    });

    $scope.confirmCreatePOI = function(data) {

        var confirmCreatePOIpopup = $ionicPopup.show({
            templateUrl: 'templates/pois/confirmCreatePOI.html',
            title: 'Confirmar creación de POI',
            scope: $scope,
            buttons: [
                {
                    text: '<b>Guardar</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                        e.preventDefault();
                        var email = $($('#confirm-create-poi-popup input')[1]).val(),
                            emailValid = isValidEmailAddress(email);

                        if (email.length==0 || email==null || typeof(email)=='undefined' || !emailValid) {
                            $ionicLoading.show({ template: 'Introduzca un email válido', duration: 1500});
                        }
                        else {
                            data.email = email;
                            $scope.finalSubmitCreatePOI(data);
                            confirmCreatePOIpopup.close();
                        }
                    }
                },
                { 
                    text: 'Cancelar',
                    type: 'button-assertive'
                }
            ]
        });
    };

    $scope.finalSubmitCreatePOI = function(data) {
        console.log("finalSubmitCreatePOI form",data);
        $ionicLoading.show({ template: 'Enviando...'});
        data.category = data.category.name;
        $ionicLoading.hide();
        poisService.createPOI(data).then(
            function(poi) {
                console.log("Create POI success",poi);
                $ionicLoading.hide();
                var successMsg = '<div class="text-center">';
                successMsg += 'Creación del punto de interés enviada con éxito</div>';
                $scope.showInfoPopup('¡Éxito!', successMsg)
                $scope.modalCreatePOI.hide();
                geoService.updatePOIs(sharedProperties, poisService);
            },
            function(err){
                console.log("Error on createPOI", err);
                $ionicLoading.hide();
                var errorMsg = '<div class="text-center">Ha ocurrido un error creando<br>';
                errorMsg += 'el punto de interés</div>';
                $scope.showInfoPopup('¡Error!', errorMsg);
            }
        );
    };

    $scope.finalSubmitDeletePOI = function(data) {
        console.log("finalSubmitDeletePOI form",data);
        //TODO: [DGP] Implementar funcionalidad
    };

    $scope.openEditPOIModal = function(id){
        console.log("openEditPOIModal", id);
        $ionicLoading.show({template: 'Cargando...'});

        poisService.getInfoPOI(id).then(
            function(poi) {
                console.log("Get POI info success",poi);
                var data = poi.data;
                if (data.length === 0) $ionicLoading.hide();
                else {
                    $scope.existsCity = (data.city != null && typeof data.city !== 'undefined') ? true : false;
                    $scope.existsCampus = (data.campus != null && typeof data.campus !== 'undefined') ? true : false;
                    $scope.existsBuilding = (data.building != null && typeof data.building !== 'undefined') ? true : false;
                    $scope.existsAddress = (data.address != null && typeof data.address !== 'undefined') ? true : false;
                    $scope.existsFloor = (data.floor != null && typeof data.floor !== 'undefined') ? true : false;

                    $scope.data = data;

                    console.log("Data to modal",$scope.data);
                    $ionicLoading.hide();
                    $scope.modalEditPOI.show().then(function(){
                        $('select[name=category] option').each(function(){ $(this).val($(this).attr('label')); });
                        $('select[name=category]').val(data.category);
                    });
                } 
            },
            function(err){
                console.log("Error on get POI info", err);
                $ionicLoading.hide();
                var errorMsg = '<div class="text-center">Ha ocurrido un error recuperando<br>';
                errorMsg += 'los datos del puntos de interés</div>';
                $scope.showInfoPopup('¡Error!', errorMsg);
            }
        );
    };

    $scope.$on('modalEditPOI.hidden', function() {
        console.log("Modal hide");
    });

    $scope.confirmEditPOI = function(data) {
        var confirmEditPOIpopup = $ionicPopup.show({
            templateUrl: 'templates/pois/confirmEditPOI.html',
            title: 'Confirmar modificación',
            scope: $scope,
            buttons: [
                {
                    text: '<b>Guardar</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                        e.preventDefault();
                        var email = $($('#confirm-edit-poi-popup input')[1]).val(),
                            emailValid = isValidEmailAddress(email);

                        if (email.length==0 || email==null || typeof(email)=='undefined' || !emailValid) {
                            $ionicLoading.show({ template: 'Introduzca un email válido', duration: 1500});
                        }
                        else {
                            data.email = email;
                            $scope.finalSubmitEditPOI(data);
                            confirmEditPOIpopup.close();
                        }
                    }
                },
                { 
                    text: 'Cancelar',
                    type: 'button-assertive'
                }
            ]
        });
    };

    $scope.finalSubmitEditPOI = function(data) {
        console.log("finalSubmitEditPOI form",data);
        $ionicLoading.show({ template: 'Enviando...'});
        $ionicLoading.hide();

        data.comment = data.comments;
        data.type = "edit";
        data.poi = data.id;

        poisService.modifyPOI(data).then(
            function(poi) {
                console.log("Request modify POI success",poi);
                $ionicLoading.hide();
                var successMsg = '<div class="text-center">';
                successMsg += 'Petición de modificación del punto de interés enviada con éxito</div>';
                $scope.showInfoPopup('¡Éxito!', successMsg)
                $scope.modalEditPOI.hide();
            },
            function(err){
                console.log("Error on finalSubmitEditPOI", err);
                $ionicLoading.hide();
                var errorMsg = '<div class="text-center">Ha ocurrido un error enviando<br>';
                errorMsg += 'la petición de modificación del punto de interés</div>';
                $scope.showInfoPopup('¡Error!', errorMsg);
            }
        );
    };

    $scope.confirmDeletePOI = function(data) {
        var confirmDeletePOI = $ionicPopup.show({
            templateUrl: 'templates/pois/confirmDeletePOI.html',
            title: 'Confirmar modificación',
            scope: $scope,
            buttons: [
                {
                    text: '<b>Eliminar</b>',
                    type: 'button-assertive',
                    onTap: function(e) {
                        e.preventDefault();
                        var email = $($('#confirm-delete-poi-popup input')[1]).val(),
                            emailValid = isValidEmailAddress(email),
                            reason = $('#confirm-delete-poi-popup textarea').val();

                        if (email.length==0 || email==null || typeof(email)=='undefined' || !emailValid) {
                            $ionicLoading.show({ template: 'Introduzca un email válido', duration: 1500});
                        }
                        else if (reason.length==0 || reason==null || typeof(reason)=='undefined') {
                            $ionicLoading.show({ template: 'Introduzca una razón', duration: 1500});   
                        }
                        else {
                            data.email = email;
                            data.reason = reason;
                            $scope.finalSubmitDeletePOI(data);
                            confirmDeletePOI.close();
                        }
                    }
                },
                { 
                    text: 'Cancelar',
                    type: 'button-stable'
                }
            ]
        });
    };

    $scope.finalSubmitDeletePOI = function(data) {
        console.log("finalSubmitDeletePOI form",data);
        $ionicLoading.show({ template: 'Enviando...'});
        $ionicLoading.hide();

        data.type = "delete";
        data.poi = data.id;

        poisService.modifyPOI(data).then(
            function(poi) {
                console.log("Request delete POI success",poi);
                $ionicLoading.hide();
                var successMsg = '<div class="text-center">';
                successMsg += 'Petición de eliminación del punto de interés enviada con éxito</div>';
                $scope.showInfoPopup('¡Éxito!', successMsg)
                $scope.modalEditPOI.hide();
            },
            function(err){
                console.log("Error on finalSubmitDeletePOI", err);
                $ionicLoading.hide();
                var errorMsg = '<div class="text-center">Ha ocurrido un error enviando<br>';
                errorMsg += 'la petición de eliminación del punto de interés</div>';
                $scope.showInfoPopup('¡Error!', errorMsg);
            }
        );
    };

    $scope.showInfoPopup = function(title, msg){
        $ionicPopup.alert({
            title: title,
            template: msg
        });
    };
});
