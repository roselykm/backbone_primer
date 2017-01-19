$(function(){
	window.App = {
		Models: {},
		Collections: {},
		Views: {}
	};

	App.Models.Food = Backbone.Model.extend({
		urlRoot: '../colview3/api/food'
	});

	App.Collections.Foods = Backbone.Collection.extend({
		url: '../colview3/api/food',

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
			//this.model.destroy();

			//*
			this.model.destroy({
				wait: true,
				success: function(model, response, options){
				},
				error: function(model, xhr, options) {
					console.log('An error occured while deleting data...');
				}
			});			
			//*/

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

				this.model.save({name: newFoodTitle}, {
					wait: true,
					success: function(model, response, options){
					},
					error: function(model, xhr, options) {
						console.log('An error occured while saving the data...');
					}
				});				
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

			var foodDetail = new App.Models.Food({ name: foodName, price: foodPrice });

			var newFood = new App.Models.Food();
			newFood.save(foodDetail, {
				success: function(model, response, options) {
					//trigger add event in collection
					foodsCollection.add(model);
				},
				error: function(model, xhr, options) {
					console.log('An error occured while saving the data...');
				}
			});	
		}
	});

  	var foodsCollection = new App.Collections.Foods();

  	//fetch record from db
   	foodsCollection.fetch({
    	wait: true,
		success: function(e){
			console.log('Got data from database using REST. Collection now has ' + foodsCollection.size() + ' foods');

			var foodsView = new App.Views.Foods({ collection: foodsCollection });
			$('#foodlist').append(foodsView.render().el);
		},
		error: function(e){
			console.log('Something went wrong with the collection fetch');
		}
	}); 
	//*/	

	var addFoodView = new App.Views.AddFood();
	$('#addfood').html(addFoodView.render().el);
});	