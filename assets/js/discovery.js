'use strict';

angular
    .module('Discovery', [], function($interpolateProvider) {
        $interpolateProvider.startSymbol('[[');
        $interpolateProvider.endSymbol(']]');
    });


angular.module('Discovery').controller('DiscoveryCtrl', ['$scope', function($scope) {

	$scope.step = 1;
	$scope.thanks = false;
	$scope.form = {marketing:{}};

	var ResponseObject = Parse.Object.extend("Response");
	$scope.responseObject = new ResponseObject();
	$scope.responseObject.set("Data", $scope.form);
	$scope.responseObject.save();

	$scope.next = function(){
		$scope.step++;
		$scope.responseObject.set("Data", $scope.form);
		$scope.responseObject.save();
	}

	$scope.submit = function(){
		$scope.responseObject.set("Data", $scope.form);
		$scope.step++;

		$scope.responseObject.save().then(function(object) {
			$scope.$apply(function(){
				$scope.thanks = true;
			});
		});
	
	};

}]);