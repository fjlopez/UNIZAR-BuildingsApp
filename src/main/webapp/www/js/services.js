
var app = angular.module('starter.services', []);

var mapa;//La unica manera que he encontrado de modificar la vista del mapa desde el menú(ya que usan distintos controladores) es por var.global
var plano;
var edificios = ["CSF_1018_00","CSF_1110_00","CSF_1106_00","CSF_1021_00","CSF_1095_00","CSF_1097_00","CSF_1017_00","CSF_1022_00"];
var markerLayer;
var latUser;
var lonUser;
app.service('geoService', function () {


    this.crearMapa = function($scope,miFactoria,opcion, GetInfoService){
        opcion = typeof opcion !== 'undefined' ? opcion : 0;//Si no tenemos valor, por defecto escogemos zaragoza

        $scope.factorias = miFactoria.datosMapa;
        var ggl = new L.Google('ROADMAP');
        var satelite = new L.Google('SATELLITE');
        var hybrid = new L.Google('HYBRID');

        var MIN_ZOOM = 15;
        var INIT_ZOOM = 15;
        var MAX_ZOOM = 15;

        //Centro ciudad
        var INI_LAT = 41.653496;
        var INI_LON = -0.889492;

        /*var OSM = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            id: 'OSM'
        });*/
        //No funciona bien con geoserver y WMS


        var baseMaps = {
           // "OSM": OSM,
            "Google Roadmap": ggl,
            "Google Satelite": satelite,
            "Google Hibrida": hybrid
        };



        $scope.map = L.map('mapa'
            ,{
                crs: L.CRS.EPSG3857,
                layers: [ggl]
            }
        ).setView([$scope.factorias[opcion].latitud, $scope.factorias[opcion].longitud], INIT_ZOOM);
        $scope.map.attributionControl.setPrefix('');
        L.control.layers(baseMaps, {}, {position: 'bottomleft'}).addTo($scope.map);

        L.control.locate().addTo($scope.map);

        markerLayer = new L.LayerGroup();	//layer contain searched elements
        $scope.map.addLayer(markerLayer);
         var controlSearch = new L.Control.Search({layer: markerLayer, initial: false, position:'topright'});
        $scope.map.addControl( controlSearch );

        L.marker([42.142172, -0.405557]).addTo($scope.map)
            .bindPopup("<div class=\"text-center\"><b>Campus Huesca</b><br>Ronda Misericordia, 5</div>");

        L.marker([40.351661, -1.110081]).addTo($scope.map)
            .bindPopup("<div class=\"text-center\"><b>Vicerrectorado Campus Teruel</b><br>C/Ciudad Escolar, s/n</div>");

        for (i=0;i<edificios.length;i++){
            var mywms = L.tileLayer.wms("http://155.210.14.31:8080/geoserver/wms", {//Seria interesante probar con L.tileLayer.betterWMS
                layers: 'proyecto:'+edificios[i].toLowerCase(),
                format: 'image/png',
                transparent: true,
                version: '1.3.0'
            });
            $scope.map.addLayer(mywms);
            $( document ).ready(function() {
                añadirMarcadores($scope,i,GetInfoService)
            });

       }
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {

                latUser = position.coords.latitude;
                lonUser = position.coords.longitude;
                /* Al añadir edificios de los demás campus, borrar esta parte */
                rellenarCampus($scope);

            });
        }


        mapa = $scope.map;
        return $scope.map;
    };
    /*
    Función encargada de añadir el marcador sobre el edificio para mostrar después la información de dicho edificio
     */
    function añadirMarcadores($scope,index,GetInfoService){

        $.ajax({
            url : "http://155.210.14.31:8080/geoserver/proyecto/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=proyecto:"+edificios[index].toLowerCase()+"&srsName=epsg:4326&outputFormat=application/json",
            dataType : 'json',
            success: handleJson
        });
        function handleJson(data) {
            var coordenadas = data.features[0].geometry.coordinates[0][0][0];
           GetInfoService.getInfoEdificio(edificios[index].split("_").join(".").substring(0,9)).then(//Para adecuar el edificio a la bd
                function (dataEdificio) {
                    if (dataEdificio.length == 0){
                        $rootScope.resultadoInfoEdificioVacio = true;
                    }
                    $scope.descripcion =dataEdificio;

                    var edificio = $scope.descripcion[0];

                    var html = '<div id="popup" class=\"text-center\"><b>'+edificio.edificio+'</b><br>'+edificio.direccion+'</div> '+$scope.translation.SELECCIONAR_PLANTA+' <select class="ion-input-select selectMap" onchange="if(this!=undefined)selectPlano(this);" ng-model="plantaPopup" >';
                    html+='<option value=undefined selected="selected"></option>';
                    for (i=0;i<edificio.plantas.length;i++){//Bucle para cargar en el select todas las plantas
                        html+='<option value="'+edificios[index].substring(0,9)+edificio.plantas[i]+'">'+edificio.plantas[i]+'</option>';
                    }
                    var redireccion = "'https://maps.google.es/maps?saddr=" + latUser + "," + lonUser + "&daddr=" + coordenadas[1]+ ',' + coordenadas[0]+"'";
                    console.log(redireccion);

                    html+='</select>';
                    html+='<button class="button button-positive" onclick="location.href ='+redireccion+'" >'+$scope.translation.HOWTOARRIVE+' </button>';


                   var marker=new L.marker([coordenadas[1], coordenadas[0]],{title:edificio.edificio}).addTo($scope.map)
                        .bindPopup(html);
                    markerLayer.addLayer(marker);
                }

            );

        }
    }

    /* Método para crear Popups en los campus que no estén completados con sus edficios
     * para poder calcular ruta hasta ellos.
     */
    function rellenarCampus($scope){
        var redireccionPopup = "'https://maps.google.es/maps?saddr=" + latUser + "," + lonUser + "&daddr=41.6830208,-0.8886136'";

        L.marker([41.6830208, -0.8886136]).addTo($scope.map)
            .bindPopup('<div class=\"text-center\"><b>Campus Rio Ebro</b><br>C/María de Luna, s/n</div>' +
            '<button class="button button-positive" onclick="location.href ='+redireccionPopup+'" >'+$scope.translation.HOWTOARRIVE+' </button>');

        redireccionPopup = "'https://maps.google.es/maps?saddr=" + latUser + "," + lonUser + "&daddr=41.6465754,-0.8878908'";
        L.marker([41.6465754, -0.8878908]).addTo($scope.map)
            .bindPopup('<div class=\"text-center\"><b>Campus Gran Vía, Facultad Económicas</b><br>Paseo de la Gran Via, 2</div>' +
            '<button class="button button-positive" onclick="location.href ='+redireccionPopup+'" >'+$scope.translation.HOWTOARRIVE+' </button>');

        redireccionPopup = "'https://maps.google.es/maps?saddr=" + latUser + "," + lonUser + "&daddr=41.6347223,-0.8630691'";
        L.marker([41.6347223, -0.8630691]).addTo($scope.map)
            .bindPopup('<div class=\"text-center\"><b>Facultad de Veterinaria</b><br>Calle Miguel Servet, 177</div>' +
            '<button class="button button-positive" onclick="location.href ='+redireccionPopup+'" >'+$scope.translation.HOWTOARRIVE+' </button>');
    }


    this.localizarZaragoza= function ($scope,miFactoria){
        $scope.factorias = miFactoria.datosMapa;
        console.log('Cambio vista a: '+ $scope.factorias[0].nombre+' '+$scope.factorias[0].latitud+' '+$scope.factorias[0].longitud);
        mapa.setView(new L.LatLng($scope.factorias[0].latitud, $scope.factorias[0].longitud), 14);
    };
    this.localizarHuesca= function ($scope,miFactoria){
        $scope.factorias = miFactoria.datosMapa;
        console.log('Cambio vista a: '+ $scope.factorias[1].nombre+' '+$scope.factorias[1].latitud+' '+$scope.factorias[1].longitud);
        mapa.setView(new L.LatLng($scope.factorias[1].latitud, $scope.factorias[1].longitud), 16);
    };
    this.localizarTeruel= function ($scope,miFactoria){
        $scope.factorias = miFactoria.datosMapa;
        console.log('Cambio vista a: '+ $scope.factorias[2].nombre+' '+$scope.factorias[2].latitud+' '+$scope.factorias[2].longitud);
        mapa.setView(new L.LatLng($scope.factorias[2].latitud, $scope.factorias[2].longitud), 16);
    };
    this.crearPlano= function ($scope,$http, GetInfoService){
        var edificio=localStorage.planta;
       $.ajax({
            url : "http://155.210.14.31:8080/geoserver/proyecto/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=proyecto:"+edificio.toLowerCase()+"&srsName=epsg:4326&outputFormat=application/json",
            dataType : 'json',
            success: handleJson
        });
        function handleJson(data) {
            //console.log(data);
            if(!(typeof plano == 'undefined')){//Para sobreescribir el plano anterior si lo hubiera(ya que con leaflet no lo repinta)
                plano.remove();
            }
            var coordenadas = data.features[0].geometry.coordinates[0][0][0];
            plano = L.map('plan',{maxZoom:25}).setView([coordenadas[1],coordenadas[0]],20);

            L.geoJson(data,{onEachFeature: onEachFeature}).addTo(plano);
        }

        /*
         Funcion que gestiona cada una de las capas de GeoJSON
         */
        function onEachFeature(feature, layer) {//sacado de : http://gis.stackexchange.com/questions/121482/click-events-with-leaflet-and-geojson

            //bind click
            layer.on({
                click: whenClicked
            });
            /*
             Otra alternativa para ver que estancia se ha seleccionado, sin embargo consumia muchos recursos de la BD
            if (feature.properties && feature.properties.et_id) {
                var id = feature.properties.et_id;

                GetInfoService.getInfoEstancia(id).then(
                    function (data) {
                        $scope.infoEstancia = data;
                       // console.log(data);
                        if (data.length == 0) {
                            $rootScope.resultadoEstanciaVacio = true;
                        }
                        console.log($scope.infoEstancia);
                        layer.bindPopup($scope.infoEstancia.ID_espacio + " " + $scope.infoEstancia.ID_centro);
                    }
                );

            }*/
        }
        /*
        Funcion que dada la estancia seleccionada, muestra la información relativa
         */
        function whenClicked(e) {

            //console.log(e);
            var id = e.target.feature.properties.et_id;

            GetInfoService.getInfoEstancia(id).then(
                function (data) {
                    $scope.infoEstancia = data;
                    // console.log(data);
                    if (data.length == 0) {
                        $scope.resultadoEstanciaVacio = true;
                    }
                    //var html = data.ID_espacio + ' ' + data.ID_centro + '<br/><button value="'+data.ID_espacio+'" class="button button-positive" onclick="informacionEstancia(this)">'+$scope.translation.MASINFO+' </button>';
                    var html =  data.ID_centro + '<br/><button value="'+data.ID_espacio+'" class="button button-positive" onclick="informacionEstancia(this)">'+$scope.translation.MASINFO+' </button>';
                    e.layer.bindPopup(html).openPopup();
                }
            );

        }

    }


});