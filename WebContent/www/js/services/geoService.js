
UZCampusWebMapApp.service('geoService', function(sharedProperties, infoService, APP_CONSTANTS) {

    this.crearMapa = function($scope, infoService){

        //TODO: [DGP] Use of localStorage for recove option?
        var option = sharedProperties.getOpcion();
        option = typeof option !== 'undefined' ? option : 0;  //Si no tenemos valor, por defecto escogemos zaragoza
        sharedProperties.setOpcion(option);

        //$scope.factorias = APP_CONSTANTS.datosMapa;
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
        ).setView([APP_CONSTANTS.datosMapa[option].latitud, APP_CONSTANTS.datosMapa[option].longitud], INIT_ZOOM);
        $scope.map.attributionControl.setPrefix('');
        L.control.layers(baseMaps, {}, {position: 'bottomleft'}).addTo($scope.map);

        L.control.locate().addTo($scope.map);

        sharedProperties.setMarkerLayer(new L.LayerGroup());	//layer contain searched elements
        $scope.map.addLayer(sharedProperties.getMarkerLayer());
        var controlSearch = new L.Control.Search({layer: sharedProperties.getMarkerLayer(), initial: false, position:'topright'});
        $scope.map.addControl( controlSearch );

        L.marker([42.142172, -0.405557]).addTo($scope.map)
            .bindPopup("<div class=\"text-center\"><b>Campus Huesca</b><br>Ronda Misericordia, 5</div>");

        L.marker([40.351661, -1.110081]).addTo($scope.map)
            .bindPopup("<div class=\"text-center\"><b>Vicerrectorado Campus Teruel</b><br>C/Ciudad Escolar, s/n</div>");

        for (var i=0; i<APP_CONSTANTS.edificios.length; i++){
            //Seria interesante probar con L.tileLayer.betterWMS

            var URI_wms = APP_CONSTANTS.URI_Geoserver + 'wms';
            var mywms = L.tileLayer.wms(URI_wms, {
                layers: 'proyecto:'+APP_CONSTANTS.edificios[i].toLowerCase(),
                format: 'image/png',
                transparent: true,
                version: '1.3.0'
            });

            $scope.map.addLayer(mywms);
            $(document).ready(function() {
                addMarkers($scope, i, infoService);
            });
        }

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                sharedProperties.setLatUser(position.coords.latitude);
                sharedProperties.setLonUser(position.coords.longitude);
                rellenarCampus($scope);
            });
        }

        sharedProperties.setMapa($scope.map);
        return $scope.map;
    };


    // Función encargada de añadir el marcador sobre el edificio para mostrar después la información de dicho edificio
    function addMarkers($scope, index, infoService){

        var url = APP_CONSTANTS.URI_Geoserver + 'proyecto/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=proyecto:' + APP_CONSTANTS.edificios[index].toLowerCase()+ '&srsName=epsg:4326&outputFormat=application/json';
        $.ajax({
            url : url,
            type: 'GET',
            dataType : 'json',
            crossDomain: true,
            headers: { 'Access-Control-Allow-Origin': '*' },
            success: handleJson
        });
        function handleJson(data) {
            var coordenadas = data.features[0].geometry.coordinates[0][0][0];
            var edificioName = APP_CONSTANTS.edificios[index].split("_").join(".").substring(0,9);
            infoService.getInfoEdificio(edificioName).then(//Para adecuar el edificio a la bd
                function (dataEdificio) {
                    if (dataEdificio.length == 0){
                        $rootScope.resultadoInfoEdificioVacio = true;
                    }
                    $scope.descripcion =dataEdificio;

                    var edificio = $scope.descripcion[0];

                    var html = '<div id="popup" class=\"text-center\"><b>'+edificio.edificio+'</b><br>'+edificio.direccion+'</div> '+$scope.translation.SELECCIONAR_PLANTA+' <select class="ion-input-select selectMap" onchange="if(this!=undefined)selectPlano(this);" ng-model="plantaPopup" >';
                    html+='<option value=undefined selected="selected"></option>';
                    for (i=0;i<edificio.plantas.length;i++){//Bucle para cargar en el select todas las plantas
                        html+='<option value="'+APP_CONSTANTS.edificios[index].substring(0,9)+edificio.plantas[i]+'">'+edificio.plantas[i]+'</option>';
                    }

                    var redireccion = "'https://maps.google.es/maps?saddr=" +
                        sharedProperties.getLatUser() + "," + sharedProperties.getLontUser() +
                        "&daddr=" + coordenadas[1]+ ',' + coordenadas[0]+"'";

                    console.log(redireccion);

                    html+='</select>';
                    html+='<button class="button button-positive" onclick="location.href ='+redireccion+'" >'+$scope.translation.HOWTOARRIVE+' </button>';


                    var marker=new L.marker([coordenadas[1], coordenadas[0]],{title:edificio.edificio}).addTo($scope.map)
                        .bindPopup(html);

                    var markerLayer = sharedProperties.getMarkerLayer();
                    markerLayer.addLayer(marker);
                    sharedProperties.setMarkerLayer(markerLayer);
                }
            );
        }
    }

    /* Método para crear Popups en los campus que no estén completados con sus edficios
     * para poder calcular ruta hasta ellos.
     */
    function rellenarCampus($scope){

        var latUser = sharedProperties.getLatUser(),
            lonUser = sharedProperties.getLonUser();

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

        //TODO: [DGP] Movel la creación de leyenda al sitio correcto
        /*var legend = L.control({position: 'bottomright'});
        legend.onAdd = function (map) {

            var div = L.DomUtil.create('div', 'info legend');

            div.innerHTML += '<img alt="legend" src="images/legend.jpg" width="127" height="120" />';
            return div;
        };
        legend.addTo($scope.map);*/
    }
    this.localizarZaragoza= function ($scope){
        $scope.factorias = APP_CONSTANTS.datosMapa;
        console.log('Cambio vista a: '+ $scope.factorias[0].nombre+' '+$scope.factorias[0].latitud+' '+$scope.factorias[0].longitud);
        var mapa = sharedProperties.getMapa();
        mapa.setView(new L.LatLng($scope.factorias[0].latitud, $scope.factorias[0].longitud), 14);
        sharedProperties.setMapa(mapa);
    };

    this.localizarHuesca= function ($scope){
        $scope.factorias = APP_CONSTANTS.datosMapa;
        console.log('Cambio vista a: '+ $scope.factorias[1].nombre+' '+$scope.factorias[1].latitud+' '+$scope.factorias[1].longitud);
        var mapa = sharedProperties.getMapa();
        mapa.setView(new L.LatLng($scope.factorias[1].latitud, $scope.factorias[1].longitud), 16);
        sharedProperties.setMapa(mapa);
    };

    this.localizarTeruel= function ($scope){
        $scope.factorias = APP_CONSTANTS.datosMapa;
        console.log('Cambio vista a: '+ $scope.factorias[2].nombre+' '+$scope.factorias[2].latitud+' '+$scope.factorias[2].longitud);
        var mapa = sharedProperties.getMapa();
        mapa.setView(new L.LatLng($scope.factorias[2].latitud, $scope.factorias[2].longitud), 16);
        sharedProperties.setMapa(mapa);
    };

    this.crearPlano= function ($scope,$http, infoService){
        var edificio=localStorage.planta;
        var url = APP_CONSTANTS.URI_Geoserver + 'proyecto/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=proyecto:'+edificio.toLowerCase()+'&srsName=epsg:4326&outputFormat=application/json';
        $.ajax({
            url : url,
            type: 'GET',
            dataType : 'json',
            crossDomain: true,
            headers: { 'Access-Control-Allow-Origin': '*' },
            success: handleJson
        });

        function handleJson(data) {
            //console.log(data);
            var plano = sharedProperties.getPlano();
            if(!(typeof plano == 'undefined')){//Para sobreescribir el plano anterior si lo hubiera(ya que con leaflet no lo repinta)
                plano.remove();
            }
            var coordenadas = data.features[0].geometry.coordinates[0][0][0];
            plano = L.map('plan',{maxZoom:25}).setView([coordenadas[1],coordenadas[0]],20);
            sharedProperties.setPlano(plano);

            L.geoJson(data, {
                style: function (feature) {
                    var et_id = feature.properties.et_id;
                    var et_id_int = parseInt(et_id.split(".")[et_id.split(".").length-1]);
                    if (et_id_int < 100) return {color: "blue"};
                    else if (et_id_int > 300) return {color: "red"};
                    else return {color: "black"};
                },
                onEachFeature: onEachFeature
            }).addTo(sharedProperties.getPlano());
        }
        /*
         Funcion que gestiona cada una de las capas de GeoJSON
         */
        function onEachFeature(feature, layer) {//sacado de : http://gis.stackexchange.com/questions/121482/click-events-with-leaflet-and-geojson
            console.log(feature);
            //bind click
            layer.on({
                click: whenClicked
            });
            /*
             Otra alternativa para ver que estancia se ha seleccionado, sin embargo consumia muchos recursos de la BD
             if (feature.properties && feature.properties.et_id) {
             var id = feature.properties.et_id;

             infoService.getInfoEstancia(id).then(
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

            infoService.getInfoEstancia(id).then(
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
    };
});
