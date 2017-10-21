import * as moment from 'moment';
import * as R from 'ramda';

const sortNewestToOldest = entities =>
  entities.sort((a, b) => {
    const valid = value => value && R.has('createdDate', value) && moment(value).isValid();

    if (valid(a) && valid(b)) {
      const dateA = moment(a.createdDate, moment.ISO_8601);
      const dateB = moment(b.createdDate, moment.ISO_8601);
      return dateA.isBefore(dateB);
    }
  });

export {
  sortNewestToOldest,
};
