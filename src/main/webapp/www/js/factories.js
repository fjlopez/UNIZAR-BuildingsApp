var app = angular.module('starter.factories', []);

app.factory('miFactoria', function(){
    return {
        datosMapa: [{
                nombre: "Zaragoza",
                latitud: 41.653496,
                longitud: -0.889492
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
