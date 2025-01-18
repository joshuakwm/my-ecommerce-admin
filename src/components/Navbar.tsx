'use client';

import { ShoppingCartIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

const Navbar = () => {
  const [cartItemCount, setCartItemCount] = useState(0);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchCartItemCount = async () => {
      if (session?.user) {
        try {
          const response = await fetch('/api/cart', {
            credentials: 'include',
          });
          if (response.ok) {
            const data = await response.json();
            setCartItemCount(data?.data?.reduce((acc: number, item: { quantity: number }) => acc + item.quantity, 0) || 0);
          } else {
            console.error('Failed to fetch cart items');
            setCartItemCount(0);
          }
        } catch (error) {
          console.error('Error fetching cart items:', error);
          setCartItemCount(0);
        }
      } else {
        setCartItemCount(0);
      }
    };

    fetchCartItemCount();
  }, [session]);

  return (
    <nav className="bg-background-light dark:bg-background-dark p-4 shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-lg font-bold text-text-light dark:text-text-dark hover:text-primary-accent transition-colors">
          eShop
        </Link>
        <div className="flex space-x-6">
          <Link href="/about" className="text-text-light dark:text-text-dark hover:text-primary-accent transition-colors">
            About
          </Link>
          <Link href="/blog" className="text-text-light dark:text-text-dark hover:text-primary-accent transition-colors">
            Blog
          </Link>
          <Link href="/cart" className="relative text-text-light dark:text-text-dark hover:text-primary-accent transition-colors">
            <ShoppingCartIcon className="h-6 w-6"></ShoppingCartIcon>
            {cartItemCount > 0 && (
              <span className="absolute top-[-10px] right-[-10px] bg-primary-accent text-white rounded-full px-2 py-0 text-xs">
                {cartItemCount}
              </span>
            )}
          </Link>
          <Link href="/login" className="text-text-light dark:text-text-dark hover:text-primary-accent transition-colors">
            <UserCircleIcon className="h-6 w-6"></UserCircleIcon>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
