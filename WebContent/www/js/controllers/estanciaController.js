/**************************************************************************
 * EstanciaCtrl: Controlador encargado de la página de información de una estancia
 ***********************************************************************/

UZCampusWebMapApp.controller('EstanciaCtrl', function($scope, $rootScope, $ionicPopup, $http, $filter, geoService, infoService, APP_CONSTANTS){

        var estancia=localStorage.estancia;

        infoService.getEstancia(estancia).then(
            function (data) {
                $scope.infoEstancia = data;
                console.log(data);
                if (data.length == 0) {
                    $scope.resultadoEstanciaVacio = true;
                }
                /*angular.element(document.querySelector('#dato_estancia')).html(data.ID_espacio);
                angular.element(document.querySelector('#nombre_estancia')).html(data.ID_centro);
                angular.element(document.querySelector('#tipo_estancia')).html(data.tipo_uso);
                angular.element(document.querySelector('#superficie_estancia')).html(data.superficie);*/
                $scope.data = {
                    city: data.ID_espacio,
                    estancia: data.ID_centro,
                    type: data.tipo_uso,
                    area: data.superficie
                };
            }
        );

        $scope.mostrarFoto = function() {//Comprueba si hay imagenes para dicha estancia, si no hay muestra un error, si lo hay, lo carga al usuario
            var fotos = 0,
                salirbucle = false,
                url = "";

            for (i = 1; i <= 6 && !salirbucle; i++) {//Menor que 6 porque es el maximo de fotos de las que se dispone de una misma estancia
                url = APP_CONSTANTS.URI_fotos + estancia + "(" + i + ") [640x480].jpg";
                $.ajax({
                    url: url,
                    type: 'HEAD',
                    async: false,
                    error: function () {
                        if (i == 1) alert($scope.translation.NOPHOTO);//Si no hay ninguna foto mostrar alerta
                        salirbucle = true;
                    },
                    success: function () {
                        fotos++;
                    }
                });
            }
            $rootScope.numeroFotos = fotos;
            if (fotos > 0) {
                //TODO: [DGP] Why the "(" character at the end of the url?
                url = APP_CONSTANTS.URI_fotos + estancia + "(";
                console.log(url);
                $rootScope.urlFoto = url;
                $rootScope.fotoSelecionada = Number(1);//Para empezar mostrando la imagen primera
                //$window.location.href = url;
                window.location = "#/app/foto";

            }
        };

        $scope.volver = function() {
            estancia = undefined;
            window.history.back();
        };

        $scope.favoritos = function() {
            localStorage.favoritos+=estancia;
            var alertPopup = $ionicPopup.alert({
                title: $scope.translation.ADDFAVOURITE
            });
            alertPopup.then(function(res) {
                //console.log('Thank you for not eating my delicious ice cream cone');
            });
        };
    });