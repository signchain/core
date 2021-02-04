/* eslint-disable */
import React, {useCallback, useEffect, useState} from "react";
import {HashRouter, Route, Switch} from "react-router-dom";
import "antd/dist/antd.css";
import 'semantic-ui-css/semantic.min.css'
import "./App.css";
import {getDefaultProvider, Web3Provider} from "@ethersproject/providers";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import {useUserAddress} from "eth-hooks";
import {useContractLoader, useExchangePrice, useGasPrice} from "./hooks";
import {Transactor} from "./helpers";
import wallet from 'wallet-besu'
import {definitions} from "./ceramic/config.json"

import Dashboard from "./components/Dashboard";
import Documents from "./components/Documents";
import Profile from "./components/Profile";
import Layout from "./components/Layout";
import Steps from './components/Stepper/Steps'
import Verify from './components/Verify/Verify'
import TopNav from './components/Navigation/TopNav'
import UserProfiles from "./components/UserProfile";
import {ETHERSCAN_KEY, INFURA_ID} from "./constants";
import {generateSignature} from "./lib/ceramicConnect"
import {getLoginUser, loginUserWithChallenge} from "./lib/threadDb"

import Ceramic from '@ceramicnetwork/http-client'
import {IDX} from '@ceramicstudio/idx'
import {Ed25519Provider} from 'key-did-provider-ed25519'
import {PrivateKey} from "@textile/hub";
import Onboarding from './components/Onboarding/Onboarding'
import WarningPopup from './components/warnings/WarningPopup'
import DocumentDetails from './components/Documents/DocumentDetails'

const blockExplorer = "https://etherscan.io/"
const CERAMIC_URL = 'https://ceramic.signchain.xyz'
const mainnetProvider = getDefaultProvider("mainnet", { infura: INFURA_ID, etherscan: ETHERSCAN_KEY, quorum: 1 })

function App() {

    const [injectedProvider, setInjectedProvider] = useState();
    const [ceramic, setCeramic] = useState(null);
    const [idx, setIdx] = useState(null);
    const [identity, setIdentity] = useState(null);
    const [userStatus, setUserStatus] = useState(0);
    const [seed, setSeed] = useState([])
    const [connectLoading, setConnectLoading] = useState(false)
    const [network, setNetwork] = useState(null);
    const authStatus = {
        "disconnected" : 0,
        "connected" : 1,
        "loggedIn" : 2,
        "warning": 3,
        "error": 4

    }
    const price = useExchangePrice(mainnetProvider);
    const gasPrice = useGasPrice("fast");
    const userProvider = injectedProvider;
    const address = useUserAddress(userProvider);
    const tx = Transactor(userProvider, gasPrice)
    const readContracts = useContractLoader(userProvider)
    const writeContracts = useContractLoader(userProvider)

    const loadWeb3Modal = useCallback(async () => {
        // Alternatively, this can also be used: await getProvider()).provider
        const provider = await web3Modal.connectTo("injected");
        setInjectedProvider(new Web3Provider(provider));
    }, [setInjectedProvider]);

    async function test (seed, identity, idx){

    }

    async function loginUser(seed, identity, idx, address) {
      const pass = Buffer.from(new Uint8Array(seed)).toString("hex")
      const user = JSON.parse(localStorage.getItem('USER'))
      if (user && user.address.toLowerCase() === address.toLowerCase()) {
        const accounts = await wallet.login(pass);
        if (accounts) {
          const client = await loginUserWithChallenge(identity);
          let userInfo
          if (client !== null) {
            userInfo = await getLoginUser(user.address, idx)
            if (userInfo !== null) {
              localStorage.setItem("USER", JSON.stringify(userInfo))
              localStorage.setItem("password", "12345");
              return authStatus.loggedIn
            }
            return authStatus.error
          }
        }
      }
      else if (user && user.address!==address){
        return authStatus.warning
        // handle redirection to signup page 
      }
      else{
        return authStatus.connected
      }
    }


    const connectUser = async () => {
        
        setConnectLoading(true)
        await loadWeb3Modal()
        const {seed, metamask} = await generateSignature();
        if(metamask){
          setNetwork(metamask.signer.provider._network.name)
        }
        setSeed(seed)
        const identity = PrivateKey.fromRawEd25519Seed(Uint8Array.from(seed))
        setIdentity(identity)
        const ceramic = new Ceramic(CERAMIC_URL)
        await ceramic.setDIDProvider(new Ed25519Provider(seed))
        setCeramic(ceramic)
      // Create the IDX instance with the definitions aliases from the config
        const idx = new IDX({ ceramic, aliases: definitions })
        setIdx(idx)
        setUserStatus(await loginUser(seed, identity, idx, metamask.address))
        setConnectLoading(true)

    }



    useEffect(() => {
        // Metamask should pop up only on connect request
        // if (web3Modal.cachedProvider) {
        //     loadWeb3Modal();
        // }
        if(!address){
            setUserStatus(authStatus.disconnected)
        }
    }, [loadWeb3Modal, address]);

    const [route, setRoute] = useState();

    useEffect(() => {
        setRoute(window.location.pathname)

    }, [ window.location.pathname ]);


  return (
      <div className="App">

        <HashRouter>
          <div className="App">
            
            <TopNav
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
            <Switch>
                {
                    userStatus !== authStatus.loggedIn  ? 
                    (<WarningPopup 
                        userStatus={userStatus} 
                        connectUser = {connectUser} 
                        authStatus={authStatus}
                        setInjectedProvider={setInjectedProvider}
                        setUserStatus={setUserStatus}
                        identity={identity}
                        address={address}
                        idx={idx}
                        seed = {seed}
                        connectLoading = {connectLoading}
                        />) : 
                    ( 
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
                  <Route exact path="/" render={(props)=><Onboarding/>}/>
                
                <Route exact path="/documents/:doc/:sig" render={(props)=>
                  <DocumentDetails
                    {...props}
                    address={address}
                    tx={tx}
                    writeContracts={writeContracts}
                    userProvider={userProvider}
                    seed={seed}
                  />}/>
                <Route exact path="/sign" render={(props) =>
                    <Steps
                        address={address}
                        tx={tx}
                        writeContracts={writeContracts}
                        readContracts={readContracts}
                        userProvider={userProvider}
                        {...props}
                    />}/>
               <Route exact path="/home" render={(props) => 
               <Dashboard
                    address={address}
                    tx={tx}
                    writeContracts={writeContracts}
                    userStatus={userStatus}
                    authStatus={authStatus}
                    idx={idx}
                    identity = {identity}
               />}/>
               
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
                 <Route exact path="/profile/:did" render={(props) =>
                   <UserProfiles
                      {...props}
                      idx={idx}
                   />}/>
              </Layout>
                    )}
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
