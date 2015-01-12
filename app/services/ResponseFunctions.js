define(['app'], function (app) {
	app
	.factory('ResponseFunctions', [
		function () {
			return {
				displayFeedback: function (response, status) {
					if (status === 200)
					{
						var successful = {
							alertHidden: false,
							customAlert: 'alert-success',
							feedback: response.msg
						};
						return successful;
					}
					else
					{
						var unsuccessful = {
							alertHidden: false,
							customAlert: 'alert-danger',
							feedback: response.msg
						};

						return unsuccessful;
					}

				}
			};
		}
	]);
});

