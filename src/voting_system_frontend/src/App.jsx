import React, { useState, useEffect } from 'react';
import { voting_system_backend } from '../../../declarations/voting_system_backend';

function App() {
  const [voterId, setVoterId] = useState('');
  const [candidateName, setCandidateName] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const registerVoter = async () => {
    try {
      const success = await voting_system_backend.registerVoter(voterId);
      if (success) {
        alert('Voter registered successfully!');
        setVoterId('');
      } else {
        alert('Voter registration failed!');
      }
    } catch (error) {
      console.error('Error registering voter:', error);
      alert('An error occurred while registering the voter.');
    }
  };

  const vote = async () => {
    try {
      const success = await voting_system_backend.vote(voterId, candidateName);
      if (success) {
        alert('Vote cast successfully!');
        setVoterId('');
        setCandidateName('');
        fetchResults(); // Refresh results after voting
      } else {
        alert('Voting failed!');
      }
    } catch (error) {
      console.error('Error casting vote:', error);
      alert('An error occurred while casting the vote.');
    }
  };

  const fetchResults = async () => {
    setLoading(true);
    try {
      const res = await voting_system_backend.getResults();
      setResults(res);
    } catch (error) {
      console.error('Error fetching results:', error);
      alert('An error occurred while fetching the results.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  return (
    <main>
      <h1>Decentralized Voting System</h1>
      <div>
        <input
          type="text"
          placeholder="Enter Voter ID"
          value={voterId}
          onChange={(e) => setVoterId(e.target.value)}
        />
        <button onClick={registerVoter}>Register Voter</button>
      </div>
      <div>
        <input
          type="text"
          placeholder="Enter Candidate Name"
          value={candidateName}
          onChange={(e) => setCandidateName(e.target.value)}
        />
        <button onClick={vote}>Vote</button>
      </div>
      <div>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <ul>
            {results.map((candidate, index) => (
              <li key={index}>
                {candidate.name}: {candidate.votes} votes
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}

export default App;