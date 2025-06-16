// src/pages/ProfilePage.js
import React from 'react';
import { useAuth } from '../context/AuthContext';
import ProductList from '../components/ProductList'; // We'll reuse this to show recommendations

function ProfilePage() {
  const { currentUser } = useAuth();

  // If for some reason we land here without a user, show a message.
  // (Our ProtectedRoute should prevent this, but it's good practice).
  if (!currentUser) {
    return <p>Please log in to see your profile.</p>;
  }

  return (
    <div className="container">
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h2>Your Profile</h2>
        <p style={{ fontSize: '1.2rem' }}>
          <strong>Username:</strong> {currentUser.username}
        </p>
        <p style={{ fontSize: '1.2rem' }}>
          <strong>Display Name:</strong> {currentUser.name}
        </p>
      </div>

      <hr style={{ margin: '40px 0' }} />

      {/* BONUS: Recommended Products Section */}
      <div>
        <h3 style={{ textAlign: 'center', marginBottom: '30px' }}>✨ Recommended For You ✨</h3>
        {/* For now, we'll just show the same product list.
            In a real app, this could be a different, curated list. */}
        <ProductList />
      </div>
    </div>
  );
}

export default ProfilePage;