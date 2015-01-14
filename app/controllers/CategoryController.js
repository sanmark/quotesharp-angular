define(['app', 'QuotesharpAPI', 'services/ResponseFunctions'], function (app) {
	app
	.controller('CategoryController', [
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

			getCategories();
			getCategoriesForHtmlSelect();
			$scope.responseAlert = {};
			$scope.responseAlert.alertHidden = true;

			$scope.logout = function () {
				QuotesharpAPI.auth.logout()
				.success(function () {
					localStorage.clear();

					$location.path('/login');
				});
			};


			$scope.saveNewCategory = function (newCategoryName, newCategoryDetails, parentCategory) {
				if (parentCategory === undefined || newCategoryName === undefined)
				{
					return false;
				}
				QuotesharpAPI.categories.saveNewCategory(newCategoryName, newCategoryDetails, parentCategory)
				.success(function (response, status) {
					clearNewCategoryInputs();
					getCategories();
					getCategoriesForHtmlSelect();
					$scope.responseAlert = ResponseFunctions.displayFeedback(response, status);
				})
				.error(function (response, status) {
					$scope.responseAlert = ResponseFunctions.displayFeedback(response, status);
				});
			};

			$scope.updateCategories = function () {
				var categoriesData = $scope.categories;
				QuotesharpAPI.categories.updateCategories(categoriesData)
				.success(function (response, status) {
					getCategories();
					getCategoriesForHtmlSelect();
					$scope.responseAlert = ResponseFunctions.displayFeedback(response, status);
				})
				.error(function (response, status) {
					$scope.responseAlert = ResponseFunctions.displayFeedback(response, status);
				});

			};

			function getCategories() {
				QuotesharpAPI.categories.getCategories()
				.success(function (response) {
					$scope.categories = response.data;
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

			function clearNewCategoryInputs() {
				$scope.newCategoryName = null;
				$scope.newCategoryDetails = null;
				$scope.parentCategory = null;
			}

			$scope.deleteCategory = function (categoryId, categoryName) {

				var result = confirm('Deleteing this will set all child products,categories in "' + categoryName + '" category to its parent category.\n\nAre you sure to delete "' + categoryName + '" category ?');
				if (result === false)
				{
					return false;
				}
				QuotesharpAPI.categories.deleteCategory(categoryId)
				.success(function (response, status) {
					getCategories();
					getCategoriesForHtmlSelect();
					$scope.responseAlert = ResponseFunctions.displayFeedback(response, status);
				})
				.error(function (response, status) {
					$scope.responseAlert = ResponseFunctions.displayFeedback(response, status);
				});
			};
			
		}]);
});

