import React from "react";
import { NavLink } from "react-router-dom";
import { GoogleLogin } from "react-google-login";
import { Container, GithubAuth, GmailAuth } from "./Login.styled";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useTableland } from "../../contexts/Tableland";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { useLoader } from "../../contexts/LoaderContext";
import { useLogin } from "@privy-io/react-auth";




export default function Login() {

	const { ready, authenticated, user } = usePrivy();
	const { wallets } = useWallets();
	const wallet = wallets[ 0 ];
	const { setLoader } = useLoader();

	const { readTable, writeTable, createTable } = useTableland();

	useEffect(() => {
		if (ready && authenticated) {
			window.location.href = "/";
		} else {
		}
	}, [ready, authenticated]);

	const CreateTable = async (res) => {

		try
		{
			// setLoader({ loading: true, type: "default" });
			const chainId = wallet?.chainId?.split(":")[1];
			const userAddress = user.wallet?.address;
			const { data } = await axios.get(
				`${import.meta.env.VITE_BACKEND_URL}/tableland?address=${userAddress}&networkId=${chainId}`,
			);
			console.log("Data ", data);
			if ( !data && !data?.length )
			{

				await createTable()
					// if (ready && authenticated) {
					// 	window.location.href = "/";
					// } else {
					// }
			}
			


		} catch (error) {
			console.error("Error fetching data:", error);
			
		}
		finally
		{
			setLoader({ loading: false, type: "default" });
		}
	};
	// const { login } = usePrivy();

	const { login } = useLogin({
		onComplete: (user, isNewUser, wasAlreadyAuthenticated) => {
			console.log(user, isNewUser, wasAlreadyAuthenticated);
			CreateTable();
			
		},
		onError: (error) => {
			console.log(error);
			
		},
	});


	

	return (
		<Container>
			<header>
				<img src="/images/logo.png" className="logo" alt="Memester logo" />

				<p>Sign in to make your favourite memes and cast in Forcaster</p>

				<a className="btn btn-primary" onClick={login}>
					Log in {"  "}
					<i className="fas fa-arrow-right"></i>
				</a>
				{/* <br />
				<br />
				<a className="btn btn-tertiary" onClick={CreateTable}>
					Create Your account in TableLand and start {"  "}
					<i className="fas fa-arrow-right"></i>
				</a> */}
			</header>
		</Container>
	);
}
