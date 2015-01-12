define([
	'app'
], function (app) {
	app
	.config([
		'$urlRouterProvider',
		'$stateProvider',
		'$locationProvider',
		function (
		$urlRouterProvider,
		$stateProvider,
		$locationProvider
		) {
			$urlRouterProvider.otherwise('/quote/add');

			$stateProvider
			
			.state('login', {
				url: '/login',
				templateUrl: 'app/views/login.html',
				controller: 'LoginController',
				resolve: {
					controller: function ($q) {
						var deferred = $q.defer();
						require(['controllers/LoginController'], function () {
							deferred.resolve();
						});

						return deferred.promise;
					}
				}
			})
			.state('categories', {
				url: '/categories',
				templateUrl: 'app/views/categories.html',
				controller: 'CategoryController',
				resolve: {
					controller: function ($q) {
						var deferred = $q.defer();
						require(['controllers/CategoryController'], function () {
							deferred.resolve();
						});

						return deferred.promise;
					}
				}
			})
			.state('products-and-services', {
				url: '/products-and-services',
				templateUrl: 'app/views/productsandservices.html',
				controller: 'ProductsAndServicesController',
				resolve: {
					controller: function ($q) {
						var deferred = $q.defer();
						require(['controllers/ProductsAndServicesController'], function () {
							deferred.resolve();
						});

						return deferred.promise;
					}
				}
			})
			.state('quote-add', {
				url: '/quote/add',
				templateUrl: 'app/views/quote/add.html',
				controller: 'QuoteAddController',
				resolve: {
					controller: function ($q) {
						var deferred = $q.defer();
						require(['controllers/quote/QuoteAddController'], function () {
							deferred.resolve();
						});

						return deferred.promise;
					}
				}
			})
			.state('quoteEdit', {
				url: '/quote/:id/edit',
				templateUrl: 'app/views/quote/edit.html',
				controller: 'QuoteEditController',
				resolve: {
					controller: function ($q) {
						var deferred = $q.defer();
						require(['controllers/quote/QuoteEditController'], function () {
							deferred.resolve();
						});

						return deferred.promise;
					}
				}
			})
			.state('quote-view-all', {
				url: '/quote/view-all',
				templateUrl: 'app/views/quote/viewAll.html',
				controller: 'QuoteViewAllController',
				resolve: {
					controller: function ($q) {
						var deferred = $q.defer();
						require(['controllers/quote/QuoteViewAllController'], function () {
							deferred.resolve();
						});

						return deferred.promise;
					}
				}
			})
			.state('quote-edit', {
				url: '/quote/edit',
				templateUrl: 'app/views/quote/edit.html',
				controller: 'QuoteEditController',
				resolve: {
					controller: function ($q) {
						var deferred = $q.defer();
						require(['controllers/quote/QuoteEditController'], function () {
							deferred.resolve();
						});

						return deferred.promise;
					}
				}
			})

			$locationProvider.html5Mode(true).hashPrefix('!');
		}
	]);
});