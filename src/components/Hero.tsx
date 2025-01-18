import Link from 'next/link';

const Hero = () => {
  return (
    <div className="bg-gradient-to-r from-primary-accent to-secondary-accent py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-light dark:text-text-dark mb-6">
          Discover the Latest Trends
        </h1>
        <p className="text-lg sm:text-xl text-text-light dark:text-text-dark mb-10">
          Explore our curated collection of high-quality products.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-accent hover:bg-secondary-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-accent transition-colors"
        >
          Shop Now
        </Link>
      </div>
    </div>
  );
};

export default Hero;
