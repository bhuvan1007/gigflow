import express from "express";
import { createBid, getBidsByGig, hireFreelancer, getMyBid, updateBid, deleteBid, getBids } from "../controllers/bid.controller.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

router.post("/", verifyToken, createBid);
router.get("/", verifyToken, getBids); // New generic search/filter route
router.get("/:gigId", verifyToken, getBidsByGig); // Specific for a gig (kept for backward compat or specific logic)
router.get("/gig/:gigId/my", verifyToken, getMyBid);
router.patch("/:bidId/hire", verifyToken, hireFreelancer);
router.delete("/:id", verifyToken, deleteBid);
router.put("/:id", verifyToken, updateBid);

export default router;
