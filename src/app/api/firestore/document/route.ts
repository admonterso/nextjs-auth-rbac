import { db } from "@/provider";
import { addDocument } from "@/provider/addDocument";
import { getDocumentById } from "@/provider/getDocumentById";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { collectionName, documentId } = {
      collectionName: request.nextUrl.searchParams.get("collectionName") ?? "",
      documentId: request.nextUrl.searchParams.get("documentId") ?? "",
    };

    console.log({ collectionName, documentId });

    try {
      const response = await getDocumentById(collectionName, documentId);
      return response;
    } catch (e) {
      return NextResponse.json(
        {
          status: "error",
          error: e,
          message: "error in getDocumentById GET request",
        },
        { status: 400 }
      );
    }
  } catch (e) {
    return NextResponse.json(
      {
        status: "error",
        message: "something went wrong in GET request",
        params: request.url,
        error: e,
      },
      { status: 500 }
    );
  }
}
export async function POST(request: NextRequest) {
  try {
    const { collectionName, data } = {
      collectionName: request.nextUrl.searchParams.get("collectionName") ?? "",
      data: await request.json(),
    };
    console.log({ collectionName, data });
    try {
      const response = await addDocument(collectionName, data);
      return response;
    } catch (e) {
      return NextResponse.json(
        {
          status: "error",
          error: e,
          message: "error in getDocumentById POST request",
        },
        { status: 400 }
      );
    }
  } catch (e) {
    return NextResponse.json(
      {
        status: "error",
        message: "something went wrong in POST request",
        params: request.url,
        error: e,
      },
      { status: 500 }
    );
  }
}
