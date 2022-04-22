// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol"; // 

contract MintAnimalToken is ERC721Enumerable { // 상속받아서 기본적인 함수 됨. 
    constructor() ERC721("yongCharacters", "YCH") {} // 컨트랙트 만들어질때 최초한개 실행됨
    
    mapping(uint256 => uint256) public animalTypes;
    
    struct AnimalTokenData {
        uint256 animalTokenId;
        uint256 animalType;
            }

    function mintAnimalToken() public {
        uint256 animalTokenId = totalSupply() + 1;
        uint256 animalType = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, animalTokenId))) % 5 + 1;
        animalTypes[animalTokenId] = animalType;
        _mint(msg.sender, animalTokenId); // 민팅누른사람 주인, 토큰아이디가 증명하는토큰아이디
    }

    // 느려지는걸 파악해서 
    // 배열타입은 메모리표시 해줘야 스토리지에 저장 노
    function getAnimalTokens(address _animalTokenOwner) view public returns (AnimalTokenData[] memory) {
        uint256 balanceLength = balanceOf(_animalTokenOwner);

        require(balanceLength != 0, "Owner did not have token.");

        AnimalTokenData[] memory animalTokenData = new AnimalTokenData[](balanceLength);

        for(uint256 i = 0; i < balanceLength; i++) {
            uint256 animalTokenId = tokenOfOwnerByIndex(_animalTokenOwner, i);
            uint256 animalType = animalTypes[animalTokenId];

            animalTokenData[i] = AnimalTokenData(animalTokenId, animalType);
        }

        return animalTokenData;
    }

} 