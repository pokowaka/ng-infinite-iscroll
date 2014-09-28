/**
*/

'use strict';

angular.module('myApp').controller('HomeCtrl', function($scope, $timeout, $q) {
  $scope.iscrollOptions = {
		mouseWheel              : true,
    scrollbars              : 'custom',
    interactiveScrollbars   : true,
  };
  //uu
  $scope.total = 500000;
  $scope.getData = function(offset, size) {
    // Set the loading flag so the ui shows something sensible.
    $scope.loading = true;
    var def = $q.defer();
    // Simulate a webcall that takes two seconds..
     $timeout(function() {
       var data = {
         limits: {
           total : $scope.total,
           begin : offset,
           end   : offset + size,
         },
         items : []
       };
       for(var i = offset; i < offset + size; i++) {
          data.items.push('Element: ' + i);
       }
       $scope.loading = false;
       def.resolve(data);
     }, 2000);
    return def.promise;
  };
  $scope.grtotal = 10000;
  var data = {
    limits : {
      total    : $scope.grtotal
    },
    groupBy    : [],
    items      : []
  };
  for (var j = 0; j < $scope.grtotal; j+=10) {
    data.groupBy.push( {
      item : 'Group ' + (j / 10),
      offset : j
    });
  }
  $scope.getGroupData = function(offset, size) {
    console.log('getGroupData: ' + offset);
    // Set the loading flag so the ui shows something sensible.
    $scope.grloading = true;
    var def = $q.defer();
    // Simulate a webcall that takes two seconds..
     $timeout(function() {
       data.items = [];
       for(var i = offset; i < offset + size; i++) {
         data.items.push('Element: ' + i);
       }
       data.limits = { begin : offset, end : offset + size} ;
       $scope.grloading = false;
       def.resolve(data);
     }, 2000);
    return def.promise;
  };

  $scope.set = { size : 25, order : true };
  $scope.setSize= function(size) {
    $scope.set.size = size;
  };
  $scope.setToggle = function() {
    $scope.set.order = !$scope.set.order;
  };
  $scope.getSetData = function(offset, size) {
    var items = {
      limits : {
        total : $scope.set.size,
        begin : offset > $scope.set.size ? 0 : offset,
        end   : Math.min(offset + size, $scope.set.size)
      },
      items : []
    };
    var def = $q.defer();
    if ($scope.set.order)  {
      for (var i = items.limits.begin; i < items.limits.end; i++) {
        items.items.push('item : ' + i);
      }
    } else {
      for (var i = items.limits.end-1; i >= items.limits.begin; i--) {
        items.items.push('item : ' + i);
      }
    }
    def.resolve(items);
    return def.promise;
  };

});
