define(['app', 'jquery', 'QuotesharpAPI', 'services/ResponseFunctions', 'services/TreeViewFunctions'], function (app, $) {
	app
	.controller('QuoteAddController', [
		'$scope',
		'$rootScope',
		'$state',
		'$location',
		'$compile',
		'QuotesharpAPI',
		'ResponseFunctions',
		'TreeViewFunctions',
		function (
		$scope,
		$rootScope,
		$state,
		$location,
		$compile,
		QuotesharpAPI,
		ResponseFunctions,
		TreeViewFunctions
		) {
			if (!localStorage.authenticated) {
				$location.path('/login');
			}

			getCategoriesForQuote();
			getCustomers();
			$scope.dateTime = getCurrentDate();
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

			function getCategoriesForQuote() {
				QuotesharpAPI.categories.getCategoriesForTreeView()
				.success(function (response) {
					$scope.quoteCategories = response.data;
					var appendData = TreeViewFunctions.buildTreeView(0, $scope.quoteCategories);
					$('#quote-category-area').append(appendData);
					TreeViewFunctions.designTreeView();
					getProductsAndServicesForQuote();
				})
				.error(function (response) {

				});
			}
			function getProductsAndServicesForQuote() {
				QuotesharpAPI.productsAndServices.getActiveProductsAndServices()
				.success(function (response) {
					$scope.quoteProductsAndServices = response.data;
					var productsAndServices = $scope.quoteProductsAndServices;
					$scope.quoteData = {};
					var ids = [];
					for (key in productsAndServices)
					{
						ids.push(Number(productsAndServices[key]['id']));
						var id = 'price_' + productsAndServices[key]['id'];
						$scope.quoteData[id] = productsAndServices[key]['price'];
						var html = "";
						html = "<li class='productRow'><span class='name'>" + productsAndServices[key]['name'] + "</span>";
						html += "<input class='form-control' type='text' readonly data-ng-model='quoteData.price_" + productsAndServices[key]['id'] + "' id='proPrice_" + productsAndServices[key]['id'] + "' value='" + productsAndServices[key]['price'] + "'>";
						html += "Quantity:<input class='form-control' id='" + productsAndServices[key]['id'] + "' data-ng-model='quoteData.quantity_" + productsAndServices[key]['id'] + "' type='text'>";
						html += "Line total:<input class='form-control' id='proLineTotal_" + productsAndServices[key]['id'] + "' type='text' disabled></li>";
						var elementId = productsAndServices[key]['parent_id'];

						$('#row_' + elementId).append($compile(html)($scope));

					}
					$scope.quoteProductsIds = ids;

					$("input").keyup(function () {
						var price = $('#proPrice_' + this.id).val();
						var quantity = $(this).val();
						var lineTotal = Number(price) * Number(quantity);
						$('#proLineTotal_' + this.id).val(lineTotal);
						var lineTotal = $("input[id^='proLineTotal']");
						var total = 0;
						for (i in lineTotal)
						{
							var value = Number(lineTotal[i]['value']);
							if (isNaN(value))
							{
								value = 0;
							}
							total += value;
						}
						$('#fullTotal').val($rootScope.currencyFormat+" "+total);
					});
				})
				.error(function (response) {

				});
			}

			$scope.rows = [
			];

			$scope.saveQuote = function ()
			{
				var sendData = new Object();
				for (i in $scope.quoteProductsIds)
				{
					if ($scope.quoteData.hasOwnProperty('quantity_' + $scope.quoteProductsIds[i]))
					{
						sendData[$scope.quoteProductsIds[i]] = {
							'id': $scope.quoteProductsIds[i],
							'price': $scope.quoteData['price_' + $scope.quoteProductsIds[i]],
							'quantity': $scope.quoteData['quantity_' + $scope.quoteProductsIds[i]]
						};
					}
				}
				var result = validateAddQuoteOnSave(sendData);

				if (result)
				{
					QuotesharpAPI.quote.saveQuote(sendData, $scope.customerName, $scope.customerTelephone, $scope.customerAddress, $scope.quoteId, $scope.dateTime)
					.success(function (response, status) {
						$state.transitionTo('quote-view-all');
					})
					.error(function (response, status) {
						$scope.responseAlert = ResponseFunctions.displayFeedback({"msg": ["Failed to save quote"]}, status);
					});
				}
				else
				{
					$scope.responseAlert = ResponseFunctions.displayFeedback({"msg": ["Please enter quote data"]}, 406);
				}
			};

			function validateAddQuoteOnSave(sendData)
			{

				if (Object.getOwnPropertyNames(sendData).length === 0)
				{
					return false;
				}
				else
				{
					return true;
				}

			}

			function getCurrentDate()
			{
				var today = new Date();
				var dd = today.getDate();
				var mm = today.getMonth() + 1;
				var yyyy = today.getFullYear();
				if (dd < 10) {
					dd = '0' + dd
				}
				if (mm < 10) {
					mm = '0' + mm
				}
				var today = yyyy + '-' + mm + '-' + dd;
				return today;
			}

			function getCustomers()
			{
				QuotesharpAPI.quote.getCustomers()
				.success(function (response, status) {
					$scope.customersList = response.data;
				})
				.error(function (response, status) {

				});
			}

		}]);
});

