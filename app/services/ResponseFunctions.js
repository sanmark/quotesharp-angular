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
						var list = "";
						for (i in response.msg)
						{
							list += response.msg[i]+' , ';
						}

						var unsuccessful = {
							alertHidden: false,
							customAlert: 'alert-danger',
							feedback: list
						};
						return unsuccessful;
					}

				}
			};
		}
	]);
});

