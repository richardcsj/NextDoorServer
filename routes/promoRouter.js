const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');

const Promotion = require('../models/promotion');


const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

promoRouter.route('/')
.get((req,res,next) => {
  Promotion.find({})
  .then((promotions) => {
    res.statusCode = 200;
    res.setHeader('Content-type', 'application/json');
    res.json(promotions);
  }, (e) => next(e))
  .catch((e) => next(e));
})
.post(authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
  Promotion.create(req.body)
  .then((promotion) => {
    console.log('Promotion created', promotion);
    res.statusCode = 200;
    res.setHeader('Content-type', 'application/json');
    res.json(promotion);
  }, (e) => next(e))
  .catch((e) => next(e));
})
.put(authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
  res.statusCode = 403;
  res.end('PUT operation not supported on /promotions');
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Promotion.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

promoRouter.route('/:promoId')
.get((req,res,next) => {
  Promotion.findById(req.params.promoId)
  .then((promo) => {
    res.statusCode = 200;
    res.setHeader('Content-type', 'application/json');
    res.json(promo);
  }, (e) => next(e))
  .catch((e) => next(e));
})
.post(authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /promotions/'+ req.params.promoId);
})
.put(authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
  Promotion.findByIdAndUpdate(req.params.promoId, {
    $set: req.body
  }, {new: true})
  .then((promo) => {
    res.statusCode = 200;
    res.setHeader('Content-type', 'application/json');
    res.json(promo);
  }, (e) => next(e))
  .catch((e) => next(e));
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
  Promotion.findByIdAndRemove(req.params.promoId)
  .then((resp) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(resp);
  }, (err) => next(err))
  .catch((err) => next(err));
});

module.exports = promoRouter;
