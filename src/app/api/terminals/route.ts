import {
  FirestoreTerminalSchema,
  FirestoreTerminalType,
} from "@/types/terminals";
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
      return NextResponse.json(response, { status: 200 });
    })
    .catch((e) => {
      console.error(e);
      return NextResponse.json(e, { status: 200 });
    });
}

export async function POST(request: Request) {
  try {
    const body: FirestoreTerminalType = await request.json();
    body.balance = body.balance ?? 0;
    body.paymentDate = new Date(body.paymentDate);

    const response = FirestoreTerminalSchema.safeParse(body);

    if (response.success === false) {
      return NextResponse.json(
        {
          status: "error",
          data: body,
          message: response.error.errors
            .map((error) => error.message)
            .join(", "),
        },
        { status: 400 }
      );
    }
    const entreeId = body.entreeId;
    const entreeRes = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/firestore/document/${entreeId}/?collectionName=Entrees`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!entreeRes.ok) {
      return NextResponse.json(
        {
          error: entreeRes.statusText,
          message: `Failed to fetch entree with id ${entreeId}`,
        },
        { status: entreeRes.status }
      );
    }

    const entreeResponse = await entreeRes.json();

    if (!entreeResponse) {
      return NextResponse.json(
        {
          error: "Entree does not exist",
          message: `Failed to fetch entree with id ${entreeId}`,
        },
        { status: 404 }
      );
    }

    const terminalRes = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/firestore/document/?collectionName=Terminals`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    if (!terminalRes.ok) {
      return NextResponse.json(
        {
          error: terminalRes.statusText,
          message: "Failed to create terminal",
        },
        { status: terminalRes.status }
      );
    }

    if (terminalRes.status === 201) {
      const terminalResponse = await terminalRes.json();
      const entree = terminalResponse;
      const terminalId = terminalResponse.id;

      const entreesRes = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/firestore/document/${entreeId}/?collectionName=Entrees`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            terminals: [...(entree?.terminals ?? []), terminalId],
          }),
        }
      );

      if (!entreesRes.ok) {
        return NextResponse.json(
          {
            error: entreesRes.statusText,
            message: "Failed to update entree with terminal",
          },
          { status: entreesRes.status }
        );
      }
      // Fetch the house document
      const houseId = entreeResponse.houseId;
      const houseRes = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/firestore/document/${houseId}/?collectionName=Houses`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!houseRes.ok) {
        return NextResponse.json(
          {
            error: houseRes.statusText,
            message: `Failed to fetch house with id ${houseId}`,
          },
          { status: houseRes.status }
        );
      }

      const houseResponse = await houseRes.json();

      if (!houseResponse) {
        return NextResponse.json(
          {
            error: "House does not exist",
            message: `Failed to fetch house with id ${houseId}`,
          },
          { status: 404 }
        );
      }

      // Update the house document
      const house = houseResponse;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/firestore/document/${houseId}/?collectionName=Houses`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            terminals: [...(house?.terminals ?? []), terminalId],
          }),
        }
      );

      if (!res.ok) {
        return NextResponse.json(
          {
            error: res.statusText,
            message: "Failed to update house with terminal",
          },
          { status: res.status }
        );
      }

      return NextResponse.json(
        {
          ...terminalResponse,
          entreeId,
          houseId: entree.houseId,
          id: terminalId,
        },
        { status: 201 }
      );
    }

    return NextResponse.json(
      { error: terminalRes.statusText, terminalRes, url: terminalRes.url },
      { status: terminalRes.status }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        error: e,
        message: "something went wrong in POST request in Terminals",
        params: request.url,
      },
      { status: 500 }
    );
  }
}
