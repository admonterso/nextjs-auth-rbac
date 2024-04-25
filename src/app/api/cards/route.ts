import { db } from "@/provider";
import { FirestoreCardSchema, FirestoreCardType } from "@/types/card";
import { addDoc, collection } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET(request: Request, context: { params: any }) {
  return fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/firestore/collection/?pageSize=20&collectionName=Cards&orderByField&filters=&pageToken=`,
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
      return NextResponse.json({ error: e }, { status: 500 });
    });
}
// 500 200 201 404 403 401 400

export async function POST(request: Request) {
  // get the data from the request
  const body = await request.json();
  // const { fullName, email, password, phoneNumber }: RegisterUser =
  //   await request.json();

  // const response = RegisterUserSchema.safeParse({
  //   fullName,
  //   email,
  //   password,
  //   phoneNumber,
  // });

  // if (response.success === false) {
  //   return NextResponse.json(
  //     {
  //       status: "error",
  //       data: {
  //         fullName,
  //         email,
  //         phoneNumber,
  //       },
  //       message: response.error.errors.map((error) => error.message).join(", "),
  //     },
  //     { status: 400 }
  //   );
  // }

  return fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/firestore/document/?collectionName=Cards`,
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
}
