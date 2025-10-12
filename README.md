# Book Review API

A RESTful API to manage books, users, and reviews. Users can register, login, add books, submit reviews, and search books.

---

## Table of Contents

- [Project Setup](#project-setup)
- [Running Locally](#running-locally)
- [API Documentation (Postman Requests)](#api-documentation-postman-requests)
  - [Books API](#books-api)
  - [Users API](#users-api)
- [Design Decisions & Assumptions](#design-decisions--assumptions)

---

## Project Setup
1. Clone the repository
Open you terminal and run:
git clone https://github.com/your-username/book-review-api.git
cd book-review-api

2.Install dependencies
using npm: npm install

3.Create Environment Variables
In the root directory, create a .env file and add the following variables:

PORT=5000
DATABASE_URL=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_secret_key
REFRESH_TOKEN_SECRET=your_refresh_secret

5.How to run locally
Use "npm run start"

6.Access the API
Open your browser or Postman and go to:
http://localhost:5000

Books API
1. Add a Book

POST /api/books/addBook

Headers:

Authorization: Bearer <access_token>

Content-Type: application/json

Body (JSON):

{
  "title": "Book Title",
  "author": "Author Name",
  "genre": "Fiction",
  "year": 2025,
  "description": "Book description here"
}


Access: Protected (requires login)

2. Get Filtered Books

GET /api/books/

Query Parameters (optional):

genre=Fiction

author=Author Name

Access: Public

3. Get Book by ID

GET /api/books/:id

Access: Public

Example: /api/books/64f9c8b1e5a2f12a34567890

4. Submit a Review

POST /api/books/:id/reviews

Headers:

Authorization: Bearer <access_token>

Content-Type: application/json

Body (JSON):

{
  "rating": 5,
  "comment": "Excellent book!"
}


Access: Protected (requires login)

5. Update a Review

PUT /api/books/reviews/:id

Headers:

Authorization: Bearer <access_token>

Content-Type: application/json

Body (JSON):

{
  "rating": 4,
  "comment": "Updated review text"
}


Access: Protected (only the author can update)

6. Delete a Review

DELETE /api/books/reviews/:id

Headers:

Authorization: Bearer <access_token>

Access: Protected (only author/admin)

7. Search Books by Title or Author

GET /api/books/search

Query Parameters:

title=Book Title

author=Author Name

Access: Public

Users API
1. Register User

POST /api/users/register

Headers: Content-Type: application/json

Body (JSON):

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}


Access: Public

2. Login User

POST /api/users/login

Headers: Content-Type: application/json

Body (JSON):

{
  "email": "john@example.com",
  "password": "securepassword"
}


Output: JWT access token

Access: Public

3. Refresh Access Token

POST /api/users/refresh-token

Headers: Content-Type: application/json

Body (JSON):

{
  "refreshToken": "<refresh_token>"
}

#Database Schema:
*/
const bookSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    index: true,
  },
  author: {
    type: String,
    required: true,
    lowercase: true,
    index: true,
  },
  genre: {
    type: String,
    required: true,
    lowercase: true,
    index: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      rating: { type: Number, min: 1, max: 5 },
      comment: String,
      createdAt: { type: Date, default: Date.now },
    },
  ],
});
*/

const userSchema = new Schema(
  {
    avatar: {
      type: {
        url: { type: String },
        localpath: { type: String },
      },
      default: {
        url: "https://placehold.co/600x400",
        localpath: "",
      },
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    fullname: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
    },
    forgotPasswordToken: {
      type: String,
    },
    forgotPasswordExpiry: {
      type: Date,
    },
    emailVerificationToken: {
      type: String,
    },
    emailVerificationExpiry: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
)
