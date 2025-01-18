'use client';

import { useState, useEffect } from 'react';
import BlogPostCard from '../../components/BlogPostCard';
import BlogSidebar from '../../components/BlogSidebar';
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

const BlogPage = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [postsError, setPostsError] = useState<string | null>(null);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/blog/posts');
        if (!response.ok) {
          throw new Error(`Failed to load posts: ${response.statusText}`);
        }
        const data: BlogPost[] = await response.json();
        setPosts(data);
        setPostsError(null);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
        setPostsError('Failed to load blog posts. Please try again later.');
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/blog/categories');
        if (!response.ok) {
          throw new Error(`Failed to load categories: ${response.statusText}`);
        }
        const data: string[] = await response.json();
        setCategories(data);
        setCategoriesError(null);
      } catch (error) {
        console.error('Error fetching blog categories:', error);
        setCategoriesError('Failed to load categories. Please try again later.');
      }
    };

    Promise.all([fetchPosts(), fetchCategories()])
      .finally(() => setIsLoading(false));
  }, []);

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      (post.content && post.content.toLowerCase().includes(debouncedSearchTerm.toLowerCase()));
    
    const matchesCategory = !selectedCategory || String(post.category_id) === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleCategoryClick = (categoryId: number) => {
    setSelectedCategory(String(categoryId) === selectedCategory ? null : String(categoryId));
  };

  // Calculate paginated posts
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          <p className="text-text-light dark:text-text-dark">Loading blog content...</p>
        </div>
      </div>
    );
  }

  if (postsError || categoriesError) {
    return (
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading blog content</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{postsError || categoriesError}</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-header-light dark:text-header-dark mb-8">Our Blog</h1>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-header-light dark:text-header-dark mb-4">Featured Posts</h2>
            {posts.length > 0 && (
              <div className="relative">
                <BlogPostCard post={posts[0]} />
                <div className="absolute top-4 right-4 bg-primary-500 text-white px-3 py-1 rounded-full text-sm">
                  Featured
                </div>
              </div>
            )}
          </section>
          <section>
            <h2 className="text-2xl font-bold text-header-light dark:text-header-dark mb-4">All Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {currentPosts.map((post) => (
                <BlogPostCard key={post.post_id} post={post} />
              ))}
            </div>
            {filteredPosts.length > postsPerPage && (
              <div className="flex justify-center mt-8">
                <nav className="inline-flex rounded-md shadow-sm">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 text-sm font-medium text-text-light dark:text-text-dark bg-background-light dark:bg-background-dark border border-gray-300 dark:border-gray-700 rounded-l-md hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 text-sm font-medium text-text-light dark:text-text-dark bg-background-light dark:bg-background-dark border-t border-b border-gray-300 dark:border-gray-700">
                    Page {currentPage} of {Math.ceil(filteredPosts.length / postsPerPage)}
                  </span>
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === Math.ceil(filteredPosts.length / postsPerPage)}
                    className="px-4 py-2 text-sm font-medium text-text-light dark:text-text-dark bg-background-light dark:bg-background-dark border border-gray-300 dark:border-gray-700 rounded-r-md hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </section>
        </div>
        <div className="lg:col-span-1">
          <BlogSidebar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryClick={(category) => handleCategoryClick(categories.indexOf(category) + 1)}
            recentPosts={posts.slice(0, 5).map(post => ({
              post_id: post.post_id,
              title: post.title,
              slug: post.slug
            }))}
          />
        </div>
      </div>
      <div className="mt-4">
        <Link href="/blog/new" className="bg-primary-500 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded">
          Add New Blog Post
        </Link>
      </div>
    </div>
  );
};

export default BlogPage;
