define(['app'], function (app) {
	app
	.factory('QuotesharpAPI', [
		'$http',
		function (
		$http
		) {
			apiUrlBase = 'http://api.quotesharp.loc/';

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
					getCategoriesForQuote: function () {
						return $http.post(
						apiUrlBase + 'categories/get-categories-for-quote',
						{
							authToken: localStorage.authToken
						}
						);
					},
					updateCategory: function (categoryData) {
						return $http.post(
						apiUrlBase + 'categories/update-categories',
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
					save: function (sendData, customerName, customerTelephone, customerAddress, printedId, dateTime) {
						return $http.post(
						apiUrlBase + 'quote/save',
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
					getCustomers: function () {
						return $http.post(
						apiUrlBase + 'quote/get-customers',
						{
							authToken: localStorage.authToken
						}
						);
					},
					update: function (editQuoteId, sendData, customerName, customerTelephone, customerAddress, printedId, dateTime) {
						return $http.post(
						apiUrlBase + 'quote/update',
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
					get: function () {
						return $http.post(
						apiUrlBase + 'products-and-services/get',
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
					save: function (newProductCode, newProductName, newProductPrice, newProductDetails, newProductParent, newProductStatus) {
						return $http.post(
						apiUrlBase + 'products-and-services/save',
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
					update: function (updateData) {
						return $http.post(
						apiUrlBase + 'products-and-services/update',
						{
							authToken: localStorage.authToken,
							updateData: updateData
						}
						);
					},
					deleteProductOrService: function (productId) {
						return $http.post(
						apiUrlBase + 'products-and-services/delete-product',
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