var request;
var objJSON;
var id_mongo;

//----------- INDEXED DB ------------------------------

var indexedDB_req = indexedDB.open("pulseDB");
var db;

indexedDB_req.onupgradeneeded = function () {
	db = indexedDB_req.result;
	var store = db.createObjectStore("pulse", { keyPath: "id", autoIncrement: true });
	store.createIndex("puls", "puls");
	store.createIndex("rok", "rok");
	store.createIndex("miesiac", "miesiac");
	store.createIndex("dzien", "dzien");
	store.createIndex("godzina", "godzina");
};

indexedDB_req.onsuccess = function () {
	db = indexedDB_req.result;
};

function daysInMonth(m, y) { // m is 0 indexed: 0-11
    switch (m+1) {
        case 1 :
            return (y % 4 == 0 && y % 100) || y % 400 == 0 ? 29 : 28;
        case 8 : case 3 : case 5 : case 10 :
            return 30;
        default :
            return 31
    }
}
function validate_data(form) {
	if (form.puls.value == "" || form.rok.value == "" || form.miesiac.value == "" || form.dzien.value == ""|| form.godzina.value == "") {
		alert("Uzupełnij wszystkie pola poprawnie");
		return false;
	}
   var dt = new Date();
   var dt_year = dt.getYear() + 1900;
	if (isNaN(form.rok.value) || form.rok.value < 1990 || form.rok.value > dt_year) {
		alert("Podaj rok z przedziału 1990-" + (dt_year));
		return false;
	}
	if (isNaN(form.miesiac.value) || form.miesiac.value < 1 || form.miesiac.value > 12) {
		alert("Podaj poprawny miesiac.");
		return false;
	}
	if (isNaN(form.dzien.value) || form.dzien.value < 1 || form.dzien.value > daysInMonth(form.miesiac.value,form.rok.value)) {
		alert("Podaj poprawny dzien.");
		return false;
	}
	if (isNaN(form.godzina.value) || form.godzina.value < 1 || form.godzina.value > 24) {
		alert("Podaj poprawna godzina.");
		return false;
	}

	if (isNaN(form.puls.value) || form.puls.value < 0 || form.puls.value >= 200) {
		alert("PULS!?");
		return false;
	}
	return true;
}
function insert_offline(form) {
if (validate_data(form)) 
{
		var data = {};
		data.puls = form.puls.value;
		data.rok = form.rok.value;
		data.miesiac = form.miesiac.value;
		data.dzien = form.dzien.value;
		data.godzina = form.godzina.value;

		to_send = JSON.stringify(data);
		var db_tr = db.transaction("pulse", "readwrite");
		var obj = db_tr.objectStore("pulse");

		if(obj.put(data)){
			alert("Dane zostały dodane do lokalnej bazy przeglądarki.");
		}

	}
}

function synchronize_data() {
	var counter = 0;
	var db_tx = db.transaction("pulse", "readwrite");
	var obj = db_tx.objectStore("pulse");
	obj.openCursor().onsuccess = function (event) {
		var cursor = event.target.result;
		if (cursor) {
			var data = {};
			data.puls = cursor.value.puls;
			data.rok = cursor.value.rok;
			data.miesiac = cursor.value.miesiac;
			data.dzien = cursor.value.dzien;
			data.godzina = cursor.value.godzina;

			to_send = JSON.stringify(data);
			req = getRequestObject();

			req.onreadystatechange = function () {
				if (req.readyState == 4 && req.status == 200) {
					objJSON = JSON.parse(req.response);
					if (objJSON['return'] == 'ok') {	//chyba 'return' 'ok'
						alert("Dodano: wszystkie dane. :)");
					}
				}
			}
			req.open("POST", "http://pascal.fis.agh.edu.pl/~6sitko/mongo/rest/save", true);
			req.send(to_send);
			cursor.delete();
			counter += 1;

			cursor.continue();
		}
		else if (counter == 0) {
			alert("Brak rekordów offline.");
		}
	};
}



