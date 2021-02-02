# Signchain :memo: :key:


![logo](./logo.png)
> Digital signing platform for legal documents


We have been working on an Arbitration platform for some time. While dealing with a large amount of agreement documents, we felt that there is an absolute need for digitizing the signing process of such documents. That's when we started ideating around the digital signing platform (Signchain). Read more on the inception of Signchain [here](http://blog.consensolabs.com/signchain).

We know that there have been plenty of efforts in the area of electronic signing. But the existing solutions don't seem to operate on standards that are openly verifiable and interoperable. In Signchain, we want to address the age-old issues of document signing such as tampering, delayed process, verification troubles, with the help of decentralized storage and open verification. We also want to address the interoperability concerns by using standardized identity, storage, and signing protocols.

We created a basic platform where users can share the document privately with other counterparties that need access and sign the document. Whenever any party signs on the document, the proofs (standard digitally signed data) are recorded. The proofs of the signatures can be verified by anyone on the platform while only certain parties will have access to the document. The identity of all the parties can also be verified as the credentials are maintained using decentralized identity standards

Technologies/ protocols used:

* Fleek APIs to store the encrypted documents on IPFS
* Textile ThreadDb to store signatures proofs of documents
* Ceramic IDX for decentralized identities

[Check out the demo video:](https://youtu.be/XZy307J-0dI)


## quickstart

```bash 
git clone https://github.com/signchain/core

cd core
```

```bash

yarn install

```

> you might get node-gyp errors, ignore them and run:

```bash

yarn run start

```

> in a second terminal window:

```bash

yarn run chain

```

> in a third terminal window:

```bash

yarn run deploy

```

🔏 Smart contract is located at `packages/hardhat/contracts`

📝 React frontend is at `packages/react-app`

📱 Open http://localhost:3000 to see the app

## Contributing

You are welcome to submit issues and enhancement requests and work on any of the existing issues. Follow this simple guide to contribute to the repository.

 1. **Create** or pick an existing issue to work on
 2. **Fork** the repo on GitHub
 3. **Clone** the forked project to your own machine
 4. **Commit** changes to your own branch
 5. **Push** your work back up to your forked repo
 6. Submit a **Pull request** from the forked repo to our repo so that we can review your changes

## Grants and awards:
> #### Signchain has bagged 2 sponsor prizes during the [EthOnline hackathon](https://hack.ethglobal.co/showcase/signchain-recY6409wwWnJyxJ9) :tada: :confetti_ball:.
> * :large_orange_diamond: [Ceramic](https://www.ceramic.network): Best overall use of [Identity Index (IDX)](http://idx.xyz) Library
> * :file_folder: [Protocol Labs](https://protocol.ai), 3rd place

## Other resources:
* [Website](https://signchain.xyz)
* [Blog posts](https://blog.consensolabs.com/tag/signchain)
* [Roadmap](https://hackmd.io/8oj1tY8fRmih7jhtdBmKCg?view)
