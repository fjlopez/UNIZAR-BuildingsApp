// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js

var UZCampusWebMapApp = angular.module(
            'UZCampusWebMapApp',
            //['ionic', 'starter.controllers', 'starter.services', 'angularSlideables','ngResource','ngRoute']
            ['ionic', 'angularSlideables','ngResource','ngRoute']
    );

UZCampusWebMapApp.run(function($ionicPlatform) {
      $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            // StatusBar.styleDefault();
        }
      });
    })
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/:type/:ciudad', {
            templateUrl: "templates/mapa.html"
        });
    }])
    //.config(function($stateProvider, $urlRouterProvider,$routeProvider) {
    .config(function($stateProvider, $urlRouterProvider) {
      $stateProvider
          .state('app', {
            url: "/app",
            abstract: true,
            templateUrl: "templates/menu.html",
            controller: 'AppCtrl'
          })
          .state('splash', {
            url: "/app/splash",
            templateUrl: "templates/splash.html",
            controller: 'AppCtrl'
          })
          .state('app.home', {
            url: "/home",
            views: {
              'menuContent':{
                templateUrl: "templates/home.html",
                controller: 'AppCtrl'
              }
            }
          })
          .state('app.busqueda', {
            url: "/busqueda",
            views: {
              'menuContent':{
                templateUrl: "templates/busqueda.html",
                controller: 'SearchCtrl'
              }
            }
          })
          .state('app.busquedaavanzada', {
              url: "/busquedaavanzada",
              views: {
                  'menuContent':{
                      templateUrl: "templates/busquedaavanzada.html",
                      controller: 'SearchCtrl'
                  }
              }
          })
          .state('app.favoritos', {
            url: "/favoritos",
            views: {
              'menuContent':{
                templateUrl: "templates/favoritos.html",
                controller: 'AppCtrl'
              }
            }
          })
          .state('app.ajustes', {
            url: "/ajustes",
            views: {
              'menuContent':{
                templateUrl: "templates/ajustes.html",
                controller: 'AppCtrl'
              }
            }
          })
          .state('app.plano', {
              url: "/plano",
              views: {
                  'menuContent':{
                      templateUrl: "templates/plano.html"
                      //controller: 'AppCtrl'
                  }
              }
          })
          .state('app.estancia', {
              url: "/estancia",
              views: {
                  'menuContent':{
                      templateUrl: "templates/estancia.html",
                      controller: 'EstanciaCtrl'
                  }
              }
          })
          .state('app.foto', {
              url: "/foto",
              views: {
                  'menuContent':{
                      templateUrl: "templates/foto.html",
                      controller: 'FotoCtrl'
                  }
              }
          })
          .state('app.mapa', {
              url: "/mapa",
              views: {
                  'menuContent':{
                      templateUrl: "templates/mapa.html"
                      //controller: 'MapCtrl'
                  }
              }
          });

          // if none of the above states are matched, use this as the fallback
          $urlRouterProvider.otherwise('/app/home');

    });
    /*.config(['$routeProvider', function($routeProvider) {
        $routeProvider.
            when('/:type/:ciudad', {
                templateUrl: "templates/mapa.html"
            });
    }]);*/