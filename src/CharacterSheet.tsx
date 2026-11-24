import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, set, get } from 'firebase/database';
import Header from './components/Header';

function CharacterSheet() {
  const [character, setCharacter] = useState({
    name: '',
    class: '',
    level: 1,
    race: '',
    background: '',
    alignment: '',
    experiencePoints: 0,
    attributes: {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10
    },
    hitPoints: {
      maximum: 10,
      current: 10,
      temporary: 0
    },
    skills: {
      acrobatics: false,
      animalHandling: false,
      arcana: false,
      athletics: false,
      deception: false,
      history: false,
      insight: false,
      intimidation: false,
      investigation: false,
      medicine: false,
      nature: false,
      perception: false,
      performance: false,
      persuasion: false,
      religion: false,
      sleightOfHand: false,
      stealth: false,
      survival: false
    },
    currency: {
      cp: 0,
      sp: 0,
      ep: 0,
      gp: 0,
      pp: 0
    },
    equipment: '',
    features: '',
    proficiencies: '',
    appearance: {
      age: '',
      height: '',
      weight: '',
      eyes: '',
      skin: '',
      hair: ''
    },
    personality: {
      traits: '',
      ideals: '',
      bonds: '',
      flaws: ''
    },
    backstory: ''
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const auth = getAuth();
  const db = getDatabase();

  useEffect(() => {
    const loadCharacterSheet = async () => {
      if (!auth.currentUser) return;

      const characterRef = ref(db, `characterSheets/${auth.currentUser.uid}`);
      const snapshot = await get(characterRef);
      
      if (snapshot.exists()) {
        setCharacter(snapshot.val());
      }
    };

    loadCharacterSheet();
  }, []);

  const handleAttributeChange = (attribute, value) => {
    setCharacter(prev => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        [attribute]: value
      }
    }));
  };

  const calculateModifier = (value) => {
    return Math.floor((value - 10) / 2);
  };

  const handleSave = async () => {
    if (!auth.currentUser) return;

    setIsSaving(true);
    setSaveStatus('Saving...');

    try {
      await set(ref(db, `characterSheets/${auth.currentUser.uid}`), character);
      setSaveStatus('Saved successfully!');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      setSaveStatus('Error saving character sheet');
      console.error('Error saving character sheet:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header title="Character Sheet" showBack />
      <div className="max-w-6xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Character Sheet</h2>
            <div className="flex items-center gap-4">
              {saveStatus && (
                <span className={`text-sm ${saveStatus.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
                  {saveStatus}
                </span>
              )}
              <button
                onClick={handleSave}
                disabled={isSaving}
                className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors ${
                  isSaving ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSaving ? 'Saving...' : 'Save Character'}
              </button>
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <input
              type="text"
              placeholder="Character Name"
              value={character.name}
              onChange={(e) => setCharacter({...character, name: e.target.value})}
              className="p-2 border rounded"
            />
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Class"
                value={character.class}
                onChange={(e) => setCharacter({...character, class: e.target.value})}
                className="p-2 border rounded flex-1"
              />
              <input
                type="number"
                placeholder="Level"
                value={character.level}
                onChange={(e) => setCharacter({...character, level: parseInt(e.target.value)})}
                className="p-2 border rounded w-20"
              />
            </div>
            <input
              type="text"
              placeholder="Race"
              value={character.race}
              onChange={(e) => setCharacter({...character, race: e.target.value})}
              className="p-2 border rounded"
            />
          </div>

          {/* Attributes */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
            {Object.entries(character.attributes).map(([attr, value]) => (
              <div key={attr} className="text-center">
                <div className="uppercase font-bold mb-1">{attr}</div>
                <input
                  type="number"
                  value={value}
                  onChange={(e) => handleAttributeChange(attr, parseInt(e.target.value))}
                  className="p-2 border rounded w-20 text-center mb-1"
                />
                <div className="text-sm">Modifier: {calculateModifier(value)}</div>
              </div>
            ))}
          </div>

          {/* Hit Points */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-bold mb-1">Maximum HP</label>
              <input
                type="number"
                value={character.hitPoints.maximum}
                onChange={(e) => setCharacter({
                  ...character,
                  hitPoints: {...character.hitPoints, maximum: parseInt(e.target.value)}
                })}
                className="p-2 border rounded w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Current HP</label>
              <input
                type="number"
                value={character.hitPoints.current}
                onChange={(e) => setCharacter({
                  ...character,
                  hitPoints: {...character.hitPoints, current: parseInt(e.target.value)}
                })}
                className="p-2 border rounded w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Temporary HP</label>
              <input
                type="number"
                value={character.hitPoints.temporary}
                onChange={(e) => setCharacter({
                  ...character,
                  hitPoints: {...character.hitPoints, temporary: parseInt(e.target.value)}
                })}
                className="p-2 border rounded w-full"
              />
            </div>
          </div>

          {/* Currency */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            {Object.entries(character.currency).map(([currency, amount]) => (
              <div key={currency}>
                <label className="block text-sm font-bold mb-1">{currency.toUpperCase()}</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setCharacter({
                    ...character,
                    currency: {...character.currency, [currency]: parseInt(e.target.value)}
                  })}
                  className="p-2 border rounded w-full"
                />
              </div>
            ))}
          </div>

          {/* Text Areas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-1">Equipment</label>
              <textarea
                value={character.equipment}
                onChange={(e) => setCharacter({...character, equipment: e.target.value})}
                className="p-2 border rounded w-full h-32"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Features & Traits</label>
              <textarea
                value={character.features}
                onChange={(e) => setCharacter({...character, features: e.target.value})}
                className="p-2 border rounded w-full h-32"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Proficiencies & Languages</label>
              <textarea
                value={character.proficiencies}
                onChange={(e) => setCharacter({...character, proficiencies: e.target.value})}
                className="p-2 border rounded w-full h-32"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Backstory</label>
              <textarea
                value={character.backstory}
                onChange={(e) => setCharacter({...character, backstory: e.target.value})}
                className="p-2 border rounded w-full h-32"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CharacterSheet;