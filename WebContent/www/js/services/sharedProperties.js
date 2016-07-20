UZCampusWebMapApp.service('sharedProperties', function () {

    var mapa = undefined;
    var plano = undefined;
    var markerLayer = [];
    var latUser = 0;
    var lonUser = 0;
    var opcion = undefined;
    var reloadMap = true;
    var lastMarkers = [];

    return ({
        getMapa: getMapa,
        setMapa: setMapa,
        getPlano: getPlano,
        setPlano: setPlano,
        getMarkerLayer: getMarkerLayer,
        setMarkerLayer: setMarkerLayer,
        getLatUser: getLatUser,
        setLatUser: setLatUser,
        getLonUser: getLonUser,
        setLonUser: setLonUser,
        getOpcion: getOpcion,
        setOpcion: setOpcion,
        getReloadMap: getReloadMap,
        setReloadMap: setReloadMap,
        getLastMarkers: getLastMarkers,
        setLastMarkers: setLastMarkers
    });

    function getMapa(){
        return mapa;
    }
    function setMapa(data){
        mapa = data;
    }

    function getPlano(){
        return plano;
    }
    function setPlano(data){
        plano = data;
    }

    function getMarkerLayer(){
        return markerLayer;
    }
    function setMarkerLayer(data){
        markerLayer = data;
    }

    function getLatUser(){
        return latUser;
    }
    function setLatUser(data){
        latUser = data;
    }

    function getLonUser(){
        return lonUser;
    }
    function setLonUser(data){
        lonUser = data;
    }

    function getOpcion(){
        return opcion;
    }
    function setOpcion(data){
        opcion = data;
    }

    function getReloadMap(){
        return reloadMap;
    }
    function setReloadMap(data){
        reloadMap = data;
    }

    function getLastMarkers(){
        return lastMarkers;
    }
    function setLastMarkers(data){
        lastMarkers = data;
    }
});