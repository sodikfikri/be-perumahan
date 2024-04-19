const moment = require("moment");
const MySQLHelper = require("../helpers/MySQLHelper");
const DB = require('../config/db_connection');

const table = 't_expend'

const Expend = {

    InsData: function(data) {
        return new Promise(async (resolve, reject) => {
            try {
                const ins = await MySQLHelper.insert(table, data)

                resolve({
                    type: 'success',
                    ins
                })
            } catch (error) {
                reject(error)
            }
        })
    },

    GetList: function(filter_date) {
        return new Promise(async (resolve, reject) => {
            try {
                let dtX = ''
                if (filter_date) {
                    dtX = ` WHERE DATE_FORMAT(created_at, '%Y-%m-%d') = '${filter_date}'`
                }

                const query = `SELECT * FROM t_expend ${dtX}`
                const result = await MySQLHelper.query(DB, query)

                resolve(result)
            } catch (error) {
                reject(error)
            }
        })
    }

}

module.exports = Expend