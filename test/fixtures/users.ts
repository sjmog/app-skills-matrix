import { ObjectID } from 'mongodb';

export default ({
  dmorgantini: {
    _id: new ObjectID(),
    username: 'dmorgantini',
    email: 'dmorgantini@gmail.com',
    name: 'David Morgantini',
    avatarUrl: 'https://www.tes.com/logo.svg',
  },
  magic: {
    _id: new ObjectID(),
    username: 'magic',
    email: 'user@magic.com',
    name: 'User Magic',
    templateId: 'eng-nodejs',
    avatarUrl: 'https://www.tes.com/logo.svg',
  },
  dragonrider: {
    _id: new ObjectID(),
    email: 'user@dragon-riders.com',
    username: 'dragon-rider',
    name: 'User Dragon Rider',
    avatarUrl: 'https://www.tes.com/logo.svg',
  },
});
