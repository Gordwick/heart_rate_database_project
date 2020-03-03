Projekt 2 : Baza danych do przechowywania wyników pomiaru tętna oraz analiza wyników
Wykonanie: Sebastian Sitko

Wykorzystano 2 bazy danych
1. IndexedDB - w trybie offline
2. MongoDB - w trybie online

Dane przedstawione są ze względu na zalogowanego użytkownika oraz ogólne (do porównania).

Aby uzyskać dostęp do bazy MongoDB użytkownik musi być zalogowany - bez tego można jedynie dodać wynik do lokalnej bazy danych.
Nic nie stoi na przeszkodze by tak dodane wyniki przesłać do głównej bazy po zalogowaniu.
Wychodząc z założenia, że osoba wprowadzająca dane na konkretnym stanowisku w trybie offlie jest tą samą która się z niego loguje,
dane automatycznie są synchronizowane z tym konte po kliknięciu 'Synchronizuj  z bazą danych'..
Możliwe jest także usunięcie danych z bazy - tylko zalogowanego użytkownika - oraz ich wyświetlenie.

Obsługa sesji oraz bazy MongoDB zaimplementowana jest w języku PHP - styl RESTful, natomiast IndexedDB w JS. Do stworzenia wykresów użyto CanvasJS.


Login z przykładowymi danymi mail:s haslo:s