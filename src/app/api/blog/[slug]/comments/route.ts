import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { authorName, commentContent } = await req.json();
    const slug = params.slug;

    if (!authorName || !commentContent || !slug) {
      return new NextResponse('Missing fields', { status: 400 });
    }

    const post = await db.query.blogPosts.findFirst({
      where: (posts, { eq }) => eq(posts.slug, slug),
    });

    if (!post) {
      return new NextResponse('Post not found', { status: 404 });
    }

    await db.insert(db.blogComments).values({
      postId: post.postId,
      authorName,
      content: commentContent,
      commentedAt: new Date(),
    });

    return NextResponse.json({ message: 'Comment submitted successfully' });
  } catch (error) {
    console.error('Error submitting comment:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
