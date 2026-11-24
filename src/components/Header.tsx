import React from 'react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
}

function Header({ title, showBack }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-blue-600 text-white p-4 shadow-md">
      <div className="max-w-6xl mx-auto flex items-center">
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            className="mr-4 hover:bg-blue-700 p-2 rounded transition-colors"
          >
            ← Back
          </button>
        )}
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>
    </div>
  );
}

export default Header;