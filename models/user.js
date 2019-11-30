const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('../helpers/bcrypt');

const userSchema = new Schema({
    username: String,
    email: {
        type: String,
        validate: [
            {
                validator: function (val) {
                    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    return re.test(String(val).toLowerCase());
                },
                message: `Email invalid format`
            },
            {
                validator: function (val) {
                    return User.findOne({ email: val, _id: { $ne: this._id } })
                        .then(data => {
                            if (data) {
                                throw err;
                            }
                        })
                        .catch(err => {
                            throw err;
                        });
                },
                message: `Please check your email again`
            }
        ]
    },
    password: {
        type: String,
        required: [true, 'Password must be filled']

    },
    by: {
        type: String,
        default: 'manual'
    }
});

userSchema.pre('save', function (next) {
    this.password = bcrypt.hash(this.password);
    next();
})

const User = mongoose.model('Users', userSchema);

module.exports = User;