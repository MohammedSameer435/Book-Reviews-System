import { Books } from "../models/booksmodel.js";
import { asyncHandler } from "../utils/asynchandler.js";

const addBook = asyncHandler(async (req, res) => {
  const { title, author, genre } = req.body;

  const newBook = new Books({
    title,
    author,
    genre,
    user: req.user._id,
  });

  await newBook.save();
  res.status(200).json({ message: "Book added successfully", book: newBook });
});

const getFilteredBooks = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, author, genre, title } = req.query;

  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);

  if (pageNumber <= 0 || limitNumber <= 0) {
    return res
      .status(400)
      .json({ message: "Page and limit must be positive integers" });
  }

  let filter = {};

  if (title) {
    filter.title = { $regex: title, $options: "i" };
  }

  if (author) {
    filter.author = { $regex: author, $options: "i" };
  }

  if (genre) {
    filter.genre = { $regex: genre, $options: "i" };
  }

  const skip = (pageNumber - 1) * limitNumber;

  const books = await Books.find(filter).skip(skip).limit(limitNumber);
  const totalBooks = await Books.countDocuments(filter);
  const totalPages = Math.ceil(totalBooks / limitNumber);

  res.status(200).json({
    books,
    page: pageNumber,
    totalPages,
    totalBooks,
    limit: limitNumber,
  });
});

const getBooksbyid = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);
  const skip = (pageNumber - 1) * limitNumber;

  const book = await Books.findById(id);

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  const totalRatings = book.reviews.reduce(
    (acc, review) => acc + review.rating,
    0
  );
  const averageRating =
    book.reviews.length > 0 ? totalRatings / book.reviews.length : 0;

  const paginatedReviews = book.reviews.slice(skip, skip + limitNumber);
  const totalReviews = book.reviews.length;

  res.status(200).json({
    book,
    averageRating,
    reviews: paginatedReviews,
    totalReviews,
    totalPages: Math.ceil(totalReviews / limitNumber),
    page: pageNumber,
  });
});

const submitReview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;
  const userId = req.user._id;

  const book = await Books.findById(id);
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  const existingReview = book.reviews.find(
    (review) => review.userId.toString() === userId.toString()
  );
  if (existingReview) {
    return res
      .status(400)
      .json({ message: "You can only submit one review per book" });
  }

  const newReview = { userId, rating, comment };
  book.reviews.push(newReview);
  await book.save();

  res.status(201).json({ message: "Review submitted successfully", review: newReview });
});

const updateReview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;
  const userId = req.user._id;

  const book = await Books.findOne({ "reviews._id": id });
  if (!book) return res.status(404).json({ message: "Review not found" });

  const review = book.reviews.id(id);
  if (review.userId.toString() !== userId.toString()) {
    return res.status(403).json({ message: "You can only update your own review" });
  }

  review.rating = rating || review.rating;
  review.comment = comment || review.comment;

  await book.save();
  res.status(200).json({ message: "Review updated successfully", review });
});

const deleteReview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const book = await Books.findOne({ "reviews._id": id });
  if (!book) return res.status(404).json({ message: "Review not found" });

  book.reviews = book.reviews.filter(
  (r) => r._id.toString() !== id.toString()
);
await book.save();
res.status(200).json({ message: "Review deleted successfully" });


  review.remove();
  await book.save();

  res.status(200).json({ message: "Review deleted successfully" });
});

const getBooksTitleAuthor = asyncHandler(async (req, res) => {
  const { title, author } = req.query; 
  let filter = {};

  if (title) filter.title = { $regex: title, $options: "i" };
  if (author) filter.author = { $regex: author, $options: "i" };

  const books = await Books.find(filter);
  res.status(200).json({ books });
});



export {
  addBook,
  getFilteredBooks,
  getBooksbyid,
  submitReview,
  updateReview,
  deleteReview,
  getBooksTitleAuthor,
};
