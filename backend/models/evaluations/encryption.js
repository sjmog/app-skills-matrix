const crypto = require('crypto');

const encryptionpassword = process.env.ENCRYPTION_PASSWORD;

module.exports.encrypt = (changes) => {
  if (!Boolean(changes.skills)) {
    return changes;
  }
  const cipher = crypto.createCipher('aes192', encryptionpassword);
  let encryptedSkills = cipher.update(JSON.stringify(changes.skills), 'utf8', 'hex');
  encryptedSkills += cipher.final('hex');

  return Object.assign({}, changes, { skills: null, encryptedSkills })
};

module.exports.decrypt = (fromDb) => {
  const decipher = crypto.createDecipher('aes192', encryptionpassword);
  let decrypted = decipher.update(fromDb.encryptedSkills, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return Object.assign({}, fromDb, { skills: JSON.parse(decrypted), encryptedSkills: null })
};
