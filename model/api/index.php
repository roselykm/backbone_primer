<?php
/**
 * Step 1: Require the Slim Framework
 *
 * If you are not using Composer, you need to require the
 * Slim Framework and register its PSR-0 autoloader.
 *
 * If you are using Composer, you can skip this step.
 */
require 'Slim/Slim.php';

//class Book
class Book
{
    var $id;
    var $isbn;
    var $title;
    var $author;
    var $publisher;
    var $publishdate;
    var $price;
}

function getConnection() {
    $dbhost="127.0.0.1";
    $dbuser="root";
    $dbpass="";
    $dbname="frontend";
    $dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);
    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  $dbh->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
    return $dbh;
}

\Slim\Slim::registerAutoloader();

/**
 * Step 2: Instantiate a Slim application
 *
 * This example instantiates a Slim application using
 * its default settings. However, you will usually configure
 * your Slim application now by passing an associative array
 * of setting names and values into the application constructor.
 */
$app = new \Slim\Slim();

/**
 * Step 3: Define the Slim application routes
 *
 * Here we define several Slim application routes that respond
 * to appropriate HTTP request methods. In this example, the second
 * argument for `Slim::get`, `Slim::post`, `Slim::put`, and `Slim::delete`
 * is an anonymous function.
 */

// GET - select all books
function getBooks()
{
  $sql = "SELECT *
          FROM books
          ORDER BY id";

  try
  {
    $db = getConnection();

    //no need to prepare, cause no data from users
    $stmt = $db->query($sql);
    $stmt->execute();
    $row_count = $stmt->rowCount();

    if ( count($row_count) )
    {
      //books collection
      $books = array();

      while($row = $stmt->fetch(PDO::FETCH_ASSOC)) 
      {
        //create Book object
        //put book data in Model (Book Object)
        $book = new Book();
        $book->id = $row['id'];
        $book->isbn = $row['isbn'];
        $book->title = $row['title'];
        $book->author = $row['author'];
        $book->publisher = $row['publisher'];
        $book->publishdate = $row['publishdate'];
        $book->price = $row['price'];

        array_push($books, $book);
      }

      $db = null;
      echo json_encode($books);
    }
    else
    {
      $db = null;
      $books = array();
      echo json_encode($books);
    }
  }
  catch(PDOException $e)
  {
    echo '{"error":{"text":'. $e->getMessage() .'}}';
  }
}
$app->get('/books', 'getBooks'); //get all books

// GET - SELECT book by id
function getBookById($id)
{
  $sql = "SELECT *
          FROM books WHERE id = :id";
  try
  {
    $db = getConnection();
    $stmt = $db->prepare($sql);
    $stmt->bindParam("id", $id);
    $stmt->execute();

    $row_count = $stmt->rowCount();

    if (count($row_count))
    {
      while($row = $stmt->fetch(PDO::FETCH_ASSOC)) 
      {
        //create Book object
        //put book data in Model (Book Object)
        $book = new Book();
        $book->id = $row['id'];
        $book->isbn = $row['isbn'];
        $book->title = $row['title'];
        $book->author = $row['author'];
        $book->publisher = $row['publisher'];
        $book->publishdate = $row['publishdate'];
        $book->price = $row['price'];

        $db = null;
        echo json_encode($book);
      }
    }
    else
    {
      $db = null;
      echo json_encode(array());
    }
  }
  catch(PDOException $e)
  {
    echo '{"error":{"text":'. $e->getMessage() .'}}';
  }
}
$app->get('/books/:id', 'getBookById'); //get SINGLE book VIA id

