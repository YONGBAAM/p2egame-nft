import React, { FC, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import NftStorage from './routes/nft-storage';

const App: FC = () => {
  const [account, setAccount] = useState<string>("");

  return (
    <BrowserRouter>
      <Layout onConnected= {setAccount} account = {account}>
        <Routes>
          <Route path = "/" element = {<div>main</div>} />
          <Route path = "nft-storage" element = {<NftStorage account = {account} />}  />
          </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App