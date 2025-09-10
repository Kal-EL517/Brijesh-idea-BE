import { Request, Response } from "express";
import { UserModel } from "../../models/user.model";
import { UserService } from "./user.service";
import { Codes, Message } from "../../utils/message.utils";
import { Utils } from "../../utils/utils";

export class UserController {

    public userService = new UserService();

    public googleAuth = async (req: Request, res: Response) => {
        try {
            const { code } = req.body;
            const result: any = await this.userService.googleAuth(code);
            return res.status(result.statusCode).json(result);
        } catch (error) {
            console.log(error);
            res.status(Codes.INTERNAL_SERVER_ERROR).json({ message: Message.INTERNAL_SERVER_ERROR });
        }
    };

    public userSubscriptionList = async (req: any, res: Response) => {
        try {
            const user = req['user'];
            const { userId } = req;
            const { sort_by, order } = req['query'];
            const result: any = await this.userService.userSubscriptionList(Utils.mongoID(userId), sort_by, +order);
            return res.status(result.statusCode).json(result);
        } catch (error) {
            console.log(error);
            res.status(Codes.INTERNAL_SERVER_ERROR).json({ message: Message.INTERNAL_SERVER_ERROR });
        }
    };

    public channelDetailsByChannelId = async (req: any, res: Response) => {
        try {
            const user = req['user'];
            const { userId } = req;
            const { channel_id } = req['query'];
            const result: any = await this.userService.channelDetailsByChannelId(Utils.mongoID(userId), channel_id);
            return res.status(result.statusCode).json(result);
        } catch (error) {
            console.log(error);
            res.status(Codes.INTERNAL_SERVER_ERROR).json({ message: Message.INTERNAL_SERVER_ERROR });
        }
    };

     public channelPlaylistsByChannelId = async (req: any, res: Response) => {
        try {
            const user = req['user'];
            const { userId } = req;
            const { channel_id, playlist_id } = req['query'];
            const result: any = await this.userService.channelPlaylistByChannelId(Utils.mongoID(userId), channel_id, playlist_id);
            return res.status(result.statusCode).json(result);
        } catch (error) {
            console.log(error);
            res.status(Codes.INTERNAL_SERVER_ERROR).json({ message: Message.INTERNAL_SERVER_ERROR });
        }
    };

    public videoPlaylistsByPlaylistId = async (req: any, res: Response) => {
        try {
            const user = req['user'];
            const { userId } = req;
            const { playlist_id } = req['query'];
            const result: any = await this.userService.videoPlayLists(Utils.mongoID(userId), playlist_id);
            return res.status(result.statusCode).json(result);
        } catch (error) {
            console.log(error);
            res.status(Codes.INTERNAL_SERVER_ERROR).json({ message: Message.INTERNAL_SERVER_ERROR });
        }
    };
}
