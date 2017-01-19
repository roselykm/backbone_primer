Backbone Model

declaration

  window.App = {
      Models: {},
      Collections: {}
  };

  App.Models.Book = Backbone.Model.extend({
   	urlRoot: '../bbmodel/api/books',

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

  //urlRoot - RESTFul API location - relative address
  //default - optional
  //initialize - optional

create

  var book1 = new App.Models.Book();

setter

  //multi
  book1.set({
    isbn: "isbn456",
    title: "night world",
    author: "jane doe"
  });

  //single setter	
  book1.set("title", "new title");

getter

  var isbn = book1.get("isbn");

  //toJSON
  console.log(book1.toJSON());

////////////////////////////////////////////////////////////////////////
//REST operation INSERT ////////////////////////////////////////////////

//create empty model first
var saveBook = new App.Models.Book();

//use empty model to do RESTFul POST (save) using the model that
//need to be saved as parameter
//the operation got a callback with new model inserted return and with ID

  saveBook.save(book1, {
    success: function (book) {
      book1 = book;
      console.log(book1.toJSON());
    }
  })

//calling save directly will not work
book1.save(); //this will not have ID from server


///////////////////////////////////////////////////////////////////////
//REST operation UPDATE (for existing record with id) /////////////////
//updateBook is an existing model with id
//for example a model from a data table (single row)
//operation got callback which return the new updated model

        updateBook.save({
          isbn: "isbn789",
          title: "day world",
          author: "john doe"
        }, {
          //another callback if put is successful, display the model
          success: function (book) {
            console.log(book.toJSON());
          }
        });

////////////////////////////////////////////////////////////////////////
//REST operation DELETE ////////////////////////////////////////////////
//deleteBook is an existing model with id
//for example a model from a data table (single row)
//operation got callback which return the DELETE status

  var deleteBook = new App.Models.Book({id: '???'});
  deleteBook.destroy({
      wait: true,
      success: function(model, response, options){
          console.log('delete status: ' + response.status);
      },
      error: function(model, xhr, options) {
          console.log('An error occured while deleting data...');
      }
  });

////////////////////////////////////////////////////////////////////////
//REST operation GET ///////////////////////////////////////////////////
//FETCH operation for Backbone Collection


