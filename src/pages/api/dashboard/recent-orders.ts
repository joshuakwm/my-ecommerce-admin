import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { created_at: "desc" },
      include: { customer: true },
    });

    res.status(200).json(recentOrders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to load recent orders" });
  }
}
