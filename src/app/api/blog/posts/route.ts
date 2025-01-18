import { NextResponse } from 'next/server';
import { db as pool } from 'lib/db';

interface BlogPost {
  post_id: number;
  title: string;
  excerpt: string;
  published_at: string;
  category_id: number;
  category_name: string;
}

export async function GET() {
  try {
    const result = await pool.query<BlogPost>(`
      SELECT 
        bp.post_id,
        bp.title,
        bp.excerpt,
        bp.published_at,
        bc.category_id,
        bc.name as category_name
      FROM Blog_Posts bp
      JOIN Blog_Categories bc ON bp.category_id = bc.category_id
      ORDER BY bp.published_at DESC
    `);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
  }
}
