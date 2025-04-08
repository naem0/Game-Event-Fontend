import User from "../models/User.js"

// @desc    Get all users
// @route   GET /api/users
// @access  Admin
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password")
    res.status(200).json(users)
  } catch (error) {
    console.error("Get users error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password")

    if (user) {
      res.status(200).json(user)
    } else {
      res.status(404).json({ message: "User not found" })
    }
  } catch (error) {
    console.error("Get user error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Private
export const updateUser = async (req, res) => {
  try {
    const { name } = req.body
    const userId = req.params.id

    // Check if user is updating their own profile or is an admin
    if (req.user._id.toString() !== userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" })
    }

    const user = await User.findById(userId)

    if (user) {
      user.name = name || user.name

      const updatedUser = await user.save()

      res.status(200).json({
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      })
    } else {
      res.status(404).json({ message: "User not found" })
    }
  } catch (error) {
    console.error("Update user error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

// @desc    Promote user to admin
// @route   PUT /api/users/:id/promote
// @access  Admin
export const promoteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)

    if (user) {
      if (user.role === "admin") {
        return res.status(400).json({ message: "User is already an admin" })
      }

      user.role = "admin"
      const updatedUser = await user.save()

      res.status(200).json({
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      })
    } else {
      res.status(404).json({ message: "User not found" })
    }
  } catch (error) {
    console.error("Promote user error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

