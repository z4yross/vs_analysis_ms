import debugLib from 'debug';
const debug = debugLib('app:neo4j');
const error = debugLib('app:neo4j:error');

import * as neo4j from 'neo4j-driver';

const NEO_URL = process.env.NEO_URL;
const NEO_USER = process.env.NEO_USER;
const NEO_PASS = process.env.NEO_PASS;

class NeoSession {
    static _instance;

    constructor() {
        const driver = neo4j.driver(
            NEO_URL,
            neo4j.auth.basic(NEO_USER, NEO_PASS)
        );

        return driver.session({
            database: 'analysis'
        });
    }

    static getInstance() {
        if (this._instance) return this._instance;

        this._instance = new NeoSession();
        return this._instance;
    }
}

export default NeoSession;