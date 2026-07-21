import { DataSource } from 'typeorm';

export const truncateTables = async (connection: DataSource) => {
    //provide the list of all entities
    const entities = connection.entityMetadatas;
    for (const entity of entities) {
        const repository = connection.getRepository(entity.name);
        await repository.clear();
    }
};

export const isJwt = (token: string | undefined): boolean => {
    if (token === undefined) {
        return false;
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
        return false;
    }

    try {
        parts.forEach((part) => {
            Buffer.from(part, 'base64').toString('utf-8');
        });
        return true;
    } catch {
        return false;
    }
};