function new_data() {
   var dt = new Date();
   var dt_year = dt.getYear() + 1900;
   var dt_month = dt.getMonth()+1;
   var dt_day = dt.getDate();
   var hour = dt.getHours();
   var form1 = "<form name='add'><table>" ;
   form1    += "<tr><td>PULS</td><td><input type='number' name='puls' value=0 min=0 ></input></td></tr>";
   form1    += "<tr><td coelspan=\"2\"> Zmierzone </td></tr>";
   form1    += "<tr><td>Rok</td><td><input type='number' name='rok' value=" + dt_year + " ></input></td></tr>";
   form1    += "<tr><td>Miesiąc</td><td><input type='number' name='miesiac' value=" + dt_month + " ></input></td></tr>";  
   form1    += "<tr><td>Dzień</td><td><input type='number' name='dzien' value=" + dt_day + " ></input></td></tr>";
   form1    += "<tr><td>Godzina</td><td><input type='number' name='godzina' value=" + hour + " ></input></td></tr>";
   form1    += "<tr><td></td><td><input type='button' value='wyslij' onclick='insert_offline(this.form)' ></input></td></tr>";
   form1    += "</table></form>";

   document.getElementById('data').innerHTML = form1;
   document.getElementById('result').innerHTML = ''; 
}
/*
function list_offline() {
   document.getElementById('result').innerHTML = ''; 
   document.getElementById('data').innerHTML = ''; 

	var db_tx = db.transaction("pulse", "readonly");
	var objectStore = db_tx.objectStore("pulse");

objectStore.openCursor().onsuccess = function(event) {
	var txt=" ";
  var cursor = event.target.result;
  if (cursor) {
    txt += ":::"; //cursor.value.puls;
    cursor.continue();
  }
  else {
   //txt += "NOOOO!";
  }
  document.getElementById('data').innerHTML = txt;
};


}
*/
//------------------------------------------------------


function getRequestObject()      {
   if ( window.ActiveXObject)  {
      return ( new ActiveXObject("Microsoft.XMLHTTP")) ;
   } else if (window.XMLHttpRequest)  {
      return (new XMLHttpRequest())  ;
   } else {
      return (null) ;
   }
}
 
// Lista rekordow w bazie
function _list() {
   document.getElementById('result').innerHTML = ''; 
   document.getElementById('data').innerHTML = '';  
   request = getRequestObject() ;
   request.onreadystatechange = function() {
      if (request.readyState == 4)    {
         objJSON = JSON.parse(request.response);
         var txt = "<h1>Twoje wyniki</h1><br>";
         txt+="<table class='table' ><thead><tr><th scope='col'>#</th><th scope='col'>Data</th><th scope='col'>Puls</th></tr></thead><tbody>"
         for ( var id in objJSON )  {
            txt += "<tr>" ;
            txt+='<th scope="row">' + id + '</th>';

             txt += "<td>" + objJSON[id].rok +"/" +objJSON[id].miesiac +"/" +objJSON[id].dzien +" " +objJSON[id].godzina + ":00" +  "</td><td>" + objJSON[id].puls + "</td>";
             txt += "</tr>" ;
         }
         txt+="</tbody>";
         document.getElementById('data').innerHTML = txt;
      }
   }
   request.open("GET", "http://pascal.fis.agh.edu.pl/~6sitko/mongo/rest/user", true);
   request.send(null);
}


// Wstawianie rekordow do bazy
function _ins_form() {
   var dt = new Date();
   var dt_year = dt.getYear() + 1900;
   var dt_month = dt.getMonth()+1;
   var dt_day = dt.getDate();
   var hour = dt.getHours();
   var form1 = "<form name='add'><table>" ;
   form1    += "<tr><td>PULS</td><td><input type='number' name='puls' value=0 min=0 ></input></td></tr>";
   form1    += "<tr><td coelspan=\"2\"> Zmierzone </td></tr>";
   form1    += "<tr><td>Rok</td><td><input type='number' name='rok' value=" + dt_year + " ></input></td></tr>";
   form1    += "<tr><td>Miesiąc</td><td><input type='number' name='miesiac' value=" + dt_month + " ></input></td></tr>";  
   form1    += "<tr><td>Dzień</td><td><input type='number' name='dzien' value=" + dt_day + " ></input></td></tr>";
   form1    += "<tr><td>Godzina</td><td><input type='number' name='godzina' value=" + hour + " ></input></td></tr>";
   form1    += "<tr><td></td><td><input type='button' value='wyslij' onclick='_insert(this.form)' ></input></td></tr>";
   form1    += "</table></form>";
   document.getElementById('data').innerHTML = form1;
   document.getElementById('result').innerHTML = '';
}
 
