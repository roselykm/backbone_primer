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
		tagName: 'tr',

		initialize: function() {
			this.model.on('change', this.render, this);
			this.model.on('destroy', this.remove, this);
		},

		render: function() {

			//load the template using underscore
			//foodTemplate is td
			var template = _.template( $("#foodTemplate").html() );

			//assign json data to template and asign template to the view EL: 'tr'
			this.$el.html( template( this.model.toJSON() ) );

			return this;
		},

		events: {
			'click .delete': 'destroy',
			'click .edit': 'editFood'
		},

		destroy: function() {
			this.model.destroy();
			//trigger destroy event in model
		},

		remove: function() {
			this.$el.fadeOut(500, function() {
        		this.remove();
    		});
		},

		editFood: function() {			
			var newFoodTitle = prompt('What would you like to change the text to?', this.model.get('name'));			

			if (newFoodTitle)
			{	
				this.model.set('name', newFoodTitle);
				//trigger change event in model
			}
		}
	});	

	App.Views.Foods = Backbone.View.extend({
		tagName: 'tbody',

		initialize: function() {
			this.collection.on('add', this.addOne, this);
		},

		render: function() {
			this.collection.each(this.addOne, this);

			return this;
		},

		addOne: function(food) {
			var foodView = new App.Views.Food({ model: food });
			this.$el.append(foodView.render().el);
		}
	});	

	App.Views.AddFood = Backbone.View.extend({

		render: function() {
			var template = _.template( $("#addFoodTemplate").html() );
			this.$el.html(template);
			return this;
		},

		events: {
			'click #submit': 'addFood'
		},

		addFood: function(e) {
			e.preventDefault();

			var foodName = $('input[id=name]').val();
			var foodPrice = $('input[id=price]').val();
			console.log(foodPrice);

			var food = new App.Models.Food({ name: foodName, price: foodPrice });

			//trigger add event in collection
			foodsCollection.add(food); 
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
	$('#foodlist').append(foodsView.render().el);

	var addFoodView = new App.Views.AddFood();
	$('#addfood').html(addFoodView.render().el);
});	