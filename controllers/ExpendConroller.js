const moment = require('moment')
const Validator = require("validatorjs")
const MessageFormat = require("../helpers/MessageFormat")
const responses = require("../config/responses")
const Expend = require('../models/Expend')

const ExpendConroller = {

    Expend: async function(req, res) {
        let apiResult = {}
        try {
            const { description, nominal } = req.body

            const rules = {
                description: 'required',
                nominal: 'required|integer',
            }

            const inputValidation = new Validator(req.body, rules)
            if(inputValidation.fails()) {
                apiResult = {...responses[400]}
                apiResult.meta.message = Object.values(inputValidation.errors.all())[0][0]; // get first message
                return res.status(200).json(apiResult)
            }

            req.body.status = 1
            req.body.created_at = moment().format('YYYY-MM-DD HH:mm:ss')

            const add = await Expend.InsData(req.body)
            if (!add) {
                apiResult = {...responses[400]}
                apiResult.meta.message = 'Gagal memasukan tagihan'
                return res.json(apiResult)
            }

            apiResult = {...responses[201]}
            apiResult.meta.message = 'Berhasil memasukan tagihan'
            return res.json(apiResult)
        } catch (error) {
            apiResult = MessageFormat.SetMessage(500, error.message)
            return res.status(500).json(apiResult)
        }
    },

    List: async function(req, res) {
        let apiResult = {}
        try {
            const {filter_date} = req.query
            
            const data = await Expend.GetList(filter_date)
            // return res.json(data)
            if (data.length == 0) {
                apiResult = {...responses[404]}
                apiResult.data = []
                return res.status(200).json(apiResult)
            }

            apiResult = {...responses[200]}
            apiResult.data = data
            return res.status(200).json(apiResult)
        } catch (error) {
            apiResult = MessageFormat.SetMessage(500, error.message)
            return res.status(500).json(apiResult)
        }
    }

}

module.exports = ExpendConroller