/* eslint-disable */
import React, {useCallback, useEffect, useState} from "react";
import {HashRouter, Route, Switch} from "react-router-dom";
import "antd/dist/antd.css";
import 'semantic-ui-css/semantic.min.css'
import "./App.css";
import { getDefaultProvider, Web3Provider } from "@ethersproject/providers";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useUserAddress } from "eth-hooks";
import { useExchangePrice, useGasPrice, useContractLoader } from "./hooks";
import { Transactor } from "./helpers";
import {Account} from "./components";
import {definitions} from "./ceramic/config.json"
import SignUpForm from "./components/auth/SignUpForm";
import LoginForm from "./components/auth/LoginForm";
import Share from "./components/Share";
import Dashboard from "./components/Dashboard";
import Documents from "./components/Documents";
import Profile from "./components/Profile";
import Layout from "./components/Layout";
import Steps from './components/Stepper/Steps'
import Verify from './components/Verify/Verify'
import Database from "./components/database/Database";
 import TopNav from './components/Navigation/TopNav'
import { INFURA_ID, ETHERSCAN_KEY } from "./constants";
import {generateSignature} from "./lib/ceramicConnect"

import Ceramic from '@ceramicnetwork/http-client'
import { IDX } from '@ceramicstudio/idx'
import { Ed25519Provider } from 'key-did-provider-ed25519'
import {randomBytes} from 'crypto'
import {fromString} from 'uint8arrays/from-string'
import {PrivateKey} from "@textile/hub";

import SignInWarning from './components/warnings/SignInWarning'
import DocumentDetails from './components/Documents/DocumentDetails'

const blockExplorer = "https://etherscan.io/"
const CERAMIC_URL = 'https://ceramic-clay.3boxlabs.com'
const mainnetProvider = getDefaultProvider("mainnet", { infura: INFURA_ID, etherscan: ETHERSCAN_KEY, quorum: 1 })

function App() {

    const [injectedProvider, setInjectedProvider] = useState();
    const [ceramic, setCeramic] = useState(null);
    const [idx, setIdx] = useState(null);
    const [identity, setIdentity] = useState(null);

    const price = useExchangePrice(mainnetProvider);
    const gasPrice = useGasPrice("fast");
    console.log(gasPrice)
    const userProvider = injectedProvider;
    const address = useUserAddress(userProvider);
    const tx = Transactor(userProvider, gasPrice)
    const readContracts = useContractLoader(userProvider)
    const writeContracts = useContractLoader(userProvider)
    const loadWeb3Modal = useCallback(async () => {
        const provider = await web3Modal.connect();
        setInjectedProvider(new Web3Provider(provider));
    }, [setInjectedProvider]);

    const setup = async () => {
        const seed = await generateSignature();
        const identity = PrivateKey.fromRawEd25519Seed(Uint8Array.from(seed))
        setIdentity(identity)
      //   const ceramic = new Ceramic(CERAMIC_URL)
      //   await ceramic.setDIDProvider(new Ed25519Provider(seed))
      //   setCeramic(ceramic)
      // // Create the IDX instance with the definitions aliases from the config
      //   const idx = new IDX({ ceramic, aliases: definitions })
      //   console.log(idx);
      //   setIdx(idx)
    }

    useEffect(() => {
        if (web3Modal.cachedProvider) {
            loadWeb3Modal();
        }
        if(address){
            setup().then(data => console.log(idx))
        }
    }, [loadWeb3Modal, address]);

    const [route, setRoute] = useState();

    useEffect(() => {
        console.log("SETTING ROUTE",window.location.pathname)
        setRoute(window.location.pathname)

    }, [ window.location.pathname ]);

  return (
      <div className="App">
        {/* <div style={{position: "fixed", textAlign: "right", right: 0, top: 0, padding: 10,}}>
          <Account
              address={address}
              localProvider={userProvider}
              userProvider={userProvider}
              mainnetProvider={mainnetProvider}
              price={price}
              web3Modal={web3Modal}
              loadWeb3Modal={loadWeb3Modal}
              logoutOfWeb3Modal={logoutOfWeb3Modal}
              blockExplorer={blockExplorer}
          />
        </div> */}

        <HashRouter>
          <div className="App">
<TopNav/>
            <Switch>
                <Route exact path="/db" component={Database} />
              <Route exact path="/" render={(props) =>
                  <SignUpForm
                      address={address}
                      tx={tx}
                      writeContracts={writeContracts}
                      ceramic={ceramic}
                      idx={idx}
                      identity = {identity}
                  />}/>

              <Route exact path="/login" render={(props) =>
                  <LoginForm
                      address={address}
                      tx={tx}
                      writeContracts={writeContracts}
                      identity = {identity}
                      {...props}
                  />}/>
              <Route exact path="/signup" render={(props) =>
                  <SignUpForm
                      address={address}
                      tx={tx}
                      writeContracts={writeContracts}
                      ceramic={ceramic}
                      idx={idx}
                      identity = {identity}
                  />}/>

              <Layout
                  address={address}
                  localProvider={userProvider}
                  userProvider={userProvider}
                  mainnetProvider={mainnetProvider}
                  price={price}
                  web3Modal={web3Modal}
                  loadWeb3Modal={loadWeb3Modal}
                  logoutOfWeb3Modal={logoutOfWeb3Modal}
                  blockExplorer={blockExplorer}
              >
                
                   {/* testing purpose- remove this while merging */}
                <Route exact path="/warning" render={(props)=><SignInWarning/>}/>
                <Route exact path="/documentdetails" render={(props)=><DocumentDetails {...props}/>}/>

                {/* *************************** */}
                <Route exact path="/sign" render={(props) =>
                    <Steps
                        address={address}
                        tx={tx}
                        writeContracts={writeContracts}
                        readContracts={readContracts}
                        userProvider={userProvider}
                        {...props}
                    />}/>
               <Route exact path="/dashboard" render={(props) => <Dashboard/>}/>
               <Route exact path="/verify" render={(props) =>
                   <Verify
                       address={address}
                       tx={tx}
                       writeContracts={writeContracts}
                       readContracts={readContracts}
                       userProvider={userProvider}
                       {...props}
                   />}/>
               <Route exact path="/documents" render={(props) =>
                   <Documents
                       address={address}
                       tx={tx}
                       writeContracts={writeContracts}
                       userProvider={userProvider}
                       {...props}
                   />}/>
               <Route exact path="/profile" render={(props) =>
                   <Profile
                       address={address}
                       tx={tx}
                       writeContracts={writeContracts}
                       {...props}
                       ceramic={ceramic}
                      idx={idx}
                   />}/>
              </Layout>
            </Switch>
          </div>
        </HashRouter>
      </div>
  );
}

/*
  Web3 modal helps us "connect" external wallets:
*/
const web3Modal = new Web3Modal({
    // network: "mainnet", // optional
    cacheProvider: true, // optional
    providerOptions: {
        walletconnect: {
            package: WalletConnectProvider, // required
            options: {
                infuraId: INFURA_ID,
            },
        },
    },
});

const logoutOfWeb3Modal = async () => {
    await web3Modal.clearCachedProvider();
    setTimeout(() => {
        window.location.reload();
    }, 1);
};

export default App;
