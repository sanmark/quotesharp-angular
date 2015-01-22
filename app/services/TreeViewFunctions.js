define(['app'], function (app) {
	app
	.factory('TreeViewFunctions', [
		function () {
			return {
				buildTreeView: function (parent, category, editButtons)
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
								if (editButtons === true)
								{
									html += "<li id='row_" + category['categories'][cat_id]['id'] + "'><a href='javascript:void(0)'><span>" + category['categories'][cat_id]['name'] + "</span></a><button class='editButton btn btn-warning' data-toggle='modal' data-target='#editCategoryModal_" + category['categories'][cat_id]['id'] + "'>Edit</button></li>";
								}
								else
								{
									html += "<li id='row_" + category['categories'][cat_id]['id'] + "'><a href='javascript:void(0)'><span>" + category['categories'][cat_id]['name'] + "</span></a></li>";
								}

							}

							if (typeof category['parent_cats'][cat_id] !== 'undefined')
							{

								if (editButtons === true)
								{
									html += "<li id='row_" + category['categories'][cat_id]['id'] + "'><a href='javascript:void(0)'><span>" + category['categories'][cat_id]['name'] + "</span></a>";
									html += this.buildTreeView(cat_id, category, true);
									html += "<button class='editButton btn btn-warning' data-toggle='modal' data-target='#editCategoryModal_" + category['categories'][cat_id]['id'] + "'>Edit</button></li>";
								}
								else
								{
									html += "<li id='row_" + category['categories'][cat_id]['id'] + "'><a href='javascript:void(0)'><span>" + category['categories'][cat_id]['name'] + "</span></a>";
									html += this.buildTreeView(cat_id, category);
									html += "</li>";
								}

							}
						}
						html += "</ul>";
					}
					return html;
				},
				designTreeView: function ()
				{
					$('#quote-category-area > ul > li ul').each(function (index, element) {
						var content = '<span class="cnt glyphicon glyphicon-plus"></span>';
						$(element).closest('li').children('a').append(content);
					});

					$('#quote-category-area > ul>li a').click(function () {

						var checkElement = $(this).next();

						$('#quote-category-area li').removeClass('active');
						$(this).closest('li').addClass('active');

						if ((checkElement.is('ul')) && (checkElement.is(':visible'))) {
							$(this).closest('li').removeClass('active');
							$(this).find(".cnt");
							$(this).find(".cnt").removeClass('glyphicon-minus');
							$(this).find(".cnt").addClass('glyphicon-plus');
							checkElement.slideUp('normal');
						}
						if ((checkElement.is('ul')) && (!checkElement.is(':visible'))) {
							$(this).find(".cnt").removeClass('glyphicon-plus');
							$(this).find(".cnt").addClass('glyphicon-minus');
							checkElement.slideDown('normal');
						}

						if ($(this).closest('li').find('ul').children().length === 0) {
							return true;
						} else {
							return false;
						}

					});

				}
			};
		}
	]);
});

