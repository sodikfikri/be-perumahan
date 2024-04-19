const moment = require("moment")
const Validator = require("validatorjs")
const MessageFormat = require("../helpers/MessageFormat")
const House = require("../models/House")
const responses = require("../config/responses")
const Recident = require("../models/Recident")

const HouseController = {

    List: async function(req, res) {
        let apiResult = {}
        try {
            const data = await House.ListData()

            if (data.length == 0) {
                apiResult = {...responses[404]}
                apiResult.data = []
                return res.status(200).json(apiResult)
            }

            for(let val of data) {
                val.status = val.status == 1 ? 'Dihuni' : 'Tidak Dihuni'

                if (val.recident_status) {
                    if (val.recident_status == 1) {
                        val.recident_status = 'Tetap'
                    } else if(val.recident_status == 2) {
                        val.recident_status = 'Kontrak Habis'
                    } else {
                        val.recident_status = 'Kontrak'
                    }
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

    Store: async function(req, res) {
        let apiResult = {}
        try {
            const {name, recident_id, blog, description, status} = req.body
            // return res.json(req.body)
            const rules = {
                name: 'required',
                recident_id: 'required',
                blog: 'required',
                description: 'max:255',
                status: 'required|integer',
            }

            const inputValidation = new Validator(req.body, rules)
            if(inputValidation.fails()) {
                apiResult = {...responses[400]}
                apiResult.meta.message = Object.values(inputValidation.errors.all())[0][0]; // get first message
                return res.status(200).json(apiResult)
            }

            req.body.created_at = moment().format('YYYY-MM-DD HH:mm:ss')

            const isAvalilable = await House.ValidateStore(recident_id)
            if (isAvalilable.length != 0) {
                apiResult = {...responses[400]}
                apiResult.meta.message = 'Penghuni masih menempati rumah lain'
                return res.json(apiResult)   
            }

            const isReady = await Recident.FindData(recident_id)
            if (isReady.length == 0) {
                apiResult = {...responses[404]}
                apiResult.meta.message = 'Recident cannot be found'
                return res.json(apiResult)   
            }

            const add = await House.StoreData(req.body)

            if (!add) {
                apiResult = {...responses[400]}
                apiResult.meta.message = 'Fail to insert data'
                return res.json(apiResult)   
            }

            const params_history = {
                house_id: add.ins.result.insertId,
                recident_id: recident_id,
                created_at: moment().format('YYYY-MM-DD HH:mm:ss')
            }

            await House.CreateHouseHistory(params_history)

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
            const {id, name, recident_id, blog, description, status} = req.body
            
            const rules = {
                id: 'required|integer',
                recident_id: 'required',
                name: 'required',
                blog: 'required',
                description: 'max:255',
                status: 'required|integer',
            }

            const inputValidation = new Validator(req.body, rules)
            if(inputValidation.fails()) {
                apiResult = {...responses[400]}
                apiResult.meta.message = Object.values(inputValidation.errors.all())[0][0]; // get first message
                return res.status(200).json(apiResult)
            }

            const housecek = await House.FindData(id)
            if (housecek.length === 0) {
                apiResult = {...responses[404]}
                apiResult.meta.message = 'House cannot be found'
                return res.json(apiResult)
            }

            // validate recident
            if (housecek[0].recident_id != recident_id) {
                const ck = await House.ValidateRecident(recident_id)
                // return res.json(ck)
                if (ck.length !== 0) {
                    apiResult = {...responses[400]}
                    apiResult.meta.message = 'Penghuni masih menempati rumah'
                    return res.json(apiResult)
                }

                const params_history = {
                    house_id: id,
                    recident_id: recident_id,
                    created_at: moment().format('YYYY-MM-DD HH:mm:ss')
                }
    
                await House.CreateHouseHistory(params_history)
            }

            const isAvalilable = await House.ValidateStore(recident_id)
            if (isAvalilable.length != 0) {
                apiResult = {...responses[400]}
                apiResult.meta.message = 'Penghuni masih menempati rumah lain'
                return res.json(apiResult)   
            }

            const isReady = await Recident.FindData(recident_id)
            if (isReady.length == 0) {
                apiResult = {...responses[404]}
                apiResult.meta.message = 'Recident cannot be found'
                return res.json(apiResult)   
            }

            const params = {
                name, blog, recident_id, description, status,
                updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
            }

            const doChange = await House.UpdateData(params, 'id', id)

            if (!doChange) {
                apiResult = {...responses[400]}
                apiResult.meta.message = 'Fail to update data'
                return res.json(apiResult)   
            }

            apiResult = {...responses[200]}
            apiResult.meta.message = 'Success update data'
            return res.json(apiResult)
        } catch (error) {
            apiResult = MessageFormat.SetMessage(500, error.message)
            return res.status(500).json(apiResult)
        }
    },

    Find: async function(req, res) {
        let apiResult = {}
        try {
            const data = await House.FindData(req.params.id)

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

    Delete: async function(req, res) {
        let apiResult = {}
        try {
            const del = await House.DeleteData(req.params.id)

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

    History: async function(req, res) {
        let apiResult = {}
        try {
            const data = await House.HistoryList(req.params.id)

            if (data.length == 0) {
                apiResult = {...responses[404]}
                apiResult.data = []
                return res.status(200).json(apiResult)
            }

            apiResult = {...responses[200]}
            apiResult.meta.message = 'Success delete data'
            apiResult.data = data
            return res.json(apiResult)
        } catch (error) {
            apiResult = MessageFormat.SetMessage(500, error.message)
            return res.status(500).json(apiResult)
        }
    }

}

module.exports = HouseController