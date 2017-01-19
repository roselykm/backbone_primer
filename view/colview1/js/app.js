$(function(){
	window.App = {
		Models: {},
		Collections: {},
		Views: {}
	};

	App.Models.Food = Backbone.Model.extend({
	});

	App.Collections.Foods = Backbone.Collection.extend({
		model: App.Models.Food
	});

	App.Views.Food = Backbone.View.extend({
		tagName: 'li',

		render: function() {
			//load the template using underscore
			var template = _.template( $("#foodTemplate").html() );

			//assign json data to template and asign template to the view EL: 'li'
			this.$el.html( template( this.model.toJSON() ) );

			return this;
		}
	});	

	App.Views.Foods = Backbone.View.extend({
		tagName: 'ul',

		initialize: function() {
			this.collection.on('add', this.addOne, this);
		},

		render: function() {
			this.collection.each(this.addOne, this);

			return this;
		},

		addOne: function(food) {
			//create single view based on the model
			var foodView = new App.Views.Food({ model: food });

			//append the single view to the collection view
			this.$el.append(foodView.render().el);
		}
	});	

	var food1 = new App.Models.Food({
    	name: 'nasi',
		price: 2.50
  	});

  	var food2 = new App.Models.Food({
    	name: 'steak',
			price: 2.99
  	});

  	var food3 = new App.Models.Food({
    	name: 'mee',
		price: 1.20
  	});

  	var foodsCollection = new App.Collections.Foods([food1, food2, food3]);

	var foodsView = new App.Views.Foods({ collection: foodsCollection });
	$('#foodlist').html(foodsView.render().el);
});	