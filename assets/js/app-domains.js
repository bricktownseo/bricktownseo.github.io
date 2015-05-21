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
    .module('SEMRushApp', [
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


angular.module('SEMRushApp')
    .controller('SEMRushCtrl', ['$scope', function($scope) {

        $scope.reset = function() {
            $scope.keyword = "";
            $scope.relatedKeywords = 1;
            $scope.domainList = "";
            $scope.domains = {};
            $scope.domainArray = [];
            $scope.complete = false;
            $scope.searching = false;
            $scope.status = "";
            $scope.country = "us";
        }

        $scope.search = function() {
            $scope.searching = true;

            $scope.status = "Checking Domains...";
            
            SEMRushDomains();
        }

        function SEMRushDomains() {
          $scope.domainArray = $scope.domainList.trim().split("\n");
          $scope.domains = {};
          for (var i = 0; i < $scope.domainArray.length; i++) {
            if($scope.domainArray[i].trim().length>0){
              var dom = $scope.domainArray[i].trim();
              $scope.status = ('Checking domain '+dom+'...');
              $scope.domains[dom] = {'domain': dom};
              var newRequest = new xdRequest;
              console.log("Domain search for "+dom);
              console.log("http://api.semrush.com/?type=domain_rank&key=" + $scope.semkey + "&export_columns=Dn,Rk,Or,Ot,Oc,Ad,At,Ac&domain="+dom+"&database=" + $scope.country);
              newRequest.setURL("http://api.semrush.com/?type=domain_rank&key=" + $scope.semkey + "&export_columns=Dn,Rk,Or,Ot,Oc,Ad,At,Ac&domain="+dom+"&database=" + $scope.country);
              newRequest.get(function(response) {
                var domaindata = SEMRushData(response.html);
                console.log(domaindata);
              });
            }
          }
        }

        function SEMRushDomain(domain) {
            $scope.complete = true;
            var newRequest = new xdRequest;
            console.log("http://api.semrush.com/?type=domain_rank&key="+$scope.semkey+"&export_columns=Dn,Rk,Or,Ot,Oc,Ad,At,Ac&domain="+domain+"&database=us");
            newRequest.setURL("http://api.semrush.com/?type=domain_rank&key="+$scope.semkey+"&export_columns=Dn,Rk,Or,Ot,Oc,Ad,At,Ac&domain="+domain+"&database=" + $scope.country);
            newRequest.get(function(response) {
                $scope.$apply(function() {
                    var domaindata = SEMRushData(response.html);
                    if (domaindata.length > 0) {
                      //console.log(domaindata);
                      console.log(domaindata[0]);
                      $scope.domains[domaindata[0]["Domain"]]["paid"] = domaindata[0]["Adwords Cost"];
                    }
                    /*
                    var domain = response.url.substring(response.url.indexOf("domain=") + 7);
                    domain = domain.substring(0, domain.indexOf("&"))
                    var domaindata = SEMRushData(response.html);
                    console.log(domaindata);
                    if (domaindata.length > 0) {
                      $scope.domains[domain]["paid"] = domaindata[0]["Adwords Cost"];
                    }
                    */
                });
            });
        }

        function SEMRushData(data) {
            var resp = [];

            if (data.indexOf("ERROR") > -1 && data.indexOf("50")==-1) {
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


        $scope.semkey = "";
        $scope.reset();

    }]);