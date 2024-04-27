# Project-wordly-s-kmotor
En enkel sökmotor för att lösa wordly liknande problemer

Ord-databasen är hämtad från https://github.com/almgru/svenska-ord.txt

# Köra API'n ihop med databas
Följande paket behövs:
Kopiera och installera följande:
```pip install fastapi uvicorn python-dotenv```

1. För att kunna köra med en databas ska en .env fil som heter infoContainer.env skapas. I denna fil ska föjande 'keys' finnas med:
* HOST
* NAME
* PASSWORD
* DATABASE

Detta är för att säkra våra tjänster.

2. Sätt in rätt variabler i .env filen. Kontakta ledande chef för variabler.

3. Kör Api'n med föjande kommando: ```uvicorn APIMain:app --reload```.

4. API'n är nu uppe och igång. Du kan nu göra ändringar och sedan bara spara för att uppdatera API'n.
