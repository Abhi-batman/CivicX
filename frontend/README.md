# Civic Issue Reporting App

A React Native + Expo app for reporting civic issues like potholes, garbage, etc.

## Features
- **Home Feed**: View reported issues, upvote, and sort by popularity/recency.
- **Report Issue**: Submit new issues with photo, location, and description.
- **Map View**: See issues on a map.
- **Leaderboard**: See top contributors.

## Setup Instructions

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Environment Setup**:
    - Create a `.env` file in the root directory (copy from `.env.example` if available, or use the one generated).
    - Add your API Base URL and Google Maps API Key:
      ```
      API_BASE_URL=https://your-api-endpoint.com
      GOOGLE_MAPS_API_KEY=your_google_maps_key
      ```

3.  **Run the App**:
    - Start the Expo server:
      ```bash
      npx expo start
      ```
    - Scan the QR code with the Expo Go app on your phone (Android/iOS).
    - Or press `a` for Android Emulator, `i` for iOS Simulator.

## API Integration

The API logic is separated in `src/api/`.

- **`src/api/apiClient.js`**: Configures Axios. Change `API_BASE_URL` here or in `.env`.
- **`src/api/issueApi.js`**: Contains methods for fetching/creating issues.
  - `getAllIssues()`: Replace mock data with `apiClient.get('/issues')`.
  - `createIssue()`: Replace mock with `apiClient.post('/issues', data)`.
- **`src/api/userApi.js`**: Contains methods for user rankings.

## Backend Integration Steps

1.  Open `src/api/issueApi.js`.
2.  Uncomment the `apiClient` calls inside the functions.
3.  Remove the mock data return statements.
4.  Ensure your backend endpoints match the paths used (e.g., `/issues`, `/issues/:id/vote`).

## Map Configuration

This app uses `react-native-maps`.
- For **Android**: You need to add your Google Maps API Key to `app.json` (if you eject) or configure it in Expo.
- For **iOS**: It uses Apple Maps by default.

## Folder Structure

```
/src
  /api          # API integration
  /components   # Reusable UI components
  /screens      # App screens
  /navigation   # Navigation setup
  /context      # Global state (Auth)
```
