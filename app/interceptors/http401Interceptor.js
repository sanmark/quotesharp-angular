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
						if (response.status === 401) {
							localStorage.clear();
							$location.path('/login');
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