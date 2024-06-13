const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./review.js");

const listingSchema=new Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image:{
        type:String,
        default:"https://www.pexels.com/photo/green-grass-near-trees-1770809/",
        set: (v) => v==="" ? "https://www.pexels.com/photo/green-grass-near-trees-1770809/":v,
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        },
    ],
});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}});
    }
});//This will delete all reviews for a listing whenever a listing is deleted as whenever a listing will be deleted then there will be findByIdAndDelete called so it will call this middleware as it has method-findOneAndDelete so this will delete all the reviews for that listing

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;