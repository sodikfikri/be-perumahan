const moment = require('moment')
const Validator = require("validatorjs")
const MessageFormat = require("../helpers/MessageFormat")
const responses = require("../config/responses")
const Payment = require('../models/Payment')

const PaymentController = {

    Pay: async function(req, res) {
        let apiResult = {}
        try {
            const { recident_id, house_id, type, nominal, payment_start, payment_end } = req.body

            const rules = {
                recident_id: 'required',
                house_id: 'required',
                type: 'required',
                nominal: 'required|integer',
                payment_start: 'required',
                payment_end: 'required',
            }

            const inputValidation = new Validator(req.body, rules)
            if(inputValidation.fails()) {
                apiResult = {...responses[400]}
                apiResult.meta.message = Object.values(inputValidation.errors.all())[0][0]; // get first message
                return res.status(200).json(apiResult)
            }

            req.body.status = 1
            req.body.created_at = moment().format('YYYY-MM-DD HH:mm:ss')

            const add = await Payment.InsData(req.body)

            if (!add) {
                apiResult = {...responses[400]}
                apiResult.meta.message = 'Gagal melakukan pembayaran'
                return res.json(apiResult)
            }

            apiResult = {...responses[201]}
            apiResult.meta.message = 'Berhasil melakukan pembayaran'
            return res.json(apiResult)
        } catch (error) {
            apiResult = MessageFormat.SetMessage(500, error.message)
            return res.status(500).json(apiResult)
        }
    },

    GetHouseByRecident: async function(req, res) {
        let apiResult = {}
        try {
            const data = await Payment.GetHouse(req.query.recident_id)

            if (data.length == 0) {
                apiResult = {...responses[404]}
                apiResult.data = []
                return res.status(200).json(apiResult)
            }

            apiResult = {...responses[200]}
            apiResult.data = data[0]
            return res.status(200).json(apiResult)
        } catch (error) {
            apiResult = MessageFormat.SetMessage(500, error.message)
            return res.status(500).json(apiResult)
        }
    },

    PaymentList: async function(req, res) {
        let apiResult = {}
        try {
            const data = await Payment.GetList()

            if (data.length == 0) {
                apiResult = {...responses[404]}
                apiResult.data = []
                return res.status(200).json(apiResult)
            }

            for(let val of data) {
                if (val.type == 1) {
                    val.type = 'Iuran Satpam'
                } else if (val.type == 2) {
                    val.type = 'Iuran Kebersihan'
                } else {
                    val.type = 'Uang Sewa Rumah'
                }
            }

            apiResult = {...responses[200]}
            apiResult.data = data
            return res.status(200).json(apiResult)
        } catch (error) {
            apiResult = MessageFormat.SetMessage(500, error.message)
            return res.status(500).json(apiResult)
        }
    },

    GetDataChart: async function(req, res) {
        let apiResult = {}
        try {
            const data = await Payment.GrafikPemasukan(moment().format('YYYY'))

            return res.status(200).json({
                labels: [
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec',
                  ],
                  datasets: [
                    {
                      label: 'Pemasukan',
                      data: data,
                    },
                  ]
            })
        } catch (error) {
            apiResult = MessageFormat.SetMessage(500, error.message)
            return res.status(500).json(apiResult)
        }
    }

}

module.exports = PaymentController