// ProtectedComponent.js
import React from 'react';

const ProtectedComponent = () => {
  return (
    <div>
      <h1>This page is for logged in users!</h1>
      <p>This page is only accessible to logged in users.</p>
    </div>
  );
};

export default ProtectedComponent;
