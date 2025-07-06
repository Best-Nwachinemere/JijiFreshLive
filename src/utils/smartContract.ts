import { ethers } from 'ethers';

// Smart contract configuration for Lisk Testnet
const CONTRACT_ADDRESS = '0x1234567890123456789012345678901234567890'; // Replace with actual deployed address
const LISK_TESTNET_RPC = 'https://rpc.sepolia-api.lisk.com';

// ABI for the smart contract
const CONTRACT_ABI = [
  {
    "inputs": [
      {"internalType": "string", "name": "_name", "type": "string"},
      {"internalType": "string", "name": "_description", "type": "string"},
      {"internalType": "uint256", "name": "_price", "type": "uint256"},
      {"internalType": "bool", "name": "_isNegotiable", "type": "bool"},
      {"internalType": "uint256", "name": "_minAcceptablePrice", "type": "uint256"},
      {"internalType": "uint256", "name": "_targetPrice", "type": "uint256"},
      {"internalType": "string", "name": "_category", "type": "string"},
      {"internalType": "string[5]", "name": "_imageUrls", "type": "string[5]"}
    ],
    "name": "listItem",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getCurrentItemCounter",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_itemId", "type": "uint256"}],
    "name": "getItem",
    "outputs": [
      {
        "components": [
          {"internalType": "uint256", "name": "id", "type": "uint256"},
          {"internalType": "address", "name": "seller", "type": "address"},
          {"internalType": "string", "name": "name", "type": "string"},
          {"internalType": "string", "name": "description", "type": "string"},
          {"internalType": "uint256", "name": "price", "type": "uint256"},
          {"internalType": "bool", "name": "isNegotiable", "type": "bool"},
          {"internalType": "uint256", "name": "minAcceptablePrice", "type": "uint256"},
          {"internalType": "uint256", "name": "targetPrice", "type": "uint256"},
          {"internalType": "string", "name": "category", "type": "string"},
          {"internalType": "string[5]", "name": "imageUrls", "type": "string[5]"},
          {"internalType": "uint256", "name": "timestamp", "type": "uint256"},
          {"internalType": "enum JijiFresh.ItemStatus", "name": "status", "type": "uint8"},
          {"internalType": "address", "name": "currentBuyer", "type": "address"},
          {"internalType": "uint256", "name": "holdStartTime", "type": "uint256"},
          {"internalType": "uint256", "name": "agreedPrice", "type": "uint256"}
        ],
        "internalType": "struct JijiFresh.Item",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// Admin wallet private key (should be in environment variables in production)
const ADMIN_PRIVATE_KEY = process.env.REACT_APP_ADMIN_PRIVATE_KEY || '0x0000000000000000000000000000000000000000000000000000000000000001';

class SmartContractService {
  private provider: ethers.JsonRpcProvider;
  private adminWallet: ethers.Wallet;
  private contract: ethers.Contract;

  constructor() {
    this.provider = new ethers.JsonRpcProvider(LISK_TESTNET_RPC);
    this.adminWallet = new ethers.Wallet(ADMIN_PRIVATE_KEY, this.provider);
    this.contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, this.adminWallet);
  }

  // List item on blockchain (admin-only, no user wallet required)
  async listItem(itemData: {
    name: string;
    description: string;
    price: number;
    isNegotiable: boolean;
    minAcceptablePrice: number;
    targetPrice: number;
    category: string;
    imageUrls: string[];
  }) {
    try {
      // Convert price to wei (assuming price is in ETH equivalent)
      const priceInWei = ethers.parseEther(itemData.price.toString());
      const minPriceInWei = ethers.parseEther(itemData.minAcceptablePrice.toString());
      const targetPriceInWei = ethers.parseEther(itemData.targetPrice.toString());

      // Ensure we have exactly 5 image URLs (pad with empty strings if needed)
      const imageUrls = [...itemData.imageUrls];
      while (imageUrls.length < 5) {
        imageUrls.push('');
      }
      imageUrls.splice(5); // Ensure max 5 URLs

      const tx = await this.contract.listItem(
        itemData.name,
        itemData.description,
        priceInWei,
        itemData.isNegotiable,
        minPriceInWei,
        targetPriceInWei,
        itemData.category,
        imageUrls
      );

      const receipt = await tx.wait();
      
      return {
        success: true,
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString()
      };
    } catch (error) {
      console.error('Smart contract error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Get item from blockchain
  async getItem(itemId: number) {
    try {
      const item = await this.contract.getItem(itemId);
      return {
        success: true,
        item: {
          id: item.id.toString(),
          seller: item.seller,
          name: item.name,
          description: item.description,
          price: ethers.formatEther(item.price),
          isNegotiable: item.isNegotiable,
          minAcceptablePrice: ethers.formatEther(item.minAcceptablePrice),
          targetPrice: ethers.formatEther(item.targetPrice),
          category: item.category,
          imageUrls: item.imageUrls.filter((url: string) => url !== ''),
          timestamp: item.timestamp.toString(),
          status: item.status,
          currentBuyer: item.currentBuyer,
          holdStartTime: item.holdStartTime.toString(),
          agreedPrice: ethers.formatEther(item.agreedPrice)
        }
      };
    } catch (error) {
      console.error('Error fetching item:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Get current item counter
  async getCurrentItemCounter() {
    try {
      const counter = await this.contract.getCurrentItemCounter();
      return {
        success: true,
        counter: counter.toString()
      };
    } catch (error) {
      console.error('Error fetching counter:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Check connection status
  async checkConnection() {
    try {
      const network = await this.provider.getNetwork();
      const balance = await this.provider.getBalance(this.adminWallet.address);
      
      return {
        success: true,
        network: network.name,
        chainId: network.chainId.toString(),
        adminAddress: this.adminWallet.address,
        balance: ethers.formatEther(balance)
      };
    } catch (error) {
      console.error('Connection error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Connection failed'
      };
    }
  }
}

// Export singleton instance
export const smartContractService = new SmartContractService();

// Helper function to format transaction data for display
export const formatTransactionData = (txData: any) => {
  return {
    hash: txData.transactionHash,
    block: txData.blockNumber,
    gas: txData.gasUsed,
    timestamp: new Date().toISOString()
  };
};