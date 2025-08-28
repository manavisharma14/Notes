import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
export async function GET(){
    const notes = await prisma.notes.findMany();
    return NextResponse.json(notes);
}

export async function POST(request: NextRequest){
    console.log("POST request received");
    const body = await request.json();
    const newNote = await prisma.notes.create({
        data: body

    });
    return NextResponse.json(newNote);
}



export async function PUT(request: NextRequest){
    const idParam = request.nextUrl.searchParams.get("id");
    const id = idParam ? Number(idParam) : null;

    if(!id){
        return NextResponse.json({message: "Id is required"}, {status:400})
    }
    const body = await request.json();
    const updatedNote = await prisma.notes.update({
        where: {id: id.toString()},
        data: body
    })

    return NextResponse.json(updatedNote)
}