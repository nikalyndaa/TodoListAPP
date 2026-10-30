import { IImageFile } from "../common/IImageFile";

export interface IRegisterType{
    firstName:string;
    lastName:string;
    email:string;
    password:string;
    confirmPassword:string;
    imageFile?: IImageFile
}