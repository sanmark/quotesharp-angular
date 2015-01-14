define(['app', 'QuotesharpAPI'], function (app) {
	app
	.controller('LoginController', [
		'$scope',
		'$state',
		'$sanitize',
		'$location',
		'QuotesharpAPI',
		function (
		$scope,
		$state,
		$sanitize,
		$location,
		QuotesharpAPI
		) {
			if (localStorage.authenticated) {
				$location.path('/');
			}

			$scope.logout = function () {
				QuotesharpAPI.auth.logout()
				.success(function () {
					localStorage.clear();

					$location.path('/login');
				});
			};

			$scope.login = function () {
				QuotesharpAPI.auth.login($sanitize($scope.username), $sanitize($scope.password), $sanitize($scope.organization))
				.success(function (data) {
					$location.path('/quote/add');
					localStorage.authenticated = true;
					localStorage.authToken = data.authToken;
					localStorage.username = data.username;
					localStorage.organization = data.organization;
				})
				.error(function (data) {
					$scope.flash = data.msg;
				});
			};
		}
	]);
});