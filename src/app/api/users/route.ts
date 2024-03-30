import { Z_Role } from "@/types/role";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function GET(request: Request, context: { params: any }) {
  return NextResponse.json({ data: [] }, { status: 400 });
}
// 500 200 201 404 403 401 400
export async function HEAD(request: Request) {}

export async function POST(request: Request) {
  //validate the request body
  try {
    const { fullName, email, password, role } = await request.json();
    const registerUserSchema = z.object({
      fullName: z.string(),
      email: z
        .string({
          required_error: "Email is required",
        })
        .email({
          message: "Invalid email",
        }),
      password: z
        .string()
        .min(6, {
          message: "Password must be at least 6 characters",
        })
        .optional(),
      role: Z_Role,
    });

    const response = registerUserSchema.safeParse({
      fullName,
      email,
      password,
      role,
    });
    console.log(response);
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
