import { RegisterUserSchema, User } from "@/types/user";
import { NextResponse } from "next/server";
// 500 200 201 404 403 401 400

export async function GET(request: Request, context: { params: any }) {
  return NextResponse.json({ data: [] }, { status: 400 });
}

export async function HEAD(request: Request) {}

export async function POST(request: Request) {
  //validate the request body
  try {
    const { fullName, email, password, role }: User = await request.json();

    const response = RegisterUserSchema.safeParse({
      fullName,
      email,
      password,
      role,
    });

    if (response.success === false) {
      return NextResponse.json(
        {
          status: "error",
          data: {
            fullName,
            email,
            role,
          },
          message: response.error.errors
            .map((error) => error.message)
            .join(", "),
        },
        { status: 400 }
      );
    }
    // TODO: add user to Firebase Authenication & Firestore

    // in case of success
    return NextResponse.json(
      {
        fullName,
        email,
        role,
      },
      { status: 201 }
    );
  } catch (e) {
    return NextResponse.json(e, { status: 400 });
  }
}

export async function PUT(request: Request) {}

export async function DELETE(request: Request) {}

export async function PATCH(request: Request) {}

// If `OPTIONS` is not defined, Next.js will automatically implement `OPTIONS` and  set the appropriate Response `Allow` header depending on the other methods defined in the route handler.
export async function OPTIONS(request: Request) {}
