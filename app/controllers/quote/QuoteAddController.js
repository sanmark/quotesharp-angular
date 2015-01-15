define(['app', 'jquery', 'QuotesharpAPI', 'services/ResponseFunctions'], function (app, $) {
	app
	.controller('QuoteAddController', [
		'$scope',
		'$state',
		'$location',
		'$compile',
		'QuotesharpAPI',
		'ResponseFunctions',
		function (
		$scope,
		$state,
		$location,
		$compile,
		QuotesharpAPI,
		ResponseFunctions
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

			function buildCategory(parent, category)
			{
				var html = "";
				if (typeof category['parent_cats'][parent] !== 'undefined')
				{
					html += "<ul>";
					for (key in category['parent_cats'][parent])
					{
						var cat_id = category['parent_cats'][parent][key];

						if (typeof category['parent_cats'][cat_id] === 'undefined')
						{
							html += "<li id='row_" + category['categories'][cat_id]['id'] + "'><a href='javascript:void(0)'><span>" + category['categories'][cat_id]['name'] + "</span></a></li>";
						}

						if (typeof category['parent_cats'][cat_id] !== 'undefined')
						{
							html += "<li id='row_" + category['categories'][cat_id]['id'] + "'><a href='javascript:void(0)'><span>" + category['categories'][cat_id]['name'] + "</span></a>";
							html += buildCategory(cat_id, category);
							html += "</li>";
						}
					}
					html += "</ul>";
				}
				return html;
			}

			function getCategoriesForQuote() {
				QuotesharpAPI.categories.getCategoriesForQuote()
				.success(function (response) {
					$scope.quoteCategories = response.data;
					var appendData = buildCategory(0, $scope.quoteCategories);
					$('#quote-category-area').append(appendData);
					designQuoteView();
					getProductsAndServicesForQuote();
				})
				.error(function (response) {
					console.log(response.msg);
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
						$('#fullTotal').val(total);
					});
				})
				.error(function (response) {
					console.log(response.msg);
				});
			}

			$scope.rows = [
			];

			$scope.saveQuote = function ()
			{
				var quoteData = $scope.quoteData;
				var quoteDataIds = $scope.quoteProductsIds;
				var sendData = new Object();
				for (i in quoteDataIds)
				{
					if (quoteData.hasOwnProperty('quantity_' + quoteDataIds[i]))
					{
						sendData[quoteDataIds[i]] = {
							'id': quoteDataIds[i],
							'price': quoteData['price_' + quoteDataIds[i]],
							'quantity': quoteData['quantity_' + quoteDataIds[i]]
						};
					}
				}
				var customerName = $scope.customerName;
				var customerTelephone = $scope.customerTelephone;
				var customerAddress = $scope.customerAddress;
				var printedId = $scope.quoteId;
				var dateTime = $scope.dateTime;

				var result = validateAddQuoteOnUpdate(sendData);

				if (result)
				{
					QuotesharpAPI.quote.save(sendData, customerName, customerTelephone, customerAddress, printedId, dateTime)
					.success(function (response, status) {
						clearQuoteInputs();
						$state.transitionTo('quote-view-all');
					})
					.error(function (response, status) {
						$scope.responseAlert = ResponseFunctions.displayFeedback(response, status);
					});
				}
				else
				{
					$scope.responseAlert = ResponseFunctions.displayFeedback({msg: 'Please enter quote data'}, 406);
				}


			};

			function designQuoteView()
			{
				$('#quote-category-area > ul > li ul').each(function (index, element) {
					var content = '<span class="cnt glyphicon glyphicon-hand-down"></span>';
					$(element).closest('li').children('a').append(content);
				});

				$('#quote-category-area > ul>li a').click(function () {

					var checkElement = $(this).next();

					$('#quote-category-area li').removeClass('active');
					$(this).closest('li').addClass('active');

					if ((checkElement.is('ul')) && (checkElement.is(':visible'))) {
						$(this).closest('li').removeClass('active');
						checkElement.slideUp('normal');
					}
					if ((checkElement.is('ul')) && (!checkElement.is(':visible'))) {
						checkElement.slideDown('normal');
					}

					if ($(this).closest('li').find('ul').children().length === 0) {
						return true;
					} else {
						return false;
					}

				});

			}

			function clearQuoteInputs()
			{
				$scope.customerName = null;
				$scope.customerTelephone = null;
				$scope.customerAddress = null;
				$scope.quoteId = null;
				$scope.sendData = null;
			}

			function validateAddQuoteOnUpdate(sendData)
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
					console.log(response, status);
				});
			}

		}]);
});

