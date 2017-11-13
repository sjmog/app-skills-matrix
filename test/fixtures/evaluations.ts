import { ObjectID } from 'mongodb';
import users from './users';

const user = {
  id: users.dmorgantini._id.toString(),
  name: users.dmorgantini.name,
  email: users.dmorgantini.email,
};

export default [
  {
    _id: new ObjectID(),
    user,
    createdDate: new Date(),
    status: 'NEW',
    template: {
      id: 'eng-nodejs',
      name: 'Node JS Dev',
      version: 1,
      categories: [
        'Magicness',
        'Dragon Flight',
        'Dragon Slaying',
      ],
      levels: [
        'Expert',
        'Knowledgeable',
        'Experienced Beginner',
        'Novice',
      ],
    },
    skills: [
      {
        id: 5,
        name: 'Knows what slaying a dragon means',
        criteria: '',
        type: 'skill',
        version: 1,
        questions: [],
        status: {
          previous: null,
          current: null,
        },
      },
      {
        id: 6,
        name: 'Has successfully slayed a dragon',
        criteria: 'You have slayed at least one dragon',
        type: 'behaviour',
        version: 1,
        questions: [],
        status: {
          previous: null,
          current: null,
        },
      },
      {
        id: 2,
        name: 'Advanced knowledge of Dragon Flight',
        criteria: 'Is able to fly their dragon in all situations',
        type: 'skill',
        version: 1,
        questions: [
          {
            title: 'Are you able to fly your dragon in a hurricane?',
          },
          {
            title: 'Can you memoize your dragon?',
          },
        ],
        status: {
          previous: null,
          current: null,
        },
      },
      {
        id: 4,
        name: 'Working knowledge of the Dark Arts',
        criteria: 'Can execute the Toenail-growing hex',
        type: 'skill',
        version: 1,
        questions: [
          {
            title: 'Have you hexed anyone in the last month?',
          },
        ],
        status: {
          previous: null,
          current: null,
        },
      },
      {
        id: 1,
        name: 'Dragon Feeding',
        criteria: 'Can successfully feed their dragon',
        type: 'skill',
        version: 1,
        questions: [
          {
            title: 'Do you know where to get the dragon food?',
          },
          {
            title: 'Are you able to feed a dragon and retain your hands',
          },
        ],
        status: {
          previous: null,
          current: null,
        },
      },
      {
        id: 3,
        name: 'Advanced knowledge of the Dark Arts',
        criteria: 'Can execute the Imperius Curse',
        type: 'skill',
        version: 1,
        questions: [
          {
            title: 'Can you speak parseltongue?',
          },
        ],
        status: {
          previous: null,
          current: null,
        },
      },
      {
        id: 7,
        name: 'Knows the 8 principles of slaying a dragon',
        criteria: '',
        type: 'skill',
        version: 1,
        questions: [],
        status: {
          previous: null,
          current: null,
        },
      },
      {
        id: 8,
        name: 'In depth understanding of the theory behind slaying a dragon',
        criteria: '',
        type: 'skill',
        version: 1,
        questions: [],
        status: {
          previous: null,
          current: null,
        },
      },
      {
        id: 9,
        name: 'Can groom their dragon to reduce drag',
        criteria: '',
        type: 'skill',
        version: 1,
        questions: [],
        status: {
          previous: null,
          current: null,
        },
      },
      {
        id: 10,
        name: 'Can fly their dragon in good conditions',
        criteria: '',
        type: 'skill',
        version: 1,
        questions: [],
        status: {
          previous: null,
          current: null,
        },
      },
      {
        id: 11,
        name: 'Good grasp of the key concepts behind the Dark Arts',
        criteria: '',
        type: 'skill',
        version: 1,
        questions: [],
        status: {
          previous: null,
          current: null,
        },
      },
      {
        id: 12,
        name: 'In depth understanding of the Dark Arts',
        criteria: '',
        type: 'skill',
        version: 1,
        questions: [],
        status: {
          previous: null,
          current: null,
        },
      },
    ],
    skillGroups: [
      {
        id: 0,
        level: 'Novice',
        category: 'Dragon Slaying',
        skills: [
          5,
        ],
      },
      {
        id: 1,
        level: 'Expert',
        category: 'Dragon Slaying',
        skills: [
          6,
        ],
      },
      {
        id: 2,
        level: 'Expert',
        category: 'Dragon Flight',
        skills: [
          2,
        ],
      },
      {
        id: 3,
        level: 'Novice',
        category: 'Magicness',
        skills: [
          4,
        ],
      },
      {
        id: 4,
        level: 'Novice',
        category: 'Dragon Flight',
        skills: [
          1,
        ],
      },
      {
        id: 5,
        level: 'Expert',
        category: 'Magicness',
        skills: [
          3,
        ],
      },
      {
        id: 6,
        level: 'Experienced Beginner',
        category: 'Dragon Slaying',
        skills: [
          7,
        ],
      },
      {
        id: 7,
        level: 'Knowledgeable',
        category: 'Dragon Slaying',
        skills: [
          8,
        ],
      },
      {
        id: 8,
        level: 'Experienced Beginner',
        category: 'Dragon Flight',
        skills: [
          9,
        ],
      },
      {
        id: 9,
        level: 'Knowledgeable',
        category: 'Dragon Flight',
        skills: [
          10,
        ],
      },
      {
        id: 10,
        level: 'Experienced Beginner',
        category: 'Magicness',
        skills: [
          11,
        ],
      },
      {
        id: 11,
        level: 'Knowledgeable',
        category: 'Magicness',
        skills: [
          12,
        ],
      },
    ],
  },
  {
    _id: new ObjectID(),
    user,
    createdDate: new Date(),
    status: 'NEW',
    template: {
      id: 'eng-nodejs',
      name: 'Node JS Dev',
      version: 1,
      categories: [
        'Magicness',
        'Dragon Flight',
      ],
      levels: [
        'Novice',
        'Expert',
      ],
    },
    skills: [
      {
        id: 1,
        name: 'Dragon Feeding',
        criteria: 'Can successfully feed their dragon',
        type: 'skill',
        version: 1,
        questions: [
          {
            title: 'Do you know where to get the dragon food?',
          },
          {
            title: 'Are you able to feed a dragon and retain your hands',
          },
        ],
        status: {
          previous: null,
          current: 'ATTAINED',
        },
        notes: ['noteId_1', 'noteId_2'],
      },
      {
        id: 2,
        name: 'Advanced knowledge of Dragon Flight',
        criteria: 'Is able to fly their dragon in all situations',
        type: 'skill',
        version: 1,
        questions: [
          {
            title: 'Are you able to fly your dragon in a hurricane?',
          },
          {
            title: 'Can you memoize your dragon?',
          },
        ],
        status: {
          previous: null,
          current: 'FEEDBACK',
        },
        notes: [],
      },
      {
        id: 3,
        name: 'Advanced knowledge of the Dark Arts',
        criteria: 'Can execute the Imperius Curse',
        type: 'skill',
        version: 1,
        questions: [
          {
            title: 'Can you speak parseltongue?',
          },
        ],
        status: {
          previous: null,
          current: 'OBJECTIVE',
        },
      },
      {
        id: 4,
        name: 'Working knowledge of the Dark Arts',
        criteria: 'Can execute the Toenail-growing hex',
        type: 'skill',
        version: 1,
        questions: [
          {
            title: 'Have you hexed anyone in the last month?',
          },
        ],
        status: {
          previous: null,
          current: null,
        },
      },
      {
        id: 6,
        name: 'Has successfully slayed a dragon',
        criteria: 'You have slayed at least one dragon',
        type: 'behaviour',
        version: 1,
        questions: [],
        status: {
          previous: null,
          current: 'ATTAINED',
        },
      },
    ],
    skillGroups: [
      {
        id: 0,
        level: 'Novice',
        category: 'Dragon Flight',
        skills: [
          1,
        ],
      },
      {
        id: 1,
        level: 'Expert',
        category: 'Dragon Flight',
        skills: [
          2,
        ],
      },
      {
        id: 2,
        level: 'Expert',
        category: 'Magicness',
        skills: [
          3,
        ],
      },
      {
        id: 3,
        level: 'Novice',
        category: 'Magicness',
        skills: [
          4,
          6,
        ],
      },
    ],
  },
  {
    _id: new ObjectID(),
    user,
    createdDate: new Date(),
    status: 'NEW',
    template: {
      id: 'eng-nodejs',
      name: 'Node JS Dev',
      version: 1,
      categories: [
        'Magicness',
        'Dragon Flight',
        'Dragon Slaying',
      ],
      levels: [
        'Expert',
        'Knowledgeable',
        'Experienced Beginner',
        'Novice',
      ],
    },
    skills: [
      {
        id: 5,
        name: 'Knows what slaying a dragon means',
        criteria: '',
        type: 'skill',
        version: 1,
        questions: [],
        status: {
          previous: 'NEW',
          current: null,
        },
      },
      {
        id: 6,
        name: 'Has successfully slayed a dragon',
        criteria: 'You have slayed at least one dragon',
        type: 'behaviour',
        version: 1,
        questions: [],
        notes: [],
        status: {
          previous: 'ATTAINED',
          current: null,
        },
      },
      {
        id: 2,
        name: 'Advanced knowledge of Dragon Flight',
        criteria: 'Is able to fly their dragon in all situations',
        type: 'skill',
        version: 1,
        questions: [
          {
            title: 'Are you able to fly your dragon in a hurricane?',
          },
          {
            title: 'Can you memoize your dragon?',
          },
        ],
        status: {
          previous: 'FEEDBACK',
          current: null,
        },
        notes: [],
      },
      {
        id: 4,
        name: 'Working knowledge of the Dark Arts',
        criteria: 'Can execute the Toenail-growing hex',
        type: 'skill',
        version: 1,
        questions: [
          {
            title: 'Have you hexed anyone in the last month?',
          },
        ],
        status: {
          previous: null,
          current: null,
        },
        notes: [],
      },
      {
        id: 1,
        name: 'Dragon Feeding',
        criteria: 'Can successfully feed their dragon',
        type: 'skill',
        version: 1,
        questions: [
          {
            title: 'Do you know where to get the dragon food?',
          },
          {
            title: 'Are you able to feed a dragon and retain your hands',
          },
        ],
        status: {
          previous: 'ATTAINED',
          current: 'ATTAINED',
        },
        notes: ['noteId_1', 'noteId_2'],
      },
      {
        id: 3,
        name: 'Advanced knowledge of the Dark Arts',
        criteria: 'Can execute the Imperius Curse',
        type: 'skill',
        version: 1,
        questions: [
          {
            title: 'Can you speak parseltongue?',
          },
        ],
        status: {
          previous: 'OBJECTIVE',
          current: null,
        },
        notes: [],
      },
      {
        id: 7,
        name: 'Knows the 8 principles of slaying a dragon',
        criteria: '',
        type: 'skill',
        version: 1,
        questions: [],
        status: {
          previous: 'NEW',
          current: null,
        },
      },
      {
        id: 8,
        name: 'In depth understanding of the theory behind slaying a dragon',
        criteria: '',
        type: 'skill',
        version: 1,
        questions: [],
        status: {
          previous: 'NEW',
          current: null,
        },
      },
      {
        id: 9,
        name: 'Can groom their dragon to reduce drag',
        criteria: '',
        type: 'skill',
        version: 1,
        questions: [],
        status: {
          previous: 'NEW',
          current: null,
        },
      },
      {
        id: 10,
        name: 'Can fly their dragon in good conditions',
        criteria: '',
        type: 'skill',
        version: 1,
        questions: [],
        status: {
          previous: 'NEW',
          current: null,
        },
      },
      {
        id: 11,
        name: 'Good grasp of the key concepts behind the Dark Arts',
        criteria: '',
        type: 'skill',
        version: 1,
        questions: [],
        status: {
          previous: 'NEW',
          current: null,
        },
      },
      {
        id: 12,
        name: 'In depth understanding of the Dark Arts',
        criteria: '',
        type: 'skill',
        version: 1,
        questions: [],
        status: {
          previous: 'NEW',
          current: null,
        },
      },
    ],
    skillGroups: [
      {
        id: 0,
        level: 'Novice',
        category: 'Dragon Slaying',
        skills: [
          5,
        ],
      },
      {
        id: 1,
        level: 'Expert',
        category: 'Dragon Slaying',
        skills: [
          6,
        ],
      },
      {
        id: 2,
        level: 'Expert',
        category: 'Dragon Flight',
        skills: [
          2,
        ],
      },
      {
        id: 3,
        level: 'Novice',
        category: 'Magicness',
        skills: [
          4,
        ],
      },
      {
        id: 4,
        level: 'Novice',
        category: 'Dragon Flight',
        skills: [
          1,
        ],
      },
      {
        id: 5,
        level: 'Expert',
        category: 'Magicness',
        skills: [
          3,
        ],
      },
      {
        id: 6,
        level: 'Experienced Beginner',
        category: 'Dragon Slaying',
        skills: [
          7,
        ],
      },
      {
        id: 7,
        level: 'Knowledgeable',
        category: 'Dragon Slaying',
        skills: [
          8,
        ],
      },
      {
        id: 8,
        level: 'Experienced Beginner',
        category: 'Dragon Flight',
        skills: [
          9,
        ],
      },
      {
        id: 9,
        level: 'Knowledgeable',
        category: 'Dragon Flight',
        skills: [
          10,
        ],
      },
      {
        id: 10,
        level: 'Experienced Beginner',
        category: 'Magicness',
        skills: [
          11,
        ],
      },
      {
        id: 11,
        level: 'Knowledgeable',
        category: 'Magicness',
        skills: [
          12,
        ],
      },
    ],
  },
];
