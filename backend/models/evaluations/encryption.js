const crypto = require('crypto');

const encryptionpassword = process.env.ENCRYPTION_PASSWORD;

module.exports.encrypt = (changes) => {
  if (!Boolean(changes.skillGroups)) {
    return changes;
  }
  const cipher = crypto.createCipher('aes192', encryptionpassword);
  let encryptedSkillGroups = cipher.update(JSON.stringify(changes.skillGroups), 'utf8', 'hex');
  encryptedSkillGroups += cipher.final('hex');

  return Object.assign({}, changes, { skillGroups: null, encryptedSkillGroups })
};

module.exports.decrypt = (fromDb) => {
  const decipher = crypto.createDecipher('aes192', encryptionpassword);
  let decrypted = decipher.update(fromDb.encryptedSkillGroups, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return Object.assign({}, fromDb, { skillGroups: JSON.parse(decrypted), encryptedSkillGroups: null })
};
