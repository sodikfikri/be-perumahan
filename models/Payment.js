const moment = require("moment");
const MySQLHelper = require("../helpers/MySQLHelper");
const DB = require('../config/db_connection');

const table = 't_payment'

const Payment = {

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
    
    GetHouse: function(recident_id) {
        return new Promise(async (resolve, reject) => {
            try {
                const query = `SELECT * FROM t_house WHERE recident_id = ?`

                const result = await MySQLHelper.query(DB, query, [recident_id])

                resolve(result)
            } catch (error) {
                reject(error)
            }
        })
    },

    GetList: function() {
        return new Promise(async (resolve, reject) => {
            try {
                const query = `SELECT 
                                    pay.id, pay.recident_id, pay.type, pay.house_id, pay.nominal, 
                                    DATE_FORMAT(pay.payment_start, '%Y-%m-%d') payment_start, DATE_FORMAT(pay.payment_end, '%Y-%m-%d') payment_end,
                                    rc.name recident_name, hs.name house_name 
                                FROM ${table} as pay 
                                JOIN t_recident as rc ON pay.recident_id = rc.id 
                                JOIN t_house as hs ON pay.house_id = hs.id`

                const result = await MySQLHelper.query(DB, query)

                resolve(result)
            } catch (error) {
                reject(error)
            }
        })
    },

    GrafikPemasukan: function(dt) {
        return new Promise(async (resolve, reject) => {
            try {
                const sql = `
                    SELECT 
                        MONTH(created_at) AS month,
                        SUM(nominal) AS total
                    FROM 
                        t_payment
                    WHERE 
                        YEAR(created_at) = ?
                    GROUP BY 
                        MONTH(created_at)
                    ORDER BY 
                        MONTH(created_at);
                `;

                const result = await MySQLHelper.query(DB, sql, [dt])

                const monthlyTotals = Array.from({ length: 12 }, () => 0);

                result.forEach(result => {
                    monthlyTotals[result.month - 1] = parseInt(result.total);
                });

                resolve(monthlyTotals);

            } catch (error) {
                reject(error)
            }
        })
    }

}

module.exports = Payment