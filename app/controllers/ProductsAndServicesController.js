define(['app', 'jquery', 'QuotesharpAPI', 'services/ResponseFunctions'], function (app, $) {
	app
	.controller('ProductsAndServicesController', [
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
			getProductsAndServices();
			getCategoriesForHtmlSelect();
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


			function getProductsAndServices()
			{
				QuotesharpAPI.productsAndServices.get()
				.success(function (response) {
					$scope.productsAndServices = response.data;
				})
				.error(function (response) {
					console.log(response.msg);
				});
			}

			function getCategoriesForHtmlSelect() {
				QuotesharpAPI.categories.getCategoriesForHtmlSelect()
				.success(function (response) {
					$scope.htmlCategories = response.data;
				})
				.error(function (response) {
					console.log(response.msg);
				});
			}

			$scope.saveNewProduct = function (newProductCode, newProductName, newProductPrice, newProductDetails, newProductParent)
			{
				QuotesharpAPI.productsAndServices.save(newProductCode, newProductName, newProductPrice, newProductDetails, newProductParent)
				.success(function (response, status) {
					clearNewProductInputs();
					getCategoriesForHtmlSelect();
					getProductsAndServices();
					$scope.responseAlert = ResponseFunctions.displayFeedback(response, status);
				})
				.error(function (response, status) {
					$scope.responseAlert = ResponseFunctions.displayFeedback(response, status);
				});
			};

			$scope.update = function () {
				var updateData = $scope.productsAndServices;
				QuotesharpAPI.productsAndServices.update(updateData)
				.success(function (response, status) {
					getProductsAndServices();
					getCategoriesForHtmlSelect();
					$scope.responseAlert = ResponseFunctions.displayFeedback(response, status);
				})
				.error(function (response, status) {
					$scope.responseAlert = ResponseFunctions.displayFeedback(response, status);
				});
			};
			function clearNewProductInputs() {
				$scope.newProductCode = null;
				$scope.newProductName = null;
				$scope.newProductPrice = null;
				$scope.newProductDetails = null;
				$scope.newProductParent = null;
			}

			$scope.deleteProduct = function (productId, productName)
			{

				var result = confirm('Deleting "' + productName + '" will delete this item from all quotes.\n\nAre you sure to delete "' + productName + '" ?');
				if (result === false)
				{
					return false;
				}

				QuotesharpAPI.productsAndServices.deleteProductOrService(productId)
				.success(function (response, status) {
					getProductsAndServices();
					getCategoriesForHtmlSelect();
					$scope.responseAlert = ResponseFunctions.displayFeedback(response, status);
				})
				.error(function (response, status) {
					$scope.responseAlert = ResponseFunctions.displayFeedback(response, status);
				});
			};
		}]);
});

