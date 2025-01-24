import { NextResponse } from 'next/server';
import { PinataSDK } from "pinata-web3";

export async function POST(req: Request) {

    const pinata = new PinataSDK({
        pinataJwt: process.env.PINATA_JWT!,
        pinataGateway: process.env.NEXT_PUBLIC_PINATA_GATEAWAY,
    });

    const file = await req.formData();

    const fileData = file.get('file') as File | null;

    if (!fileData) {
        return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    try {
        const response = await pinata.upload.file(fileData);

        return NextResponse.json({
            success: true,
            ipfsHash: response.IpfsHash,
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return NextResponse.json({ error: error.response.data }, { status: 500 });
    }
}
