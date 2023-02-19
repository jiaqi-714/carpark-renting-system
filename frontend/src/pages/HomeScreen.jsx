import React from 'react';

import SearchBar from '../components/Home/SearchBar'
import Recommendations from '../components/Home/Recommendations'

import PageContainer from '../components/PageContainer';

function HomeScreen () {
  return (
    <PageContainer items={
      <>
        <SearchBar />
        <Recommendations />
      </>
    } />
  )
}

export default HomeScreen;
