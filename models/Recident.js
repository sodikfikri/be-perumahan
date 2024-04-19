const moment = require("moment");
const MySQLHelper = require("../helpers/MySQLHelper");
const DB = require('../config/db_connection');
const { resolve } = require("path");
const { reject } = require("bluebird");

const table = 't_recident'

const Recident = {

    List: function() {
        return new Promise(async (resolve, reject) => {
            try {
                const query = `SELECT * FROM ${table} WHERE deleted_at IS NULL`

                const result = await MySQLHelper.query(DB, query)

                resolve(result)
            } catch (error) {
                reject(error)
            }
        })
    },

    StoreData: function(data) {
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

    UpdateData: function(data, column, value) {
        return new Promise(async (resolve, reject) => {
            try {
                const update = await MySQLHelper.update(table, data, column, value)
                
                // console.log(data.status);
                if (data.status == 2) {
                    const getHouse = await MySQLHelper.query(DB, 'SELECT * FROM t_house WHERE recident_id = ?', value)
                    await MySQLHelper.update('t_house', {recident_id: null, status: 0}, 'id', getHouse[0].id)
                }

                resolve({
                    type: 'success',
                    update
                })
            } catch (error) {
                reject(error)
            }
        })
    },

    FindData: function(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const query = `SELECT * FROM ${table} WHERE id = ? AND deleted_at IS NULL`

                const result = await MySQLHelper.query(DB, query, [id])

                resolve(result)
            } catch (error) {
                reject(error)
            }
        })
    },

    DeleteData: function(id) {
        return new Promise(async (resolve, reject) => {
            try {
                // const query = `DELETE FROM t_house WHERE id = ?`
                const query = `UPDATE ${table} SET deleted_at = '${moment().format('YYYY-MM-DD HH:mm:ss')}' WHERE id = ?`

                const result = await MySQLHelper.query(DB, query, [id])

                resolve(result)
            } catch (error) {
                reject(error)
            }
        })
    }

}

module.exports = Recident