'use strict';

module.exports = {
  SORT_ITEMS: [
    'id',
    'city',
    'start_date',
    'end_date',
    'price',
    'status',
    'color'
  ],
  isValidSortKey: (key) => {
    return !!(module.exports.SORT_ITEMS[key])
  }
}
