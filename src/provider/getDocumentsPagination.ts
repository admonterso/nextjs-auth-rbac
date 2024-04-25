import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import { db } from ".";
import { ListAllRequestSchema, ListAllRequestType } from "@/types/firestore";
import { NextResponse } from "next/server";

export const getDocumentsPagination = async ({
  pageSize,
  pageToken,
  collectionName,
  filters,
}: ListAllRequestType) => {
  // input validation with zod
  const validation = ListAllRequestSchema.safeParse({
    pageSize,
    pageToken,
    collectionName,
    filters,
  });

  if (validation.success === false) {
    return NextResponse.json(
      {
        status: "error Validation",
        data: {
          pageSize,
          pageToken,
          collectionName,
          filters,
        },
        message: validation.error.errors
          .map((error) => error.message)
          .join(", "),
      },
      { status: 400 }
    );
  }

  if (!pageSize) {
    return NextResponse.json(
      {
        status: "error",
        message: "pageSize is required",
      },
      { status: 400 }
    );
  }

  if (!collectionName) {
    return NextResponse.json(
      {
        status: "error",
        message: "collectionName is required",
      },
      { status: 400 }
    );
  }

  try {
    const collectionRef = collection(db, collectionName);
    let collectionQuery = query(collectionRef);

    if (filters && filters.length > 0) {
      filters.forEach((filter) => {
        collectionQuery = query(
          collectionQuery,
          where(filter.field, filter.operator, filter.value)
        );
      });
    }

    collectionQuery = query(collectionQuery, limit(pageSize));

    if (pageToken) {
      collectionQuery = query(collectionQuery, startAfter(pageToken));
    }
    try {
      const snapshot = await getDocs(collectionQuery);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const nextPageToken =
        snapshot.docs.length > 0
          ? snapshot.docs[snapshot.docs.length - 1].id
          : null;

      return NextResponse.json({ data, nextPageToken }, { status: 200 });
    } catch (e) {
      return NextResponse.json(
        {
          status: "error",
          message: "error in getDocumentsPagination",
          error: e,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: "something went wrong in getDocumentsPagination",
        error,
      },
      { status: 500 }
    );
  }
};
