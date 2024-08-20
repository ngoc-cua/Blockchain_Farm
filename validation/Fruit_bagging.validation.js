const Joi = require('joi');

const confirmFruitBaggingSchema = Joi.object({
    product_code: Joi.string().required(),
    notes: Joi.string().required()
});

module.exports = {
    confirmFruitBaggingSchema
};
