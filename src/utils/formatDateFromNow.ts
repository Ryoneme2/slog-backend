import _m from 'moment';

const formatData = (dateTime: Date) => {
  const hour = +_m(dateTime).fromNow().split(' ')[0]
  return hour > 24
    ? _m(dateTime).format('MMM Do YY')
    : _m(dateTime).fromNow();
};

export default formatData;