const bcrypt = require('bcrypt');
module.exports = {
    compare: (password, hash) => bcrypt.compareSync(password, hash),
    hash: password => bcrypt.hashSync(password, bcrypt.genSaltSync(9))
}