import { FirestoreHouseSchema, FirestoreHouseType } from "@/types/houses";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;
    return fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/firestore/document/${id}/?collectionName=Houses`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then(async (res) => {
        const houseResponse: FirestoreHouseType = await res.json();
        const validated = FirestoreHouseSchema.safeParse(houseResponse);
        if (!validated.success) {
          return NextResponse.json(
            {
              error: validated.error,
              message: "validation didn't pass after internal fetch Houses/id",
            },
            { status: 400 }
          );
        }

        if (houseResponse.entrees) {
          const promises = [];
          const enreeIds = houseResponse.entrees ?? [];
          const terminalIds = houseResponse.terminals ?? [];
          const familyIds = houseResponse.families ?? [];
          const memberIds = houseResponse.members ?? [];
          promises.push(
            ...enreeIds.map((id) =>
              fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/firestore/document/${id}/?collectionName=Entrees`,
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
              const entrees = await Promise.all(res.map((r) => r.json()));
              return NextResponse.json(
                { ...houseResponse, entrees },
                { status: 200 }
              );
            });
          } catch (e) {
            return NextResponse.json(
              { error: e, message: "Error in GET Houses by id" },
              { status: 500 }
            );
          }
        }
        return NextResponse.json(houseResponse, { status: 200 });
      })
      .catch((e) => {
        return NextResponse.json(
          { error: e, message: "Error in GET Houses by id" },
          { status: 500 }
        );
      });
  } catch (e) {
    return NextResponse.json(
      {
        status: "error",
        message: "something went wrong in Houses GET request",
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
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/firestore/document/${id}/?collectionName=Houses`,
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
          { error: e, message: "Error in DELETE House by id" },
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
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/firestore/document/${id}/?collectionName=Houses`,
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
          { error: e, message: "Error in PATCH Houses by id" },
          { status: 500 }
        );
      });
  } catch (e) {
    return NextResponse.json(
      {
        status: "error",
        message: "something went wrong in PATCH Houses request",
        params: request.url,
        error: e,
      },
      { status: 500 }
    );
  }
}
