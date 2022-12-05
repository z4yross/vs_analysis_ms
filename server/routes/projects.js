import debugLib from 'debug';
const debug = debugLib('app:routes:projects');
const error = debugLib('app:routes:projects:error');

import { createProject } from "../controllers/projects";
import { getErrorCode } from '../utils/errors'

import express from 'express';

var router = express.Router();

router.post('/project', function (req, res, next) {
    const params = req.body;
    createProject(params).then((result) => {
        res.status(201).send(result);
    }).catch((err) => {
        error(`${err}`);
        const code = getErrorCode(err);
        res.status(code).send(err);
    });
});

export default router;
