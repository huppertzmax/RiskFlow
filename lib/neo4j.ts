import neo4j from 'neo4j-driver'

const { NEO4J_URI, NEO4J_USERNAME, NEO4J_PASSWORD } = process.env

const driver = neo4j.driver(
    NEO4J_URI!,
    neo4j.auth.basic(
        NEO4J_USERNAME!,
        NEO4J_PASSWORD!
    )
)

export async function read<RecordShape>(cypher: string, params?: Record<string, any>): Promise<RecordShape[]> {
    const session = driver.session()
    try {
        const res = await session.executeRead(tx => tx.run(cypher, params))
        const values = res.records.map(record => record.toObject() as RecordShape)
        return values
    }
    finally {
        await session.close()
    }
}

export async function write<RecordShape>(cypher: string, params?: Record<string, any>): Promise<RecordShape[]> {
    const session = driver.session()
    try {
        const res = await session.executeWrite(tx => tx.run(cypher, params))
        const values = res.records.map(record => record.toObject() as RecordShape)
        return values
    }
    finally {
        await session.close()
    }
}