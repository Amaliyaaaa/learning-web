export const createUserBodySchema = {
  type: 'object',
  properties: {
    lastname: {
      type: 'string',
      minLength: 2
    },
    firstname: {
      type: 'string',
      minLength: 2
    },
    surname: {
      type: 'string',
      minLength: 2
    },
    gender: {
      type: 'string',
      enum: ['male', 'female']
    },
    faculty: {
      type: 'string',
      minLength: 1
    },
    projectParticipant: {
      type: 'boolean'
    },
    projectName: {
      type: 'string'
    }
  },
  required: ['lastname', 'firstname', 'surname', 'gender', 'faculty']
};

