// pages/api/verifyToken.ts
import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const JWT_SECRET = "jsonwebtoken_secret_key";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.cookies.jwt_token;

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return res.status(200).json({ success: true, decoded });
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
}
