let mongoose = require ('mongoose');

let articleSchema = mongoose.Schema({
  receiving:{
    type: String,
    required: true
  },
  department:{
    type: String,
    required: true
  },
  deptype:{
    type: String,
    required: true
  },
  organization:{
    type: String,
    required: true
  },
  orgtype:{
    type: String,
    required: true
  },
  file:{
    type: String,
    required: true
  },
  subject:{
    type: String,
    required: true
  },
  filename:{
    type: String,
    required: true
  },
  status:{
    type: String,
    required: true
  },
  author:{
    type: String,
    required: true
  },
  date:{
    type: String,
    required: true
  }

});

let Article = module.exports = mongoose.model('articles', articleSchema );
