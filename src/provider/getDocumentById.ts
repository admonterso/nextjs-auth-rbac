import { doc, getDoc } from "firebase/firestore";
import { db } from ".";
import { NextResponse } from "next/server";

export const getDocumentById = async (
  collectionName: string,
  documentId: string
) => {
  if (!collectionName) {
    return NextResponse.json(
      {
        status: "error",
        message: "collectionName is required",
      },
      { status: 400 }
    );
  }

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
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return NextResponse.json(
        { ...docSnap.data(), id: docSnap.id },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          status: "error",
          message: "No such document",
        },
        { status: 404 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: "something went wrong in getDocumentById",
        error,
      },
      { status: 500 }
    );
  }
};
