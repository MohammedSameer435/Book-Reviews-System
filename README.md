Book Review API
Overview

This is a RESTful API for managing users and books with reviews. It supports:
User registration, login, and token-based authentication (access & refresh tokens)

CRUD operations on books

Adding, updating, deleting reviews per user

Filtering and searching books by title, author, and genre

Technologies used:

Node.js

Express.js

MongoDB with Mongoose

JWT authentication

bcrypt for password hashing

express-validator for input validation

dotenv for environment variables

Features
User Authentication

Register users with email verification token

Login with JWT access token and refresh token

Refresh access tokens securely

Books

Add books (authenticated users)

Get filtered books with pagination

Get book details by ID with paginated reviews

Submit, update, delete reviews (per user)

Search books by title or author

Project Structure
├── controllers
│   ├── authcontroller.js
│   └── bookcontroller.js
├── middlewares
│   ├── auth.middleware.js
│   └── validator.middleware.js
├── models
│   ├── usersmodel.js
│   └── booksmodel.js
├── routes
│   ├── auth.routes.js
│   └── bookroutes.js
├── utils
│   ├── apierror.js
│   ├── api-response.js
│   └── asynchandler.js
├── validators
│   └── index.js
├── app.js
├── server.js
└── .env

Environment Variables

Create a .env file at the root of the project:

PORT=5000

NODE_ENV=development

MONGO_URI=<YOUR_MONGO_DB_CONNECTION_STRING>

CORS_ORIGIN=http://localhost:5173

ACCESS_TOKEN_SECRET=<YOUR_ACCESS_TOKEN_SECRET>

ACCESS_TOKEN_EXPIRY=1d

REFRESH_TOKEN_SECRET=<YOUR_REFRESH_TOKEN_SECRET>

REFRESH_TOKEN_EXPIRY=10d

FORGOT_PASSWORD_REDIRECT_URL=http://localhost:3000/forgot-password


Notes:

Replace <YOUR_MONGO_DB_CONNECTION_STRING> with your MongoDB URI.

You can create your own database and collections (users and books) in MongoDB Atlas or locally.

Replace <YOUR_ACCESS_TOKEN_SECRET> and <YOUR_REFRESH_TOKEN_SECRET> with strong random strings.

Installation

Clone the repository:

git clone https://github.com/MohammedSameer435/Book-Reviews-System.git




Install dependencies:

npm install


Create a .env file with the above environment variables.

Running the Application
Development
npm run dev


The server will run on http://localhost:5000.

Production
npm start

API Endpoints

Auth Routes

Method	Endpoint	Description

POST	/api/users/register	Register a new user

POST	/api/users/login	Login a user

POST	/api/users/refresh-token	Refresh access token

Book Routes

Method	Endpoint	Description

POST	/api/books/addBook	Add a new book (auth required)

GET	/api/books/	Get filtered books

GET	/api/books/:id	Get book details by ID

POST	/api/books/:id/reviews	Submit a review (auth required)

PUT	/api/books/reviews/:id	Update a review (auth required)

DELETE	/api/books/reviews/:id	Delete a review (auth required)

GET	/api/books/search	Search books by title or author

Usage

All sensitive routes (adding books, submitting reviews) require authentication with a JWT access token.

Tokens are sent via cookies or Authorization: Bearer <token> header.

Input validation is done using express-validator. Invalid inputs return 422 with errors.

Notes

Passwords are hashed with bcrypt.

Email verification tokens are generated but actual email sending is not included.

Refresh tokens are stored in the user document in MongoDB.

The API is structured to be easily extendable for features like email verification, password reset, and more.
