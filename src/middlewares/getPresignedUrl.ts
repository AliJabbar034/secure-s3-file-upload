// src/middlewares/getPresignedUrl.ts
import { Request, Response, NextFunction } from "express";
import { getPresignedUrl } from "../utils/presignedUrl";

interface GetUrlOptions {
  expiresInSeconds?: number;
}

export const generatePresignedUrl = (options?: GetUrlOptions) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const fileKey = req.params.key; // Assuming the file key is provided as a URL parameter
      const expires = options?.expiresInSeconds || 3600; // Default 1 hour

      const url = await getPresignedUrl(fileKey, expires);
      res.status(200).json({ url });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
};
