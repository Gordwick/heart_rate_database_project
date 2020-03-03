<?php
 
function __autoload($class_name) {
    include $class_name . '.php' ;
}
 
$user = new Register_new;
 
$user->_login();
 
if ( ! $user->_is_logged() )
  {  
echo'
<!DOCTYPE HTML>
<html>
  <head>
  <meta http-equiv="content-type" content="text/html; charset=UTF-8">
<script src="https://canvasjs.com/assets/script/canvasjs.min.js"></script>
  <link href="./main.css" rel="stylesheet" type="text/css"/>
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
  <script src="rest.js" type="text/javascript"></script>
  <title>Użytkownik nie zalogowany</title>
  </head>
  <body>
<article>
	<header>
		<a href="zad04reg.html" class="btn btn-outline-primary">Rejestracja w serwisie</a>
		<button class="btn btn-outline-primary"  onclick="new_data()"/>Dodanie swój wynik</button>
		<a href="zad04.php" class="btn btn-outline-primary">Log in</a>
	</header>
	<div id="data" class="container-fluid">
		<form class="login_form" name="test" method="post" action="zad04log.php">
		<div class="form-group">
			<label for="exampleInputEmail1">Podaj e-mail:</label>
			<input type="text" name="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email">
		</div>
		<div class="form-group">
			<label for="exampleInputPassword1">Podaj hasło:</label>
			<input type="password" name="pass" class="form-control" id="exampleInputPassword1" placeholder="Password">
		</div>
			<input type="submit" class="btn btn-primary">
     </form>
	</div>
	<div id="result"></div>

</article>
<footer>
     <p>Website by Sebastian Sitko</p>
</footer>

  </body>
</html>';

  } 
else
  {
echo'
<!DOCTYPE HTML>
<html>
  <head>
<script src="https://canvasjs.com/assets/script/canvasjs.min.js"></script>
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
  <meta http-equiv="content-type" content="text/html; charset=UTF-8">
  <link href="./main.css" rel="stylesheet" type="text/css"/>
  <script src="rest.js" type="text/javascript"></script>
  <title>Logowanie do serwisu</title>
  </head>
  <body>
	<article>
   		<header>
			<button class="btn btn-outline-primary" onclick="analiza()">Analiza danych</button>
			<button class="btn btn-outline-primary" onclick="_list()">Pobranie danych z bazy</button>
			<button class="btn btn-outline-primary" onclick="_ins_form()">Dodanie rekordu do bazy</button>
			<button class="btn btn-outline-primary" onclick="_del_list()">Usuniecie rekordu z bazy</button>
			<button class="btn btn-outline-primary" onclick="synchronize_data()">Synchronizuj z bazą lokalną</button>
			<a href="zad04out.php" class="btn btn-outline-primary">Wylogowanie z serwisu</a>
		</header>
     <div id="data" class="container"></div>
     <div id="result"></div>

</article>
<footer>
     <p>Website by Sebastian Sitko</p>
</footer>

  </body>
</html>';

  }


?>