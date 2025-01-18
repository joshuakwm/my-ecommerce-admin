import { NextResponse } from 'next/server';
import { db as pool } from 'lib/db';

interface Category {
  category_id: number;
  name: string;
}

export async function GET() {
  try {
    const result = await pool.query<Category>(`
      SELECT category_id, name 
      FROM Blog_Categories
      ORDER BY name ASC
    `);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching blog categories:', error);
    return NextResponse.json({ error: 'Failed to fetch blog categories' }, { status: 500 });
  }
}
