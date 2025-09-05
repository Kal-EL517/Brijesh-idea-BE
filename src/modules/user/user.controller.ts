import { Request, Response } from "express";
import { UserModel } from "../../models/user.model";
import { UserService } from "./user.service";
import { Codes, Message } from "../../utils/message.utils";

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
            const result: any = await this.userService.userSubscriptionList(userId);
            return res.status(result.statusCode).json(result);
        } catch (error) {
            console.log(error);
            res.status(Codes.INTERNAL_SERVER_ERROR).json({ message: Message.INTERNAL_SERVER_ERROR });
        }
    };

}
