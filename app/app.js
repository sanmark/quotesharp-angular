define(['angular'], function (angular) {
	var app = angular.module('app', [
		'ngRoute',
		'ui.router'
	])
	.config([
		'$controllerProvider',
		'$compileProvider',
		'$filterProvider',
		'$provide',
		function (
		$controllerProvider,
		$compileProvider,
		$filterProvider,
		$provide
		) {
			app.controller = $controllerProvider.register;
			app.service = $provide.service;
			app.factory = $provide.factory;
			app.filter = $filterProvider.register;
			app.directive = $compileProvider.directive;
		}
	]);
	return app;
});