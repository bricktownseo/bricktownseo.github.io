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
    'ngTouch',
    'blockUI'
  ]).config(function($httpProvider){
    $httpProvider.defaults.useXDomain = true;
    $httpProvider.defaults.headers.common = 'Content-Type: application/json';
    $http.defaults.headers.put = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Requested-With'
        };
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
  });
  /*
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        controller: 'SEMRushCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
*/


angular.module('SEMRushApp')
  .controller('SEMRushCtrl', ['$scope','blockUI','$http','$q', function ($scope, blockUI, $http, $q) {

    $scope.keywords = "";
    $scope.city = "";
    $scope.semkey = "";
    $scope.topKeyword = {keyword:"",volume:0};
    $scope.domains = {};
    $scope.domainArray = [];

    $scope.search = function(){
      $scope.searching = true;

      blockUI.start('Searching Domains...');


    $scope.keywordsArr = [];

    $scope.statusText = "Checking "+$scope.city+" "+$scope.keyword.trim()+"...";
    var check = encodeURIComponent($scope.city+"+"+$scope.keyword.trim());
    
    SEMRushKeyword(check);
      /*
      blockUI.message('Checking domains with Namecheap...'); 
      blockUI.message('Getting TF/CF from Majestic...'); 
      blockUI.message('Getting DA from MOZ ...'); 

      $timeout(function() {
        blockUI.stop(); 
      }, 2000);
      */
    }

    function SEMRushKeyword(keyword){
    var url = "http://api.semrush.com/?type=phrase_fullsearch&phrase="+keyword+"&key="+$scope.semkey+"&display_limit=5&export_columns=Ph,Nq,Cp,Co,Nr,Td&database=us";
    $http.get(url).
      success(function(data, status, headers, config) {
        $scope.keywords = SEMRushData(data);
        //console.log($scope.keywords);
        $scope.searching = false;
        $scope.complete = true;
        SEMRushOrganic();
        //blockUI.stop();
        //$scope.keywordsArr.push(arr);

        //SEMRush

      }).
      error(function(data, status, headers, config) {
        console.log(data);
        blockUI.stop();
      });

  }

  function SEMRushOrganic(){
    if($scope.keywords.length>0){
      for(var i = 0; i < $scope.keywords.length; i++){
        var url = "http://api.semrush.com/?type=phrase_organic&key="+$scope.semkey+"&display_limit=20&export_columns=Dn,Ur&phrase="+$scope.keywords[i].Keyword+"&database=us";
        blockUI.message('Checking domains for keyword '+$scope.keywords[i].Keyword+'...'); 
        $http.get(url,{headers:{'Access-Control-Allow-Origin': '*','Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS','Access-Control-Allow-Headers': 'Content-Type, X-Requested-With'}}).
          success(function(data, status, headers, config) {
            //console.log(headers);
            var testKeyword = config.url.substring(config.url.indexOf("phrase=")+7);
            testKeyword = testKeyword.substring(0,testKeyword.indexOf("&"))
            
            var urls = SEMRushData(data);
            for(var j = 10; j < urls.length; j++){
              if($scope.domainArray.indexOf(urls[j]["Domain"])==-1){
                $scope.domainArray.push(urls[j]["Domain"]);
                $scope.domains[urls[j]["Domain"]] = {domain:urls[j]["Domain"],position:"("+(j+1)+") "+testKeyword};
                SEMRushDomainAdwords(urls[j]["Domain"]);
              }else{
                $scope.domains[urls[j]["Domain"]].position = $scope.domains[urls[j]["Domain"]].position+"\n "+"("+(j+1)+") "+testKeyword;
              }
            }
            for(var j = 0; j < 10 && j < urls.length; j++){
              if($scope.domainArray.indexOf(urls[j]["Domain"])>=0){
                $scope.domains[urls[j]["Domain"]].position = $scope.domains[urls[j]["Domain"]].position+"\n "+"("+(j+1)+") "+testKeyword;
              } 
            }
            //console.log(urls);
            console.log($scope.domains);
            //SEMRushOrganic();
            blockUI.stop();
            //$scope.keywordsArr.push(arr);

            //SEMRush

          }).
          error(function(data, status, headers, config) {
            console.log(data);
            blockUI.stop();
        });
      }
    }else{
      blockUI.stop();
      $scope.error = "We failed to do something right...";
    }
    
  }

  function SEMRushDomainAdwords(domain){
    var url = "http://api.semrush.com/?type=domain_adwords&key="+$scope.semkey+"&display_limit=10000&export_columns=Ph,Po,Pp,Pd,Nq,Cp,Vu,Tr,Tc,Co,Nr,Td&domain="+domain+"&display_sort=po_asc&database=us";
    $http.get(url,{headers:{'Access-Control-Allow-Origin': '*','Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS','Access-Control-Allow-Headers': 'Content-Type, X-Requested-With'},"domain": domain}).
      success(function(data, status, headers, config) {
        var domain = config.domain;
        var paid = SEMRushData(data);
        if(paid.length>0){
          $scope.domains[domain]["paid"] = paid.length;
          $scope.domains[domain]["paiddetail"] = paid;
        }
        //console.log(headers);
        //console.log(data);
        //console.log(config);
        /*
        var testKeyword = config.url.substring(config.url.indexOf("phrase=")+7);
        testKeyword = testKeyword.substring(0,testKeyword.indexOf("&"))
        
        var urls = SEMRushData(data);
        for(var j = 10; j < urls.length; j++){
          if($scope.domainArray.indexOf(urls[j]["Domain"])==-1){
            $scope.domainArray.push(urls[j]["Domain"]);
            $scope.domains[urls[j]["Domain"]] = {domain:urls[j]["Domain"],position:"("+(j+1)+") "+testKeyword};
            SEMRushDomainAdwords(urls[j]["Domain"]);
          }else{
            $scope.domains[urls[j]["Domain"]].position = $scope.domains[urls[j]["Domain"]].position+"\n "+"("+(j+1)+") "+testKeyword;
          }
        }
        for(var j = 0; j < 10 && j < urls.length; j++){
          if($scope.domainArray.indexOf(urls[j]["Domain"])>=0){
            $scope.domains[urls[j]["Domain"]].position = $scope.domains[urls[j]["Domain"]].position+"\n "+"("+(j+1)+") "+testKeyword;
          } 
        }
        //console.log(urls);
        console.log($scope.domains);
        //SEMRushOrganic();
        blockUI.stop();
        //$scope.keywordsArr.push(arr);
      */
        //SEMRush

      }).
      error(function(data, status, headers, config) {
        console.log(data);
        blockUI.stop();
    });

  }

  function SEMRushData(data){
    var resp = [];
    
    if(data.includes("ERROR")){
      console.log(data);
      $scope.status = "Error checking the keyword";
      return resp;
    }
    var lines = data.split("\n");
    var headers = [];

    for(var i = 0; i < lines.length; i++){
      var vals = lines[i].split(";");
      if(i==0){
        //Headers
        headers = vals;
      }else{
        var elem = {};
        for(var j = 0; j < headers.length; j++){
          elem[headers[j]] = vals[j];
        }
        resp.push(elem);
      }
    }
    return resp;
  }

  $scope.showData = function(domain){
    $scope.selected = domain;
    $('#paid_modal').openModal();
  }

  $scope.closeData = function(){
    $('#paid_modal').closeModal();

  }

  }]);