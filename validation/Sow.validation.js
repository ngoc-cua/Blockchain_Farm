const Joi = require('joi');

const confirmSowSchema = Joi.object({
    product_code: Joi.string().required(),
    notes: Joi.string().required()
});

module.exports = {
    confirmSowSchema
};
