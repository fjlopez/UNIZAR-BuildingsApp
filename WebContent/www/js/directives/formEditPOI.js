UZCampusWebMapApp.directive('formEditPointOfInterest', function($ionicLoading) {
  return {
    restrict : 'A',
    scope: true,
    controller : function($scope) {      
      $scope.submit = function(data) {
        console.log("Submit form edit point of interest",data);
        if($scope.editPOIform.$valid) {
          $scope.confirmEditPOI($scope.data);
        } else {
          $ionicLoading.show({ template: 'El formulario es inválido', duration: 1500})
        }
      }

      $scope.delete = function(data) {
        console.log("Submit form delete point of interest",data);
        $scope.confirmDeletePOI($scope.data);
      }
    }
  }
});