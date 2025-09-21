import mongoose, {Schema, model, models } from "mongoose";

export const VIDEO_DIMENSIONS = {
    width: 1080,
    heigth: 1920,
}
export interface IVideo {
    _id?: mongoose.Types.ObjectId;
    title: string;
    description: string;
    videoUrl: string;
    thembnailUrl: string;
    controls?: boolean;
    transformation?: {
        height: number;
        width: number;
        quality?: number
    }
}

const videoSchema = new Schema<IVideo>({
    title: {type: String, required: true},
    description: {type: String, required: true},
    videoUrl: {type: String, required: true},
    thembnailUrl: {type: String, required: true},
    controls: {type: Boolean, default: true},
    transformation: {
        height: {type: Number, default: VIDEO_DIMENSIONS.heigth},
        width: {type: Number, default: VIDEO_DIMENSIONS.width}, 
        quality: {type: Number, min: 1, max: 100 }
    }
}, {timestamps: true})

const Video = models?.User || model<IVideo>("Video", videoSchema)

export default Video;