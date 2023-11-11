const mongoose = require('mongoose')

let counter = 1; // Biến để theo dõi giá trị _id, bắt đầu từ 1

const productSchema = mongoose.Schema(
    {
        name:{
            type:String,
            require:[true, "Please enter a product name"]
        },
        quality:{
            type:Number,
            require:true,
        },
        price:{
            type:Number,
            require:true,
        }
    },
    {
        timestamps: true
    }
)
const Product = mongoose.model('Product', productSchema)

module.exports = Product