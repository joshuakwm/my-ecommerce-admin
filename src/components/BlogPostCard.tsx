import Link from 'next/link';

interface BlogPost {
  post_id: number;
  title: string;
  excerpt: string;
  content?: string;
  published_at: string;
  category_id: number;
  category_name: string;
  slug: string;
  date: string;
}

const BlogPostCard = ({ post }: { post: BlogPost }) => {
  return (
    <article className="group relative flex flex-col h-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200">
      <div className="flex flex-col h-full p-6">
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-header-light dark:text-header-dark mb-4 group-hover:text-primary-500 transition-colors duration-200">
            <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0">
              {post.title}
            </Link>
          </h3>
          <p className="text-text-light/80 dark:text-text-dark/80 mb-6 leading-relaxed">
            {post.excerpt}
          </p>
        </div>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-text-light/70 dark:text-text-dark/70">
              {post.date}
            </span>
            <span className="text-sm text-text-light/70 dark:text-text-dark/70">•</span>
            <span className="text-sm font-medium text-primary-500">
              {post.category_name}
            </span>
          </div>
          <Link 
            href={`/blog/${post.slug}`}
            className="text-sm font-medium text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
          >
            Read More →
          </Link>
        </div>
      </div>
    </article>
  );
};

export default BlogPostCard;
