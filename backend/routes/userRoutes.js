import express from "express"
import { getUsers, getUserById, updateUser, promoteUser } from "../controllers/userController.js"
import { protect, admin } from "../middleware/authMiddleware.js"

const router = express.Router()

// @route   GET /api/users
router.get("/", protect, admin, getUsers)

// @route   GET /api/users/:id
router.get("/:id", protect, getUserById)

// @route   PUT /api/users/:id
router.put("/:id", protect, updateUser)

// @route   PUT /api/users/:id/promote
router.put("/:id/promote", protect, admin, promoteUser)

export default router

