import { db } from "@/provider";
import { getDocumentById } from "@/provider/getDocumentById";
import { FirestoreEntreeSchema, FirestoreEntreeType } from "@/types/entree";
import { FirestoreHouseSchema, FirestoreHouseType } from "@/types/houses";
import { collection, doc, getDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET(request: Request, context: { params: any }) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/firestore/collection/?pageSize=20&collectionName=Entrees&orderByField&filters=&pageToken=`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const response = await res.json();
    console.log(response);
    return NextResponse.json(response, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(e, { status: 200 });
  }
}
export async function POST(request: Request) {
  try {
    const body: FirestoreEntreeType = await request.json();
    const response = FirestoreEntreeSchema.safeParse(body);

    if (response.success === false) {
      return NextResponse.json(
        {
          status: "error",
          data: body,
          message: response.error.errors
            .map((error) => error.message)
            .join(", "),
        },
        { status: 400 }
      );
    }

    const houseId = body.houseId;
    const houseRes = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/firestore/document/${houseId}/?collectionName=Houses`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!houseRes.ok) {
      return NextResponse.json(
        {
          error: houseRes.statusText,
          message: `Failed to fetch house with id ${houseId}`,
        },
        { status: houseRes.status }
      );
    }

    const houseResponse = await houseRes.json();

    if (!houseResponse) {
      return NextResponse.json(
        {
          error: "House does not exist",
          message: `Failed to fetch house with id ${houseId}`,
        },
        { status: 404 }
      );
    }

    const entreeRes = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/firestore/document/?collectionName=Entrees`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    if (!entreeRes.ok) {
      return NextResponse.json(
        {
          error: entreeRes.statusText,
          message: "Failed to create entree",
        },
        { status: entreeRes.status }
      );
    }

    if (entreeRes.status === 201) {
      const entreeResponse = await entreeRes.json();
      const house = entreeResponse;
      const entreeId = entreeResponse.id;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/firestore/document/${houseId}/?collectionName=Houses`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            entrees: [...(house?.entrees ?? []), entreeId],
          }),
        }
      );

      if (!res.ok) {
        return NextResponse.json(
          {
            error: res.statusText,
            message: "Failed to update house with entree",
          },
          { status: res.status }
        );
      }

      const response = await res.json();
      console.log(response);
      return NextResponse.json(response, { status: 201 });
    }

    return NextResponse.json(
      { error: entreeRes.statusText, entreeRes, url: entreeRes.url },
      { status: entreeRes.status }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        error: e,
        message: "something went wrong in POST request in Entrees",
        params: request.url,
      },
      { status: 500 }
    );
  }
}
