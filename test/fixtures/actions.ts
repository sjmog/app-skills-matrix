import users from './users';

export default [
  {
    type : 'FEEDBACK',
    user : {
      id: users.magic._id,
      name : 'User Magic',
      mentorId : null,
    },
    skill : {
      id : 1,
      name : 'Dragon Feeding',
      criteria : 'Can successfully feed their dragon',
    },
    evaluation : {
      id : 'eval_1',
      createdDate : 'new Date()',
    },
    createdDate : 'new Date()',
  },
  {
    type : 'FEEDBACK',
    user : {
      id: users.magic._id,
      name : 'User Magic',
      mentorId : null,
    },
    skill : {
      id : 1,
      name : 'Dragon Feeding',
      criteria : 'Can successfully feed their dragon',
    },
    evaluation : {
      id : 'eval_2',
      createdDate : 'new Date()',
    },
    createdDate : 'new Date()',
  },
  {
    type : 'OBJECTIVE',
    user : {
      id: users.magic._id,
      name : 'User Magic',
      mentorId : null,
    },
    skill : {
      id : 1,
      name : 'Dragon Feeding',
      criteria : 'Can successfully feed their dragon',
    },
    evaluation : {
      id : 'eval_2',
      createdDate : 'new Date()',
    },
    createdDate : 'new Date()',
  },
];
