require
.config(
{
	paths: {
		'angular': '../lib/AngularJS/angular.min',
		'angular-route': '../lib/AngularJS/angular-route.min',
		'angular-ui-router': '../lib/AngularUIRouter/angular-ui-router.min',
		'app': 'app',
	},
	shim: {
		'angular': {
			exports: 'angular'
		},
		'angular-route': {
			deps: ['angular']
		},
		'angular-ui-router': {
			deps: ['angular-route']
		},
		'app': {
			deps: ['angular-ui-router']
		}
	}
}
);

require(['angular', 'routes'], function (angular) {
	angular.bootstrap(document, ['app'])
});
