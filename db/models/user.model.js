const {mongoose}=require('../mongodb.connect');

var UserSchema = new mongoose.Schema({
  username:{
    type: String,
    required: true,
    minlength: 1
  },
  token: {
    type: String,
    required: true,
    minlength: 1
  }
});

const db=mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("database connected");
});

var User=mongoose.model('User',UserSchema);

module.exports={User};