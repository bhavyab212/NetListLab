/**
 * Header Component
 * Top navigation bar for the application
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Home, Compass, Settings, LogOut } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

interface HeaderProps {
  currentPage?: 'explore' | 'dashboard' | 'settings';
}

export default function Header({
  currentPage = 'explore',
}: HeaderProps) {
  const { isAuthenticated, user, logout } = useAuthStore();

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Compass, label: 'Explore', path: '/explore' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        backgroundColor: 'rgba(2, 6, 23, 0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '40px',
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '1.25rem',
            fontWeight: 700,
            color: '#00C8F0',
            cursor: 'pointer',
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              background: 'linear-gradient(135deg, #00C8F0, #3B6EF0)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '1rem',
              fontWeight: 700,
            }}
          >
            N
          </div>
          <span>NetListLab</span>
        </div>

        {/* Navigation */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flex: 1,
            maxWidth: '400px',
          }}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.path === '/explore' && currentPage === 'explore';

            return (
              <motion.a
                key={item.path}
                href={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  color: isActive ? '#00C8F0' : '#94A3B8',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  transition: 'all 150ms ease',
                  backgroundColor: isActive ? 'rgba(0, 200, 240, 0.1)' : 'transparent',
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 600 : 400,
                }}
                whileHover={{
                  color: '#F8FAFC',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                }}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </motion.a>
            );
          })}
        </nav>

        {/* User Menu */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          {isAuthenticated && user ? (
            <>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '0.875rem',
                }}
              >
                <img
                  src={user.avatar || 'https://i.pravatar.cc/150?img=0'}
                  alt={user.username}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                />
                <span style={{ color: '#F8FAFC', fontWeight: 500 }}>
                  {user.username}
                </span>
              </div>

              <motion.button
                onClick={logout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  backgroundColor: 'transparent',
                  color: '#94A3B8',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  transition: 'all 150ms ease',
                }}
                whileHover={{
                  color: '#F43F5E',
                  borderColor: 'rgba(244, 63, 94, 0.3)',
                  backgroundColor: 'rgba(244, 63, 94, 0.05)',
                }}
              >
                <LogOut size={16} />
                <span>Logout</span>
              </motion.button>
            </>
          ) : (
            <motion.a
              href="/login"
              style={{
                padding: '8px 16px',
                backgroundColor: '#00C8F0',
                color: '#020617',
                textDecoration: 'none',
                borderRadius: '6px',
                fontWeight: 600,
                fontSize: '0.875rem',
                transition: 'all 150ms ease',
              }}
              whileHover={{
                backgroundColor: '#00B0D8',
                boxShadow: '0 0 20px rgba(0, 200, 240, 0.3)',
              }}
            >
              Sign In
            </motion.a>
          )}
        </div>
      </div>
    </motion.header>
  );
}
