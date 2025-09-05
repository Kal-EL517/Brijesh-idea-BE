import userRoutes from "./modules/user/user.routes";
import { Router } from "express";


const router = Router();

// attach all route modules here
router.use("/users", userRoutes);

export default router;
