const { default: mongoose } = require("mongoose")

 const BlogSchema = new mongoose.Schema({
    title:{
        type:String,
        require:true
    },
    description:{
        type:String,
        require:true
    }
})

const blog = new mongoose.model("blog",BlogSchema)

module.exports=blog;