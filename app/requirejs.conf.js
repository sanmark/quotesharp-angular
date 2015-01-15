/*require.config({
urlArgs: "bust=" + (new Date()).getTime()
});
*/

require.config(
{
	paths: {
		'jquery': '../lib/Jquery/jquery-2.1.1',
		'angular': '../lib/AngularJS/angular.min',
		'angular-route': '../lib/AngularJS/angular-route.min',
		'angular-ui-router': '../lib/AngularUIRouter/angular-ui-router.min',
		'angular-resource': '../lib/AngularJS/angular-resource.min',
		'angular-sanitize': '../lib/AngularJS/angular-sanitize.min',
		'app': 'app',
		'QuotesharpAPI': 'services/QuotesharpAPI'
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
		'angular-resource': {
			deps: ['angular']
		},
		'angular-sanitize': {
			deps: ['angular']
		},
		'app': {
			deps: [
				'angular-ui-router',
				'angular-resource',
				'angular-sanitize'
			]
		}
	}
}
);

require([
	'angular',
	'routes',
	'interceptors/http401Interceptor',
	'interceptors/http404Interceptor'
], function (
angular
) {
	angular.bootstrap(document, ['app'])
});
