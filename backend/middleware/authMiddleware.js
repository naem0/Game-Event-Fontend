import User from "../models/User.js"

// Protect routes - verify user is authenticated
export const protect = async (req, res, next) => {
  const token = req.headers.authorization

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" })
  }

  try {
    // In a real app, you'd verify a JWT here
    // For simplicity, we're using the user ID directly
    const userId = token.split(" ")[1]
    const user = await User.findById(userId)

    if (!user) {
      return res.status(401).json({ message: "Not authorized, user not found" })
    }

    req.user = user
    next()
  } catch (error) {
    console.error(error)
    res.status(401).json({ message: "Not authorized, token failed" })
  }
}

// Admin middleware
export const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next()
  } else {
    res.status(403).json({ message: "Not authorized as an admin" })
  }
}

