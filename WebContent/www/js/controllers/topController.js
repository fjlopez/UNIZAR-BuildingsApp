/**************************************************************************
 * TopCtrl: Controlador encargado de redirigir la aplicación a la pantalla
 *          de splash en caso de refresco de página
 ***********************************************************************/

UZCampusWebMapApp.controller('TopCtrl', function($location){
        $location.path("/");
    });