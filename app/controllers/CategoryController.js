define(['app', 'jquery', 'QuotesharpAPI', 'services/ResponseFunctions'], function (app, $) {
	app
	.controller('CategoryController', [
		'$scope',
		'$location',
		'$compile',
		'QuotesharpAPI',
		'ResponseFunctions',
		function (
		$scope,
		$location,
		$compile,
		QuotesharpAPI,
		ResponseFunctions
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
							html += "<li id='row_" + category['categories'][cat_id]['id'] + "'><a href='javascript:void(0)'><span>" + category['categories'][cat_id]['name'] + "</span></a><button class='editButton btn btn-warning' data-toggle='modal' data-target='#myModal_" + category['categories'][cat_id]['id'] + "'>Edit</button></li>";
						}

						if (typeof category['parent_cats'][cat_id] !== 'undefined')
						{
							html += "<li id='row_" + category['categories'][cat_id]['id'] + "'><a href='javascript:void(0)'><span>" + category['categories'][cat_id]['name'] + "</span></a>";
							html += buildCategory(cat_id, category);
							html += "<button class='editButton btn btn-warning' data-toggle='modal' data-target='#myModal_" + category['categories'][cat_id]['id'] + "'>Edit</button></li>";
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
					$scope.categories = response.data['categories'];
					if ($scope.quoteCategories['categories'].length === 0)
					{
						$scope.responseAlert = ResponseFunctions.displayFeedback({"msg": ["No categories,Please add categories"]}, 406);
					}
					else
					{
						var appendData = buildCategory(0, $scope.quoteCategories);
						$('#quote-category-area').append($compile(appendData)($scope));
						designQuoteView();
					}

				})
				.error(function (response) {
					console.log(response.msg);
				});
			}

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

			$scope.saveNewCategory = function (newCategoryName, newCategoryDetails, parentCategory) {
				if (parentCategory === undefined || newCategoryName === undefined)
				{
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
					console.log(response.msg);
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
					$scope.responseAlert = ResponseFunctions.displayFeedback(response, status);
				});
			};

		}]);
});

