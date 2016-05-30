(function(){
  var app = angular.module('starter.controllers',[]);

  app.factory('miFactoria', function(){
    return {
      datosMapa: [{
        nombre: "Zaragoza",
        latitud: 41.6487908,
        longitud: -0.889581
      },
        {
          nombre: "Huesca",
          latitud: 42.142172,
          longitud: -0.405557
        },
        {
          nombre: "Teruel",
          latitud: 40.351661,
          longitud: -1.110081
        }]
    };
  });
  var opcion;
  var mapa;


  /**********************************************************************
   * AppCtrl: Controlador principal de la aplicación.
   ***********************************************************************/
  app.controller('AppCtrl',function($scope,$rootScope,geoService,miFactoria,$window) {

    var userAgent = $window.navigator.userAgent;

    if (/firefox/i.test(userAgent)) {
      alert($scope.translation.NAVEGADORNOCOMPATIBLE);
    }


    // Si la pulsación ha sido en la vista de inicio
    $scope.Huesca = function() {
      console.log("huesca");

      opcion=1;
      if(!(typeof mapa == 'undefined')){//Para cambiar la vista del mapa Huesca
        $scope.mapa=mapa;
        geoService.localizarHuesca($scope.mapa,miFactoria);
      }
    }
    $scope.Zaragoza = function() {
      console.log("zaragoza");

      opcion=0;
      if(!(typeof mapa == 'undefined')){//Para cambiar la vista del mapa Zaragoza
        $scope.mapa=mapa;
        geoService.localizarZaragoza($scope.mapa,miFactoria);
      }

    }
    $scope.Teruel = function() {
      console.log("teruel");

      opcion=2;
      if(!(typeof mapa == 'undefined')){//Para cambiar la vista del mapa Teruel
        $scope.mapa=mapa;
        geoService.localizarTeruel($scope.mapa,miFactoria);
      }
    }



  });

  /**********************************************************************
   * MapCtrl: Controlador de Leaflet
   ***********************************************************************/
  app.controller('MapCtrl',function($scope, $rootScope, $ionicPopup, $http, $filter,geoService,miFactoria, GetInfoService) {

    mapa=geoService.crearMapa($scope,miFactoria,opcion, GetInfoService);
    console.log(mapa);


  });

  /**********************************************************************
   * PlanCtrl: Controlador del plano del edificio en  Leaflet
   ***********************************************************************/
  app.controller('PlanCtrl',function($scope, $rootScope, $ionicPopup, $http, $filter,geoService,miFactoria, GetInfoService) {

    //mapa=geoService.crearMapa($scope,miFactoria,opcion, GetInfoService);
    geoService.crearPlano($scope,$http, GetInfoService);

  });


  /**************************************************************************
   * TopCtrl: Controlador encargado de redirigir la aplicación a la pantalla
   *          de splash en caso de refresco de página
   ***********************************************************************/
  app.controller('TopCtrl', function($location){
    $location.path("/");
  })
/*
  app.controller('MainCtrl', function($scope, $ionicSideMenuDelegate, $translate) {

    $scope.ChangeLanguage = function(lang){
      $translate.use(lang);
    }

  })*/

    app.controller('TranslationCtrl',['$scope', 'translationService',
      function ($scope, translationService){

        //Run translation if selected language changes
        $scope.translate = function(){
          translationService.getTranslation($scope, $scope.selectedLanguage);
        };

        $scope.changeLanguage = function (langKey) {
          console.log(langKey);
          $scope.selectedLanguage = langKey;
          $scope.translate();
          mapa = undefined;//Por si hay cambio de idioma, que se repinte el mapa en inglés si ya se habia visitado
        };

        //Init
        $scope.selectedLanguage = 'es';
        $scope.translate();

      }])

  app.controller('EstanciaCtrl', function($scope, $rootScope, $ionicPopup, $http, $filter,geoService,miFactoria, GetInfoService,$timeout,$window){
    var estancia=localStorage.estancia;

    GetInfoService.getEstancia(estancia).then(
        function (data) {
          $scope.infoEstancia = data;
           console.log(data);
          if (data.length == 0) {
            $scope.resultadoEstanciaVacio = true;
          }
          angular.element(document.querySelector('#dato_estancia')).html(data.ID_espacio);
          angular.element(document.querySelector('#nombre_estancia')).html(data.ID_centro);
          angular.element(document.querySelector('#tipo_estancia')).html(data.tipo_uso);
          angular.element(document.querySelector('#superficie_estancia')).html(data.superficie);
        }
    );
    $scope.mostrarFoto = function() {//Comprueba si hay imagenes para dicha estancia, si no hay muestra un error, si lo hay, lo carga al usuario
      var fotos = 0;
      var salirbucle = false;
      for (i = 1; i <= 6 && !salirbucle; i++) {//Menor que 6 porque es el maximo de fotos de las que se dispone de una misma estancia
        //console.log(i);
        var url = "http://155.210.14.31:8080/mapa/www/fotos/" + estancia + "(" + i + ") [640x480].jpg";
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

        var url = "http://155.210.14.31:8080/mapa/www/fotos/" + estancia + "(";
        console.log(url);
        $rootScope.urlFoto = url;
        $rootScope.fotoSelecionada = Number(1);//Para empezar mostrando la imagen primera
        //$window.location.href = url;
        window.location = "#/app/foto";

      }
    }


    $scope.volver = function() {
      estancia = undefined;
      window.history.back();
    }

    $scope.favoritos = function() {
      localStorage.favoritos+=estancia;
      var alertPopup = $ionicPopup.alert({
        title: $scope.translation.ADDFAVOURITE
      });
      alertPopup.then(function(res) {
        //console.log('Thank you for not eating my delicious ice cream cone');
      });
    }
  })

  app.controller('FotoCtrl', function($scope, $rootScope, $ionicPopup, $http, $filter,geoService,miFactoria, GetInfoService,$timeout,$window){
    $scope.buttonAnterior=true;
    var html = '<img src="'+$rootScope.urlFoto+ $rootScope.fotoSelecionada+') [640x480].jpg""> </img>';
    $("#fotoEstancia").html(html);
    var html2 = "<strong>Foto "+$rootScope.fotoSelecionada+" de "+$rootScope.numeroFotos+"</strong>";
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

    }
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

    }

    $scope.volver = function() {
      window.history.back();
    }

    })


  app.controller('SearchCtrl', function($scope,$rootScope, GetInfoService) {


    $scope.busquedaEspacios = function() {
      GetInfoService.getEspacios().then(
          function (data) {
            $rootScope.codigoEspacios = data;
            //console.log(data);
            if (data.length == 0){
              $rootScope.resultadoCodigoEspacioVacio = true;
            }

          }
      );
      document.getElementById('codEspacio').style.display= 'block' ;//Para mostar el select con el codigo de espacio después de pulsar el boton y rellenarlo
    }

    $scope.selectCampus = function(ciudad) {//Cuando selecciono una ciudad, tengo que traerme los campus de dicha ciudad

        GetInfoService.getCampus(ciudad).then(
            function (data) {
              $rootScope.Campus = data;
              console.log(data);
              if (data.length == 0){
                $rootScope.resultadoCampusVacio = true;
              }

            }
        );
    }

    $scope.selectEdificio = function(campus) {//Cuando selecciono un campus, tengo que traerme los edificios de dicho campus

      GetInfoService.getEdificio(campus).then(
          function (data) {
            $rootScope.Edificio = data;
            console.log(data);
            if (data.length == 0){
              $rootScope.resultadoEdificioVacio = true;
            }

          }
      );
    }

    $scope.selectPlanta = function(edif) {//Cuando selecciono un edificio, tengo que buscar el numero de plantas de dicho edificio

      for (x=0;x<$rootScope.Edificio.length;x++){
        if($rootScope.Edificio[x].ID_Edificio==edif){//Saber el edificio selecionado que tenemos que incluir el Select de plantas
          $rootScope.EdificioEscogido = edif;//Se utiliza para en el siguiente select
          $rootScope.Planta = $rootScope.Edificio[x].plantas;
        }
      }
    }

    $scope.selectEstancia = function(planta) {//Cuando selecciono una planta, busco todas las estancias de dicha planta

      GetInfoService.getAllEstancias($rootScope.EdificioEscogido+planta).then(
          function (data) {
            $rootScope.Estancias = data;
            console.log(data);
            if (data.length == 0){
              $rootScope.resultadoEstanciasVacio = true;
            }

          }
      );
    }

    $scope.busqueda = function() {//Cuando selecciono un edificio, tengo que buscar el numero de plantas de dicho edificio
      if(($("#selectCiudad option:selected").text().trim() == "")||($("#selectCampus option:selected").text().trim() == "")||
          ($("#selectEdificio option:selected").text().trim() == "")|| ($("#selectPlanta option:selected").text().trim() == "")||
          ($("#selectEstancia option:selected").text().trim() == "")){//Comprobar que no haya ningún select vacio
          alert($scope.translation.ALERT_SELECT);
      }
      else{
        localStorage.estancia = $("#selectEstancia option:selected").val().trim();
        window.location = "#/app/estancia";
      }
    }



  });

})


();


/**********************************************************************
 * FACTORY: Servicio que define todas las llamadas al web service para recoger los datos
 ***********************************************************************/
app.factory('GetInfoService', function($http, $q, $timeout, $state, $rootScope) {
  var URI_busquedas = 'http://localhost:8080/busquedas';
  var URI_estancias = 'http://localhost:8080/estancias';
  //var URI_busquedas = 'http://155.210.14.31:8080/mapa/busquedas';
  //var URI_estancias = 'http://155.210.14.31:8080/mapa/estancias';

  //Llamada AJAX al web service para recoger los codigos de espacio para rellenar el SELECT de busqueda
  var getEspacios = function () {
    var deferred = $q.defer();
    var request = {
      method: 'GET',
      url: URI_busquedas + '/codigoespacios',
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
      url: URI_busquedas + '/campus?ciudad='+ciudad,
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
      url: URI_busquedas + '/edificio?campus='+campus,
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
      url: URI_busquedas + '/infoedificio?edificio='+edificio,
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
      url: URI_estancias + '/id_estancia?estancia='+estancia,
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
      url: URI_estancias + '/getEstancia?estancia='+estancia,
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
      url: URI_estancias + '/getAllEstancias?estancia='+estancia,
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

