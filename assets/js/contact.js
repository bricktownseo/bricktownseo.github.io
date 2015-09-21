'use strict';

angular
    .module('Contact', [], function($interpolateProvider) {
        $interpolateProvider.startSymbol('[[');
        $interpolateProvider.endSymbol(']]');
    });


angular.module('Contact').controller('ContactCtrl', ['$scope', function($scope) {

	console.log('CONTACT CTRL');

	$scope.contact = function(){
		
		console.log($scope);
		
		if($scope.name!=null && $scope.name.length==0){
			alert("Please enter your name.");
			return;
		}
		if($scope.email!=null && $scope.email.length==0){
			alert("Please enter your message.");
			return;
		}
		if($scope.message!=null && $scope.message.length==0){
			alert("Please enter your message.");
			return;
		}
		
		var ContactObject = Parse.Object.extend("Contact");
		var contactObject = new ContactObject();
		contactObject.set("Name", $scope.name);
		contactObject.set("Email", $scope.email);
		contactObject.set("Message", $scope.message);

		contactObject.save().then(function(object) {
		  alert("yay! it worked");
		});

		$scope.data = 'TEST';
	};

}]);