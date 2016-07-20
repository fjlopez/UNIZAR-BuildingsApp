UZCampusWebMapApp.directive('formAddPointOfInterest', function($ionicLoading) {
  return {
    restrict : 'A',
    scope: true,
    controller : function($scope) {      
      $scope.submit = function(data) {
        console.log("Submit form add point of interest",data);
        if($scope.addPOIform.$valid) {
          $scope.confirmCreatePOI($scope.data);
        } else {
          $ionicLoading.show({ template: 'El formulario es inválido', duration: 1500})
        }
      }
    }
  }
})