define(['app', 'jquery', 'QuotesharpAPI', 'services/ResponseFunctions', 'services/TreeViewFunctions'], function (app, $) {
	app
	.controller('CategoryController', [
		'$scope',
		'$location',
		'$compile',
		'QuotesharpAPI',
		'ResponseFunctions',
		'TreeViewFunctions',
		function (
		$scope,
		$location,
		$compile,
		QuotesharpAPI,
		ResponseFunctions,
		TreeViewFunctions
		) {
			if (!localStorage.authenticated) {
				$location.path('/login');
			}

			getCategoriesForHtmlSelect();
			getCategoriesForQuote();
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
					$scope.categories = response.data['categories'];
					if ($scope.quoteCategories['categories'].length === 0)
					{
						$scope.responseAlert = ResponseFunctions.displayFeedback({"msg": ["No categories,Please add categories"]}, 406);
					}
					else
					{
						var appendData = TreeViewFunctions.buildTreeView(0, $scope.quoteCategories, true);
						$('#quote-category-area').append($compile(appendData)($scope));
						TreeViewFunctions.designTreeView();
					}

				})
				.error(function () {

				});
			}

			$scope.saveNewCategory = function (newCategoryName, newCategoryDetails, parentCategory) {
				if (parentCategory === undefined || newCategoryName === undefined)
				{
					$scope.responseAlert = ResponseFunctions.displayFeedback({"msg": ["Please fill input fields"]},406);
					return false;
				}
				QuotesharpAPI.categories.saveNewCategory(newCategoryName, newCategoryDetails, parentCategory)
				.success(function (response, status) {
					clearNewCategoryInputs();
					$('#quote-category-area').empty();
					getCategoriesForQuote();
					getCategoriesForHtmlSelect();
					$scope.responseAlert = ResponseFunctions.displayFeedback(response, status);
				})
				.error(function (response, status) {
					$scope.responseAlert = ResponseFunctions.displayFeedback(response, status);
				});
			};

			$scope.updateCategory = function (categoryData) {
				QuotesharpAPI.categories.updateCategory(categoryData)
				.success(function (response, status) {
					$('#quote-category-area').empty();
					getCategoriesForQuote();
					getCategoriesForHtmlSelect();
					$scope.responseAlert = ResponseFunctions.displayFeedback(response, status);
				})
				.error(function (response, status) {
					$scope.responseAlert = ResponseFunctions.displayFeedback(response, status);
				});

			};

			function getCategoriesForHtmlSelect() {
				QuotesharpAPI.categories.getCategoriesForHtmlSelect()
				.success(function (response) {
					$scope.htmlCategories = response.data;
					
				})
				.error(function (response) {

				});
			}

			function clearNewCategoryInputs() {
				$scope.newCategoryName = null;
				$scope.newCategoryDetails = null;
				$scope.parentCategory = null;
			}

			$scope.deleteCategory = function (categoryId) {

				QuotesharpAPI.categories.deleteCategory(categoryId)
				.success(function (response, status) {
					$('#quote-category-area').empty();
					getCategoriesForQuote();
					getCategoriesForHtmlSelect();
					$scope.responseAlert = ResponseFunctions.displayFeedback(response, status);
				})
				.error(function (response, status) {
					$scope.responseAlert = ResponseFunctions.displayFeedback({"msg": ["Failed to delete category"]}, status);
				});
			};

		}]);
});

