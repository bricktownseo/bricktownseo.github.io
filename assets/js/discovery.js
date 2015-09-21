'use strict';

angular
    .module('Discovery', [], function($interpolateProvider) {
        $interpolateProvider.startSymbol('[[');
        $interpolateProvider.endSymbol(']]');
    });


angular.module('Discovery').controller('DiscoveryCtrl', ['$scope', function($scope) {

	$scope.step = 1;

	$scope.next = function(){
		$scope.step ++;
	}
	// $scope.thanks = false;

	// $scope.contact = function(){

	// 	if($scope.name==undefined || $scope.name.length==0){
	// 		alert("Please enter your name.");
	// 		return;
	// 	}
	// 	if($scope.phone==undefined || $scope.phone.length==0){
	// 		alert("Please enter your phone.");
	// 		return;
	// 	}
	// 	if($scope.message==undefined || $scope.message.length==0){
	// 		alert("Please enter your message.");
	// 		return;
	// 	}
		
	// 	var ContactObject = Parse.Object.extend("Discovery");
	// 	var contactObject = new ContactObject();
	// 	contactObject.set("Name", $scope.name);
	// 	contactObject.set("Phone", $scope.phone);
	// 	contactObject.set("Email", $scope.email);
	// 	contactObject.set("Message", $scope.message);

	// 	contactObject.save().then(function(object) {
	// 		$scope.$apply(function(){
	// 			$scope.thanks = true;
	// 		});
	// 	});
		
	// };

}]);