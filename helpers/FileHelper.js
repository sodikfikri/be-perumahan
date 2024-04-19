const fs = require('fs')
const moment = require('moment')
const path = require('path')
const FileHelper = {

    UpFile: function(file) {
        return new Promise(async (resolve, reject) => {

            const splitArr = file.name.split('.')

            const filePath = `files/ktp/${moment().format('YYYYMMDDHHmmss')}.${splitArr.pop()}`;
            
            file.mv(filePath, (err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(filePath)
                }
            })
        })
    },
    remove(filenamepath) {
        return new Promise((resolve, reject) => {
            const removeLocation = path.join(__dirname, '../'+filenamepath);
            console.log(removeLocation);
            // if not exists mean, have been deleted
            if (!fs.existsSync(removeLocation)) return resolve(true);
            // if exist mean not deleted
            fs.unlink(removeLocation, function(err) {
                if (err) return reject(err);
                resolve(true);
            });
        })
    }

}

module.exports = FileHelper