// imports
import express from "express";
import {
	createBuddyHandler,
	deleteBuddyHandler,
	getAllBuddiesHandler,
	getBuddyHandler,
	updateBuddyHandler,
} from "../controllers/buddies.controllers.js";

// create a router
const router = express.Router();

// set up routes
router.get("/", getAllBuddiesHandler);
router.get("/search", getBuddyHandler);
router.post("/", createBuddyHandler);
router.put("/:id", updateBuddyHandler);
router.delete("/:id", deleteBuddyHandler);

// export router
export { router as buddiesRouter };
