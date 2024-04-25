import { getDocumentsPagination } from "@/provider/getDocumentsPagination";
import { FirestoreFilterType } from "@/types/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const {
      pageSize = 20,
      pageToken,
      collectionName,
      filters,
    } = {
      pageSize: Number(request.nextUrl.searchParams.get("pageSize") || 20),
      pageToken: request.nextUrl.searchParams.get("pageToken") ?? undefined,
      collectionName: request.nextUrl.searchParams.get("collectionName") ?? "",

      filters:
        ((request.nextUrl.searchParams.getAll("filters") ?? [])
          .filter((filter) => filter.trim() !== "")
          .map((filter) => JSON.parse(filter)) as FirestoreFilterType[]) ?? [],
    };
    try {
      const response = await getDocumentsPagination({
        pageSize,
        pageToken,
        collectionName,
        filters,
      });

      return response;
    } catch (e) {
      return NextResponse.json(
        {
          status: "error",
          error: e,
          message: "error in getDocumentsPagination Users GET request",
        },
        { status: 400 }
      );
    }
  } catch (e) {
    return NextResponse.json(
      {
        status: "error",
        message: "something went wrong in Users GET request",
        params: request.url,
        error: e,
      },
      { status: 500 }
    );
  }
}
