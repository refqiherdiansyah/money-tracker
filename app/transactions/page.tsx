import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import TransactionHistoryClient from "./transaction-history-client"

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return <TransactionHistoryClient initialTransactions={[]} />
  }

  const transactions = await prisma.transaction.findMany({
    where: {
      user: { email: session.user.email },
    },
    orderBy: { createdAt: "desc" },
  })

  return <TransactionHistoryClient initialTransactions={transactions} />
}
