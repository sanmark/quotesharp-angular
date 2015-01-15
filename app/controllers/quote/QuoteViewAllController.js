define(['app', 'QuotesharpAPI', 'services/ResponseFunctions'], function (app) {
	app
	.controller('QuoteViewAllController', [
		'$scope',
		'$location',
		'QuotesharpAPI',
		'ResponseFunctions',
		function (
		$scope,
		$location,
		QuotesharpAPI,
		ResponseFunctions
		) {
			if (!localStorage.authenticated) {
				$location.path('/login');
			}

			getQuotes();
			$scope.responseAlert = {};
			$scope.responseAlert.alertHidden = true;

			$scope.loggedUser = localStorage.username;
			$scope.userOrganization = localStorage.organization;

			$scope.logout = function () {
				QuotesharpAPI.auth.logout()
				.success(function () {
					localStorage.clear();

					$location.path('/login');
				});
			};

			function getQuotes()
			{
				QuotesharpAPI.quote.getQuotes()
				.success(function (response)
				{
					$scope.quotes = response.data;
				})
				.error(function (response) {

				});
			}

			$scope.deleteQuote = function (quoteId) {
				QuotesharpAPI.quote.deleteQuote(quoteId)
				.success(function (response, status) {
					$scope.responseAlert = ResponseFunctions.displayFeedback({"msg": ["Quote deleted successfully"]}, status);
					getQuotes();
				})
				.error(function (response, status) {
					$scope.responseAlert = ResponseFunctions.displayFeedback({"msg": ["Failed to delete quote"]}, status);
				});
			};

		}]);
});

