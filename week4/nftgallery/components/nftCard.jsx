import { ethers } from "ethers";

export const NFTCard = ({ nft }) => {
    let tokenId =parseInt(ethers.utils.hexStripZeros(nft.id.tokenId),16);

    return (
        <div className="w-1/4 flex flex-col ">
        <div className="rounded-md">
            <img className="object-cover h-128 w-full rounded-t-md" src={nft.media[0].gateway} ></img>
        </div>
        <div className="flex flex-col y-gap-2 px-2 py-3 bg-slate-100 rounded-b-md h-110 ">
            <div className="">
                <h2 className="text-xl text-gray-800">{nft.title}</h2>
                <p className="text-gray-600">Id: {tokenId}</p>
                <p className="text-gray-600" >{nft.contract.address}
                    <button className={"disabled:bg-slate-500 text-white bg-blue-400 px-5 py-1 mt-3 rounded-sm"} 
                    onClick={()=>{
                        navigator.clipboard.writeText(nft.contract.address)
                        alert("copied")
                    }}>Copy</button>
                </p>
            </div>

            <div className="flex-grow mt-2">
                <p className="text-gray-600">{nft.description}</p>
            </div>
        </div>

    </div>
    )
}