# Firebase Authentication System

This project implements a complete Firebase authentication system for a Next.js application, including server-side verification of Firebase ID tokens.

## Features

- User registration with email and password
- User login with email and password
- Password reset functionality
- Email verification
- Protected routes with server-side verification
- Session management with secure cookies
- Profile management (update email and password)

## Setup Instructions

### 1. Firebase Project Setup

1. Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Enable the Email/Password authentication method:
   - Go to Authentication > Sign-in method
   - Enable Email/Password provider
3. Optional: Configure email templates for verification and password reset emails

### 2. Environment Configuration

1. Copy the `.env.local` file and fill in your Firebase project details:

```
# Firebase Client SDK Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin SDK Configuration
FIREBASE_SERVICE_ACCOUNT_KEY=your_base64_encoded_service_account_key_here
```

2. To get your Firebase Client SDK configuration:
   - Go to Firebase Console > Project Settings > General
   - Scroll down to "Your apps" section
   - Click on the Web app (create one if you haven't already)
   - Copy the configuration values

3. To get your Firebase Admin SDK service account key:
   - Go to Firebase Console > Project Settings > Service Accounts
   - Click "Generate new private key"
   - Save the JSON file
   - Base64 encode the JSON file content:
     - On macOS/Linux: `cat path/to/serviceAccountKey.json | base64`
     - On Windows: `certutil -encode path/to/serviceAccountKey.json temp.b64 && findstr /v /c:- temp.b64 > temp.txt`
   - Copy the output and paste it as the value for `FIREBASE_SERVICE_ACCOUNT_KEY`

### 3. Installation and Running

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Authentication Flow

1. **Client-side Authentication**:
   - User logs in using Firebase Authentication
   - Upon successful login, an ID token is obtained
   - The ID token is sent to the server to create a session cookie

2. **Server-side Verification**:
   - The server verifies the ID token using Firebase Admin SDK
   - If valid, a session cookie is created and sent to the client
   - The session cookie is used for subsequent requests

3. **Middleware Protection**:
   - Next.js middleware checks for the session cookie
   - The cookie is verified using Firebase Admin SDK
   - If valid, the user is allowed to access protected routes
   - If invalid, the user is redirected to the login page

## Security Considerations

- Session cookies are HTTP-only to prevent JavaScript access
- Cookies are secure in production to ensure HTTPS-only transmission
- Server-side verification ensures tokens cannot be tampered with
- Session cookies are automatically invalidated when a user logs out
- Firebase Admin SDK verifies tokens with Firebase's servers

## Testing

A test endpoint is available at `/api/auth/test` to verify that the Firebase Admin SDK is working correctly. This endpoint should be removed in production.

## Troubleshooting

- **Invalid Service Account**: Ensure the service account key is correctly base64 encoded
- **Middleware Errors**: Check server logs for detailed error messages
- **Authentication Issues**: Verify Firebase configuration in `.env.local`
- **CORS Errors**: Ensure your Firebase project has the correct domains whitelisted

## License

This project is licensed under the MIT License - see the LICENSE file for details.