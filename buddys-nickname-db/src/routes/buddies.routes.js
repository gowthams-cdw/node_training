// imports
import express from "express";
import { buddiesController } from "../controllers/index.js";

// create a router
const router = express.Router();

// set up routes
router.get("/", buddiesController.getAllBuddies);
router.get("/search", buddiesController.getBuddy);
router.post("/", buddiesController.createNewBuddy);
router.put("/:id", buddiesController.updateBuddy);
router.delete("/:id", buddiesController.deleteBuddy);

// export router
export { router as buddiesRouter };
