import { Request } from "express";
import { Controllers } from "../controllers";

export interface RequestWithControllers extends Request {
    controllers: Controllers;
}
