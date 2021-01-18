module.exports = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "docHash",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "notary",
        "type": "address"
      }
    ],
    "name": "DocumentNatarized",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "docHash",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "signer",
        "type": "address"
      }
    ],
    "name": "DocumentSigned",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "docHash",
        "type": "bytes32"
      },
      {
        "internalType": "string",
        "name": "title",
        "type": "string"
      },
      {
        "internalType": "address[]",
        "name": "signers",
        "type": "address[]"
      }
    ],
    "name": "addDocument",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "docHash",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "signer",
        "type": "address"
      }
    ],
    "name": "addSigner",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllDocument",
    "outputs": [
      {
        "internalType": "bytes32[]",
        "name": "docHash",
        "type": "bytes32[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllUsers",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "users",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "docHash",
        "type": "bytes32"
      }
    ],
    "name": "getCipherKey",
    "outputs": [
      {
        "internalType": "string",
        "name": "cipherKey",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "documentHash",
        "type": "bytes32"
      }
    ],
    "name": "getDocument",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "documentLocation",
            "type": "string"
          },
          {
            "internalType": "bytes32",
            "name": "documentHash",
            "type": "bytes32"
          },
          {
            "internalType": "string[]",
            "name": "key",
            "type": "string[]"
          },
          {
            "internalType": "address[]",
            "name": "users",
            "type": "address[]"
          }
        ],
        "internalType": "struct DocumentRegistry.Document",
        "name": "document",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "documentHash",
        "type": "bytes32"
      }
    ],
    "name": "getNotarizeDocument",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "notaryAddress",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "notaryFee",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "notarized",
            "type": "bool"
          }
        ],
        "internalType": "struct Signchain.Notarize",
        "name": "document",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "userAddress",
        "type": "address"
      }
    ],
    "name": "getPublicKey",
    "outputs": [
      {
        "internalType": "string",
        "name": "publicKey",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "docHash",
        "type": "bytes32"
      }
    ],
    "name": "getSignatures",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "signer",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "nonce",
            "type": "uint256"
          },
          {
            "internalType": "bytes",
            "name": "signatureDigest",
            "type": "bytes"
          },
          {
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
          }
        ],
        "internalType": "struct SigningModule.Signature[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "docHash",
        "type": "bytes32"
      }
    ],
    "name": "getSignedDocuments",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "title",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "owner",
            "type": "address"
          },
          {
            "internalType": "address[]",
            "name": "signers",
            "type": "address[]"
          },
          {
            "components": [
              {
                "internalType": "address",
                "name": "signer",
                "type": "address"
              },
              {
                "internalType": "uint256",
                "name": "nonce",
                "type": "uint256"
              },
              {
                "internalType": "bytes",
                "name": "signatureDigest",
                "type": "bytes"
              },
              {
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
              }
            ],
            "internalType": "struct SigningModule.Signature[]",
            "name": "signatures",
            "type": "tuple[]"
          }
        ],
        "internalType": "struct SigningModule.SignedDocument",
        "name": "doc",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "documentHash",
        "type": "bytes32"
      }
    ],
    "name": "isDocumentSigned",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "documentHash",
        "type": "bytes32"
      }
    ],
    "name": "notarizeDoc",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "documentHash",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "nonce",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "signature",
        "type": "bytes"
      }
    ],
    "name": "notarizeDocument",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "name": "notarizedDocs",
    "outputs": [
      {
        "internalType": "address",
        "name": "notaryAddress",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "notaryFee",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "notarized",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "userName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "userEmail",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "publicKey",
        "type": "string"
      },
      {
        "internalType": "enum DocumentRegistry.UserType",
        "name": "userType",
        "type": "uint8"
      }
    ],
    "name": "registerUser",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "replayNonce",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "documentHash",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "notary",
        "type": "address"
      }
    ],
    "name": "saveNotarizeDoc",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "documentHash",
        "type": "bytes32"
      },
      {
        "internalType": "string",
        "name": "title",
        "type": "string"
      },
      {
        "internalType": "address[]",
        "name": "signers",
        "type": "address[]"
      },
      {
        "internalType": "uint256",
        "name": "nonce",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "signature",
        "type": "bytes"
      },
      {
        "internalType": "address",
        "name": "notary",
        "type": "address"
      }
    ],
    "name": "signAndShareDocument",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "docHash",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "nonce",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "_signature",
        "type": "bytes"
      }
    ],
    "name": "signDocument",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "name": "signedDocuments",
    "outputs": [
      {
        "internalType": "string",
        "name": "title",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "storeUser",
    "outputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "email",
        "type": "string"
      },
      {
        "internalType": "bool",
        "name": "status",
        "type": "bool"
      },
      {
        "internalType": "string",
        "name": "publicKey",
        "type": "string"
      },
      {
        "internalType": "enum DocumentRegistry.UserType",
        "name": "userType",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "key",
        "type": "string"
      }
    ],
    "name": "updatePublicKey",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "documentHash",
        "type": "bytes32"
      },
      {
        "internalType": "string",
        "name": "documentLocation",
        "type": "string"
      },
      {
        "internalType": "string[]",
        "name": "key",
        "type": "string[]"
      },
      {
        "internalType": "address[]",
        "name": "users",
        "type": "address[]"
      }
    ],
    "name": "uploadDocument",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];