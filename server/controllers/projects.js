import debugLib from 'debug';
const debug = debugLib('app:controller:projects');
const error = debugLib('app:controller:projects:error');


export async function createProject(params) {
    try {
        const query = "MERGE (james:Person {name : $nameParam}) RETURN james.name AS name"
        const params = {
            nameParam: 'James'
        }

        const res = await neo.run(query, params);
        const records = res.records;

        const recordNames = records.map(r => r.get('name'));

        return recordNames;
    } catch (err) {
        error(err);
        throw err
    }
}

