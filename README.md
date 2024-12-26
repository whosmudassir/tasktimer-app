`# **TaskTimer - React Native App**

## **Setup Instructions**

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/whosmudassir/tasktimer-app
   cd <project-directory> `

   ```

1. **Install Dependencies:**

   bash

   Copy code

   `npm install`

1. **Run the App:**

   For development, run the following command:

   bash

   Copy code

   `npm run start`

   This will open Expo DevTools. You can scan the QR code with the Expo Go app or press `i` for iOS simulator and `a` for Android emulator.

---

## **Assumptions Made:**

- UI handling for scenarios when there is no room or task.
- Proper logout flow is implemented.
- Room name addition feature is included.

---

## **Technical Decisions:**

- **Login Flow**:

  - The app includes a login form with username and password fields.
  - Authentication tokens are securely stored using `expo-secure-store`.
  - Proper handling of authentication errors.
  - The app checks for valid tokens on launch and uses refresh tokens for maintaining session.

- **Task Management**:

  - The "Get Next Task" button is placed at the bottom of the screen.
  - Task details such as title and start time are displayed.
  - Local notifications are scheduled based on the `starts_in` duration.
  - Notifications display:
    - Task title
    - Two action buttons: "Done" and "Skip"
    - Both buttons dismiss the notification.

- **Code Quality**:

  - TypeScript is strictly used for type safety.
  - Error handling and loading states are implemented for smoother user experience.
  - UI/UX considerations are made, ensuring the app is responsive and intuitive.

---

## **Screen Recording:**

Here is the screen recording of the working app:

[Watch the screen recording](https://vimeo.com/1042218093)
