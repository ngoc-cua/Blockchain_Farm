const Joi = require('joi');

const confirmHarvestSchema = Joi.object({
    product_code: Joi.string().required(),
    notes: Joi.string().required()
});

module.exports = {
    confirmHarvestSchema
};
