import { NextResponse } from "next/server";

export async function GET() {
  return fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/firestore/collection/?pageSize=20&collectionName=Terminals&orderByField&filters=&pageToken=`,
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
