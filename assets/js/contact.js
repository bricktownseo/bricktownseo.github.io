'use strict';

angular
    .module('Contact', [], function($interpolateProvider) {
        $interpolateProvider.startSymbol('[[');
        $interpolateProvider.endSymbol(']]');
    });


angular.module('Contact').controller('ContactCtrl', ['$scope', function($scope) {

	$scope.contact = function(){
		alert('CONTACT');
		/*
		console.log($scope);
		var ContactObject = Parse.Object.extend("Contact");
		var contactObject = new ContactObject();
		contactObject.save({foo: "bar"}).then(function(object) {
		  alert("yay! it worked");
		});

		$scope.data = 'TEST';
		*/
	};

}]);