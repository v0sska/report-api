import * as crypto from 'node:crypto';
import * as dotenv from 'dotenv';
import config from '../configs';

dotenv.config();

const ALGORITHM = 'aes-256-cbc';

export class CryptoUtil {
  public static encrypt(text: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
      ALGORITHM,
      Buffer.from(config.server.crypto),
      iv,
    );

    let encrypted = cipher.update(text);

    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return iv.toString('hex') + ':' + encrypted.toString('hex');
  }

  public static decrypt(text: string): string {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv(
      ALGORITHM,
      Buffer.from(config.server.crypto),
      iv,
    );

    let decrypted = decipher.update(encryptedText);

    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
  }

  public static generateUUID(): string {
    return crypto.randomUUID();
  }
}
