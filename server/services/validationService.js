'use strict';

const moment = require('moment')

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
    return module.exports.SORT_ITEMS.includes(key)
  },
  isValidDate: (value) => {
    return moment(value).isValid()
  },
  isDateBefore: (date1, date2) => {
    const date1Valid = module.exports.isValidDate(date1)
    const date2Valid = module.exports.isValidDate(date2)
    let result = false
    if (date1Valid && date2Valid) {
      result = moment(date1).toDate().getTime() < moment(date2).toDate().getTime()
    }
    return result
  }
}