function _insert(form)  {
if (validate_data(form)){
    var user = {};
    user.puls = form.puls.value;
    user.rok = form.rok.value;
    user.miesiac = form.miesiac.value;
    user.dzien = form.dzien.value;
    user.godzina = form.godzina.value;
    txt = JSON.stringify(user);
    document.getElementById('result').innerHTML = ''; 
    document.getElementById('data').innerHTML = '';  
    request = getRequestObject() ;
    request.onreadystatechange = function() {
       if (request.readyState == 4 && request.status == 200 )    {
          document.getElementById('result').innerHTML = /*request.response;*/ "<h1>Element dodano do bazy danych.</h1>";
       }
    }
    request.open("POST", "http://pascal.fis.agh.edu.pl/~6sitko/mongo/rest/save", true);
    request.send(txt);
}}
 
// Usuwanie rekordow z bazy danych
function _del_list() {
    document.getElementById('result').innerHTML = ''; 
    document.getElementById('data').innerHTML = '';  
    request = getRequestObject() ;
    request.onreadystatechange = function() {
       if (request.readyState == 4) { 
          objJSON = JSON.parse(request.response);
          var txt = "<form name='data'><select name='del' size='10'>";
          for ( var id in objJSON ) {
              txt +=  "<option value="+id+" >"+id+": {" ;
              for ( var prop in objJSON[id] ) {             
                 if ( prop !== '_id')
                   { txt += prop+":"+objJSON[id][prop]+",";  }
                 else
                   { txt += "id:"+ objJSON[id][prop]['$oid']+"," ;  }
              }     
              txt +="}</option>";
          }
          txt += "</select><br/><input type='button' value='usun' onclick='_delete(this.form)'/></form>";
          document.getElementById('data').innerHTML = txt;
       }
    }
    request.open("GET", "http://pascal.fis.agh.edu.pl/~6sitko/mongo/rest/user", true);
    request.send(null);
}
 
function _delete(form) {
    var rec = form.del.selectedIndex;
    var id = document.getElementsByTagName('option')[rec].value;
    var id_mongo = objJSON[id]['_id']['$oid'];
    document.getElementById('result').innerHTML = ''; 
    document.getElementById('data').innerHTML = '';  
    request = getRequestObject() ;
    request.onreadystatechange = function() {
       if (request.readyState == 4 )    {
           document.getElementById('result').innerHTML = request.response;
       }
    }
    request.open("DELETE", "http://pascal.fis.agh.edu.pl/~6sitko/mongo/rest/delete1/"+id_mongo, true);
    request.send(null);
}
 

 
 
 

function analiza()
{
      document.getElementById('result').innerHTML = ''; 
   document.getElementById('data').innerHTML = "<div id='chartContainer' style='height: 370px; width: 100%;'></div><br><br><div id='chartContainer2' style='height: 370px; width: 100%;'></div><br><br><div id='chartContainer3' style='height: 370px; width: 100%;'></div>";  
   request = getRequestObject() ;
   request.onreadystatechange = function() {
      if (request.readyState == 4)    {
         objJSON = JSON.parse(request.response);
         var txt = "";
         let array = new Array(200).fill(0);
         var dps = [];
         for ( var id in objJSON )  {
             for ( var prop in objJSON[id] ) {             
                 if ( prop == 'puls')
                   { 
                      ++array[objJSON[id].puls];
                  }

             }

             
         }
         analiza2();


         var chart = new CanvasJS.Chart("chartContainer", {
            animationEnabled: true,
            title:{
               text: "Rozkład tętna wszystkich użytkowników."
            },
            axisX: {
               valueFormatString: "##"
            },
            axisY: {
               title: "Tętno",
               includeZero: true,
            },
            legend:{
               cursor: "pointer",
               fontSize: 16,
               itemclick: toggleDataSeries
            },
            toolTip:{
               shared: true
            },
            data: [{
               name: "Tętno",
               type: "spline",
               yValueFormatString: "##",
               showInLegend: true,
               dataPoints: dps
            }]
         });
         

         function toggleDataSeries(e){
            if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
               e.dataSeries.visible = false;
            }
            else{
               e.dataSeries.visible = true;
            }
            chart.render();}
         function parseDataPoints () {
            dps.push({x: 0, y: array[0]});
               for (var i = 1; i < array.length; i++)
               {
                  if(array[i]!==0){dps.push({x: i, y: array[i]});}
               }
               dps.push({x: 199, y: array[199]});
         } 
         parseDataPoints();
         chart.options.data[0].dataPoints = dps;
         chart.render();

         
         }

      } 
   request.open("GET", "http://pascal.fis.agh.edu.pl/~6sitko/mongo/rest/list", true);
   request.send(null);

}

