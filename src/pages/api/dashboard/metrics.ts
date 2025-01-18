import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const totalSales = await prisma.order.aggregate({
      _sum: { total_amount: true },
    });

    const totalCustomers = await prisma.customer.count();
    const totalOrders = await prisma.order.count();

    res.status(200).json({
      totalSales: totalSales._sum.total_amount || 0,
      totalCustomers,
      totalOrders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to load metrics" });
  }
}
