<?php
 
class User extends Register {
 
   private $ident = 'test' ;
   private $auth = false ;
 
   function __construct () {
      parent::__construct() ;  
      session_start() ;
   }              
 
   function setSession () {
      $_SESSION["ident"] = $this->ident ;
      session_set_cookie_params(360,"/","fis.agh.edu.pl",true,false) ; 
   }
 
   function destroySession() {
      $_SESSION = array() ;
      if ( isset($_COOKIE[session_name()]) ) {
          setcookie( session_name(), '', time()-42000, '/') ;
       }
       session_destroy();
    }    
}
 
?>