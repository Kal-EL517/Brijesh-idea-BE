import mongoose, { ObjectId } from "mongoose";

export class Utils{

    public static mongoID(id : string | ObjectId){
        if(id && typeof id == 'string'){
            return new mongoose.Types.ObjectId(id)
        }
        return id;
    }
    
}