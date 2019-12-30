const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const saltRounds = 10;
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength:50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minglength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role : {
        type: Number,
        default: 0
    },
    token : {
        type: String,
    },
    tokenExp : {
        type: Number
    }
})


// Hashing User Passwords
userSchema.pre('save', function(next){
    var user = this;   

    // only hash the password if it has been modified (or is new)
    if(user.isModified('password')){
        console.log('password has been modified')
        // generate a salt
        bcrypt.genSalt(saltRounds, (err, salt) => {
            if(err) {
                return next(err);
            }
        
            // hash the password along with our new salt
            bcrypt.hash(user.password, salt, function(err, hash) {
                if(err){
                    return next(err);
                }
                user.password = hash
                next();
            })
        })
    } else {
        next()
    }
});


// Password Verification
userSchema.methods.comparePassword = function(candidatePassword, cb){
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
        if(err) return cb(err);
        cb(null, isMatch);
    });
};

userSchema.methods.generateToken = function(cb) {
    var user = this;
    var token = jwt.sign(user._id.toHexString(), 'secret');

    user.token = token;
    user.save(function (err, user){
        if(err) {
            return cb(err);
        }
        cb(null, user);
    });
}

userSchema.statics.findByToken = function(token, cb) {
    var user = this;

    jwt.verify(token, 'secret', function(err, decode){
        user.findOne({"_id":decode, "token":token}, function(err, user){
            if(err){
                return cb(err)
            }
            cb(null, user);
        })
    })
}

const User = mongoose.model('User', userSchema);

module.exports = {User}