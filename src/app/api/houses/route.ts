import { FirestoreHouseSchema, FirestoreHouseType } from "@/types/houses";
import { NextResponse } from "next/server";

export async function GET(request: Request, context: { params: any }) {
  return fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/firestore/collection/?pageSize=20&collectionName=Houses&orderByField&filters=&pageToken=`,
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
    const { name, address }: FirestoreHouseType = await request.json();

    const response = FirestoreHouseSchema.safeParse({
      name,
      address,
    });

    if (response.success === false) {
      return NextResponse.json(
        {
          status: "error",
          data: {
            name,
            address,
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
      address,
    };
    return fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/firestore/document/?collectionName=Houses`,
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
    console.error(e);
    return NextResponse.json(e, { status: 500 });
  }
}
