import React from 'react';
import DevPanel from '../components/DevPanel';
import Layout from '../components/Layout'; // πρόσθεσε αυτό

const App = () => {
  return (
    <Layout>
      <h1>Welcome to Pinescripers</h1>
      <DevPanel />
    </Layout>
  );
};

export default App;
