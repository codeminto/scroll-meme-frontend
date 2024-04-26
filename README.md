## Memester

## MorphL2
Memester, powered by MorphL2, revolutionizes meme creation and sharing by leveraging the scalability and security features of MorphL2's Layer 2 solution. Users can now create, share, and engage with memes seamlessly on the blockchain, enjoying faster transaction speeds and reduced costs. With MorphL2 integration, Memester enhances the user experience while maintaining the integrity and decentralization of the platform.

### Smart Contracts : 
#### [CampaignFactory.sol](https://github.com/codeminto/contract-memeagent/blob/main/contracts/CampaignFactory.sol)
#### [Campaign.sol](https://github.com/codeminto/contract-memeagent/blob/main/contracts/Campaign.sol)

#### MorphL2 Contract Address : [0x51D1c4117fcb34358D0Da8E54C6F11028391e4db](https://explorer-testnet.morphl2.io/address/0x51D1c4117fcb34358D0Da8E54C6F11028391e4db)






## Filecoin Integration
#### Store data with Tableland seamlessly integrates with various features of the Memester platform, including meme creation tools, competition platforms, and voting systems. This integration ensures that data flows smoothly between different components of the platform, enabling a cohesive user experience.
### Integration while login  [File](https://github.com/codeminto/meme-frontend/blob/main/src/pages/Login/index.jsx)

	const CreateTable = async (res) => {

		try
		{
			const chainId = wallet?.chainId?.split(":")[1];
			const userAddress = user.wallet?.address;
			const { data } = await axios.get(
				"${import.meta.env.VITE_BACKEND_URL}/tableland?address=${userAddress}&networkId=${chainId}",
			);
			if ( !data && !data?.length )
			{
        await createTable()
			}
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};

 ### Integration while submitting meme and participation [File](https://github.com/codeminto/meme-frontend/blob/main/client/src/contexts/Tableland.jsx)

![each meme will stored in taleland](https://github.com/codeminto/meme-frontend/assets/16322269/65c52600-1565-412d-a505-394be530a14e)




## Farcaster
Users on Memester can create memes and generate frames, which can be shared on Farcaster. During competitions, users can generate frames on Warpcast and submit their votes for memes directly from Farcaster's Warpcast integration. This seamless integration between Memester and Warpcast enhances user engagement and voting accessibility, streamlining the competition process.

![tested frame in frame gear](https://github.com/codeminto/memeAgent/assets/16322269/cd597644-3019-4733-b2d2-b8d3a60306cb)



