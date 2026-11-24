import React, { useState, useEffect } from 'react';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, set, onValue } from 'firebase/database';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [campaignName, setCampaignName] = useState('');
  const [characterName, setCharacterName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getDatabase();

  useEffect(() => {
    const usersRef = ref(db, 'users');
    const unsubscribe = onValue(usersRef, (snapshot) => {
      const usersData = [];
      snapshot.forEach((childSnapshot) => {
        usersData.push({
          id: childSnapshot.key,
          ...childSnapshot.val()
        });
      });
      setUsers(usersData);
    });

    return () => unsubscribe();
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    const sanitizedCampaign = campaignName.toLowerCase().replace(/\s+/g, '_');
    const sanitizedCharacter = characterName.toLowerCase().replace(/\s+/g, '_');
    const email = `${sanitizedCampaign}_${sanitizedCharacter}@dnd.game`;
    const password = `${sanitizedCampaign}${sanitizedCharacter}123!`;

    try {
      if (isRegistering) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await set(ref(db, `users/${userCredential.user.uid}`), {
          campaignName,
          characterName,
          createdAt: new Date().toISOString(),
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(isRegistering ? 'Failed to register. Try different names.' : 'Failed to login. Please check your credentials. Or if the Campaign and Character are not registered.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 relative">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8 m-4 relative z-10">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">D&D Home</h2>
        {error && <p className="text-red-500 mb-6 text-center">{error}</p>}
        <form onSubmit={handleAuth} className="space-y-6">
          <div>
            <input
              type="text"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              placeholder="Campaign Name (e.g., Lost Mine of Phandelver)"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <p className="text-sm text-gray-500 mt-1">Examples: Storm King's Thunder, Curse of Strahd, Homebrew Campaign</p>
          </div>
          <div>
            <input
              type="text"
              value={characterName}
              onChange={(e) => setCharacterName(e.target.value)}
              placeholder="Character Name (e.g., Thorin Stormforge)"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <p className="text-sm text-gray-500 mt-1">Examples: Elara Moonweaver, Grimlock the Mighty, Zephyr Swiftwind</p>
          </div>
          <div className="space-y-4">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {isRegistering ? 'Register' : 'Login'}
            </button>
            <button
              type="button"
              onClick={() => setIsRegistering(!isRegistering)}
              className="w-full bg-gray-200 text-gray-700 p-3 rounded-lg hover:bg-gray-300 transition-colors"
            >
              {isRegistering ? 'Back to Login' : 'Register Campaign'}
            </button>
          </div>
        </form>
      </div>

      <button
        onClick={() => setIsPanelOpen(!isPanelOpen)}
        className="fixed top-1/2 right-0 -translate-y-1/2 bg-blue-600 text-white px-3 py-4 rounded-l-lg hover:bg-blue-700 transition-colors z-20"
      >
        {isPanelOpen ? '→' : '←'}
      </button>

      {isPanelOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={() => setIsPanelOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-lg z-40 overflow-y-auto transform transition-transform duration-300">
            <div className="relative">
              <button
                onClick={() => setIsPanelOpen(false)}
                className="absolute left-0 top-1/2 -translate-x-full transform bg-blue-600 text-white px-3 py-4 rounded-l-lg hover:bg-blue-700 transition-colors"
              >
                →
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Active Campaigns</h3>
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
                  {users.length} Characters
                </span>
              </div>
              <div className="space-y-6">
                {users.reduce((campaigns, user) => {
                  const campaign = campaigns.find(c => c.name === user.campaignName);
                  if (campaign) {
                    campaign.characters.push(user.characterName);
                  } else {
                    campaigns.push({
                      name: user.campaignName,
                      characters: [user.characterName]
                    });
                  }
                  return campaigns;
                }, []).map((campaign, index) => (
                  <div key={index} className="bg-gray-50 border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-bold text-blue-600">{campaign.name}</h4>
                      <span className="bg-blue-50 text-blue-600 text-xs font-medium px-2 py-1 rounded-full">
                        {campaign.characters.length} {campaign.characters.length === 1 ? 'Player' : 'Players'}
                      </span>
                    </div>
                    <ul className="space-y-2">
                      {campaign.characters.map((character, charIndex) => (
                        <li key={charIndex} className="flex items-center text-gray-700">
                          <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                          {character}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default LoginPage;