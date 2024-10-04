const { Schema, model} = require('mongoose');

const postSchema = new Schema({
    title : {
        type : String,
        required : true
    },
    body : {
        type : String,
        required : true
    },
    postImageUrl : {
        type : String,
        required : true
    },
    createdBy : {
        type : Schema.Types.ObjectId,
        ref : "users"
    }
},
{ 
    timestamps : true
});

const Post = model("posts", postSchema);

module.exports = Post;