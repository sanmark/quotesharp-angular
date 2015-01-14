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
					console.log(response.msg);
				});
			}

			$scope.deleteQuote = function (quoteId) {

				var result = confirm('Are you sure to delete this quote ?');
				if (result === false)
				{
					return false;
				}

				QuotesharpAPI.quote.deleteQuote(quoteId)
				.success(function (response, status) {
					$scope.responseAlert = ResponseFunctions.displayFeedback(response, status);
					getQuotes();
				})
				.error(function (response, status) {
					$scope.responseAlert = ResponseFunctions.displayFeedback(response, status);
				});
			};

		}]);
});

