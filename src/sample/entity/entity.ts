import { Node } from 'neo4j-driver'

export class Entity {
    constructor(private readonly node: Node) {}

    get(): Record<string, any> {
        const { password, bio, image, ...properties } = <Record<string, any>>(
            this.node.properties
        )

        return {
            ...properties,
        }
    }
}
