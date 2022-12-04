import express from 'express';

import debugLib from 'debug';
const debug = debugLib('app:route:index');
const error = debugLib('app:route:index:error');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(200).send('hi');
});

export default router;
