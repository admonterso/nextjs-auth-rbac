import { db } from "@/provider";
import { getDocumentById } from "@/provider/getDocumentById";
import { FirestoreEntreeSchema, FirestoreEntreeType } from "@/types/entree";
import { FirestoreHouseSchema, FirestoreHouseType } from "@/types/houses";
import { collection, doc, getDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET(request: Request, context: { params: any }) {
  return fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/firestore/collection/?pageSize=20&collectionName=Entrees&orderByField&filters=&pageToken=`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
    .then(async (res) => {
      const response = await res.json();
      console.log(response);
      return NextResponse.json(response, { status: 200 });
    })
    .catch((e) => {
      console.error(e);
      return NextResponse.json(e, { status: 200 });
    });
}

export async function POST(request: Request) {
  try {
    const { name, houseId }: FirestoreEntreeType = await request.json();
    const response = FirestoreEntreeSchema.safeParse({
      name,
      houseId,
    });

    if (response.success === false) {
      return NextResponse.json(
        {
          status: "error",
          data: {
            name,
            houseId,
          },
          message: response.error.errors
            .map((error) => error.message)
            .join(", "),
        },
        { status: 400 }
      );
    }

    const body = {
      name,
      houseId,
    };

    return fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/firestore/document/?collectionName=Entrees`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    )
      .then(async (res) => {
        if (res.status === 201) {
          const response = await res.json();

          return NextResponse.json(response, { status: 201 });
        }

        return NextResponse.json(
          { error: res.statusText, res, url: res.url },
          { status: res.status }
        );
      })
      .catch((e) => {
        console.error(e);
        return NextResponse.json(e, { status: 500 });
      });
  } catch (e) {
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
