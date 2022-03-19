import { Router } from "express";
import { registerUser, loginUser, getLoggedInUser } from "../controllers/userController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.post("/", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getLoggedInUser);

module.exports = router;
