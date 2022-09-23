// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract ChainBattles is ERC721URIStorage {
    using Strings for uint256;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct Warrior {
        uint256 level;
        uint256 speed;
        uint256 strength;
        uint256 life;
    }

    mapping (uint256 => Warrior) tokenIdToWarrior;

    constructor() ERC721("Chain Battles","CBTLS"){
    
    }

    // to generate and update the SVG image of our NFT
    function generateCharacter(uint256 tokenId) public view returns (string memory) {
        bytes memory svg = abi.encodePacked(
            '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350">',
            '<style>.base { fill: white; font-family: serif; font-size: 14px; }</style>',
            '<rect width="100%" height="100%" fill="black" />',
            '<text x="50%" y="40" class="base" dominant-baseline="middle" text-anchor="middle">',"Warrior",'</text>',
            '<text x="50%" y="65" class="base" dominant-baseline="middle" text-anchor="middle">', "Levels: ",getWarrior(tokenId).level.toString(),'</text>',
            '<text x="50%" y="80" class="base" dominant-baseline="middle" text-anchor="middle">', "Speed: ",getWarrior(tokenId).speed.toString(),'</text>',
            '<text x="50%" y="95" class="base" dominant-baseline="middle" text-anchor="middle">', "Strength: ",getWarrior(tokenId).strength.toString(),'</text>',
            '<text x="50%" y="110" class="base" dominant-baseline="middle" text-anchor="middle">', "Life: ",getWarrior(tokenId).life.toString(),'</text>',
            '</svg>'
        );
        return string(abi.encodePacked("data:image/svg+xml;base64,",Base64.encode(svg)));
    }

    // to get the current level of an NFT
    function getWarrior(uint256 tokenId) public view returns (Warrior memory) {
        Warrior storage warrior = tokenIdToWarrior[tokenId];
        return warrior;
    }

    // to get the TokenURI of an NFT
    function getTokenURI(uint256 tokenId) public view returns (string memory){
        bytes memory dataURI = abi.encodePacked(
            '{',
                '"name": "Chain Battles #', tokenId.toString(), '",',
                '"description": "Battles on chain",',
                '"image": "', generateCharacter(tokenId), '"',
            '}'
        );
        return string(abi.encodePacked("data:application/json;base64,",Base64.encode(dataURI)));
    }

    // to mint
    function mint() public {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _safeMint(msg.sender,newItemId);
        tokenIdToWarrior[newItemId]=Warrior(0,1,5,10);
        _setTokenURI(newItemId,getTokenURI(newItemId));
    }

    // to train an NFT and raise its level
    function train(uint256 tokenId) public {
        require(_exists(tokenId),"Please use an existing token");
        require(ownerOf(tokenId) == msg.sender,"You must own this token to train it");
        Warrior storage warrior = tokenIdToWarrior[tokenId];
        tokenIdToWarrior[tokenId].level = warrior.level + 1;
        tokenIdToWarrior[tokenId].speed = warrior.speed + 1;
        tokenIdToWarrior[tokenId].strength = warrior.strength + 5;
        tokenIdToWarrior[tokenId].life = warrior.life + 10;
        _setTokenURI(tokenId,getTokenURI(tokenId));
    }
    
}