const moment = require("moment")
const Validator = require("validatorjs")
const MessageFormat = require("../helpers/MessageFormat")
const responses = require("../config/responses")
const Recident = require("../models/Recident")
const House = require("../models/House")
const FileHelper = require("../helpers/FileHelper")

const RecidentController = {

    List: async function(req, res) {
        let apiResult = {}
        try {
            const data = await Recident.List()

            if (data.length == 0) {
                apiResult = {...responses[404]}
                apiResult.data = []
                return res.status(200).json(apiResult)
            }

            for(let val of data) {
                val.image_ktp = 'http://localhost:8100/api/'+val.image_ktp
                // val.status = val.status == 1 ? 'Tetap' : 'Kontrak'

                if (val.status == 1) {
                    val.status = 'Tetap'
                } else if(val.status == 2) {
                    val.status = 'Kontrak Habis'
                } else {
                    val.status = 'Kontrak'
                }

                val.is_merried = val.is_merried == 1 ? 'Sudah Menikah' : 'Belum Menikah'
            }

            apiResult = {...responses[200]}
            apiResult.data = data
            return res.status(200).json(apiResult)
        } catch (error) {
            apiResult = MessageFormat.SetMessage(500, error.message)
            return res.status(500).json(apiResult)
        }
    },
    Find: async function(req, res) {
        let apiResult = {}
        try {
            const data = await Recident.FindData(req.params.id)

            if (data.length == 0) {
                apiResult = {...responses[404]}
                apiResult.data = []
                return res.status(200).json(apiResult)
            }

            data[0].image_ktp = 'http://localhost:8100/api/' + data[0].image_ktp

            apiResult = {...responses[200]}
            apiResult.data = data[0]
            return res.status(200).json(apiResult)
        } catch (error) {
            apiResult = MessageFormat.SetMessage(500, error.message)
            return res.status(500).json(apiResult)
        }
    },
    Store: async function(req, res) {
        let apiResult = {}
        try {
            const {name, nik, phone, is_merried, image_ktp, status} = req.body
            // return res.json(req.body)
            const rules = {
                name: 'required',
                nik: 'required|integer',
                phone: 'required',
                is_merried: 'required|integer',
                image_ktp: 'max:255',
                status: 'required|integer',
            }

            const inputValidation = new Validator(req.body, rules)
            if(inputValidation.fails()) {
                apiResult = {...responses[400]}
                apiResult.meta.message = Object.values(inputValidation.errors.all())[0][0]; // get first message
                return res.status(200).json(apiResult)
            }

            req.body.created_at = moment().format('YYYY-MM-DD HH:mm:ss')

            const add = await Recident.StoreData(req.body)
            if (add.type != 'success') {
                apiResult = {...responses[400]}
                apiResult.meta.message = 'Fail to add data'
                return res.json(apiResult)
            }

            if (req.files !== null) {
                const uploadedFile = req.files.image_ktp;
                const sv = await FileHelper.UpFile(uploadedFile) 
                await Recident.UpdateData({image_ktp: sv}, 'id', add.ins.result.insertId) 
            }

            apiResult = {...responses[201]}
            apiResult.meta.message = 'Success add data'
            return res.json(apiResult)
        } catch (error) {
            apiResult = MessageFormat.SetMessage(500, error.message)
            return res.status(500).json(apiResult)
        }
    },
    Update: async function(req, res) {
        let apiResult = {}
        try {
            const {id, name, nik, phone, is_merried, image_ktp, status} = req.body
            // return res.json(req.body)
            const rules = {
                id: 'required',
                name: 'required',
                nik: 'required|integer',
                phone: 'required',
                is_merried: 'required|integer',
                image_ktp: 'max:255',
                status: 'required|integer',
            }

            const inputValidation = new Validator(req.body, rules)
            if(inputValidation.fails()) {
                apiResult = {...responses[400]}
                apiResult.meta.message = Object.values(inputValidation.errors.all())[0][0]; // get first message
                return res.status(200).json(apiResult)
            }

            req.body.created_at = moment().format('YYYY-MM-DD HH:mm:ss')

            const data = await Recident.FindData(id)
            if (data.length == 0) {
                apiResult = {...responses[404]}
                apiResult.meta.message = 'Recident cannot be found'
                return res.json(apiResult)
            }

            const params = {
                name, nik, phone, is_merried, status,
                updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
            }

            const doChange = await Recident.UpdateData(params, 'id', id)
            if (doChange.type != 'success') {
                apiResult = {...responses[400]}
                apiResult.meta.message = 'Fail to update data'
                return res.json(apiResult)
            }

            if (req.files !== null) {
                const rm = await FileHelper.remove(data[0].image_ktp)
                
                const uploadedFile = req.files.image_ktp;
                const sv = await FileHelper.UpFile(uploadedFile) 
                await Recident.UpdateData({image_ktp: sv}, 'id', id) 
            }

            apiResult = {...responses[200]}
            apiResult.meta.message = 'Success update data'
            return res.json(apiResult)
        } catch (error) {
            apiResult = MessageFormat.SetMessage(500, error.message)
            return res.status(500).json(apiResult)
        }
    },
    Delete: async function(req, res) {
        let apiResult = {}
        try {
            const del = await Recident.DeleteData(req.params.id)

            if (!del) {
                apiResult = {...responses[400]}
                apiResult.meta.message = 'Fail to delete data'
                return res.json(apiResult)
            }

            apiResult = {...responses[200]}
            apiResult.meta.message = 'Success delete data'
            return res.json(apiResult)
        } catch (error) {
            apiResult = MessageFormat.SetMessage(500, error.message)
            return res.status(500).json(apiResult)
        }
    },

}

module.exports = RecidentController