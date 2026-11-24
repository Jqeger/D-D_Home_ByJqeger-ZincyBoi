import React, { useState } from 'react';
import Header from './components/Header';

function DicePage() {
  const [diceType, setDiceType] = useState('20');
  const [diceCount, setDiceCount] = useState('1');
  const [results, setResults] = useState<number[]>([]);
  const [total, setTotal] = useState<number | null>(null);
  const [hasRolled, setHasRolled] = useState(false);

  const rollDice = () => {
    const rolls: number[] = [];
    const count = parseInt(diceCount);
    const sides = parseInt(diceType);

    for (let i = 0; i < count; i++) {
      const array = new Uint32Array(1);
      crypto.getRandomValues(array);
      const roll = (array[0] % sides) + 1;
      rolls.push(roll);
    }

    setResults(rolls);
    setTotal(rolls.reduce((sum, roll) => sum + roll, 0));
    setHasRolled(true);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header title="Dice Roller" showBack />
      <div className="max-w-2xl mx-auto p-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex gap-4 mb-8 justify-center">
            <select
              value={diceCount}
              onChange={(e) => {
                setDiceCount(e.target.value);
                setHasRolled(false);
              }}
              className="w-24 p-2 border rounded"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
            <span className="text-xl flex items-center">d</span>
            <select
              value={diceType}
              onChange={(e) => {
                setDiceType(e.target.value);
                setHasRolled(false);
              }}
              className="w-24 p-2 border rounded"
            >
              {[4, 6, 8, 10, 12, 20, 100].map((sides) => (
                <option key={sides} value={sides}>
                  {sides}
                </option>
              ))}
            </select>
          </div>

          <div className="text-center mb-8">
            {hasRolled && (
              <>
                {parseInt(diceCount) > 1 && (
                  <div className="text-2xl mb-4">
                    {results.join(' + ')} = {total}
                  </div>
                )}
                <div className="text-4xl font-bold">{total}</div>
              </>
            )}
          </div>

          <button
            onClick={rollDice}
            className="w-full bg-purple-600 text-white p-4 rounded-lg text-xl font-bold hover:bg-purple-700"
          >
            {hasRolled ? 'Roll Again' : 'Roll'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DicePage;
