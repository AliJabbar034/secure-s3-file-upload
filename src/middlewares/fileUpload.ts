// src/middlewares/fileUpload.ts
import multer from "multer";
import { Request, Response, NextFunction } from "express";
import { encrypt } from "../utils/encrypt";
import { storageConfig } from "../config/storage";
import * as Yup from "yup";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

const fileSchema = Yup.object({
  mimetype: Yup.string().oneOf(["image/jpeg", "application/pdf"]).required(),
  size: Yup.number()
    .max(5 * 1024 * 1024)
    .required(),
});

interface Options {
  storage: "local" | "s3";
}

interface Req extends Request {
  file: any;
}
export const secureFileUpload = (options: Options) => {
  return async (req: Req, res: Response, next: NextFunction) => {
    upload.single("file")(req, res, async (err: any) => {
      if (err) return res.status(400).send({ error: "File upload error!" });

      try {
        const file = req.file;
        if (!file) throw new Error("File not provided");

        // Validate file
        await fileSchema.validate({
          mimetype: file.mimetype,
          size: file.size,
        });

        // Encrypt file
        const { encrypted, iv } = encrypt(file.buffer);

        // Upload to storage
        if (options.storage === "s3") {
          const { s3Instance, bucket } = storageConfig.s3;
          await s3Instance
            .upload({
              Bucket: bucket,
              Key: `uploads/${Date.now()}_${file.originalname}`,
              Body: encrypted,
            })
            .promise();
        } else if (options.storage === "local") {
          const fs = await import("fs/promises");
          const path = await import("path");
          const filePath = path.join(
            storageConfig.local.destination,
            file.originalname
          );
          await fs.writeFile(filePath, encrypted);
        }

        res.status(200).send({ message: "File uploaded securely!" });
      } catch (validationErr: any) {
        res.status(400).send({ error: validationErr.message });
      }
    });
  };
};
