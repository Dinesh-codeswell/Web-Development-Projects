import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  const generateBreadcrumbLabel = (path: string) => {
    return path
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6" aria-label="Breadcrumb">
      <Link
        to="/"
        className="flex items-center hover:text-indigo-600 transition-colors"
        aria-label="Home"
      >
        <Home size={16} className="mr-1" />
        <span className="sr-only">Home</span>
      </Link>

      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;

        return (
          <React.Fragment key={name}>
            <ChevronRight size={16} className="text-gray-400" aria-hidden="true" />
            <Link
              to={routeTo}
              className={`${
                isLast
                  ? 'text-gray-900 font-medium cursor-default pointer-events-none'
                  : 'hover:text-indigo-600 transition-colors'
              }`}
              aria-current={isLast ? 'page' : undefined}
            >
              {generateBreadcrumbLabel(name)}
            </Link>
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;