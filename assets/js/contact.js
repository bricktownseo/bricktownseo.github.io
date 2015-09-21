'use strict';

angular
    .module('Contact', [], function($interpolateProvider) {
        $interpolateProvider.startSymbol('[[');
        $interpolateProvider.endSymbol(']]');
    });


angular.module('Contact').controller('ContactCtrl', ['$scope', function($scope) {
	$scope.thanks = false;

	$scope.contact = function(){

		if($scope.name==undefined || $scope.name.length==0){
			alert("Please enter your name.");
			return;
		}
		if($scope.phone==undefined || $scope.phone.length==0){
			alert("Please enter your phone.");
			return;
		}
		if($scope.message==undefined || $scope.message.length==0){
			alert("Please enter your message.");
			return;
		}
		
		var ContactObject = Parse.Object.extend("Contact");
		var contactObject = new ContactObject();
		contactObject.set("Name", $scope.name);
		contactObject.set("Phone", $scope.phone);
		contactObject.set("Email", $scope.email);
		contactObject.set("Message", $scope.message);

		contactObject.save().then(function(object) {
			$scope.thanks = true;
		});
		
	};

}]);