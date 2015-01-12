define(['app'], function (app) {
	app
	.config([
		'$httpProvider',
		function (
		$httpProvider
		) {
			$httpProvider.responseInterceptors.push(['$location', '$q', function ($location, $q) {
					var success = function (response) {
						return response;
					};

					var error = function (response) {
						if (response.status === 404) {
							$location.path('/');
						}

						return $q.reject(response);
					};

					return function (promise) {
						return promise.then(success, error);
					}
				}]);
		}
	]);
});