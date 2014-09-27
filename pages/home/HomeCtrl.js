/**
*/

'use strict';

angular.module('myApp').controller('HomeCtrl', function($scope, $timeout, $q) {
	//TODO - put any directive code here
  $scope.total = 500000;
  $scope.getData = function(offset, size) {
    // Set the loading flag so the ui shows something sensible.
    $scope.loading = true;
    var def = $q.defer();
    // Simulate a webcall that takes two seconds..
     $timeout(function() {
       var data = { total : $scope.total, items : [] };
       for(var i = offset; i < offset + size; i++) {
          data.items.push('Element: ' + i);
       }
       $scope.loading = false;
       def.resolve(data);
     }, 2000);
    return def.promise;
  };
  $scope.grtotal = 10000;
  var data = { total : $scope.grtotal, groupBy: [], items : [] };
  for (var j = 0; j < $scope.grtotal; j+=10) {
    data.groupBy.push( {
      item : 'Group ' + (j / 10),
      offset : j
    });
  }
  $scope.getGroupData = function(offset, size) {
    console.log("getGroupData: " + offset);
    // Set the loading flag so the ui shows something sensible.
    $scope.grloading = true;
    var def = $q.defer();
    // Simulate a webcall that takes two seconds..
     $timeout(function() {
       data.items = [];
       for(var i = offset; i < offset + size; i++) {
         data.items.push('Element: ' + i);
       }
       $scope.grloading = false;
       def.resolve(data);
     }, 2000);
    return def.promise;
  };
});
