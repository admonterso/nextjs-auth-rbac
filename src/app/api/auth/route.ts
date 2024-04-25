import { firebaseAuth } from "@/provider";
import { AuthUser, AuthUserSchema } from "@/types/user";
import { signInWithEmailAndPassword } from "firebase/auth";
import { NextResponse } from "next/server";
// 500 200 201 404 403 401 400

export async function GET(request: Request, context: { params: any }) {
  // TODO: get user's data

  const reponse = firebaseAuth.currentUser;

  // in case of success
  return NextResponse.json(
    {
      ...reponse,
    },
    { status: 200 }
  );
}

export async function POST(request: Request) {
  // validate the request's body
  try {
    const { email, password }: AuthUser = await request.json();

    const validation = AuthUserSchema.safeParse({
      email,
      password,
    });

    // check type validation
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
    if (validation.success === false) {
      return NextResponse.json(
        {
          status: "error",
          data: {
            email,
          },
          message: validation.error.errors
            .map((error) => error.message)
            .join(", "),
        },
        { status: 400 }
      );
    }

    try {
      const response = await signInWithEmailAndPassword(
        firebaseAuth,
        email,
        password
      );
      return NextResponse.json(
        {
          status: "success",
          data: {
            uid: response.user.uid,
            displayName: response.user.displayName,
            email: response.user.email,
            emailVerified: response.user.emailVerified,
            phoneNumber: response.user.phoneNumber,
            photoURL: response.user.photoURL,
            isAnonymous: response.user.isAnonymous,
            tenantId: response.user.tenantId,
            accessToken: await response.user.getIdToken(),
          },
          message: "User signed in successfully",
        },
        { status: 201 }
      );
    } catch (e: any) {
      return NextResponse.json(
        {
          status: "error",
          data: {
            email,
          },
          message: e.message,
        },
        { status: 401 }
      );
    }
  } catch (e) {
    return NextResponse.json(e, { status: 400 });
  }
}
