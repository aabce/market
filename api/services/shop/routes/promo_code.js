'use strict';

const express = require('express');
const router = express.Router();

const promoCodeController = require(`${__dirname}/../controllers/promo_code.js`);

router.get('/shop/promo_code/get_promo_codes', promoCodeController.selectAllPromocodes);
router.get('/shop/promo_code/get_promo_code/:promo_code', promoCodeController.selectPromocodeByName);
router.get('/shop/promo_code/get_discount_price/:price/:promo_code', promoCodeController.getPriceWithDiscount);
router.post('/shop/promo_code/create_promo_code', promoCodeController.createPromocode);
router.put('/shop/promo_code/update_promo_code/:promo_code', promoCodeController.updatePromocodeRateByName);
router.delete('/shop/promo_code/delete_promo_code/:promo_code', promoCodeController.deletePromocodeByName);

module.exports = router;
