import { google } from "googleapis";
import { UserModel } from "../models/user.model";
import googleClient from '../utils/googleClient';
import { Utils } from "../utils/utils";

export class YoutubeService {
    private googleClientObj: any;

    constructor() {
        this.googleClientObj = googleClient;
    }

    public async getYouTubeClient(userId:any) {

        userId = Utils.mongoID(userId);
        
        const userTokens: any = await UserModel.findOne({ _id: userId }, {
            google_access_token: 1,
            google_refresh_token: 1,
            google_expiry_date: 1
        }).lean();

        this.googleClientObj.setCredentials(
            {
                access_token: userTokens.google_access_token,
                refresh_token: userTokens.google_refresh_token,
            }
        );

        this.googleClientObj.on("tokens", async (tokens:any) => {
            if (userTokens && tokens.access_token && tokens.access_token !== userTokens.google_access_token) {
                console.log('tokensss', tokens.access_token);
                await UserModel.updateOne({_id : userTokens._id},{
                    google_access_token : tokens.access_token,
                    google_expiry_date : new Date(Date.now() + 3600 * 1000)
                })
            }
        });

        return google.youtube({ version: "v3", auth: this.googleClientObj });
    }
}