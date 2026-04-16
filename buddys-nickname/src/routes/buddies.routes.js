// imports
import express from "express";
import {  asyncHandler } from "../utils/index.js";
import { DATA_FILE_PATH } from "../constants/index.js";
import { buddiesController } from "../controllers/index.js";

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
