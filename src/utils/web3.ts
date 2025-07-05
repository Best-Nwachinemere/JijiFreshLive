import { ethers } from 'ethers';

// Lisk Testnet Configuration
export const LISK_TESTNET_CONFIG = {
  chainId: '0x106A', // 4202 in hex
  chainName: 'Lisk Sepolia Testnet',
  nativeCurrency: {
    name: 'Sepolia Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: ['https://rpc.sepolia-api.lisk.com'],
  blockExplorerUrls: ['https://sepolia-blockscout.lisk.com'],
};

// Contract Configuration
export const CONTRACT_CONFIG = {
  address: '0x9B6b54B9A1456C638f80C358Be78C9E570a133B0',
  abi: [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "itemId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "seller",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "price",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "isNegotiable",
          "type": "bool"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "category",
          "type": "string"
        }
      ],
      "name": "ItemListed",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "itemId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "buyer",
          "type": "address"
        }
      ],
      "name": "ItemReleased",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "itemId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "enum JijiFresh.ItemStatus",
          "name": "oldStatus",
          "type": "uint8"
        },
        {
          "indexed": false,
          "internalType": "enum JijiFresh.ItemStatus",
          "name": "newStatus",
          "type": "uint8"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "buyer",
          "type": "address"
        }
      ],
      "name": "ItemStatusChanged",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "itemId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "buyer",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "agreedPrice",
          "type": "uint256"
        }
      ],
      "name": "NegotiationAccepted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "itemId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "buyer",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "seller",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "finalPrice",
          "type": "uint256"
        }
      ],
      "name": "PaymentConfirmed",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "HOLD_DURATION",
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
      "inputs": [],
      "name": "admin",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_itemId",
          "type": "uint256"
        }
      ],
      "name": "cancelListing",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_newAdmin",
          "type": "address"
        }
      ],
      "name": "changeAdmin",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_itemId",
          "type": "uint256"
        }
      ],
      "name": "confirmPayment",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_itemId",
          "type": "uint256"
        }
      ],
      "name": "forceMarkAsSold",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getCurrentItemCounter",
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
          "internalType": "uint256",
          "name": "_itemId",
          "type": "uint256"
        }
      ],
      "name": "getItem",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "seller",
              "type": "address"
            },
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "description",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "price",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "isNegotiable",
              "type": "bool"
            },
            {
              "internalType": "uint256",
              "name": "minAcceptablePrice",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "targetPrice",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "category",
              "type": "string"
            },
            {
              "internalType": "string[5]",
              "name": "imageUrls",
              "type": "string[5]"
            },
            {
              "internalType": "uint256",
              "name": "timestamp",
              "type": "uint256"
            },
            {
              "internalType": "enum JijiFresh.ItemStatus",
              "name": "status",
              "type": "uint8"
            },
            {
              "internalType": "address",
              "name": "currentBuyer",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "holdStartTime",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "agreedPrice",
              "type": "uint256"
            }
          ],
          "internalType": "struct JijiFresh.Item",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_itemId",
          "type": "uint256"
        }
      ],
      "name": "getItemBasic",
      "outputs": [
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "price",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "isNegotiable",
          "type": "bool"
        },
        {
          "internalType": "string",
          "name": "category",
          "type": "string"
        },
        {
          "internalType": "enum JijiFresh.ItemStatus",
          "name": "status",
          "type": "uint8"
        },
        {
          "internalType": "address",
          "name": "seller",
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
          "name": "_seller",
          "type": "address"
        }
      ],
      "name": "getItemsBySeller",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256[]",
          "name": "_itemIds",
          "type": "uint256[]"
        }
      ],
      "name": "getMultipleItems",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "seller",
              "type": "address"
            },
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "description",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "price",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "isNegotiable",
              "type": "bool"
            },
            {
              "internalType": "uint256",
              "name": "minAcceptablePrice",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "targetPrice",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "category",
              "type": "string"
            },
            {
              "internalType": "string[5]",
              "name": "imageUrls",
              "type": "string[5]"
            },
            {
              "internalType": "uint256",
              "name": "timestamp",
              "type": "uint256"
            },
            {
              "internalType": "enum JijiFresh.ItemStatus",
              "name": "status",
              "type": "uint8"
            },
            {
              "internalType": "address",
              "name": "currentBuyer",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "holdStartTime",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "agreedPrice",
              "type": "uint256"
            }
          ],
          "internalType": "struct JijiFresh.Item[]",
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
          "internalType": "uint256",
          "name": "_itemId",
          "type": "uint256"
        }
      ],
      "name": "getRemainingHoldTime",
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
          "internalType": "uint256",
          "name": "_itemId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_agreedPrice",
          "type": "uint256"
        }
      ],
      "name": "initiatePurchase",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_itemId",
          "type": "uint256"
        }
      ],
      "name": "isHoldExpired",
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
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "itemExists",
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
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "items",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "seller",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "description",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "price",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "isNegotiable",
          "type": "bool"
        },
        {
          "internalType": "uint256",
          "name": "minAcceptablePrice",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "targetPrice",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "category",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        },
        {
          "internalType": "enum JijiFresh.ItemStatus",
          "name": "status",
          "type": "uint8"
        },
        {
          "internalType": "address",
          "name": "currentBuyer",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "holdStartTime",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "agreedPrice",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_description",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "_price",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "_isNegotiable",
          "type": "bool"
        },
        {
          "internalType": "uint256",
          "name": "_minAcceptablePrice",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_targetPrice",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "_category",
          "type": "string"
        },
        {
          "internalType": "string[5]",
          "name": "_imageUrls",
          "type": "string[5]"
        }
      ],
      "name": "listItem",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_itemId",
          "type": "uint256"
        }
      ],
      "name": "releaseExpiredHold",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_itemId",
          "type": "uint256"
        }
      ],
      "name": "resetItemStatus",
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
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "sellerItems",
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
          "internalType": "uint256",
          "name": "_itemId",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "_name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_description",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "_price",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "_category",
          "type": "string"
        }
      ],
      "name": "updateItem",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]
};

