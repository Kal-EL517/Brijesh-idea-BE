import { UserModel } from "../../models/user.model"
import { ResponseUtil } from "../../utils/response.util";
import googleClient from '../../utils/googleClient';
import { google } from "googleapis";
import { JwtUtil } from "../../utils/jwt.utility";
import { Message, sortOrder } from "../../utils/message.utils";
import { YoutubeService } from "../../services/youtubeService";
import { SubscribeChannelModel } from "../../models/subscribeChannel.model";
import { Utils } from "../../utils/utils";

export class UserService {

    private youtubeService: any;

    constructor() {
        this.youtubeService = new YoutubeService();
    }

    public async googleAuth(code: string) {
        const googleDetails = await this.getUserDetailsFromGoogle(code);
        let user: any = await UserModel.findOne({ email: googleDetails.email }).lean();
        if (!user?._id) {
            user = await UserModel.create(this.getUser(googleDetails));
        }
        else {
            const userDetails = this.getUser(googleDetails);
            await UserModel.updateOne({ _id: user._id }, {
                google_access_token: userDetails.google_access_token,
                google_refresh_token: userDetails.google_refresh_token,
                google_scope: userDetails.google_scope,
                google_token_type: userDetails.google_token_type,
                google_id_token: userDetails.google_id_token,
                google_refresh_token_expires_in: userDetails.google_refresh_token_expires_in,
                google_expiry_date: userDetails.google_expiry_date
            })
        }
        console.log(user);
        const userPayload = {
            _id: user._id,
            email: user.email,
            name: user.name,
        }
        const jwtToken = JwtUtil.sign(userPayload);

        return ResponseUtil.success(Message.USER_SIGNIN_SUCCESS,
            {
                code: code,
                token: jwtToken,
                user: {
                    picture: user.picture,
                    name: user.name,
                    emailId: user.email
                }
            });
    }

    private getUserDetailsFromGoogle(code: string): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const { tokens } = await googleClient.getToken(code);
                console.log(tokens);

                googleClient.setCredentials(tokens);

                const oauth2 = google.oauth2({
                    auth: googleClient,
                    version: "v2",
                });

                const { data } = await oauth2.userinfo.get();

                resolve({
                    ...data,
                    ...tokens,
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    private getUser(googleDetails: any) {
        return {
            googleId: googleDetails.id,
            email: googleDetails.email,
            verified_email: googleDetails.verified_email,
            given_name: googleDetails.given_name,
            family_name: googleDetails.family_name,
            name: googleDetails.name,
            picture: googleDetails.picture,
            google_access_token: googleDetails.access_token,
            google_refresh_token: googleDetails.refresh_token,
            google_scope: googleDetails.scope,
            google_token_type: googleDetails.token_type,
            google_id_token: googleDetails.id_token,
            google_refresh_token_expires_in: googleDetails.refresh_token_expires_in,
            google_expiry_date: googleDetails.expiry_date
        }
    }

    public async userSubscriptionList(userId: any, sort_by: any = 'title', order: any = sortOrder.ASC) {

        // check in DB
        const userSubscribeChannel = await SubscribeChannelModel.find(
            {
                userId: userId
            }
        ).sort(
            {
                [sort_by]: order
            }
        );

        if (userSubscribeChannel?.length) {
            return ResponseUtil.success(Message.USER_SUBSCRIPTION_LIST, {
                result: userSubscribeChannel,
                totalResult: userSubscribeChannel.length,
                isFromDB: true
            });
        }

        //fetch from Youtube API and Save in DB
        else {
            const youtubeClient = await this.youtubeService.getYouTubeClient(userId);

            let res = await youtubeClient.subscriptions.list({
                part: ["snippet", "contentDetails"],
                mine: true,
                maxResults: 25,
            });

            if (res?.data?.items?.length) {
                const result = res?.data?.items?.map((channel: any) => {
                    const details = {
                        title: channel.snippet.title,
                        description: channel.snippet.description,
                        resourceId: channel.snippet.resourceId,
                        thumbnails: channel.snippet.thumbnails,
                        userId: userId
                    }
                    return details;
                });

                if (result.length) {
                    await SubscribeChannelModel.create(result);
                }
                return ResponseUtil.success(Message.USER_SUBSCRIPTION_LIST, {
                    result,
                    totalResult: res.data.pageInfo.totalResults,
                    isFromDB: false
                });
            }

            return ResponseUtil.success(Message.USER_SUBSCRIPTION_LIST, {
                result: [],
                totalResult: 0,
                isFromDB: false
            });
        }

    }

    public async channelDetailsByChannelId(userId: any, channel_id: string) {
        const youtubeClient = await this.youtubeService.getYouTubeClient(userId);

        const res = await youtubeClient.channels.list({
            part: ["snippet", "contentDetails", "statistics"],
            id: [channel_id], // channel ID here
        });

        return ResponseUtil.success(Message.CHANNEL_DETAILS, {
            result: res.data.items[0],
        });
    }

     public async channelPlaylistByChannelId(userId: any, channel_id: string,playlist_id : string) {
        const youtubeClient = await this.youtubeService.getYouTubeClient(userId);

        const res = await youtubeClient.playlists.list({
            part: ["snippet", "contentDetails"],
            channelId: channel_id, // channel ID here
            maxResults: 25
        });

        return ResponseUtil.success(Message.CHANNEL_DETAILS, {
            res,
        });
    }

     public async videoPlayLists(userId: any , playlist_id : string) {
        const youtubeClient = await this.youtubeService.getYouTubeClient(userId);

        const res = await youtubeClient.playlistItems.list({
            part: ["snippet", "contentDetails"],
            playlistId : playlist_id,
            maxResults: 25
        });

        return ResponseUtil.success(Message.CHANNEL_DETAILS, {
            result : res?.data?.items,
            totalResults : res?.data?.pageInfo?.totalResults
        });
    }

}