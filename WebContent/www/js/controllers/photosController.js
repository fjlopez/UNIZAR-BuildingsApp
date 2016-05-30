/**************************************************************************
 * FotoCtrl: Controlador encargado de las acciones de la vista de fotos de una estancia
 ***********************************************************************/

UZCampusWebMapApp.controller('FotoCtrl', function($scope, $rootScope, $window){

        $scope.buttonAnterior=true;
        var html = '<img src="' + $rootScope.urlFoto + $rootScope.fotoSelecionada + ') [640x480].jpg"> </img>';
        $("#fotoEstancia").html(html);
        var html2 = "<strong>Foto " + $rootScope.fotoSelecionada + " de " + $rootScope.numeroFotos + "</strong>";
        $("#datosFotos").html(html2);
        $scope.anterior = function() {

            if($rootScope.fotoSelecionada-1 >0){
                $rootScope.fotoSelecionada=$rootScope.fotoSelecionada-1;

                //window.location = "#/app/foto";
                var html = '<img src="'+$rootScope.urlFoto+ $rootScope.fotoSelecionada+') [640x480].jpg""> </img>';
                var html2 = "<strong>Foto "+$rootScope.fotoSelecionada+" de "+$rootScope.numeroFotos+"</strong>";

                $scope.buttonSiguiente=false;//se activa si pasamos a una foto anterior
                if($rootScope.fotoSelecionada-1<1){//Si no hay mas fotos anteriores, inactivar el boton
                    $scope.buttonAnterior=true;
                }else{
                    $scope.buttonAnterior=false;
                }
                $("#fotoEstancia").html(html);
                $("#datosFotos").html(html2);
            }
            else{
                $scope.buttonAnterior=true;
            }
        };

        $scope.siguiente = function() {

            if(parseInt($rootScope.fotoSelecionada+1) <= parseInt($rootScope.numeroFotos)){
                $rootScope.fotoSelecionada=$rootScope.fotoSelecionada+1;
                var html = '<img src="'+$rootScope.urlFoto+ $rootScope.fotoSelecionada+') [640x480].jpg""> </img>';
                var html2 = "<strong>Foto "+$rootScope.fotoSelecionada+" de "+$rootScope.numeroFotos+"</strong>";

                $scope.buttonAnterior=false;//se activa si pasamos a una foto siguiente
                if($rootScope.fotoSelecionada+1>$rootScope.numeroFotos){//Si no hay mas fotos siguientes, inactivar el boton
                    $scope.buttonSiguiente=true;
                }else{
                    $scope.buttonSiguiente=false;
                }
                $("#fotoEstancia").html(html);
                $("#datosFotos").html(html2);
            }
            else{
                $scope.buttonSiguiente=true;
            }
        };

        $scope.volver = function() {
            $window.history.back();
        };
    });