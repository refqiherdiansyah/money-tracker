import { prisma } from "@/lib/prisma";
import TransactionClient from "./components/TransactionClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

function serializeTransaction(t: any) {
  return {
    ...t,
    amount: Number(t.amount),
  };
}

export default async function Page() {
  let session = null;

  try {
    session = await getServerSession(authOptions);
  } catch (error) {
    console.error("❌ getServerSession failed:", error);
    session = null;
  }

  if (!session?.user?.email) {
    return <TransactionClient initialTransactions={[]} />;
  }

  const transactions = await prisma.transaction.findMany({
    where: {
      user: { email: session.user.email },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <TransactionClient
      initialTransactions={transactions.map(serializeTransaction)}
    />
  );
}
