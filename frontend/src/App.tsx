import React, { FC, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import GameStorage from './routes/game-storage';
import Main from './routes/main';
import NftStorage from './routes/nft-storage';

const App: FC = () => {
  const [account, setAccount] = useState<string>("");

  return (
    <BrowserRouter>
      <Layout onConnected= {setAccount} account = {account}>
        <Routes>
          <Route path = "/" element = {<Main account = {account} />} />
          <Route path = "nft-storage" element = {<NftStorage account = {account} />}  />
          <Route path = "game-storage" element = {<GameStorage account = {account} />}  />
          </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App