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
router.get("/subscribe-channel-list",middleware.authMiddleware,userController.userSubscriptionList);

//give channel details by channelId
router.get('/get-channel-details-by-channelId',middleware.authMiddleware,userController.channelDetailsByChannelId);

//give channel playlists by channelId
router.get('/channel-playlists',middleware.authMiddleware,userController.channelPlaylistsByChannelId);

//Videoplaylist by playlist_id
router.get('/video-playlists-by-playlist-id',middleware.authMiddleware,userController.videoPlaylistsByPlaylistId);

export default router;