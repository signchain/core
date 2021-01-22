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
import wallet from 'wallet-besu'
import {Account} from "./components";
import {definitions} from "./ceramic/config.json"

import Share from "./components/Share";
import Dashboard from "./components/Dashboard";
import Documents from "./components/Documents";
import Profile from "./components/Profile";
import Layout from "./components/Layout";
import Steps from './components/Stepper/Steps'
import Verify from './components/Verify/Verify'
import Database from "./components/database/Database";
 import TopNav from './components/Navigation/TopNav'
 import SignUp from './components/auth/SignUp'
 import SignIn from './components/auth/SignIn'
 import SignDocs from './components/Verify/SignDocument'
 import UserProfiles from "./components/UserProfile";
import { INFURA_ID, ETHERSCAN_KEY } from "./constants";
import {generateSignature, getProvider} from "./lib/ceramicConnect"
import {getLoginUser, loginUserWithChallenge} from "./lib/threadDb"
import { BigNumber, providers, utils } from 'ethers'

import Ceramic from '@ceramicnetwork/http-client'
import { IDX } from '@ceramicstudio/idx'
import { Ed25519Provider } from 'key-did-provider-ed25519'
import {randomBytes} from 'crypto'
import {fromString} from 'uint8arrays/from-string'
import {PrivateKey} from "@textile/hub";

import WarningPopup from './components/warnings/WarningPopup'
import DocumentDetails from './components/Documents/DocumentDetails'

const blockExplorer = "https://etherscan.io/"
const CERAMIC_URL = 'https://ceramic-clay.3boxlabs.com'
const mainnetProvider = getDefaultProvider("mainnet", { infura: INFURA_ID, etherscan: ETHERSCAN_KEY, quorum: 1 })

function App() {

    const [injectedProvider, setInjectedProvider] = useState();
    const [ceramic, setCeramic] = useState(null);
    const [idx, setIdx] = useState(null);
    const [identity, setIdentity] = useState(null);
    const [userStatus, setUserStatus] = useState(0);
    const [seed, setSeed] = useState([])
    const [connectLoading, setConnectLoading] = useState(false)

    const authStatus = {
        "disconnected" : 0,
        "connected" : 1,
        "loggedIn" : 2

    }
    const price = useExchangePrice(mainnetProvider);
    const gasPrice = useGasPrice("fast");
    console.log(gasPrice)
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
      console.log("Welcomee!!!", pass)
      const user = JSON.parse(localStorage.getItem('USER'))
      if (user && user.address.toLowerCase() === address.toLowerCase()) {
        const accounts = await wallet.login(pass);
        console.log("Accounts", accounts)
        if (accounts) {
          const client = await loginUserWithChallenge(identity);
          console.log("USER Login!!")
          let userInfo
          if (client !== null) {
            userInfo = await getLoginUser(user.address, idx)
            if (userInfo !== null) {
              console.log("User Info:", userInfo)
              localStorage.setItem("USER", JSON.stringify(userInfo))
              localStorage.setItem("password", "12345");
              return userInfo
            }
            console.log("Some error!!!")
            return false
          }
        }
      }
      else if (user && user.address!==address){
        alert("Different account !!!")
        // handle redirection to signup page 
      }
      else{
        console.log("Cannot login account!!")
        setUserStatus(authStatus.connected)
      }
    }


    const connectUser = async () => {
        
        setConnectLoading(true)
        await loadWeb3Modal()
        const {seed, metamask} = await generateSignature();
        setSeed(seed)
        console.log("Seed:",seed, "metamsk:",metamask)
        const identity = PrivateKey.fromRawEd25519Seed(Uint8Array.from(seed))
        setIdentity(identity)
        const ceramic = new Ceramic(CERAMIC_URL)
        await ceramic.setDIDProvider(new Ed25519Provider(seed))
        setCeramic(ceramic)
      // Create the IDX instance with the definitions aliases from the config
        const idx = new IDX({ ceramic, aliases: definitions })
        console.log(idx);
        setIdx(idx)
        const res = await loginUser(seed, identity, idx, metamask.address);
        if(res !== undefined){
            setUserStatus(authStatus.loggedIn)
        }
        else {
            setUserStatus(authStatus.connected)
        }
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
        console.log("SETTING ROUTE",window.location.pathname)
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
                
                   {/* testing purpose- remove this while merging */}
                <Route exact path="/warning" render={(props)=><WarningPopup/>}/>
                <Route exact path="/documents/:doc/:sig" render={(props)=>
                  <DocumentDetails
                    {...props}
                    address={address}
                    tx={tx}
                    writeContracts={writeContracts}
                    userProvider={userProvider}
                    seed={seed}
                  />}/>
                <Route exact path='/signuptest' render={(props)=><SignUp/>}/>
                 <Route exact path='/signintest' render={(props)=><SignIn/>}/>
                 <Route exact path='/sharedocs' render={(props)=><SignDocs/>}/>

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
                <Route exact path="/" render={(props) => 
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
