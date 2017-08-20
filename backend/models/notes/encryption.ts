import * as crypto from 'crypto';

const encryptionpassword = process.env.ENCRYPTION_PASSWORD;

export const encrypt = (changes) => {
  if (!changes.note) { // TODO: Is there a test that can be added here?
    return changes;
  }

  const cipher = crypto.createCipher('aes192', encryptionpassword);
  let encryptedNote = cipher.update(JSON.stringify(changes.note), 'utf8', 'hex');
  encryptedNote += cipher.final('hex');

  return Object.assign({}, changes, { note: encryptedNote });
};

export const decrypt = (fromDb) => {
  const decipher = crypto.createDecipher('aes192', encryptionpassword);
  let decrypted = decipher.update(fromDb.note, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return Object.assign({}, fromDb, { note: JSON.parse(decrypted) });
};
