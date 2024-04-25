import { collection, addDoc } from "firebase/firestore";
import { db } from ".";
import { NextResponse } from "next/server";

export const addDocument = async (
  collectionName: string,
  documentData: any
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

  if (!documentData) {
    return NextResponse.json(
      {
        status: "error",
        message: "documentData is required",
      },
      { status: 400 }
    );
  }

  try {
    const docRef = await addDoc(collection(db, collectionName), documentData);

    return NextResponse.json(
      {
        status: "success",
        message: "Document added successfully",
        id: docRef.id, // Return the auto-generated ID
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: "something went wrong in addDocument",
        error,
      },
      { status: 500 }
    );
  }
};
