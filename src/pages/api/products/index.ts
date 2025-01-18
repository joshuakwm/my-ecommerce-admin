import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { db } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      // Use Prisma to fetch products
      const products = await prisma.product.findMany();
      res.status(200).json(products);
    } else if (req.method === "POST") {
      const { name, category, price } = req.body;
      const product = await prisma.product.create({
        data: { name, category, price },
      });
      res.status(201).json(product);
    } else if (req.method === "GET" && req.query.source === "db") {
      // Use db to fetch products from PostgreSQL
      const result = await db.query('SELECT * FROM products');
      res.status(200).json(result.rows);
    } else {
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: "Failed to manage products" });
  }
}
