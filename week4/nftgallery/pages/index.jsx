import { NFTCard } from "../components/nftCard"
import { useState } from 'react'

const Home = () => {
  const [wallet,setWalletAddress] = useState("")
  const [collection, setCollectionAddress] = useState("")
  const [NFTs, setNFTs] = useState([])
  const [fetchForCollection, setFetchForCollection]=useState(false)
  const [pageKey="",setPageKey] = useState("")
  const [showNextPage,setShowNextPage] = useState("")
  const pageSize = 1;

  const fetchNFTs = async() => {
    let nfts;
    console.log("fetching nfts");
    const api_key = "MU9dWCZZrIu56qxAtZCKG2GAflGsDlLQ"
    const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${api_key}/getNFTs/`;
    var requestOptions = {
        method: 'GET'
      };
     
    if (!collection.length) {
    
      const fetchURL = `${baseURL}?owner=${wallet}&pageSize=${pageSize}&pageKey=${pageKey}`;
  
      nfts = await fetch(fetchURL, requestOptions).then(data => data.json())
    } else {
      console.log("fetching nfts for collection owned by address")
      const fetchURL = `${baseURL}?owner=${wallet}&contractAddresses%5B%5D=${collection}&pageSize=${pageSize}&pageKey=${pageKey}`;
      nfts= await fetch(fetchURL, requestOptions).then(data => data.json())
    }
  
    if (nfts) {
      console.log("nfts:", nfts)
      setNFTs(nfts.ownedNfts)
      if(nfts.pageKey) {
        setShowNextPage(true)
        setPageKey(nfts.pageKey)
      }else{
        setShowNextPage(false)
        setPageKey("")
      }
    }
  }
  
  const fetchNFTsForCollection = async () => {
    if (collection.length) {
      var requestOptions = {
        method: 'GET'
      };
      const api_key = "MU9dWCZZrIu56qxAtZCKG2GAflGsDlLQ"
      const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${api_key}/getNFTsForCollection/`;
      const fetchURL = `${baseURL}?contractAddress=${collection}&withMetadata=${"true"}`;
      const nfts = await fetch(fetchURL, requestOptions).then(data => data.json())
      if (nfts) {
        console.log("NFTs in collection:", nfts)
        setNFTs(nfts.nfts)
      }
    }
  }

  return (
    <div className="flex flex-col items-center justify-center py-8 gap-y-3">
      <div className="flex flex-col w-full justify-center items-center gap-y-2">
        <input disabled={fetchForCollection} onChange={(e)=>{setWalletAddress(e.target.value)}} value={wallet} type={"text"} placeholder="Add your wallet address"></input>
        <input onChange={(e)=>{setCollectionAddress(e.target.value)}} value={collection} type={"text"} placeholder="Add the collection address"></input>
        <label className="text-gray-600 "><input type={"checkbox"} className="mr-2" onChange={(e)=>setFetchForCollection(e.target.checked)}></input>Fetch for collection</label>
        <button className={"disabled:bg-slate-500 text-white bg-blue-400 px-4 py-2 mt-3 rounded-sm w-1/5"} onClick={
          ()=>{
            if(fetchForCollection){
              fetchNFTsForCollection()
            }else fetchNFTs()
          }
        }>Let's go! </button>
      </div>
      <div className='flex flex-wrap gap-y-12 mt-4 w-5/6 gap-x-2 justify-center'>
        {
          NFTs.length && NFTs.map(nft => {
            return (
              <NFTCard nft={nft}></NFTCard>
            )
          })
        }
      </div>
        {showNextPage? <div className='flex flex-col w-full justify-center items-center gap-y-2'>
        <button className={"disabled:bg-slate-500 text-white bg-blue-400 px-4 py-2 mt-3 rounded-sm w-1/5"} onClick={
            ()=>{
              if(fetchForCollection){
                fetchNFTsForCollection()
              }else fetchNFTs()
            }
          }>Next page</button>
        </div>  : null }
    </div>
  )
}

export default Home