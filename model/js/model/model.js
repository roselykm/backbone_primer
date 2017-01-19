$(function(){
  window.App = {
      Models: {},
      Collections: {}
  };

	//models
  App.Models.Book = Backbone.Model.extend({
   	urlRoot: '../model/api/books',

   	defaults: {
  		isbn: 'isbn0000',
  		title: "the book",
  		author: 'john doe',
  		publisher: "the company",
  		publishdate: "2015-10-01",
  		price: "1.00"
		},

   	initialize: function(){
      	console.log("New book created!");
  	}
  });

  //collection all
  App.Collections.Books = Backbone.Collection.extend({

    url: '../model/api/books',

    model: App.Models.Book
  });
   
  //collection search
  App.Collections.BooksSearch = Backbone.Collection.extend({

    url: '../model/api/search',

    model: App.Models.Book
  });   
});