define(['app', 'jquery', 'QuotesharpAPI', 'services/ResponseFunctions', 'services/TreeViewFunctions'], function (app, $) {
	app
	.controller('QuoteEditController', [
		'$scope',
		'$rootScope',
		'$state',
		'$location',
		'$stateParams',
		'$compile',
		'QuotesharpAPI',
		'ResponseFunctions',
		'TreeViewFunctions',
		function (
		$scope,
		$rootScope,
		$state,
		$location,
		$stateParams,
		$compile,
		QuotesharpAPI,
		ResponseFunctions,
		TreeViewFunctions
		) {

			var editQuoteId = $stateParams.id;

			if (!localStorage.authenticated) {
				$location.path('/login');
			}

			getCategoriesForQuote();
			getBasicQuoteData(editQuoteId);
			getQuoteProductsAndServicesData(editQuoteId);
			getCustomers();
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


			function getQuoteProductsAndServicesData(editQuoteId)
			{
				QuotesharpAPI.quote.getQuoteProductsAndServicesData(editQuoteId)
				.success(function (response) {
					$scope.productsInQuote = response.data;
				})
				.error(function (response) {

				});
			}

			function getBasicQuoteData(editQuoteId)
			{
				QuotesharpAPI.quote.getBasicQuoteData(editQuoteId)
				.success(function (response) {
					$scope.basicDetails = response.data;
					$scope.customerName = $scope.basicDetails['customer_name'];
					$scope.customerTelephone = $scope.basicDetails['customer_telephone'];
					$scope.customerAddress = $scope.basicDetails['customer_address'];
					$scope.quoteId = $scope.basicDetails['printed_quote_id'];
					$scope.dateTime = $scope.basicDetails['date'];
				})
				.error(function (response) {

				});
			}

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
				QuotesharpAPI.productsAndServices.getAllProductsAndServicesForEditMode(editQuoteId)
				.success(function (response) {
					$scope.quoteProductsAndServices = response.data;
					var productsAndServices = $scope.quoteProductsAndServices;
					$scope.quoteData = {};
					var ids = [];
					var quoteProductIds = [];
					var productsInQuote = $scope.productsInQuote;
					for (key in productsInQuote)
					{
						quoteProductIds.push(productsInQuote[key]['product_or_service_id']);
					}
					for (key in productsAndServices)
					{
						if (quoteProductIds.indexOf(productsAndServices[key]['id']) !== -1)
						{
							for (var i = 0; i < productsInQuote.length; i++) {
								if (productsInQuote[i]['product_or_service_id'] === productsAndServices[key]['id'])
								{
									var price = productsInQuote[i]['price'];
									var quantity = productsInQuote[i]['quantity'];
									var lineTotal = Number(price) * Number(quantity);
								}
							}

						}
						else
						{
							var price = productsAndServices[key]['price'];
							var quantity = '';
							var lineTotal = '';
						}
						ids.push(Number(productsAndServices[key]['id']));
						var priceId = 'price_' + productsAndServices[key]['id'];
						var quantityId = 'quantity_' + productsAndServices[key]['id'];
						$scope.quoteData[priceId] = price;
						$scope.quoteData[quantityId] = quantity;
						var html = "";
						html = "<li><span class='name'>" + productsAndServices[key]['name'] + "</span>";
						html += "<div class='treeViewButton'>";
						html += "<input class='form-control' type='text' readonly data-ng-model='quoteData.price_" + productsAndServices[key]['id'] + "' id='proPrice_" + productsAndServices[key]['id'] + "'>";
						html += "<input placeholder='Quantity' class='form-control' id='" + productsAndServices[key]['id'] + "' data-ng-model='quoteData.quantity_" + productsAndServices[key]['id'] + "' type='text'>";
						html += "<input placeholder='Line total' class='form-control' id='proLineTotal_" + productsAndServices[key]['id'] + "' type='text' value='" + lineTotal + "' disabled>";
						html += "</div></li>";
						var elementId = productsAndServices[key]['parent_id'];
						$('#row_' + elementId).append($compile(html)($scope));

					}

					quoteTotalOnLoad(ids);

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
						$('#fullTotal').val($rootScope.currencyFormat + " " + total);
					});
				})
				.error(function (response) {

				});
			}

			function quoteTotalOnLoad(ids)
			{

				var total = 0;
				for (index in ids)
				{
					var value = $('#proLineTotal_' + ids[index]).val();
					if (isNaN(value))
					{
						value = 0;
					}
					total += Number(value);
				}
				$('#fullTotal').val($rootScope.currencyFormat + " " + total);

			}

			$scope.rows = [
			];

			$scope.updateQuote = function ()
			{

				var sendData = new Object();
				for (i in $scope.quoteProductsIds)
				{
					sendData[$scope.quoteProductsIds[i]] = {
						'id': $scope.quoteProductsIds[i],
						'price': $scope.quoteData['price_' + $scope.quoteProductsIds[i]],
						'quantity': $scope.quoteData['quantity_' + $scope.quoteProductsIds[i]]
					};
				}
				
				var result = validateEditQuoteOnUpdate(sendData);
				
				if (result)
				{
					QuotesharpAPI.quote.updateQuote($stateParams.id, sendData, $scope.customerName, $scope.customerTelephone, $scope.customerAddress, $scope.quoteId, $scope.dateTime)
					.success(function (response, status) {
						$state.transitionTo('quote-view-all');
					})
					.error(function (response, status) {
						$scope.responseAlert = ResponseFunctions.displayFeedback(response, status);
					});
				}
				else
				{
					$scope.responseAlert = ResponseFunctions.displayFeedback({"msg": ["Quote is empty,please add data or delete quote"]}, 406);
				}


			};

			function validateEditQuoteOnUpdate(sendData)
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

