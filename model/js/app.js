$(function(){
  /*
  var book1 = new App.Models.Book();
  console.log("Book1");
  console.log(book1.toJSON());
  console.log("");
  //*/

  /*
  book1.set({
    isbn: "isbn456",
    title: "night world",
    author: "jane doe"
  });

  console.log("Book1 updated");
  console.log(book1.toJSON());
  console.log(book1.get("isbn"));
  console.log("");
  //*/

  //////////////////////////////////////////////////////////////////////

  /*
  var book2 = new App.Models.Book({
    isbn: "isbn999",
    title: "kingkiller chronicle",
    author: "patrick rothfuss"
  });  

  console.log("Book2");
  console.log(book2.toJSON());
  console.log("");

  console.log(book2.get("title"));
  book2.set("title", "new title");
  console.log(book2.toJSON());
  console.log("");
  //*/

  ///////////////////////////////////////////////////////////////////////

  /*
  var book3 = new App.Models.Book({
    isbn: "isbn321",
    title: "the sun",
    author: "john doe",
    publisher: "tor",
    publishdate: "2015-10-07",
    price: "9.00"
  });

  console.log("Book3");
  console.log(book3.toJSON());
  console.log("");
  //*/


  //REST operation INSERT ////////////////////////////////////////////////
  //insert - OK
  /*
  var saveBook = new App.Models.Book();
  saveBook.save(book1, {
    success: function (book) {
      book1 = book;
      var id = book1.get("id")
      console.log("book sync/saved/insert to database with a return id: " + id);
      console.log(book1.toJSON());
      console.log("");
    }
  })

  //book1.save(); //this will not have ID from server
  //console.log(book1.toJSON());
  //*/  

  //REST operation SINGLE FETCH AND UPDATE /////////////////////////////////
  // single fetch: $app->get('/books/:id', 'getBookById'); //get SINGLE book VIA id
  /*
  //create model with the id to fetch with AJAX callback for update
  //
  // new model with ID  
  var updateBook = new App.Models.Book({id: '4'});
  //
  // fetch the model using the ID
  updateBook.fetch({
      wait: true,
      success: function(book){
        console.log(book.toJSON());

        //using the fetch callback, update the model at the backend
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
      },
      error: function(e){
          console.log('Something went wrong with the collection fetch');
      }
  });
  //*/

  // not working because of async
  // must use callback
  /*
  var myBook = new App.Models.Book({id: '???'});
  myBook.fetch();
  console.log(myBook.get("title"));
  //*/

  //REST operation DELETE ////////////////////////////////////////////////
  //
  /*
  var deleteBook = new App.Models.Book({id: '4'});
  deleteBook.destroy({
      wait: true,
      success: function(model, response, options){
          console.log('delete status: ' + response.status);
      },
      error: function(model, xhr, options) {
          console.log('An error occured while deleting data...');
      }
  });
  /*/  

  
  //Collection /////////////////////////////////////////////////
  //
  //ADD MODEL TO COLLECTION AND AUTO BACKEND SYNC
  /*  
  var library = new App.Collections.Books([book1, book2, book3]);
  for(var i = 0; i < library.length; i++)
  {
    var currentBook = library.at(i);
    
    //display to console
    console.log(currentBook.toJSON());
    console.log("");

    //sync to database start
    var saveBook = new App.Models.Book();
    saveBook.save(currentBook, {
      success: function (insertedbook) {
        currentBook = insertedbook;
        var id = currentBook.get("id")
        console.log("book sync/saved/insert to database with a return id: " + id);
        console.log(currentBook.toJSON());
        console.log("");
      }
    })  
    //sync to database end
  }
  //*/

  //FETCH COLLECTION
  /*
  var library = new App.Collections.Books();

  library.fetch({
    wait: true,
    success: function(e){
      console.log('Got data from database using REST. Collection now has ' + library.size() + ' books');

      for(var i = 0; i < library.length; i++)
      {
        var book = library.at(i);
        console.log(book.toJSON());
      }
    },
    error: function(e){
      console.log('Something went wrong with the collection fetch');
    }
  });  
  //*/
  
  //COLLECTION SEARCH
  //NEED A DIFFERENT COLLECTION BECAUSE OF THE RESTFUL URL DIFFERENCES
  /*
  var librarySearch = new App.Collections.BooksSearch();

  var search_params = {
    'isbn': 'isbn123',
    'title': 'The Way of Kings',
    'author': 'Brandon Sanderson'
  };

  librarySearch.fetch({
    wait: true,
    data: $.param(search_params),
    success: function(e){

        console.log('Search returning ' + librarySearch.size() + ' books');
        for(var i = 0; i < librarySearch.length; i++){
            var book = librarySearch.at(i);
            console.log(book.get("isbn") + " | " + book.get("title"))
        }
    },
    error: function(e){
        console.log('Something went wrong with the collection fetch');
    }
  });
  //*/
  
});