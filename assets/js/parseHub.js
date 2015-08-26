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
    .module('ParseHubApp', [
        'ngAnimate',
        'ngCookies',
        'ngResource',
        'ngRoute',
        'ngSanitize',
        'ngTouch'
    ], function($interpolateProvider) {
        $interpolateProvider.startSymbol('[[');
        $interpolateProvider.endSymbol(']]');
    });


angular.module('ParseHubApp')
    .controller('ParseHubCtrl', ['$scope', '$window', function($scope, $window) {

        $scope.reset = function() {
            $scope.keyword = "";
            $scope.relatedKeywords = 1;
            $scope.domains = {};
            $scope.domainArray = [];
            $scope.complete = false;
            $scope.searching = false;
            $scope.status = "";
            $scope.region = "us";
        }

        $scope.search = function() {
            $scope.searching = true;

            $scope.keywordsArr = [];

            $scope.status = "Checking " + $scope.keyword.trim() + "...";
            var check = encodeURIComponent($scope.keyword.trim().replace(" ", "+"));

            parseHubKeyword(check);
        }

        //store value in local storage so that it can be reloaded agai
        $scope.storeKey = function() {
            if ($scope.store){
                $window.localStorage['parsekey'] = $scope.parsekey;  
            }
            else
            {
                $window.localStorage.removeItem('parsekey');   
            }
        }

        //store value in local storage as user types
        $scope.onChange = function () {
            if ($scope.parsekey){
                $window.localStorage['parsekey'] = $scope.parsekey;  
            }

            }


        function parseHubKeyword(keyword) {
            var newRequest = new xdRequest;
            console.log("Requesting Phrase Related Keywords");
            console.log("https://www.parsehub.com/api/v2/projects/"+ {PROJECT_TOKEN} + "?api_key=" + {YOUR_API_KEY} + "&offset=0");
            newRequest.setURL("https://www.parsehub.com/api/v2/projects/"+ {PROJECT_TOKEN} + "?api_key=" + {YOUR_API_KEY} + "&offset=0");
            newRequest.get(function(response) {
                var keywords = parseHubData(response.html);
                $scope.$apply(function() {
                    $scope.keywords = keywords;
                });

                SEMRushOrganic();
            });
        }


        function parseHubData(data) {
            var resp = [];
            if (data.indexOf("ERROR") > -1) {
                console.log(data);
                $scope.status_update = data;
                $scope.error_message = data;
                return resp;
            }
            var lines = data.split("\n");
            var headers = [];
            if(lines.length>1){
              for (var i = 0; i < lines.length; i++) {
                  if (lines[i].trim().length > 0) {
                      var vals = lines[i].trim().split(";");
                      if (i == 0) {
                          //Headers
                          headers = vals;
                      } else {
                          var elem = {};
                          for (var j = 0; j < headers.length; j++) {
                              elem[headers[j]] = vals[j];
                          }
                          resp.push(elem);
                      }
                  }
              }
            }
            return resp;
        }

        $scope.dump = function() {
            console.log($scope);
        }

        $scope.getKey = function(arr, key) {
            return arr[key];
        }

        $window.localStorage['parsekey'] == undefined ? $scope.parsekey = "" : $scope.parsekey = $window.localStorage['parsekey'];

        // $scope.parsekey = $window.localStorage['parsekey'];
        $scope.store = $window.localStorage['parsekey'] != undefined;
        $scope.reset();


    }]);