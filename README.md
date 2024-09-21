# Welcome to RS-Wordle 👋

This is an interview submission project for the position of [Internship Frontend Developer at The Selection Lab](https://www.theselectionlab.com/job-vacancies/internship-frontend-developer).

## Get started

1. Clone the repository & install dependencies

   ```bash
   npm install
   ```

3. Add the .env file and paste the required EXPO_PUBLIC variables

   ```bash
   code .env
   ```

2. Start the app

   ```bash
   npx expo start -c
   ```

## Environment Variables

You can get the values from the private gist link and password that I've submitted via email.

## Security

I'm aware that a username and password combination was present in the code while I was developing the app. This was a dummy combination I used to test the authentication flow and does not represent a valid authentication for any other service I use.

The firebase database is currently in testing mode and accepts all requests. This is not a secure setup and should not be used in a production environment.

## Limitations

* I'm aware of limitations around keyboard visibility and screen moving.
* The app only works on portrait mode at the moment.
* On physical Android devices, 1 font is not loading.
* I was unable to implement mmkv storage for the user's data vs async storage. MMKV would be much faster.
* The share functionality is just a dummy.
* The api calls could be more robust
* I wanted to implement Firebase functions to add the definition of the last word to the user's data, but skipped this in the interest of time.

## Author

I hereby declare that I have completed this project on my own.

## Credit & Acknowledgments

This project is based on the [Wordle](https://www.nytimes.com/games/wordle/index.html) game. The app is a clone based on the [YouTube tutorial by Simon Grimm](https://www.youtube.com/watch?v=pTonpjmKtiE).