// Web3 Service Class
export class Web3Service {
  private provider: ethers.providers.Web3Provider | null = null;
  private signer: ethers.Signer | null = null;
  private contract: ethers.Contract | null = null;

  async connectWallet(): Promise<string | null> {
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed');
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      // Initialize provider and signer
      this.provider = new ethers.providers.Web3Provider(window.ethereum);
      this.signer = this.provider.getSigner();

      // Check if we're on the correct network
      const network = await this.provider.getNetwork();
      if (network.chainId !== 4202) {
        await this.switchToLiskTestnet();
      }

      // Initialize contract
      this.contract = new ethers.Contract(
        CONTRACT_CONFIG.address,
        CONTRACT_CONFIG.abi,
        this.signer
      );

      return accounts[0];
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    }
  }

  async switchToLiskTestnet(): Promise<void> {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: LISK_TESTNET_CONFIG.chainId }],
      });
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [LISK_TESTNET_CONFIG],
        });
      } else {
        throw switchError;
      }
    }
  }

  async listItem(
    name: string,
    description: string,
    price: string,
    isNegotiable: boolean,
    minAcceptablePrice: string,
    targetPrice: string,
    category: string,
    imageUrls: string[]
  ): Promise<ethers.ContractTransaction> {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    // Convert price to wei (assuming price is in ETH)
    const priceWei = ethers.utils.parseEther(price);
    const minPriceWei = ethers.utils.parseEther(minAcceptablePrice);
    const targetPriceWei = ethers.utils.parseEther(targetPrice);

    // Pad imageUrls array to exactly 5 elements
    const paddedImageUrls = [...imageUrls];
    while (paddedImageUrls.length < 5) {
      paddedImageUrls.push('');
    }

    return await this.contract.listItem(
      name,
      description,
      priceWei,
      isNegotiable,
      minPriceWei,
      targetPriceWei,
      category,
      paddedImageUrls.slice(0, 5)
    );
  }

  async getItem(itemId: number): Promise<any> {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    return await this.contract.getItem(itemId);
  }

  async getItemsBySeller(sellerAddress: string): Promise<number[]> {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    return await this.contract.getItemsBySeller(sellerAddress);
  }

  async initiatePurchase(itemId: number, agreedPrice: string): Promise<ethers.ContractTransaction> {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    const priceWei = ethers.utils.parseEther(agreedPrice);
    return await this.contract.initiatePurchase(itemId, priceWei);
  }

  async confirmPayment(itemId: number): Promise<ethers.ContractTransaction> {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    return await this.contract.confirmPayment(itemId);
  }

  async getCurrentItemCounter(): Promise<number> {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    const counter = await this.contract.getCurrentItemCounter();
    return counter.toNumber();
  }

  getConnectedAddress(): string | null {
    return this.signer ? this.signer.getAddress() : null;
  }

  isConnected(): boolean {
    return this.provider !== null && this.signer !== null && this.contract !== null;
  }
}

// Singleton instance
export const web3Service = new Web3Service();

// Helper function to format Wei to Ether
export const formatEther = (wei: ethers.BigNumber): string => {
  return ethers.utils.formatEther(wei);
};

// Helper function to parse Ether to Wei
export const parseEther = (ether: string): ethers.BigNumber => {
  return ethers.utils.parseEther(ether);
};