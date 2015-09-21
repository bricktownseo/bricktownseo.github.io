'use strict';

/**
 * @ngdoc overview
 * @name unitSchedulingApp
 * @description
 * # unitSchedulingApp
 *
 * Main module of the application.
 */
angular
    .module('Contact', [], function($interpolateProvider) {
        $interpolateProvider.startSymbol('[[');
        $interpolateProvider.endSymbol(']]');
    });


angular.module('Contact').controller('ContactCtrl', ['$scope', function($scope) {
	
	Parse.initialize("hLyeV7y6Uo3Ga3fSZgOu87j5bmJahVS3MGqcaZxg", "6MoiN7pUZ4FnZwXDXXTYiy2ft7aXdMSIS1J5qd3k");

	$scope.contact = function(){
		console.log($scope);
		var ContactObject = Parse.Object.extend("Contact");
		var contactObject = new ContactObject();
		contactObject.save({foo: "bar"}).then(function(object) {
		  alert("yay! it worked");
		});

		$scope.data = 'TEST';
	};

}]);