import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import store from "./redux";
import { PrivyProvider } from "@privy-io/react-auth";
import { TablelandProvider } from "./contexts/Tableland";
import toast, { Toaster } from 'react-hot-toast';
import Loader from "./Components/Loader";
import { LoaderProvider } from "./contexts/LoaderContext";
// Replace this with any of the networks listed at https://viem.sh/docs/clients/chains.html
import {arbitrumSepolia, baseSepolia, morphSepolia, } from 'viem/chains';
// import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

// const client = new ApolloClient({
// 	uri: import.meta.env.VITE_GRAPHQL_CLIENT,
// 	cache: new InMemoryCache(),
// });

const ScrollSepolia = {
	id: 534351,
	name: "Scroll Sepolia Testnet",
	nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
	rpcUrls: {
		default: {
			http: ["https://scroll-sepolia.blockpi.network/v1/rpc/public"],
		},
	},
	blockExplorers: {
		default: {
			name: "Scroll Sepolia Testnet",
			url: "https://sepolia.scrollscan.dev",
			apiUrl: "https://sepolia.scrollscan.dev/api",
		},
	},
	testnet: true,
};

ReactDOM.render(
	<React.StrictMode>
		<LoaderProvider>
			<Toaster />
			<Loader />
			{/* <ApolloProvider client={client}> */}
			<PrivyProvider
				appId="cltzqi0kf0gjpsd7f9c5r6lqx"
				config={{
					// Configures email, wallet, Google, Apple, and Farcaster login
					loginMethods: ["farcaster", "wallet"],
					appearance: {
						// Defaults to true
						showWalletLoginFirst: false,
					},
					// Replace this with your desired default chain
					defaultChain: ScrollSepolia,
					// Replace this with a list of your desired supported chains
					supportedChains: [
						baseSepolia,
						arbitrumSepolia,
						morphSepolia,
						ScrollSepolia,
					],
				}}
				// onSuccess={ () => ( window.location.href = "/" )
				onSuccess={() => console.log("login success")}
			>
				<Provider store={store}>
					<TablelandProvider>
						<App />
					</TablelandProvider>
				</Provider>
			</PrivyProvider>
		</LoaderProvider>
		{/* </ApolloProvider> */}
	</React.StrictMode>,
	document.getElementById("root"),
);
