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
class Food
{
   var $id;
   var $name;
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

// GET - select all foods
function getFoods()
{
   $sql = "SELECT *
           FROM food
           ORDER BY name";

   try {
      $db = getConnection();

      //no need to prepare, cause no data from users
      $stmt = $db->query($sql);
      $stmt->execute();
      $row_count = $stmt->rowCount();

      if ( count($row_count) )
      {
         //foods collection
         $foods = array();

         while($row = $stmt->fetch(PDO::FETCH_ASSOC)) 
         {
           //create food object
           //put food data in Model (Food Object)
           $food = new Food();
           $food->id = $row['id'];
           $food->name = $row['name'];
           $food->price = $row['price'];
           array_push($foods, $food);
         }

         $db = null;
         echo json_encode($foods);
      }
      else
      {
         $db = null;
         $foods = array();
         echo json_encode($foods);
      }
   }
   catch(PDOException $e) {
      echo '{"error":{"text":'. $e->getMessage() .'}}';
   }
}
$app->get('/food', 'getFoods'); //get all foods

//POST - INSERT food
function insertFood() {
   $request = \Slim\Slim::getInstance()->request();
   $food = json_decode($request->getBody());
   $sql = "INSERT INTO food (name, price)
           VALUES (:name, :price)";

   try {
      $db = getConnection();
      $stmt = $db->prepare($sql);
      $stmt->bindParam("name", $food->name);
      $stmt->bindParam("price", $food->price);
      $stmt->execute();
      $id = $db->lastInsertId();

      $db = null;

      $newFood = Array(
         "id" => $id,
         "name" => $food->name,
         "price" => $food->price
      );

      echo json_encode($newFood);
   }
   catch(PDOException $e) {
      $errorMessage = $e->getMessage();
      $data = Array(
         "insertStatus" => "failed",
         "errorMessage" => $errorMessage
      );
      echo json_encode($data);
   }
}
$app->post('/food', 'insertFood'); //insert food

//PUT - UPDATE food
function updateFood($id)
{
  $request = \Slim\Slim::getInstance()->request();
  $food = json_decode($request->getBody());

  $sql = "UPDATE food
          SET name = :name,
              price = :price
          WHERE id = :id";

  try
  {
    $db = getConnection();
    $stmt = $db->prepare($sql);
    $stmt->bindParam("id", $id);
    $stmt->bindParam("name", $food->name);
    $stmt->bindParam("price", $food->price);
    $stmt->execute();
    $db = null;

    $updatedFood = Array(
      "id" => $id,
      "name" => $food->name,
      "price" => $food->price
    );
    echo json_encode($updatedFood);
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
$app->put('/food/:id', 'updateFood'); //update food via id

// DELETE food
function deleteFood($id)
{
  $sql = "DELETE
          FROM food
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
$app->delete('/food/:id', 'deleteFood'); //delete food via id

/**
 * Step 4: Run the Slim application
 *
 * This method should be called last. This executes the Slim application
 * and returns the HTTP response to the HTTP client.
 */
$app->run();