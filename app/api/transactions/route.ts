import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/* ================= HELPERS ================= */
function serializeTransaction(t: any) {
  return {
    ...t,
    amount: Number(t.amount),
  };
}

/* ================= GET ================= */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json([]);
    }

    const transactions = await prisma.transaction.findMany({
      where: {
        user: { email: session.user.email },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(transactions.map(serializeTransaction));
  } catch {
    return NextResponse.json([]);
  }
}

/* ================= POST ================= */
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  if (
    !body.title ||
    typeof body.amount !== "number" ||
    !["income", "expense"].includes(body.type)
  ) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const user = await prisma.user.upsert({
    where: { email: session.user.email },
    update: {},
    create: {
      email: session.user.email,
      name: session.user.name ?? "User",
    },
  });

  const transaction = await prisma.transaction.create({
    data: {
      title: body.title,
      amount: body.amount,
      type: body.type,
      category: body.category ?? "Other",
      userId: user.id,
    },
  });

  return NextResponse.json(serializeTransaction(transaction));
}

/* ================= DELETE ================= */
export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await req.json();
  if (typeof id !== "number") {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const owned = await prisma.transaction.findFirst({
    where: {
      id,
      user: { email: session.user.email },
    },
  });

  if (!owned) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.transaction.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
