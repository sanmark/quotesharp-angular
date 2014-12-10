define(['app'], function (app) {
	app
	.controller('HomeController', ['$scope', function ($scope) {
		$scope.name = "AngularBegin";
		$scope.description = "A kick-start template for AngularJS, equipped with AngularUI Router and RequireJS.";
		$scope.disclaimer = "Logos and names above are propertise of their respective creators.";
	}]);
});