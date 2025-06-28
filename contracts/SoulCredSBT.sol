// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title SoulCredSBT
 * @dev Soulbound Token implementation for SoulCred credentials
 * Tokens are non-transferable once minted (except for recovery mechanisms)
 */
contract SoulCredSBT is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIdCounter;
    
    // Mapping from token ID to credential data
    mapping(uint256 => CredentialData) public credentials;
    
    // Mapping from user address to their token IDs
    mapping(address => uint256[]) public userTokens;
    
    // Mapping for endorsements: tokenId => endorser => endorsed
    mapping(uint256 => mapping(address => bool)) public endorsements;
    mapping(uint256 => uint256) public endorsementCounts;
    
    struct CredentialData {
        string title;
        string category;
        string description;
        string[] skills;
        uint256 learningHours;
        uint256 projectsCompleted;
        uint256 peersHelped;
        uint256 communityContributions;
        uint256 dateEarned;
        string issuer;
        bool verified;
        address recipient;
    }
    
    event CredentialMinted(
        uint256 indexed tokenId,
        address indexed recipient,
        string title,
        string category
    );
    
    event CredentialEndorsed(
        uint256 indexed tokenId,
        address indexed endorser,
        uint256 newEndorsementCount
    );
    
    constructor() ERC721("SoulCred Credentials", "SOULCRED") {}
    
    /**
     * @dev Mint a new credential SBT
     */
    function mintCredential(
        address to,
        string memory tokenURI,
        CredentialData memory credentialData
    ) public returns (uint256) {
        require(to != address(0), "Cannot mint to zero address");
        
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        
        credentialData.recipient = to;
        credentials[tokenId] = credentialData;
        userTokens[to].push(tokenId);
        
        emit CredentialMinted(tokenId, to, credentialData.title, credentialData.category);
        
        return tokenId;
    }
    
    /**
     * @dev Endorse a credential
     */
    function endorseCredential(uint256 tokenId) public {
        require(_exists(tokenId), "Token does not exist");
        require(ownerOf(tokenId) != msg.sender, "Cannot endorse own credential");
        require(!endorsements[tokenId][msg.sender], "Already endorsed");
        
        endorsements[tokenId][msg.sender] = true;
        endorsementCounts[tokenId]++;
        
        emit CredentialEndorsed(tokenId, msg.sender, endorsementCounts[tokenId]);
    }
    
    /**
     * @dev Get user's credentials
     */
    function getUserCredentials(address user) public view returns (uint256[] memory) {
        return userTokens[user];
    }
    
    /**
     * @dev Get credential data
     */
    function getCredential(uint256 tokenId) public view returns (CredentialData memory) {
        require(_exists(tokenId), "Token does not exist");
        return credentials[tokenId];
    }
    
    /**
     * @dev Override transfer functions to make tokens soulbound
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override {
        require(from == address(0) || to == address(0), "Soulbound: Transfer not allowed");
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }
    
    /**
     * @dev Recovery mechanism for lost wallets (owner only)
     */
    function recoverToken(uint256 tokenId, address newOwner) public onlyOwner {
        require(_exists(tokenId), "Token does not exist");
        require(newOwner != address(0), "Cannot recover to zero address");
        
        address currentOwner = ownerOf(tokenId);
        
        // Remove from current owner's tokens
        uint256[] storage currentTokens = userTokens[currentOwner];
        for (uint256 i = 0; i < currentTokens.length; i++) {
            if (currentTokens[i] == tokenId) {
                currentTokens[i] = currentTokens[currentTokens.length - 1];
                currentTokens.pop();
                break;
            }
        }
        
        // Transfer token
        _transfer(currentOwner, newOwner, tokenId);
        
        // Add to new owner's tokens
        userTokens[newOwner].push(tokenId);
        credentials[tokenId].recipient = newOwner;
    }
    
    // Override required functions
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
    
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}