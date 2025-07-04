// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MockUSDT
 * @dev Mock USDT token for testing JijiFresh marketplace
 */
contract MockUSDT is ERC20, Ownable {
    uint8 private _decimals = 6; // USDT has 6 decimals
    
    constructor() ERC20("Mock USDT", "USDT") {
        // Mint initial supply to deployer
        _mint(msg.sender, 1000000 * 10**_decimals); // 1M USDT
    }
    
    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }
    
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
    
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
}