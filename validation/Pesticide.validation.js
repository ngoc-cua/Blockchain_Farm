
const Joi = require('joi');

const confirmPesticideSchema = Joi.object({
    product_code: Joi.string().required(),
    notes: Joi.string().required()
});

module.exports = {
    confirmPesticideSchema
};
