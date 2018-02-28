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
  schemaKeys: {
    city: Joi.string().trim().max(50).required(),
    start_date: Joi.date().min('01-01-2000').max('12-31-2050').required(),
    end_date: Joi.date().min('01-01-2000').max('12-31-2050').required(),
    price: Joi.number().positive().precision(2).required(),
    status: Joi.string().required().valid(['Never', 'Monthly', 'Daily', 'Seldom', 'Often', 'Once']),
    color: Joi.string().options({ convert:true }).lowercase().regex(/^#(?:[0-9a-f]{3}){1,2}$/i)
  },
  schemaIdKey: {
    id: Joi.number().integer().positive().required()
  },

  isValidSortKey: (key) => {
    const [ sortBy, sortOrder ] = key.split(':')
    return module.exports.SORT_ITEMS.includes(sortBy) && ['asc', 'desc'].includes(sortOrder.toLowerCase())
  },
  isValidDate: (value) => {
    try {
      return moment(value).isValid()
    } catch (err) {
      return false
    }
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
  validateEntryModel(data, isUpdate) {
    const t = module.exports // shortcut
    const keys = isUpdate ? { ...t.schemaIdKey, ...t.schemaKeys } : { ...t.schemaKeys }
    const joiSchema = Joi.object().keys(keys)
    return Joi.validate(data, joiSchema, { stripUnknown: true })
  }
}
