import Link from 'next/link';

interface BlogPost {
  post_id: number;
  title: string;
  slug: string;
}

interface BlogSidebarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  categories: string[];
  selectedCategory: string | null;
  onCategoryClick: (category: string) => void;
  recentPosts: BlogPost[];
}

const BlogSidebar = ({
  searchTerm,
  setSearchTerm,
  categories,
  selectedCategory,
  onCategoryClick,
  recentPosts,
}: BlogSidebarProps) => {
  return (
    <div className="space-y-8">
      {/* Search Section */}
      <div>
        <h3 className="text-lg font-bold text-header-light dark:text-header-dark mb-4">
          Search Posts
        </h3>
        <div className="relative">
          <input
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-200 dark:border-gray-700 bg-background-light dark:bg-background-dark focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-text-light dark:text-text-dark"
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-text-light/50 dark:text-text-dark/50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Categories Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-header-light dark:text-header-dark">
            Categories
          </h3>
          {selectedCategory && (
            <button
              onClick={() => onCategoryClick('')}
              className="text-sm text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
            >
              Clear Filters
            </button>
          )}
        </div>
        <div className="space-y-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryClick(category)}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors duration-200 ${
                selectedCategory === category
                  ? 'bg-primary-500 text-white'
                  : 'text-text-light dark:text-text-dark hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Recent Posts Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-header-light dark:text-header-dark">
            Recent Posts
          </h3>
          <Link
            href="/blog"
            className="text-sm text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
          >
            View All
          </Link>
        </div>
        <ul className="space-y-3">
          {recentPosts.slice(0, 5).map((post) => (
            <li key={post.post_id}>
              <Link
                href={`/blog/${post.slug}`}
                className="block text-text-light dark:text-text-dark hover:text-primary-500 dark:hover:text-primary-400 transition-colors duration-200"
              >
                {post.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BlogSidebar;
