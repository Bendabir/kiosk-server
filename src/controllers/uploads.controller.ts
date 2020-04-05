import * as crypto from "crypto";
import { Request } from "express";
import * as fs from "fs";
import * as mime from "mime-types";
import { FileFilterCallback } from "multer";
import * as path from "path";
import { promisify } from "util";
import { BadRequestError, ResourceNotFoundError } from "../exceptions";

export interface File {
    filename: string;
    mimeType: string;
    size: number;
    creationDate: Date;
    uri: string;
}

export enum AcceptedTypes {
    PNG = "image/png",
    JPEG = "image/jpeg",
    GIF = "image/gif"
}

type FileDestinationCallback = (error: Error, destination: string) => void;
type FileFilenameCallback = (error: Error, filename: string) => void;

export class UploadsController {
    public static ACCEPTED_TYPES = new Set(Object.values(AcceptedTypes));
    private static readDir = promisify(fs.readdir);
    private static unlink = promisify(fs.unlink);

    public uploadDir: string;
    public serverURL: string;

    constructor(uploadDir: string, serverURL: string) {
        this.uploadDir = uploadDir;
        this.serverURL = serverURL;
    }

    public async deleteFile(filename: string): Promise<void> {
        try {
            await UploadsController.unlink(path.join(this.uploadDir, filename));
        } catch (err) {
            throw new ResourceNotFoundError(err.message);
        }
    }

    public async listUploadedFiles(): Promise<File[]> {
        if (!fs.existsSync(this.uploadDir)) {
            return [];
        }

        const files = await UploadsController.readDir(this.uploadDir);

        return files.map((filename) => {
            const filePath = path.join(this.uploadDir, filename);
            const stats = fs.statSync(filePath);

            return {
                creationDate: new Date(stats.birthtime),
                filename,
                mimeType: mime.lookup(filePath) || null,
                size: stats.size,
                uri: `${this.serverURL}/files/${filename}`
            };
        });
    }

    public filter(req: Request, file: Express.Multer.File, callback: FileFilterCallback) {
        if (!UploadsController.ACCEPTED_TYPES.has(file.mimetype as AcceptedTypes)) {
            callback(new BadRequestError(`Accepted files are : ${[...UploadsController.ACCEPTED_TYPES].join(", ")}`));
        } else {
            callback(null, true);
        }
    }

    public destination(req: Request, file: Express.Multer.File, callback: FileDestinationCallback) {
        callback(null, this.uploadDir);
    }

    public filename(req: Request, file: Express.Multer.File, callback: FileFilenameCallback) {
        // Add the file extension
        let filename = crypto.randomBytes(16).toString("hex");

        switch (file.mimetype as AcceptedTypes) {
            case AcceptedTypes.JPEG: {
                filename += ".jpg";
                break;
            }
            case AcceptedTypes.PNG: {
                filename += ".png";
                break;
            }
            case AcceptedTypes.GIF: {
                filename += ".gif";
                break;
            }
        }

        callback(null, filename);
    }

    public convert(file: Express.Multer.File): File {
        return {
            creationDate: new Date(),
            filename: file.filename,
            mimeType: file.mimetype,
            size: file.size,
            uri: `${this.serverURL}/files/${file.filename}`
        };
    }
}
