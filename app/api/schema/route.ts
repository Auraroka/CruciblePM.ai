import { NextResponse } from 'next/server';
import { addFieldToModel, addModelToSchema, parsePrismaSchema } from '@/lib/schema-editor';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

export async function GET() {
    try {
        const schema = await parsePrismaSchema();
        return NextResponse.json({ success: true, data: schema });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { action, payload } = body;

        if (action === 'addField') {
            const { modelName, fieldName, fieldType, isOptional } = payload;
            if (!modelName || !fieldName || !fieldType) {
                return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
            }
            await addFieldToModel(modelName, fieldName, fieldType, isOptional);
        } else if (action === 'addModel') {
            const { modelName } = payload;
            if (!modelName) {
                return NextResponse.json({ success: false, error: "Missing model name" }, { status: 400 });
            }
            // Capitalize first letter
            const formattedName = modelName.charAt(0).toUpperCase() + modelName.slice(1);
            await addModelToSchema(formattedName);
        } else {
            return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
        }

        // Run prisma db push to apply changes to DB
        // Using force-reset is dangerous in prod, but db push helps with local sqlite alterations
        try {
            console.log(`Executing npx prisma db push...`);
            const { stdout, stderr } = await execPromise('npx prisma db push --accept-data-loss', {
                cwd: process.cwd()
            });
            console.log('Prisma push stdout:', stdout);

            // Also regenerate the client
            console.log(`Executing npx prisma generate...`);
            await execPromise('npx prisma generate', {
                cwd: process.cwd()
            });

        } catch (procErr: any) {
            console.error("Prisma process error:", procErr);
            return NextResponse.json({ success: false, error: `Prisma migration failed: ${procErr.message}` }, { status: 500 });
        }

        const newSchema = await parsePrismaSchema();
        return NextResponse.json({ success: true, data: newSchema });
    } catch (error: any) {
        console.error("Schema API Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
