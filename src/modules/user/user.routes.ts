import { Router } from "express";
import { UserController } from "./user.controller";
import { verifyUserCode } from "./validators";
import { MiddleWare } from "../../midleware";

const router = Router();
const userController = new UserController(); // create instance
const middleware = new MiddleWare();

//google signin 
router.post("/auth/google",verifyUserCode,userController.googleAuth);

//gives list of subscribed youtube channel
router.get("/subscription-list",middleware.authMiddleware,userController.userSubscriptionList);

export default router;