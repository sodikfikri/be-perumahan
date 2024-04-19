const moment = require("moment");
const MySQLHelper = require("../helpers/MySQLHelper");
const DB = require('../config/db_connection');
const { resolve } = require("path");
const { reject } = require("bluebird");

const table = 't_house'

const House = {

    ListData: function() {
        return new Promise(async (resolve, reject) => {
            try {
                const query = `SELECT hs.*, rc.name recident_name, rc.status recident_status FROM t_house as hs LEFT JOIN t_recident as rc ON hs.recident_id = rc.id WHERE hs.deleted_at IS NULL`
                
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
                console.log(table);
                console.log(data);
                console.log(column);
                console.log(value);
                const update = await MySQLHelper.update(table, data, column, value)

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
                const query = `SELECT hs.*, rc.id as recident_id, rc.name as recident_name FROM ${table} AS hs LEFT JOIN t_recident as rc on hs.recident_id = rc.id WHERE hs.id = ? AND hs.deleted_at IS NULL`

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
    },

    ValidateStore: function(recident_id) {
        return new Promise(async (resolve, reject) => {
            try {
                const query = `SELECT * FROM t_house WHERE recident_id = ? AND status = 1`

                const result = await MySQLHelper.query(DB, query, [recident_id])

                resolve(result)
            } catch (error) {
                reject(error)
            }
        })
    },

    CreateHouseHistory: function(data) {
        return new Promise(async (resolve, reject) => {
            try {
                const ins = await MySQLHelper.insert('t_house_history', data)

                resolve({
                    type: 'success',
                    ins
                })
            } catch (error) {
                reject(error)
            }
        })
    },

    ValidateRecident: function(recident_id) {
        return new Promise(async (resolve, reject) => {
            try {
                const query = `SELECT * FROM t_house WHERE recident_id = ? AND status = 0`

                const result = await MySQLHelper.query(DB, query, [recident_id])

                resolve(result)
            } catch (error) {
                reject(error)
            }
        })
    },

    HistoryList: function(house_id) {
        return new Promise(async (resolve, reject) => {
            try {
                const query = `SELECT history.id, rc.name recident_name, hs.name house_name FROM t_house_history history
                                JOIN t_house as hs on history.house_id = hs.id
                                JOIN t_recident as rc on history.recident_id = rc.id
                                WHERE history.house_id = ?`

                const result = await MySQLHelper.query(DB, query, [house_id])

                resolve(result)
            } catch (error) {
                reject(error)
            }
        })
    }

}

module.exports = House