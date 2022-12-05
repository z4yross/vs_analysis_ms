import debugLib from 'debug';
const debug = debugLib('app:controller:projects');
const error = debugLib('app:controller:projects:error');

import NeoSession from '../../neo4j';

const Neo = NeoSession.getInstance();

export async function create(params, session) {
    try {

    } catch (err) {
        error(err);
        throw err
    }
}

export async function read(params, session) {
    try {

    } catch (err) {
        error(err);
        throw err
    }
}

export async function update(params, session) {
    try {

    } catch (err) {
        error(err);
        throw err
    }
}

export async function remove(params, session) {
    try {

    } catch (err) {
        error(err);
        throw err
    }
}





