// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title JijiFreshMarketplace
 * @dev Smart contract for JijiFresh marketplace with escrow and onboarding rewards
 */
contract JijiFreshMarketplace is ReentrancyGuard, Ownable {
    
    // Structs
    struct Listing {
        uint256 id;
        address seller;
        string whatsappNumber;
        string title;
        string description;
        uint256 price;
        uint256 minPrice;
        string location;
        string category;
        string imageHash; // IPFS hash
        bool isActive;
        bool isNegotiable;
        uint256 createdAt;
    }
    
    struct Purchase {
        uint256 id;
        uint256 listingId;
        address buyer;
        address seller;
        uint256 finalPrice;
        string buyerWhatsapp;
        PurchaseStatus status;
        uint256 createdAt;
        uint256 completedAt;
    }
    
    struct Onboarder {
        address wallet;
        string whatsappNumber;
        uint256 totalPoints;
        uint256 sellersOnboarded;
        uint256 totalEarnings;
        bool isActive;
        uint256 joinedAt;
    }
    
    struct Seller {
        address wallet;
        string whatsappNumber;
        string name;
        string location;
        address onboardedBy;
        uint256 totalSales;
        uint256 rating;
        bool isVerified;
        uint256 joinedAt;
    }
    
    // Enums
    enum PurchaseStatus { Pending, Paid, Delivered, Completed, Cancelled, Disputed }
    
    // State variables
    mapping(uint256 => Listing) public listings;
    mapping(uint256 => Purchase) public purchases;
    mapping(address => Onboarder) public onboarders;
    mapping(address => Seller) public sellers;
    mapping(string => address) public whatsappToAddress;
    mapping(address => uint256[]) public sellerListings;
    mapping(address => uint256[]) public buyerPurchases;
    
    uint256 public nextListingId = 1;
    uint256 public nextPurchaseId = 1;
    uint256 public platformFeePercent = 250; // 2.5%
    uint256 public constant POINTS_DECIMALS = 18;
    
    // JijiPoints rewards
    uint256 public constant SELLER_SIGNUP_POINTS = 10 * 10**POINTS_DECIMALS;
    uint256 public constant FIRST_LISTING_POINTS = 15 * 10**POINTS_DECIMALS;
    uint256 public constant FIRST_SALE_POINTS = 25 * 10**POINTS_DECIMALS;
    uint256 public constant ACTIVE_30_DAYS_POINTS = 50 * 10**POINTS_DECIMALS;
    
    // Payment token (USDT)
    IERC20 public paymentToken;
    
    // Events
    event ListingCreated(uint256 indexed listingId, address indexed seller, string whatsappNumber);
    event PurchaseCreated(uint256 indexed purchaseId, uint256 indexed listingId, address indexed buyer);
    event PurchaseCompleted(uint256 indexed purchaseId, address indexed buyer, address indexed seller);
    event OnboarderRegistered(address indexed onboarder, string whatsappNumber);
    event SellerOnboarded(address indexed seller, address indexed onboarder, string whatsappNumber);
    event PointsAwarded(address indexed onboarder, uint256 points, string reason);
    event PayoutProcessed(address indexed onboarder, uint256 amount);
    
    constructor(address _paymentToken) {
        paymentToken = IERC20(_paymentToken);
    }
    
    // Modifiers
    modifier onlyRegisteredSeller() {
        require(sellers[msg.sender].wallet != address(0), "Not a registered seller");
        _;
    }
    
    modifier onlyRegisteredOnboarder() {
        require(onboarders[msg.sender].wallet != address(0), "Not a registered onboarder");
        _;
    }
    
    // Onboarder functions
    function registerOnboarder(string memory _whatsappNumber) external {
        require(onboarders[msg.sender].wallet == address(0), "Already registered");
        require(whatsappToAddress[_whatsappNumber] == address(0), "WhatsApp number already used");
        
        onboarders[msg.sender] = Onboarder({
            wallet: msg.sender,
            whatsappNumber: _whatsappNumber,
            totalPoints: 0,
            sellersOnboarded: 0,
            totalEarnings: 0,
            isActive: true,
            joinedAt: block.timestamp
        });
        
        whatsappToAddress[_whatsappNumber] = msg.sender;
        
        emit OnboarderRegistered(msg.sender, _whatsappNumber);
    }
    
    function onboardSeller(
        address _sellerWallet,
        string memory _sellerWhatsapp,
        string memory _name,
        string memory _location
    ) external onlyRegisteredOnboarder {
        require(sellers[_sellerWallet].wallet == address(0), "Seller already registered");
        require(whatsappToAddress[_sellerWhatsapp] == address(0), "WhatsApp number already used");
        
        sellers[_sellerWallet] = Seller({
            wallet: _sellerWallet,
            whatsappNumber: _sellerWhatsapp,
            name: _name,
            location: _location,
            onboardedBy: msg.sender,
            totalSales: 0,
            rating: 5000, // 5.0 rating (scaled by 1000)
            isVerified: false,
            joinedAt: block.timestamp
        });
        
        whatsappToAddress[_sellerWhatsapp] = _sellerWallet;
        
        // Award points to onboarder
        onboarders[msg.sender].totalPoints += SELLER_SIGNUP_POINTS;
        onboarders[msg.sender].sellersOnboarded += 1;
        
        emit SellerOnboarded(_sellerWallet, msg.sender, _sellerWhatsapp);
        emit PointsAwarded(msg.sender, SELLER_SIGNUP_POINTS, "Seller signup");
    }
    
    // Seller functions
    function createListing(
        string memory _title,
        string memory _description,
        uint256 _price,
        uint256 _minPrice,
        string memory _location,
        string memory _category,
        string memory _imageHash,
        bool _isNegotiable
    ) external onlyRegisteredSeller {
        require(_price > 0, "Price must be greater than 0");
        require(_minPrice <= _price, "Min price cannot exceed listing price");
        
        Listing memory newListing = Listing({
            id: nextListingId,
            seller: msg.sender,
            whatsappNumber: sellers[msg.sender].whatsappNumber,
            title: _title,
            description: _description,
            price: _price,
            minPrice: _minPrice,
            location: _location,
            category: _category,
            imageHash: _imageHash,
            isActive: true,
            isNegotiable: _isNegotiable,
            createdAt: block.timestamp
        });
        
        listings[nextListingId] = newListing;
        sellerListings[msg.sender].push(nextListingId);
        
        // Award points for first listing
        if (sellerListings[msg.sender].length == 1 && sellers[msg.sender].onboardedBy != address(0)) {
            address onboarder = sellers[msg.sender].onboardedBy;
            onboarders[onboarder].totalPoints += FIRST_LISTING_POINTS;
            emit PointsAwarded(onboarder, FIRST_LISTING_POINTS, "First listing");
        }
        
        emit ListingCreated(nextListingId, msg.sender, sellers[msg.sender].whatsappNumber);
        nextListingId++;
    }
    
    function updateListing(
        uint256 _listingId,
        string memory _title,
        string memory _description,
        uint256 _price,
        uint256 _minPrice,
        bool _isActive
    ) external {
        require(listings[_listingId].seller == msg.sender, "Not your listing");
        require(_price > 0, "Price must be greater than 0");
        require(_minPrice <= _price, "Min price cannot exceed listing price");
        
        listings[_listingId].title = _title;
        listings[_listingId].description = _description;
        listings[_listingId].price = _price;
        listings[_listingId].minPrice = _minPrice;
        listings[_listingId].isActive = _isActive;
    }
    
    // Buyer functions
    function createPurchase(
        uint256 _listingId,
        uint256 _offerPrice,
        string memory _buyerWhatsapp
    ) external nonReentrant {
        Listing storage listing = listings[_listingId];
        require(listing.isActive, "Listing not active");
        require(listing.seller != msg.sender, "Cannot buy your own item");
        require(_offerPrice >= listing.minPrice, "Offer below minimum price");
        require(_offerPrice <= listing.price, "Offer above listing price");
        
        // Transfer payment to escrow (this contract)
        require(
            paymentToken.transferFrom(msg.sender, address(this), _offerPrice),
            "Payment transfer failed"
        );
        
        Purchase memory newPurchase = Purchase({
            id: nextPurchaseId,
            listingId: _listingId,
            buyer: msg.sender,
            seller: listing.seller,
            finalPrice: _offerPrice,
            buyerWhatsapp: _buyerWhatsapp,
            status: PurchaseStatus.Paid,
            createdAt: block.timestamp,
            completedAt: 0
        });
        
        purchases[nextPurchaseId] = newPurchase;
        buyerPurchases[msg.sender].push(nextPurchaseId);
        
        // Deactivate listing
        listing.isActive = false;
        
        emit PurchaseCreated(nextPurchaseId, _listingId, msg.sender);
        nextPurchaseId++;
    }
    
    function completePurchase(uint256 _purchaseId) external nonReentrant {
        Purchase storage purchase = purchases[_purchaseId];
        require(
            purchase.buyer == msg.sender || purchase.seller == msg.sender || msg.sender == owner(),
            "Not authorized"
        );
        require(purchase.status == PurchaseStatus.Paid, "Invalid status");
        
        // Calculate fees
        uint256 platformFee = (purchase.finalPrice * platformFeePercent) / 10000;
        uint256 sellerAmount = purchase.finalPrice - platformFee;
        
        // Transfer payment to seller
        require(
            paymentToken.transfer(purchase.seller, sellerAmount),
            "Seller payment failed"
        );
        
        // Update purchase status
        purchase.status = PurchaseStatus.Completed;
        purchase.completedAt = block.timestamp;
        
        // Update seller stats
        sellers[purchase.seller].totalSales += 1;
        
        // Award points for first sale
        if (sellers[purchase.seller].totalSales == 1 && sellers[purchase.seller].onboardedBy != address(0)) {
            address onboarder = sellers[purchase.seller].onboardedBy;
            onboarders[onboarder].totalPoints += FIRST_SALE_POINTS;
            emit PointsAwarded(onboarder, FIRST_SALE_POINTS, "First sale");
        }
        
        emit PurchaseCompleted(_purchaseId, purchase.buyer, purchase.seller);
    }
    
    // Admin functions
    function processOnboarderPayout(address _onboarder, uint256 _amount) external onlyOwner {
        require(onboarders[_onboarder].wallet != address(0), "Onboarder not found");
        require(_amount > 0, "Amount must be greater than 0");
        
        // Transfer USDT to onboarder
        require(
            paymentToken.transfer(_onboarder, _amount),
            "Payout transfer failed"
        );
        
        onboarders[_onboarder].totalEarnings += _amount;
        
        emit PayoutProcessed(_onboarder, _amount);
    }
    
    function setPlatformFee(uint256 _feePercent) external onlyOwner {
        require(_feePercent <= 1000, "Fee cannot exceed 10%");
        platformFeePercent = _feePercent;
    }
    
    function withdrawPlatformFees() external onlyOwner {
        uint256 balance = paymentToken.balanceOf(address(this));
        require(balance > 0, "No fees to withdraw");
        
        require(
            paymentToken.transfer(owner(), balance),
            "Withdrawal failed"
        );
    }
    
    function verifySeller(address _seller) external onlyOwner {
        require(sellers[_seller].wallet != address(0), "Seller not found");
        sellers[_seller].isVerified = true;
    }
    
    // View functions
    function getListingsByCategory(string memory _category) external view returns (uint256[] memory) {
        uint256[] memory categoryListings = new uint256[](nextListingId - 1);
        uint256 count = 0;
        
        for (uint256 i = 1; i < nextListingId; i++) {
            if (
                listings[i].isActive &&
                keccak256(bytes(listings[i].category)) == keccak256(bytes(_category))
            ) {
                categoryListings[count] = i;
                count++;
            }
        }
        
        // Resize array
        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = categoryListings[i];
        }
        
        return result;
    }
    
    function getSellerListings(address _seller) external view returns (uint256[] memory) {
        return sellerListings[_seller];
    }
    
    function getBuyerPurchases(address _buyer) external view returns (uint256[] memory) {
        return buyerPurchases[_buyer];
    }
    
    function getOnboarderStats(address _onboarder) external view returns (
        uint256 totalPoints,
        uint256 sellersOnboarded,
        uint256 totalEarnings,
        bool isActive
    ) {
        Onboarder memory onboarder = onboarders[_onboarder];
        return (
            onboarder.totalPoints,
            onboarder.sellersOnboarded,
            onboarder.totalEarnings,
            onboarder.isActive
        );
    }
    
    function calculateOnboarderPayout(address _onboarder) external view returns (uint256) {
        uint256 points = onboarders[_onboarder].totalPoints / 10**POINTS_DECIMALS;
        
        if (points >= 1000) return 50 * 10**6; // $50 USDT (6 decimals)
        if (points >= 500) return 25 * 10**6;  // $25 USDT
        if (points >= 100) return 10 * 10**6;  // $10 USDT
        
        return 0;
    }
}