const Joi=require('joi');

module.exports.listingSchema=Joi.object({
    listing: Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        location:Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        image:Joi.string().allow("",null)
    }).required()
});//You can visit joi documentation

module.exports.reviewSchema=Joi.object({
    review:Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required(),
    }).required()
});//Joi is used taki koi server side se galat response bheje to vo handle ho