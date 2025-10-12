import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  addBook,
  getFilteredBooks,
  getBooksbyid,
  submitReview,
  updateReview,
  deleteReview,
  getBooksTitleAuthor,
} from "../controllers/bookcontroller.js";

const bookRouter = Router();


bookRouter.post("/addBook", verifyJWT, addBook);
bookRouter.get("/", getFilteredBooks);
bookRouter.get("/:id", getBooksbyid);
bookRouter.post("/:id/reviews", verifyJWT, submitReview);
bookRouter.put("/reviews/:id", verifyJWT, updateReview);
bookRouter.delete("/reviews/:id", verifyJWT, deleteReview);
bookRouter.get("/search", getBooksTitleAuthor);

export { bookRouter };
