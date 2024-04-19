const ExpendConroller = require("../controllers/ExpendConroller")
const HouseController = require("../controllers/HouseController")
const PaymentController = require("../controllers/PaymentController")
const RecidentController = require("../controllers/RecidentController")

const PREFIX = process.env.API_URL

exports.routesConfig = function(app) {

    app.get(`/${PREFIX}/house/list`, HouseController.List)
    app.post(`/${PREFIX}/house/store`, HouseController.Store)
    app.put(`/${PREFIX}/house/update`, HouseController.Update)
    app.get(`/${PREFIX}/house/find/:id`, HouseController.Find)
    app.delete(`/${PREFIX}/house/delete/:id`, HouseController.Delete)
    app.get(`/${PREFIX}/house/history/:id`, HouseController.History)
    
    app.get(`/${PREFIX}/recident/list`, RecidentController.List)
    app.post(`/${PREFIX}/recident/store`, RecidentController.Store)
    app.get(`/${PREFIX}/recident/find/:id`, RecidentController.Find)
    app.put(`/${PREFIX}/recident/update`, RecidentController.Update)
    app.delete(`/${PREFIX}/recident/delete/:id`, RecidentController.Delete)
    
    app.post(`/${PREFIX}/payment`, PaymentController.Pay)
    app.get(`/${PREFIX}/payment/getHouse`, PaymentController.GetHouseByRecident)
    app.get(`/${PREFIX}/payment/list`, PaymentController.PaymentList)
    app.get(`/${PREFIX}/payment/grafik`, PaymentController.GetDataChart)

    app.post(`/${PREFIX}/expend`, ExpendConroller.Expend)
    app.get(`/${PREFIX}/expend/list`, ExpendConroller.List)
}