import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;
    return fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/firestore/document/${id}/?collectionName=Cards`,
      {
        method: "GET",
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
          { error: e, message: "Error in GET Cards by id" },
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
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/firestore/document/${id}/?collectionName=Cards`,
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
          { error: e, message: "Error in DELETE Cards by id" },
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
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/firestore/document/${id}/?collectionName=Cards`,
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
          { error: e, message: "Error in PATCH Cards by id" },
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