function analiza2()
{
   request = getRequestObject() ;
   request.onreadystatechange = function() {
      if (request.readyState == 4)    {
         objJSON = JSON.parse(request.response);
         var txt = "";
         let array = new Array(200).fill(0);
         var dps = [];
         for ( var id in objJSON )  {
             for ( var prop in objJSON[id] ) {             
                 if ( prop == 'puls')
                   { 
                      array[objJSON[id].puls]=array[objJSON[id].puls]+1; 
                  }
                  
             }

             
         }
         analiza3(objJSON);
         var chart = new CanvasJS.Chart("chartContainer2", {
            animationEnabled: true,
            title:{
               text: "Twój rozkład tętna"
            },
            axisX: {
               valueFormatString: "##"
            },
            axisY: {
               title: "Tętno",
               includeZero: true,
            },
            legend:{
               cursor: "pointer",
               fontSize: 16,
               itemclick: toggleDataSeries
            },
            toolTip:{
               shared: true
            },
            data: [{
               name: "Tętno",
               type: "spline",
               yValueFormatString: "##",
               showInLegend: true,
               dataPoints: dps
            }]
         });
         

         function toggleDataSeries(e){
            if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
               e.dataSeries.visible = false;
            }
            else{
               e.dataSeries.visible = true;
            }
            chart.render();}
         function parseDataPoints () {
            dps.push({x: 0, y: array[0]});
               for (var i = 1; i < array.length; i++)
               {
                  if(array[i]!==0){dps.push({x: i, y: array[i]});}
               }
               dps.push({x: 199, y: array[199]});
         } 
         parseDataPoints();
         chart.options.data[0].dataPoints = dps;
         chart.render();
         
         }

      } 
   request.open("GET", "http://pascal.fis.agh.edu.pl/~6sitko/mongo/rest/user", true);
   request.send(null);
}

function analiza3(objJSON)
{
   var dps = [];
   var chart = new CanvasJS.Chart("chartContainer3", {
      animationEnabled: true,
      exportEnabled: true,
      title:{
         text: "Historia tętna"
      },
      axisY:{ 
         title: "Tętno",
      },
      axisX:{ 
         valueFormatString: "DD MMM YYYY HH:00",
      },
      data: [{
         name: "Tętno",
         type: "scatter",
         xValueFormatString: "DD MMM YYYY HH:00",
         dataPoints: dps
      }]
   });
  
   chart.render();

   function parseDataPoints () {
      let dates = new Date(objJSON.lenght);
         for (var i = 0; i < objJSON.length; i++)
         {
            dates[i]=new Date();
            dates[i].setFullYear(objJSON[i].rok);
            dates[i].setMonth(objJSON[i].miesiac-1);
            dates[i].setDate(objJSON[i].dzien);
            dates[i].setHours(objJSON[i].godzina);
            
         }
         for (var i = 0; i < objJSON.length; i++)
         {
            console.log(dates[i],objJSON[i].puls);
            dps.push({x: dates[i], y: parseInt(objJSON[i].puls)});
         }

   } 
   parseDataPoints();
   chart.options.data[0].dataPoints = dps;
   chart.render();
}
