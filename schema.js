const Joi=require('joi');

module.exports.listingSchema=Joi.object({
    listing: Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        location:Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        image:Joi.string().allow("",null),
        category: Joi.string().required().valid(...['Latest', 'Trending', 'Rooms', 'Iconic Cities', 'Mountains', 'Castles', 'Camps', 'Farms', 'Amazing Pools', 'Arctic', 'Domes', 'Boats'])
    }).required()
});

module.exports.reviewSchema=Joi.object({
    review:Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required(),
    }).required()
});

module.exports.bookingSchema = Joi.object({
    booking: Joi.object({
        user: Joi.string().required(),
        listing: Joi.string().required(),
        price: Joi.number().required().min(0),
        startDate: Joi.date().required().min('now'),
        endDate: Joi.date().required().greater(Joi.ref('startDate')),
        currentStatus: Joi.string().required().valid('Not Booked', 'Booked', 'Cancelled')
    }).required()
});