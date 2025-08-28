import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;

    if(!id){
        return NextResponse.json({message: "Id is required"}, {status:400})
    }

    const deleteNote = await prisma.notes.delete({
        where: {id: id}

    });

    return NextResponse.json(deleteNote)
}