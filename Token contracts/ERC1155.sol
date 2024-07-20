// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BLN is ERC1155, Ownable {
    constructor(address initialOwner)
        ERC1155("https://green-adequate-lemming-915.mypinata.cloud/ipfs/QmTYJHYugqt3uX8WLBkMneZGBu538kA9aoLvzbTc9xDpav/{id}.json")
        Ownable(initialOwner)
    {}

    function name() public view virtual returns (string memory) {
	        return "GameOfBalloons";
	    }

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function mint(address account, uint256 id, uint256 amount, bytes memory data)
        public
        onlyOwner
    {
        _mint(account, id, amount, data);
    }

    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        public
        onlyOwner
    {
        _mintBatch(to, ids, amounts, data);
    }
}
