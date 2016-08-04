
UZCampusWebMapApp.service('geoService', function(sharedProperties, infoService, poisService, APP_CONSTANTS, $ionicModal, $ionicPopup) {

    return ({
        crearMapa: crearMapa,
        localizarHuesca: localizarHuesca,
        localizarZaragoza: localizarZaragoza,
        localizarTeruel: localizarTeruel,
        crearPlano: crearPlano,
        updatePOIs: updatePOIs
    });

    function crearMapa($scope, infoService){
        //TODO: [DGP] Use of localStorage for recover option?
        var option = sharedProperties.getOpcion();
        option = typeof option !== 'undefined' ? option : 1;  //Si no tenemos valor, por defecto escogemos Zaragoza
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

        sharedProperties.setMarkerLayer(new L.LayerGroup());    //layer contain searched elements
        $scope.map.addLayer(sharedProperties.getMarkerLayer());
        var controlSearch = new L.Control.Search({layer: sharedProperties.getMarkerLayer(), initial: false, position:'topright'});
        $scope.map.addControl(controlSearch);

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
    }
    // Funcion encargada de añdir el marcador sobre el edificio para mostrar despues la informacion de dicho edificio
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

                    var html_header = '<div id="popup" class="text-center map-mark"><b>'+edificio.edificio+'</b><br>'+edificio.direccion+'</div> ';

                    var html_select = '<div>' + $scope.translation.SELECCIONAR_PLANTA;
                    html_select += '<select class="ion-input-select select-map" onchange="if(this!=undefined)selectPlano(this);" ng-model="plantaPopup" >';
                    html_select+='<option value=undefined selected="selected"></option>';

                    for (i=0;i<edificio.plantas.length;i++){//Bucle para cargar en el select todas las plantas
                        var selectValue = APP_CONSTANTS.edificios[index].substring(0,9)+edificio.plantas[i],
                            selectClass = 'class="'+selectValue+'"',
                            selectValueAttr = 'value="'+selectValue+'"',
                            dataEdificioFloor = 'data-floor="'+i+'"',
                            attributes = [selectClass, selectValueAttr, dataEdificioFloor].join(' ');

                        html_select+='<option '+attributes+'>'+edificio.plantas[i]+'</option>';
                    }
                    html_select+='</select>';

                    var redireccion = "'https://maps.google.es/maps?saddr=" +
                        sharedProperties.getLatUser() + "," + sharedProperties.getLonUser() +
                        "&daddr=" + coordenadas[1]+ ',' + coordenadas[0]+"'";

                    var html_button='<button class="button button-small button-positive button-how" onclick="location.href ='+redireccion+'" >'+$scope.translation.HOWTOARRIVE+' </button></div>';
                    var html = html_header + html_select + html_button;

                    var marker = new L.marker([coordenadas[1], coordenadas[0]],{title:edificio.edificio}).addTo($scope.map).bindPopup(html);

                    var markerLayer = sharedProperties.getMarkerLayer();
                    markerLayer.addLayer(marker);
                    sharedProperties.setMarkerLayer(markerLayer);
                }
            );
        }
    }

    /* Metodo para crear Popups en los campus que no estan completados con sus edficios
     * para poder calcular ruta hasta ellos.
     */
    function rellenarCampus($scope){

        var latUser = sharedProperties.getLatUser(),
            lonUser = sharedProperties.getLonUser();

        var redireccionPopup = "'https://maps.google.es/maps?saddr=" + latUser + "," + lonUser + "&daddr=41.6830208,-0.8886136'";

        L.marker([41.6830208, -0.8886136]).addTo($scope.map)
            .bindPopup('<div class=\"text-center\"><b>Campus Rio Ebro</b><br>C/María de Luna, s/n</div>' +
            '<button class="button button-small button-positive button-how" onclick="location.href ='+redireccionPopup+'" >'+$scope.translation.HOWTOARRIVE+' </button>');

        redireccionPopup = "'https://maps.google.es/maps?saddr=" + latUser + "," + lonUser + "&daddr=41.6465754,-0.8878908'";
        L.marker([41.6465754, -0.8878908]).addTo($scope.map)
            .bindPopup('<div class=\"text-center\"><b>Campus Gran Vía, Facultad Económicas</b><br>Paseo de la Gran Vía, 2</div>' +
            '<button class="button button-small button-positive button-how" onclick="location.href ='+redireccionPopup+'" >'+$scope.translation.HOWTOARRIVE+' </button>');

        redireccionPopup = "'https://maps.google.es/maps?saddr=" + latUser + "," + lonUser + "&daddr=41.6347223,-0.8630691'";
        L.marker([41.6347223, -0.8630691]).addTo($scope.map)
            .bindPopup('<div class=\"text-center\"><b>Facultad de Veterinaria</b><br>Calle Miguel Servet, 177</div>' +
            '<button class="button button-small button-positive button-how" onclick="location.href ='+redireccionPopup+'" >'+$scope.translation.HOWTOARRIVE+' </button>');
    }

    function localizarHuesca() {
        var cityData = APP_CONSTANTS.datosMapa;
        console.log('Cambio vista a: '+ cityData[0].nombre+' '+cityData[0].latitud+' '+cityData[0].longitud);
        var mapa = sharedProperties.getMapa();
        if (mapa) {
            mapa.setView(new L.LatLng(cityData[0].latitud, cityData[0].longitud), 14);
            mapa.zoomIn(); mapa.zoomOut();
        }
        sharedProperties.setMapa(mapa);
    }

    function localizarZaragoza() {
        cityData = APP_CONSTANTS.datosMapa;
        console.log('Cambio vista a: '+ cityData[1].nombre+' '+cityData[1].latitud+' '+cityData[1].longitud);
        var mapa = sharedProperties.getMapa();
        if (mapa) {
            mapa.setView(new L.LatLng(cityData[1].latitud, cityData[1].longitud), 16);
            mapa.zoomIn(); mapa.zoomOut();
        }
        sharedProperties.setMapa(mapa);
    }

    function localizarTeruel() {
        cityData = APP_CONSTANTS.datosMapa;
        console.log('Cambio vista a: '+ cityData[2].nombre+' '+cityData[2].latitud+' '+cityData[2].longitud);
        var mapa = sharedProperties.getMapa();
        if (mapa) {
            mapa.setView(new L.LatLng(cityData[2].latitud, cityData[2].longitud), 16);
            mapa.zoomIn(); mapa.zoomOut();
        }
        sharedProperties.setMapa(mapa);
    }

    function crearPlano($scope, $http, infoService, sharedProperties, poisService, createModal) {
        var edificio=localStorage.planta;
        var url = APP_CONSTANTS.URI_Geoserver + 'proyecto/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=proyecto:'+edificio.toLowerCase()+'&srsName=epsg:4326&outputFormat=application/json';
        $.ajax({
            url : url,
            type: 'GET',
            dataType : 'json',
            crossDomain: true,
            headers: { 'Access-Control-Allow-Origin': '*' },
            success: function(data) {
                handleJson(data, sharedProperties, poisService, createModal, function(plano){
                    addLegend(plano, function(){
                        // Define legend behaviour
                        $('.legend').hide();
                        $('.legend-button').click(function(){
                            if ($('.legend').is(":visible")) $('.legend').hide(500);
                            else $('.legend').show(500);
                        });
                    });
                });
            }
        });

        function handleJson(data, sharedProperties, poisService, createModal, callback) {
            //console.log(data);
            var plano = sharedProperties.getPlano();
            console.log("Plano before", plano);
            //Sobreescribir el plano anterior si lo hubiera(ya que con leaflet no lo repinta)
            console.log("Typeof plano", typeof(plano));
            if(!(typeof plano == 'undefined')) {
                console.log("Remove plano");
                plano.remove();
            }
            console.log("Data",data);
            var coordenadas = data.features[0].geometry.coordinates[0][0][0];
            plano = L.map('plan',{maxZoom:25}).setView([coordenadas[1],coordenadas[0]],20);
            console.log("Plano after", plano);

            L.geoJson(data, {
                /*style: function (feature) {
                    var et_id = feature.properties.et_id;
                    console.log("Fature properties", feature.properties);
                    var et_id_int = parseInt(et_id.split(".")[et_id.split(".").length-1]);
                    if (et_id_int < 100) return {color: "blue"};
                    else if (et_id_int > 300) return {color: "red"};
                    else return {color: "black"};
                },*/
                onEachFeature: function(feature, layer){
                    onEachFeature(feature, layer, createModal);
                }
            }).addTo(plano);

            updatePOIs(plano, sharedProperties);

            callback(plano);
        }

        //Funcion que gestiona cada una de las capas de GeoJSON
        function onEachFeature(feature, layer, createModal) {
            layer.on({
                click: whenClicked,
                contextmenu: function(e){
                    createModal(e);
                }
            });
        }

        //Funcion que dada la estancia seleccionada, muestra la informacion relativa
        function whenClicked(e) {

            var id = e.target.feature.properties.et_id;

            infoService.getInfoEstancia(id).then(
                function (data) {
                    $scope.infoEstancia = data;
                    console.log("infoEstancia",data);
                    if (data.length == 0) {
                        $scope.resultadoEstanciaVacio = true;
                    }
                    //var html = data.ID_espacio + ' ' + data.ID_centro + '<br/><button value="'+data.ID_espacio+'" class="button button-positive" onclick="informacionEstancia(this)">'+$scope.translation.MASINFO+' </button>';
                    var html_list = '<div><ul class="list-group">';
                    var html_list_items = '<li class="list-group-item">'+data.ID_espacio+'</li>';
                    html_list_items += '<li class="list-group-item">'+data.ID_centro+'</li>';
                    html_list = html_list + html_list_items + '</ul></div>';
                    var html_button = '<div class="info-btn-div"><button value="'+data.ID_espacio+'" class="button button-small button-positive" onclick="informacionEstancia(this)">'+$scope.translation.MASINFO+' </button></div>';
                    var html =  html_list + html_button;
                    e.layer.bindPopup(html).openPopup();
                }
            );
        }

        //Function que añade la leyenda al plano
        function addLegend(plano, callback) {
            var legend = L.control({position: 'topright'});
            legend.onAdd = function (map) {
                var div = L.DomUtil.create('div', '');
                var button = '<button class="button button-positive button-small legend-button">';
                button += '<i class="icon ion-ios-help-outline"></i>';
                button += '</button>';
                var legend = '<div class="legend">';
                APP_CONSTANTS.pois.forEach(function(poi){
                   legend += '<i class="'+poi.class+'">'+poi.label+'</i></br>';
                });
                legend += '</div>';
                div.innerHTML = button + '<br>' + legend;
                 L.DomEvent.disableClickPropagation(div);
                return div;
            };
            legend.addTo(plano);
            callback();
        }
    }

    //Add markers for every POI
    function updatePOIs(plano, sharedProperties){

        var building = localStorage.planta,
            floor = JSON.parse(localStorage.floor).floor,
            markers = [];

        poisService.getRoomPOIs(building, floor).then(
            function(pois) {
                console.log("Get room POIs success",pois);

                pois.forEach(function(poi){
                    var iconClass = $.grep(APP_CONSTANTS.pois, function(e) { return e.value == poi.category })[0].class;
                    var poiLabel = $.grep(APP_CONSTANTS.pois, function(e) { return e.value == poi.category })[0].label;
                    var icon = L.divIcon({className: iconClass});

                    var html = '<div class="text-center">';
                    html += '<b>Categoría:</b> '+poiLabel+'</br>';
                    html += '<b>Comentarios:</b> '+poi.comments+'</div>';
                    html += '<div class="edit-btn-div">';
                    html += '<button class="button button-small button-positive button-edit-poi" onclick="editPOI()" data-id="'+poi.id+'">Editar</button></div>';
                    var marker = new L.marker([poi.latitude, poi.longitude], {icon: icon})
                    markers.push(marker);
                    marker.addTo(plano)
                    marker.bindPopup(html);
                });

                sharedProperties.getLastMarkers().forEach(function(marker){
                    plano.removeLayer(marker);
                });

                sharedProperties.setLastMarkers(markers);
            },
            function(err){
                console.log("Error on getRoomPOIs", err);
                $ionicPopup.alert({
                    title: '¡Error!',
                    template: '<div class="text-center">Ha ocurrido un error recuperando<br>los puntos de interés</div>'
                });
            }
        );
    }
});
