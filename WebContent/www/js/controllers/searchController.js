/**************************************************************************
 * SearchCtrl: Controlador encargado de las acciones de la vista de busqueda de estancias
 ***********************************************************************/

UZCampusWebMapApp.controller('SearchCtrl', function($scope, $rootScope, infoService, $window) {

        $scope.busquedaEspacios = function() {
            infoService.getEspacios().then(
                function (data) {
                    $rootScope.codigoEspacios = data;
                    //console.log(data);
                    if (data.length == 0){
                        $rootScope.resultadoCodigoEspacioVacio = true;
                    }
                }
            );
            document.getElementById('codEspacio').style.display= 'block' ;//Para mostar el select con el codigo de espacio después de pulsar el boton y rellenarlo
        };

        $scope.selectCampus = function(ciudad) {//Cuando selecciono una ciudad, tengo que traerme los campus de dicha ciudad

            infoService.getCampus(ciudad).then(
                function (data) {
                    $rootScope.Campus = data;
                    console.log(data);
                    if (data.length == 0){
                        $rootScope.resultadoCampusVacio = true;
                    }
                }
            );
        };

        $scope.selectEdificio = function(campus) {//Cuando selecciono un campus, tengo que traerme los edificios de dicho campus

            infoService.getEdificio(campus).then(
                function (data) {
                    $rootScope.Edificio = data;
                    console.log(data);
                    if (data.length == 0){
                        $rootScope.resultadoEdificioVacio = true;
                    }
                }
            );
        };

        $scope.selectPlanta = function(edif) {//Cuando selecciono un edificio, tengo que buscar el numero de plantas de dicho edificio

            for (x=0;x<$rootScope.Edificio.length;x++){
                if($rootScope.Edificio[x].ID_Edificio==edif){//Saber el edificio selecionado que tenemos que incluir el Select de plantas
                    $rootScope.EdificioEscogido = edif;//Se utiliza para en el siguiente select
                    $rootScope.Planta = $rootScope.Edificio[x].plantas;
                }
            }
        };

        $scope.selectEstancia = function(planta) {//Cuando selecciono una planta, busco todas las estancias de dicha planta

            infoService.getAllEstancias($rootScope.EdificioEscogido+planta).then(
                function (data) {
                    $rootScope.Estancias = data;
                    console.log(data);
                    if (data.length == 0){
                        $rootScope.resultadoEstanciasVacio = true;
                    }
                }
            );
        };

        $scope.busqueda = function() {//Cuando selecciono un edificio, tengo que buscar el numero de plantas de dicho edificio
            if(($("#selectCiudad option:selected").text().trim() == "")||($("#selectCampus option:selected").text().trim() == "")||
                ($("#selectEdificio option:selected").text().trim() == "")|| ($("#selectPlanta option:selected").text().trim() == "")||
                ($("#selectEstancia option:selected").text().trim() == "")){//Comprobar que no haya ningún select vacio
                alert($scope.translation.ALERT_SELECT);
            }
            else{
                localStorage.estancia = $("#selectEstancia option:selected").val().trim();
                $window.location = "#/app/estancia";
            }
        };
    });