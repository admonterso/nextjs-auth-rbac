import { FirestoreEntreeSchema, FirestoreEntreeType } from "@/types/entree";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;
    return fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/firestore/document/${id}/?collectionName=Entrees`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then(async (res) => {
        const entreeResponse: FirestoreEntreeType = await res.json();
        const validated = FirestoreEntreeSchema.safeParse(entreeResponse);
        if (!validated.success) {
          return NextResponse.json(
            {
              error: validated.error,
              message: "validation didn't pass after internal fetch Entrees/id",
            },
            { status: 400 }
          );
        }
        const promises = [];
        const terminalIds = entreeResponse.terminals ?? [];
        promises.push(
          ...terminalIds.map((id) =>
            fetch(
              `${process.env.NEXT_PUBLIC_BASE_URL}/api/firestore/document/${id}/?collectionName=Terminals`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                },
              }
            )
          )
        );
        try {
          return Promise.all(promises).then(async (res) => {
            const terminals = await Promise.all(res.map((r) => r.json()));
            return NextResponse.json(
              { ...entreeResponse, terminals },
              { status: 200 }
            );
          });
        } catch (e) {
          return NextResponse.json(
            {
              error: e,
              message: "Failed to fetch terminals for entree",
            },
            { status: 500 }
          );
        }
      })
      .catch((e) => {
        return NextResponse.json(
          { error: e, message: "Error in GET Entrees by id" },
          { status: 500 }
        );
      });
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

export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;
    return fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/firestore/document/${id}/?collectionName=Entrees`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then(async (res) => {
        const response = await res.json();
        return NextResponse.json(response, { status: res.status });
      })
      .catch((e) => {
        return NextResponse.json(
          { error: e, message: "Error in DELETE Entrees by id" },
          { status: 500 }
        );
      });
  } catch (e) {
    return NextResponse.json(
      {
        status: "error",
        message: "something went wrong in DELETE request",
        params: request.url,
        error: e,
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  context: { params: { id: string } }
) {
  const { id } = context.params;
  try {
    const body = await request.json();
    return fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/firestore/document/${id}/?collectionName=Entrees`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    )
      .then(async (res) => {
        const response = await res.json();
        return NextResponse.json(response, { status: res.status });
      })
      .catch((e) => {
        return NextResponse.json(
          { error: e, message: "Error in PATCH Entrees by id" },
          { status: 500 }
        );
      });
  } catch (e) {
    return NextResponse.json(
      {
        status: "error",
        message: "something went wrong in PATCH request",
        params: request.url,
        error: e,
      },
      { status: 500 }
    );
  }
}
