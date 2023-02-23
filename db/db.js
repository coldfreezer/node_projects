const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
mongoose.connect('mongodb+srv://vikas:Runt8xWDL$eh3eV@clusterr.xshbinh.mongodb.net/empform?retryWrites=true&w=majority')
.then(()=>{
console.log(`connected`);
})
.catch((error)=>{
    console.log(error);
})