function bookSearch()
{
  $request = \Slim\Slim::getInstance()->request();
  $isbn = $request->params('isbn');
  $title = $request->params('title');
  $author = $request->params('author');

  //debugging
  //$info = "$isbn - $title - $author";
  //$file = 'params.txt';
  //file_put_contents($file, $info);

  $sql = "SELECT *
          FROM books
          WHERE isbn = :isbn
          AND title = :title
          AND author = :author
          ORDER BY id";

  try
  {
    $db = getConnection();

    $db = getConnection();
    $stmt = $db->prepare($sql);
    $stmt->bindParam("isbn", $isbn);
    $stmt->bindParam("title", $title);
    $stmt->bindParam("author", $author);
    $stmt->execute();
    $row_count = $stmt->rowCount();

    if ( count($row_count) )
    {
      //books collection
      $books = array();

      while($row = $stmt->fetch(PDO::FETCH_ASSOC)) 
      {
        //create Book object
        //put book data in Model (Book Object)
        $book = new Book();
        $book->id = $row['id'];
        $book->isbn = $row['isbn'];
        $book->title = $row['title'];
        $book->author = $row['author'];
        $book->publisher = $row['publisher'];
        $book->publishdate = $row['publishdate'];
        $book->price = $row['price'];

        array_push($books, $book);
      }

      $db = null;
      echo json_encode($books);
    }
    else
    {
      $db = null;
      $books = array();
      echo json_encode($books);
    }
  }
  catch(PDOException $e)
  {
    echo '{"error":{"text":'. $e->getMessage() .'}}';
  }
}
$app->get('/search', 'bookSearch'); //bookSearch


//POST - INSERT book
function insertBook() {
  $request = \Slim\Slim::getInstance()->request();
  $book = json_decode($request->getBody());
  $sql = "INSERT INTO books (isbn, title, author, publisher, publishdate, price)
          VALUES (:isbn, :title, :author, :publisher, :publishdate, :price)";

  try
  {
    $db = getConnection();
    $stmt = $db->prepare($sql);
    $stmt->bindParam("isbn", $book->isbn);
    $stmt->bindParam("title", $book->title);
    $stmt->bindParam("author", $book->author);
    $stmt->bindParam("publisher", $book->publisher);
    $stmt->bindParam("publishdate", $book->publishdate);
    $stmt->bindParam("price", $book->price);
    $stmt->execute();
    $id = $db->lastInsertId();

    $db = null;

    $newBook = Array(
      "id" => $id,
      "isbn" => $book->isbn,
      "title" => $book->title,
      "author" => $book->author,
      "publisher" => $book->publisher,
      "publishdate" => $book->publishdate,
      "price" => $book->price
    );

    echo json_encode($newBook);
  }
  catch(PDOException $e)
  {
    $errorMessage = $e->getMessage();
    $data = Array(
      "insertStatus" => "failed",
      "errorMessage" => $errorMessage
    );
    echo json_encode($data);
  }
}
$app->post('/books', 'insertBook'); //insert book

//PUT - UPDATE book
function updateBook($id)
{
  $request = \Slim\Slim::getInstance()->request();
  $book = json_decode($request->getBody());

  $sql = "UPDATE books
          SET isbn = :isbn,
              title = :title,
              author = :author,
              publisher = :publisher,
              publishdate = :publishdate,
              price = :price
          WHERE id = :id";

  try
  {
    $db = getConnection();
    $stmt = $db->prepare($sql);
    $stmt->bindParam("id", $id);
    $stmt->bindParam("isbn", $book->isbn);
    $stmt->bindParam("title", $book->title);
    $stmt->bindParam("author", $book->author);
    $stmt->bindParam("publisher", $book->publisher);
    $stmt->bindParam("publishdate", $book->publishdate);
    $stmt->bindParam("price", $book->price);
    $stmt->execute();
    $db = null;

    $updatedBook = Array(
      "id" => $id,
      "isbn" => $book->isbn,
      "title" => $book->title,
      "author" => $book->author,
      "publisher" => $book->publisher,
      "publishdate" => $book->publishdate,
      "price" => $book->price
    );
    echo json_encode($updatedBook);
  }
  catch(PDOException $e)
  {
    $errorMessage = $e->getMessage();
    $data = Array(
      "updateStatus" => "failed",
      "errorMessage" => $errorMessage
    );
    echo json_encode($data);
  }
}
$app->put('/books/:id', 'updateBook'); //update book via id

// DELETE book
function deleteBook($id)
{
  $sql = "DELETE
          FROM books
          WHERE id = :id";

  try
  {
    $db = getConnection();
    $stmt = $db->prepare($sql);
    $stmt->bindParam("id", $id);
    $stmt->execute();
    $db = null;

    echo json_encode(array("status" => "success"));
  }
  catch(PDOException $e)
  {
    $error = $e->getMessage();
    echo json_encode(array("status" => "failed", "error" => $error));
  }
}
$app->('/books/:id', 'deleteBook'); //delete book via id

/**
 * Step 4: Run the Slim application
 *
 * This method should be called last. This executes the Slim application
 * and returns the HTTP response to the HTTP client.
 */
$app->run();