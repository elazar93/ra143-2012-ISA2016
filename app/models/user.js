var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var UserSchema = new Schema({

	username:{
		type: String,
		required: true,
		unique: true
	},
	password:{
		type: String,
		required: true
	},
	email:{
		type:String,
		required: true,
		unique: true
	},
	active:{
		type: Boolean,
		required: true,
		default: false
	},
	temporarytoken: {  

		type: String,
		required:true
	},
	permission: { type: String, default: 'user'}
});

UserSchema.pre('save',function(next){
	var user = this;
	bcrypt.hash(user.password, null,null,function(err,hash){
		if (err) return next(err);
		user.password=hash;
		next();
	});


});

UserSchema.methods.comparePassword = function(password){

	return bcrypt.compareSync(password,this.password);

};

module.exports = mongoose.model('User',UserSchema);