import { randomBytes, createCipheriv, createDecipheriv } from "crypto";

const algorithm = process.env.ENCRYPTION_ALGORITHM || "aes-256-cbc";
const key = Buffer.from(process.env.ENCRYPTION_KEY || "", "hex");
const iv = randomBytes(16);

export const encrypt = (buffer: Buffer): { encrypted: Buffer; iv: Buffer } => {
  const cipher = createCipheriv(algorithm, key, iv);
  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  return { encrypted, iv };
};

export const decrypt = (encrypted: Buffer, iv: Buffer): Buffer => {
  const decipher = createDecipheriv(algorithm, key, iv);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]);
};
