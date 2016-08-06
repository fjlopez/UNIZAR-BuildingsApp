UZCampusWebMapApp.directive('formAddPointOfInterest', function($ionicLoading) {
  return {
    restrict : 'A',
    scope: true,
    controller : function($scope) {
      $scope.submit = function(data) {
        console.log("Submit form add point of interest",data);
        if($scope.addPOIform.$valid) {
          $scope.confirmCreatePOI($scope.data, $scope.addPOIform);
        } else {
          if (!data.hasOwnProperty('comments')) $('.comments-error').show();
          if (!data.hasOwnProperty('category')) $('.category-error').show();
          $ionicLoading.show({ template: 'El formulario es inválido', duration: 1500})
        }
      }
    }
  }
})