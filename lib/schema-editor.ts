import fs from 'fs';
import path from 'path';

export interface PrismaField {
    name: string;
    type: string;
    isId: boolean;
    isOptional: boolean;
    isList: boolean;
    isUnique: boolean;
    attributes: string;
    isRelation: boolean;
}

export interface PrismaModel {
    name: string;
    fields: PrismaField[];
}

export const SCHEMA_PATH = path.join(process.cwd(), 'prisma', 'schema.prisma');

/**
 * Reads the schema.prisma file and parses it into a basic AST.
 */
export async function parsePrismaSchema(): Promise<PrismaModel[]> {
    const content = fs.readFileSync(SCHEMA_PATH, 'utf-8');
    const models: PrismaModel[] = [];

    // Simple regex to extract models
    const modelRegex = /model\s+([A-Za-z0-9_]+)\s+{([^}]+)}/g;
    let match;

    while ((match = modelRegex.exec(content)) !== null) {
        const modelName = match[1];
        const body = match[2];

        const lines = body.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('//') && !l.startsWith('@@'));

        const fields: PrismaField[] = lines.map(line => {
            // e.g. "id String @id @default(cuid())" or "assignedTo User? @relation(...)"
            const parts = line.split(/\s+/);
            const name = parts[0];
            let typeStr = parts[1];

            const isOptional = typeStr.endsWith('?');
            const isList = typeStr.endsWith('[]');
            if (isOptional || isList) typeStr = typeStr.slice(0, -1);
            if (typeStr.endsWith(']')) typeStr = typeStr.slice(0, -2); // clean up []

            const attributesStr = parts.slice(2).join(' ');

            // Standard Prisma types vs Relations
            const standardTypes = ['String', 'Boolean', 'Int', 'BigInt', 'Float', 'Decimal', 'DateTime', 'Json', 'Bytes'];
            const isRelation = !standardTypes.includes(typeStr);

            return {
                name,
                type: typeStr,
                isId: attributesStr.includes('@id'),
                isOptional,
                isList,
                isUnique: attributesStr.includes('@unique'),
                attributes: attributesStr,
                isRelation,
            };
        });

        models.push({
            name: modelName,
            fields,
        });
    }

    return models;
}

/**
 * Appends a new model to the schema.
 */
export async function addModelToSchema(name: string) {
    const content = fs.readFileSync(SCHEMA_PATH, 'utf-8');

    // Check if exists
    if (content.includes(`model ${name} {`)) {
        throw new Error(`Model ${name} already exists.`);
    }

    const newModel = `\nmodel ${name} {\n  id String @id @default(cuid())\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n`;
    fs.writeFileSync(SCHEMA_PATH, content + newModel);
}

/**
 * Appends a field to an existing model in the schema.
 */
export async function addFieldToModel(modelName: string, fieldName: string, fieldType: string, isOptional: boolean = false) {
    let content = fs.readFileSync(SCHEMA_PATH, 'utf-8');

    // Quick validation
    const modelRegex = new RegExp(`model\\s+${modelName}\\s+{([^}]+)}`);
    const match = modelRegex.exec(content);
    if (!match) throw new Error(`Model ${modelName} not found.`);

    if (match[1].includes(` ${fieldName} `)) {
        throw new Error(`Field ${fieldName} already exists on ${modelName}.`);
    }

    const defaultStr = fieldType === 'String' && !isOptional ? ' @default("")' :
        fieldType === 'Boolean' && !isOptional ? ' @default(false)' :
            fieldType === 'Int' && !isOptional ? ' @default(0)' : '';

    const typeModifier = isOptional ? '?' : '';
    const newFieldLine = `  ${fieldName} ${fieldType}${typeModifier}${defaultStr}`;

    // Inject before the closing brace of the model
    const replaceRegex = new RegExp(`(model\\s+${modelName}\\s+{[^}]+)(\n})`);
    content = content.replace(replaceRegex, `$1\n${newFieldLine}$2`);

    fs.writeFileSync(SCHEMA_PATH, content);
}
