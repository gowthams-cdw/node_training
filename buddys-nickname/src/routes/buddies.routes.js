// imports
import express from "express";
import { buddiesController } from "../controllers/index.js";
import { asyncHandler } from "../utils/index.js";

// create a router
const router = express.Router();

////////////////
// set up routes
////////////////
router.get("/", asyncHandler(buddiesController.getAllBuddies));
router.get("/search", asyncHandler(buddiesController.getBuddy));
router.post("/", asyncHandler(buddiesController.createNewBuddy));
router.put("/:id", asyncHandler(buddiesController.updateBuddy));
router.delete("/:id", asyncHandler(buddiesController.deleteBuddy));

// export router
export { router as buddiesRouter };
