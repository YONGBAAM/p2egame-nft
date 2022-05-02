// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";

/// @custom:security-contact jokester59@naver.com
contract SEAToken1155Enumerable is ERC1155, Ownable, Pausable, ERC1155Burnable {
    constructor()
        ERC1155("ipfs://QmQUPAu7AT6zFP3KXpedhVL1v1hRH4LBwVdSESFnmF6Fq8/{id}.json")
    {}

    uint256 public before_override = 0;
    uint256 public transfer_override = 0;

    uint256 public transfer_override1 = 0;

    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public virtual override {
        //
         
        require(
            from == _msgSender() || isApprovedForAll(from, _msgSender()),
            "ERC1155: caller is not owner nor approved"
        );
        _safeTransferFrom(from, to, id, amount, data);
                transfer_override = transfer_override+1;

    }


    function safeTransferFrom1(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public virtual {
        ERC1155.safeTransferFrom(from, to, id, amount, data);
        transfer_override1 = transfer_override1+1;
    }

    // First, check if we override before and after token transfer and view in opensea

    // Automatically generated by openzeppelin GUI
    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }



    function mint(address account, uint256 id, uint256 amount)
        public
        onlyOwner
    {
        _mint(account, id, amount, "");
    }

    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts)
        public
        onlyOwner
    {
        _mintBatch(to, ids, amounts, "");
    }

    function _beforeTokenTransfer(address operator, address from, address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        internal
        whenNotPaused
        override
    {
                before_override = before_override +1;

        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }
}