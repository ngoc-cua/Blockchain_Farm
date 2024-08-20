// validation/wateringValidation.js
const Joi = require('joi');

const confirmWateringSchema = Joi.object({
    product_code: Joi.string().required(),
    notes: Joi.string().required()
});
module.exports = {
    confirmWateringSchema
};
