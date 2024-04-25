import { db } from "@/provider";
import { addDocument } from "@/provider/addDocument";
import { getDocumentById } from "@/provider/getDocumentById";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { collectionName, documentId } = {
      collectionName: request.nextUrl.searchParams.get("collectionName") ?? "",
      documentId: context.params.id ?? "",
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
export async function PATCH(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { collectionName, data, documentId } = {
      collectionName: request.nextUrl.searchParams.get("collectionName") ?? "",
      data: await request.json(),
      documentId: context.params.id ?? "",
    };
    console.log({ collectionName, data, documentId });

    if (!documentId) {
      return NextResponse.json(
        {
          status: "error",
          message: "documentId is required",
        },
        { status: 400 }
      );
    }

    try {
      const docRef = doc(db, collectionName, documentId);
      await updateDoc(docRef, data);

      return NextResponse.json(
        {
          status: "success",
          message: "Document updated successfully",
        },
        { status: 200 }
      );
    } catch (e) {
      return NextResponse.json(
        {
          status: "error",
          error: e,
          message: "error in updateDoc PATCH request",
        },
        { status: 400 }
      );
    }
  } catch (e) {
    return NextResponse.json(
      {
        status: "error",
        message: "something went wrong in PATCH request",
        params: request.url,
        error: e,
      },
      { status: 500 }
    );
  }
}
export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { collectionName, documentId } = {
      collectionName: request.nextUrl.searchParams.get("collectionName") ?? "",
      documentId: context.params.id ?? "",
    };
    console.log({ collectionName, documentId });

    if (!documentId) {
      return NextResponse.json(
        {
          status: "error",
          message: "documentId is required",
        },
        { status: 400 }
      );
    }

    try {
      const docRef = doc(db, collectionName, documentId);
      await deleteDoc(docRef);
      return NextResponse.json(
        {
          status: "success",
          message: "Document deleted successfully",
        },
        { status: 200 }
      );
    } catch (e) {
      return NextResponse.json(
        {
          status: "error",
          error: e,
          message: "error in deleteDoc DELETE request",
        },
        { status: 400 }
      );
    }
  } catch (e) {
    return NextResponse.json(
      {
        status: "error",
        message: "something went wrong in DELETE request",
        params: request.url,
        error: e,
      },
      { status: 500 }
    );
  }
}
