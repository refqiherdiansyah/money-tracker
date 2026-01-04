import { prisma } from "@/lib/prisma";
import TransactionClient from "./components/TransactionClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Mock initial transactions for demo
const initialTransactions = [
  {
    id: 1,
    title: "Groceries",
    amount: 150000,
    type: "expense" as const,
    category: "Food",
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Salary",
    amount: 5000000,
    type: "income" as const,
    category: "Other",
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    title: "Coffee",
    amount: 45000,
    type: "expense" as const,
    category: "Food",
    createdAt: new Date().toISOString(),
  },
]

function serializeTransaction(t: any) {
  return {
    ...t,
    amount: Number(t.amount),
  };
}

export default async function Page() {
  const session = await getServerSession(authOptions);

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
