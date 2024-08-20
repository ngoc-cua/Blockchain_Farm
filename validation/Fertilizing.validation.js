const Joi = require('joi');

const confirmFertilizingSchema = Joi.object({
    product_code: Joi.string().required(),
    notes: Joi.string().required()
});

module.exports = {
    confirmFertilizingSchema
};
