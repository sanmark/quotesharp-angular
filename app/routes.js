define([
	'app'
], function (app) {
	app
	.config([
		'$urlRouterProvider',
		'$stateProvider',
		function (
		$urlRouterProvider,
		$stateProvider
		) {
			$urlRouterProvider.otherwise('/');

			$stateProvider
			.state('home', {
				url: '/',
				templateUrl: 'app/views/home.html',
				controller: 'HomeController',
				resolve: {
					controller: function ($q) {
						var deferred = $q.defer();
						require(['controllers/HomeController'], function () {
							deferred.resolve();
						});

						return deferred.promise;
					}
				}
			})
		}
	]);
});