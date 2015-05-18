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
  ]);
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
  .controller('SEMRushCtrl', ['$scope' function ($scope) {

    $scope.keywords = "";
    $scope.city = "";
    $scope.semkey = "";
    $scope.topKeyword = {keyword:"",volume:0};
    $scope.domains = {};
    $scope.domainArray = [];
    $scope.status_update = "";

    $scope.search = function(){
      $scope.searching = true;

      $scope.keywordsArr = [];

      $scope.status_update = "Checking "+$scope.city+" "+$scope.keyword.trim()+"...";
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
      var newRequest = new xdRequest;
      newRequest.setURL("http://api.semrush.com/?type=phrase_fullsearch&phrase="+keyword+"&key="+$scope.semkey+"&display_limit=1&export_columns=Ph,Nq,Cp,Co,Nr,Td&database=us");
      newRequest.get(function(response){
        $scope.$apply(function(){
          $scope.keywords = SEMRushData(response.html);
          
          $scope.searching = false;
          $scope.doneSearching = true;
          $scope.complete = true;
          
          SEMRushOrganic();
        });

      });
    }

  function SEMRushOrganic(){
    if($scope.keywords.length>0){
      for(var i = 0; i < $scope.keywords.length; i++){
        $scope.status_update = ('Checking domains for keyword '+$scope.keywords[i].Keyword+'...'); 
        var newRequest = new xdRequest;
        newRequest.setURL("http://api.semrush.com/?type=phrase_organic&key="+$scope.semkey+"&display_limit=1&export_columns=Dn,Ur&phrase="+encodeURIComponent($scope.keywords[i].Keyword)+"&database=us");
        newRequest.get(function(response){
            var testKeyword = response.url.substring(response.url.indexOf("phrase=")+7);
            testKeyword = testKeyword.substring(0,testKeyword.indexOf("&"))
            
            var urls = SEMRushData(response.html);
            for(var j = 0; j < urls.length; j++){
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
          });
      }
    }
  }

  function SEMRushDomainAdwords(domain){
    var newRequest = new xdRequest;
    newRequest.setURL("http://api.semrush.com/?type=domain_adwords&key="+$scope.semkey+"&display_limit=1&export_columns=Ph,Po,Pp,Pd,Nq,Cp,Vu,Tr,Tc,Co,Nr,Td&domain="+encodeURIComponent(domain)+"&display_sort=po_asc&database=us");
    newRequest.get(function(response){
        $scope.$apply(function(){
        var domain = response.url.substring(response.url.indexOf("domain=")+7);
        domain = domain.substring(0,domain.indexOf("&"))
        var paid = SEMRushData(response.html);
        if(paid.length>0){
          $scope.domains[domain]["paid"] = paid.length;
          $scope.domains[domain]["paiddetail"] = paid;
        }
      });
    });
  }

  function SEMRushData(data){
    console.log(data);
    var resp = [];
    
    if(data.includes("ERROR")){
      console.log(data);
      $scope.status_update = "Error checking the keyword";
      return resp;
    }
    var lines = data.split("\n");
    var headers = [];

    for(var i = 0; i < lines.length; i++){
      var vals = lines[i].trim().split(";");
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