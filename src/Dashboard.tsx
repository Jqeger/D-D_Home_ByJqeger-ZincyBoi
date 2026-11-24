import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import Header from './components/Header';

function Dashboard() {
  const navigate = useNavigate();
  const auth = getAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-blue-600 text-white p-4 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">D&D Home</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
          >
            Log Out
          </button>
        </div>
      </div>
      <div className="max-w-4xl mx-auto p-8">
        <div className="grid grid-cols-2 gap-8">
          <button
            onClick={() => navigate('/dice')}
            className="bg-purple-600 text-white p-12 rounded-lg text-2xl font-bold hover:bg-purple-700 transition-colors shadow-lg"
          >
            Dice
          </button>
          <button
            onClick={() => navigate('/character-sheet')}
            className="bg-green-600 text-white p-12 rounded-lg text-2xl font-bold hover:bg-green-700 transition-colors shadow-lg"
          >
            Character Sheet
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;