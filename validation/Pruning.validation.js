// validation/wateringValidation.js
const Joi = require('joi');

const confirmPruningSchema = Joi.object({
    product_code: Joi.string().required(),
    notes: Joi.string().required()
});

module.exports = {
    confirmPruningSchema
};
