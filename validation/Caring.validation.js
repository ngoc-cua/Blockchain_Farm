const Joi = require('joi');

const confirmCaringSchema = Joi.object({
    product_code: Joi.string().required(),
    notes: Joi.string().required()
});

module.exports = {
    confirmCaringSchema
};
