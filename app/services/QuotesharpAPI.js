define(['app'], function (app) {
	app
	.factory('QuotesharpAPI', [
		'$http', '$rootScope',
		function (
		$http, $rootScope
		) {
			$rootScope.currencyFormat = "LKR ";
			apiUrlBase = 'http://api-quotesharp.sapps.io/';

			return {
				auth: {
					login: function (username, password, organization) {
						return $http.post(
						apiUrlBase + 'auth/login',
						{
							username: username,
							password: password,
							organization: organization
						}
						);
					},
					logout: function () {
						return $http.post(
						apiUrlBase + 'auth/logout',
						{
							authToken: localStorage.authToken
						}
						);
					}
				},
				categories: {
					getCategories: function () {
						return $http.post(
						apiUrlBase + 'categories/get-categories',
						{
							authToken: localStorage.authToken
						}
						);
					},
					getCategoriesForHtmlSelect: function () {
						return $http.post(
						apiUrlBase + 'categories/get-categories-for-html-select',
						{
							authToken: localStorage.authToken
						}
						);
					},
					saveNewCategory: function (newCategoryName, newCategoryDetails, parentCategory) {
						return $http.post(
						apiUrlBase + 'categories/save-new-category',
						{
							authToken: localStorage.authToken,
							authUserId: localStorage.userId,
							categoryName: newCategoryName,
							categoryDetails: newCategoryDetails,
							parentCategory: parentCategory
						}
						);
					},
					getCategoriesForTreeView: function () {
						return $http.post(
						apiUrlBase + 'categories/get-categories-for-tree-view',
						{
							authToken: localStorage.authToken
						}
						);
					},
					updateCategory: function (categoryData) {
						return $http.post(
						apiUrlBase + 'categories/update-category',
						{
							authToken: localStorage.authToken,
							updateData: categoryData
						}
						);
					},
					deleteCategory: function (categoryId) {
						return $http.post(
						apiUrlBase + 'categories/delete-category',
						{
							authToken: localStorage.authToken,
							categoryId: categoryId
						}
						);
					}
				},
				quote: {
					saveQuote: function (sendData, customerName, customerTelephone, customerAddress, printedId, dateTime) {
						return $http.post(
						apiUrlBase + 'quote/save-quote',
						{
							authToken: localStorage.authToken,
							quoteData: sendData,
							customer_name: customerName,
							customer_telephone: customerTelephone,
							customer_address: customerAddress,
							printed_id: printedId,
							date_time: dateTime
						}
						);
					},
					getQuotesTotal: function () {
						return $http.post(
						apiUrlBase + 'quote/get-quotes-total',
						{
							authToken: localStorage.authToken
						}
						);
					},
					getCustomers: function () {
						return $http.post(
						apiUrlBase + 'quote/get-customers',
						{
							authToken: localStorage.authToken
						}
						);
					},
					updateQuote: function (editQuoteId, sendData, customerName, customerTelephone, customerAddress, printedId, dateTime) {
						return $http.post(
						apiUrlBase + 'quote/update-quote',
						{
							authToken: localStorage.authToken,
							edit_quote_id: editQuoteId,
							quoteData: sendData,
							customer_name: customerName,
							customer_telephone: customerTelephone,
							customer_address: customerAddress,
							printed_id: printedId,
							date_time: dateTime
						}
						);
					},
					getQuotes: function () {
						return $http.post(
						apiUrlBase + 'quote/get-quotes',
						{
							authToken: localStorage.authToken,
						}
						);
					},
					getBasicQuoteData: function (editQuoteId) {
						return $http.post(
						apiUrlBase + 'quote/get-basic-quote-data',
						{
							authToken: localStorage.authToken,
							quote_id: editQuoteId
						}
						);
					},
					getQuoteProductsAndServicesData: function (editQuoteId) {
						return $http.post(
						apiUrlBase + 'quote/get-quote-products-and-services-data',
						{
							authToken: localStorage.authToken,
							quote_id: editQuoteId
						}
						);
					},
					deleteQuote: function (quoteId) {

						return $http.post(
						apiUrlBase + 'quote/delete-quote',
						{
							authToken: localStorage.authToken,
							quote_id: quoteId
						}
						);
					}
				},
				productsAndServices: {
					getAllProductsAndServices: function () {
						return $http.post(
						apiUrlBase + 'products-and-services/get-all-products-and-services',
						{
							authToken: localStorage.authToken,
						}
						);
					},
					getActiveProductsAndServices: function () {
						return $http.post(
						apiUrlBase + 'products-and-services/get-active-products-and-services',
						{
							authToken: localStorage.authToken,
						}
						);
					},
					saveNewProductOrService: function (newProductCode, newProductName, newProductPrice, newProductDetails, newProductParent, newProductStatus) {
						return $http.post(
						apiUrlBase + 'products-and-services/save-new-product-or-service',
						{
							authToken: localStorage.authToken,
							productCode: newProductCode,
							productName: newProductName,
							productPrice: newProductPrice,
							productDetails: newProductDetails,
							productParent: newProductParent,
							productStatus: newProductStatus
						}
						);
					},
					updateProductOrService: function (updateData) {
						return $http.post(
						apiUrlBase + 'products-and-services/update-product-or-service',
						{
							authToken: localStorage.authToken,
							productId: updateData.id,
							productCode: updateData.code,
							productName: updateData.name,
							productPrice: updateData.price,
							productDetails: updateData.details,
							productParent: updateData.parent_id,
							productStatus: updateData.is_active
						}
						);
					},
					deleteProductOrService: function (productId) {
						return $http.post(
						apiUrlBase + 'products-and-services/delete-product-or-service',
						{
							authToken: localStorage.authToken,
							productId: productId
						}
						);
					}

				}
			};
		}
	]);
});