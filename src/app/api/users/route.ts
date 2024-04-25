import { firebaseAuth } from "@/provider";
import { RegisterUserSchema, RegisterUser } from "@/types/user";
import { createUserWithEmailAndPassword } from "firebase/auth";

import { NextResponse } from "next/server";
// 500 200 201 404 403 401 400

export async function GET() {
  return fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/firestore/collection/?pageSize=2&collectionName=Users&orderByField=createTime&filters=&pageToken=`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
    .then(async (res) => {
      const response = await res.json();
      return NextResponse.json(response, { status: 200 });
    })
    .catch((e) => {
      console.error("error in Users GET", e);
      return NextResponse.json(e, { status: 500 });
    });
}

export async function POST(request: Request) {
  //validate the request body
  try {
    const { fullName, email, password, phoneNumber }: RegisterUser =
      await request.json();

    const response = RegisterUserSchema.safeParse({
      fullName,
      email,
      password,
      phoneNumber,
    });

    if (response.success === false) {
      return NextResponse.json(
        {
          status: "error",
          data: {
            fullName,
            email,
            phoneNumber,
          },
          message: response.error.errors
            .map((error) => error.message)
            .join(", "),
        },
        { status: 400 }
      );
    }
    if (!email || !password) {
      return NextResponse.json(
        {
          status: "error",
          data: {
            email,
          },
          message: "Email and password are required",
        },
        { status: 400 }
      );
    }

    // create firebase user
    try {
      const response = await createUserWithEmailAndPassword(
        firebaseAuth,
        email,
        password
      ).then((userCredentials) => {
        return userCredentials.user;
      });

      // in case of success
      return NextResponse.json(
        {
          ...response,
        },
        { status: 201 }
      );
    } catch (e: any) {
      return NextResponse.json(
        {
          status: "error",
          data: {
            email,
            fullError: e,
          },
          message: e?.message || e,
        },
        { status: 400 }
      );
    }
  } catch (e) {
    return NextResponse.json(e, { status: 400 });
  }
}

export async function PUT(request: Request) {}

export async function DELETE(request: Request) {}

export async function PATCH(request: Request) {}

// If `OPTIONS` is not defined, Next.js will automatically implement `OPTIONS` and  set the appropriate Response `Allow` header depending on the other methods defined in the route handler.
export async function OPTIONS(request: Request) {}
