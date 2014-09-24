/**
@toc

@param {Object} scope (attrs that must be defined on the scope (i.e. in the controller) - they can't just be defined in the partial html). REMEMBER: use snake-case when setting these on the partial!
TODO

@param {Object} attrs REMEMBER: use snake-case when setting these on the partial! i.e. my-attr='1' NOT myAttr='1'
TODO

@dependencies
TODO

@usage
partial / html:
TODO

controller / js:
TODO

//end: usage
    A scrollable view of a large set of items. You should provide a function called requestData
    that returns the following:

    {
        total :  <Integer>  // The total number of elements that are available. Elements within [0..total] can be asked for.
        items : []   // Set of items, should contain (end - start) number of elements.
    }

    cacheSize                    : The number of elements to request per method invocation.
    rowTemplate                  : Template to render an item from the array items. The scope will contain the item property. Needs to be of height        : rowHeight
    rowTemplateUrl               : Url to template to render an item from the array items. The scope will contain the item property. Needs to be of height : rowHeight
    refresh                      : Variable to observe that indicates we should refresh the cache with new data.
*/

'use strict';

angular.module('pokowaka.ng-infinite-iscroll', []).
  // TODO(ErwinJ): Get rid of this counter..
  service('counterService', function() {
  var counter = 0;
  this.next = function() {
    return counter++;
  };
})
.directive('infiniteList', function($compile, $http, $q, $templateCache, counterService) {
  return {
    restrict: 'E',
    template: '<div class="infinite-list-wrapper"><div class="infinite-list-scroller"></div></div>',
    scope          : {
      requestData    : '=requestData',
      rowTemplate    : '=rowTemplate',
      rowTemplateUrl : '=rowTemplateUrl',
      refresh        : '=refresh',
      cacheSize      : '=cacheSize',
    },
    link: function link(scope, element) {
      var cacheSize = angular.isUndefined(scope.cacheSize) ? 1000 : scope.cacheSize;
      var iScroll = null, lstStart = 0, row = null;
      var scopeMap = {};
      var createRow = function(ul, data) {

        var id = 'llx-' + counterService.next(),
        el = angular.element('<li class="llxrow" id="' + id + '"/>'),
        newScope = scope.$new(true);

        // Keep track of which row has which scope..
        // (We need this as $(el).scope() doesn't work..
        scopeMap[id] = newScope;

        ul.append(el);
        newScope.item = data;
        row(newScope, function(cloned) {
          el.append(cloned);
        });

        if (scope.$root.$$phase != '$apply' && scope.$root.$$phase != '$digest') {
          newScope.$apply();
        }
      };

      // iScroll will call this to actually render the data
      var updateContent = function(el, data) {
        var id = $(el).attr('id'), sc = scopeMap[id];
        sc.item = data;

        // Apply as we are likely outside a digest cycle.
        if (sc.$root.$$phase != '$apply' && sc.$root.$$phase != '$digest') {
          sc.$apply();
        }
      };

      // Used to fetch the data.
      var requestData = function(start, count) {
        var defer = $q.defer();
        lstStart = start;
        scope.requestData(start, count).then(function(res) {
          if (res.limits !== iScroll.options.infiniteLimit) {
            iScroll.options.infiniteLimit = res.total;
          }

          iScroll.updateCache(start, res.items);
          iScroll.updateContent();
          iScroll.refresh();
          defer.resolve();
        }).catch(function() { defer.reject(); });
        return defer.promise;
      };


      // Used to get the template ready.
      var loadTemplate = function() {
        var deferred = $q.defer();
        if (!angular.isUndefined(scope.rowTemplate)) {
          deferred.resolve($compile(scope.rowTemplate));
        }
        if (!angular.isUndefined(scope.rowTemplateUrl)) {
          $http.get(scope.rowTemplateUrl, {cache: $templateCache}).success(function(html) {
            deferred.resolve($compile(html));
          }).error(function() {
            deferred.reject();
          });
        }
        return deferred.promise;
      };



      // Okay, we now load the first rows of data..
      // as soon as we get this we can construct our iScroll component.
      loadTemplate().then(function(template) {
        row = template;
        scope.requestData(0, 50).then(function(res) {
          // We can now setup the IScroll component..
          // First we need the initial visible elements.
          // For now we will use 50 elements.
          // TODO(ErwinJ): In the future be smart and do 3x the view or something like that.
          var ul = angular.element("<ul/>");
          var scroller = element.children().children();
          scroller.append(ul);
          for(var i = 0; i < res.items.length && i < 50; i++) {
            createRow(ul, res.items[i]);
          }
          var scrollDiv = element.children();
          scrollDiv.attr('id', 'wr-' +  counterService.next());

          // TODO(ErwinJ): We might want to pass in the options through the directive?
          iScroll = new IScroll(scrollDiv[0], {
            mouseWheel            : true,
            infiniteElements      : scroller.children().children(),
            infiniteLimit         : res.total,
            scrollbars            : true,
            interactiveScrollbars : true,
            dataset               : requestData,
            dataFiller            : updateContent,
            cacheSize             : cacheSize,
          });


          // Hookup refresh observers.
          if (!angular.isUndefined(scope.refresh)) {
            var lst = scope.refresh.split(',');
            for(var j = 0; j < lst.length; j++) {
              scope.$parent.$watch(lst[j].trim(), function() {
                // Do not make any calls if the scroller is not yet initialized.
                requestData(lstStart, cacheSize);
              });
            }
          }
        });
      });
    }
  };
});
