# MovieBuzz

MovieBuzz is a simple React Native app that lets you search movies by title, view detailed information about them, and mark your favorite movies for quick access.

## Features

- Search movies by title using the OMDb API
- View detailed information about each movie
- Mark movies as favorites and access them anytime
- Persistent favorites using AsyncStorage
- Easy-to-use interface on Expo Go

## Tech Stack

- React Native with Expo
- OMDb API for movie data
- AsyncStorage for storing favorites locally
- Expo Go for development and testing

## Screens

- Home Screen: Search movies by title
- Search Screen: View search results
- Favorites Screen: List your favorite movies
- Movie Detail Screen: View detailed info and add/remove favorites

## Getting Started

### Prerequisites

- Node.js and npm installed
- Expo CLI installed globally or use `npx expo`
- OMDb API key (you need to get your own from [OMDb API](http://www.omdbapi.com/apikey.aspx))

### Installation

1. Clone the repo  
   ```bash
   git clone https://github.com/iamsainty/moviebuzz.git
   ```

2. Navigate into the project directory

   ```bash
   cd moviebuzz
   ```
3. Install dependencies

   ```bash
   npm install
   ```
4. Create a `.env` file in the root and add your OMDb API key:

   ```
   OMDB_API_KEY=your_api_key_here
   ```
5. Start the Expo development server

   ```bash
   npm start
   ```

### Running the App

* Use the Expo Go app on your mobile device to scan the QR code shown in your terminal or browser.
* The app will load, allowing you to search for movies and manage favorites.

## Deployment

This project is set up to run with Expo Go for easy testing and development. For production builds or updates, consider using EAS Build and EAS Update.

## Contributing

Feel free to open issues or submit pull requests if you want to improve the app!

## License

This project is licensed under the MIT License.

---

### Screenshots

*Add your screenshots here*

---

Made with ❤️ by iamsainty

---
