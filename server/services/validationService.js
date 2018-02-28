'use strict';

const moment = require('moment')
const Joi = require('joi')

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
  schema: Joi.object().keys({
    id: Joi.number().integer(),
    city: Joi.string().trim().max(50).required(),
    start_date: Joi.date().min('01-01-2000').max('12-31-2050').required(),
    end_date: Joi.date().min('01-01-2000').max('12-31-2050').required(),
    price: Joi.number().positive().precision(2).required(),
    status: Joi.string().required().valid(['Never', 'Monthly', 'Daily', 'Seldom', 'Often', 'Once']),
    color: Joi.string().options({ convert:true }).lowercase().regex(/^#(?:[0-9a-f]{3}){1,2}$/i)
  }),

  isValidSortKey: (key) => {
    const [ sortBy, sortOrder ] = key.split(':')
    return module.exports.SORT_ITEMS.includes(sortBy) && ['asc', 'desc'].includes(sortOrder.toLowerCase())
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
  },
  validateEntryModel(data) {
    const options = {
      stripUnknown: true
    }
    return Joi.validate(data, module.exports.schema, options)
  }
}
