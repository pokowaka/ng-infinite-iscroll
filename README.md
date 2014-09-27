# A fast scroller directive for very large sets of data.

Scrolling large sets using AngularJS that actually work on mobile devices can be quite a challenge! What this directive allows you to do is to create a scroll view over a large set of data by only requesting a window of the data that is actually visible.
It also contains a directive that allows you to group the data in
headers. See the demo for an example of the two directives.

This directive only adds a minimal amount of elements to the DOM so it works well on mobile devices.

This directive here is based on iScroll which was slighly modified. iScroll is built into this directive due to the changes that have been made to it. 

## Usage


You can use it as follows in your view:

`<infinite-list request-data="getData" row-template="'<p>The item: {{item}}</p>'" /> 
`

Now in your controller you need a function that fetches the data:

```javascript

 $scope.getData = function(offset, size) {
    var def = $q.defer();
    // This is the actual data format we need to return..
    var data = { total : 10000, items : [] };
    for(var i = offset; i < Math.min(offset + size, 10000); i++) {
          data.items.push('Element: ' + i);
    }
    def.resolve(data);
    return def.promise;
  };
```

You must return a datatype that looks like this:

```javascript
{
  total : [Integer],   // The total number of objects available that can be retrieved, this is not the length of the list of items below!
  items : [Item]       // Objects in this batch. Your template will be asked to render indivudal items of this list

}
```

You can also use `row-template-url` if your template is stored in a file somewhere. 


***Note! Your template should have a fixed height! Otherwise the scroller will not work!*** 



## Demo
http://pokowaka.github.io/ng-infinite-iscroll/

## Dependencies
- required: Nothing.
- optional:

***Note this includes a heavily modified iScoll5, which was needed to get all this to work, if you are using iScroll5 in your app you might run into conflicts***
	

See `bower.json` and `index.html` in the `gh-pages` branch for a full list / more details

## Install
1. download the files
	1. Bower
		1. add `"ng-infinite-iscroll": "latest"` to your `bower.json` file then run `bower install` OR run `bower install ng-infinite-iscroll`
2. include the files in your app
	1. `nite-iscroll.min.js`
	2. `nite-iscroll.less` OR `nite-iscroll.min.css` OR `nite-iscroll.css`
3. include the module in angular (i.e. in `app.js`) - `pokowaka.ng-infinite-iscroll`

See the `gh-pages` branch, files `bower.json` and `index.html` for a full example.


## Documentation
See the `nite-iscroll.js` file top comments for usage examples and documentation
https://github.com/pokowaka/ng-infinite-iscroll/blob/master/nite-iscroll.js


## Development

1. `git checkout gh-pages`
	1. run `npm install && bower install`
	2. write your code then run `grunt`
	3. git commit your changes
2. copy over core files (.js and .css/.less for directives) to master branch
	1. `git checkout master`
	2. `git checkout gh-pages nite-iscroll.js nite-iscroll.min.js nite-iscroll.less nite-iscroll.css nite-iscroll.min.css`
3. update README, CHANGELOG, bower.json, and do any other final polishing to prepare for publishing
	1. git commit changes
	2. git tag with the version number, i.e. `git tag v1.0.0`
4. create github repo and push
	1. [if remote does not already exist or is incorrect] `git remote add origin [github url]`
	2. `git push origin master --tags` (want to push master branch first so it is the default on github)
	3. `git checkout gh-pages`
	4. `git push origin gh-pages`
5. (optional) register bower component
	1. `bower register ng-infinite-iscroll [git repo url]`
