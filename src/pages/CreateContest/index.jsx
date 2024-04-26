import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Container, Header } from "./Contact.styled.js";
import "./ImageListPage.css";
import toast, { Toaster } from "react-hot-toast";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { providers } from "ethers";
import { ethers } from "ethers";
import CampaignFactoryAbi from "../../abi/CampaignFactory.json";
import { useLoader } from "../../contexts/LoaderContext.jsx";

function CreateContest() {
	const { ready, authenticated, user, logout } = usePrivy();

	useEffect(() => {
		if (ready && !authenticated) {
			window.location.href = "/login";
		} else {
		}
	}, [ready, authenticated]);
	const fadeTop = {
		hidden: { opacity: 0, y: -30 },
		visible: { opacity: 1, y: 0 },
	};
	const { setLoader } = useLoader();
	// const { ready, authenticated, user } = usePrivy();
	const { wallets } = useWallets();
	const wallet = wallets[0]; // Replace this with your desired wallet
	const [formData, setFormData] = useState({
		imageUrl: "",
		networkId: "",
		address: "",
		title: "",
		description: "",
		startedAt: "",
		endedAt: "",
		frame: "",
		winnerCounts: 1,
		winnerPickType: "Admin",
		participantCounts: 100,
		amount: 0,
	});
	const [imagePreview, setImagePreview] = useState(null);
	const fileInputRef = useRef(null);

	const handleImageChange = async (e) => {
		const file = e.target.files[0];
		const hash = await uploadToPinata(file);
		const imagelink = `https://${
			import.meta.env.VITE_GATEWAY_URL
		}/ipfs/${hash}`;
		console.log("imagelink is", imagelink);

		// Update formData with imagelink
		setFormData({
			...formData,
			imageUrl: imagelink,
		});

		// Set image preview
		const reader = new FileReader();
		reader.onloadend = () => {
			setImagePreview(reader.result);
		};
		reader.readAsDataURL(file);
	};

	const handleUploadBoxClick = () => {
		// Trigger the file input
		fileInputRef.current.click();
	};

	const uploadToPinata = async (blob) => {
		try {
			setLoader({ loading: true, type: "default" });
			const formData = new FormData();
			formData.append("file", blob);
			const metadata = JSON.stringify({
				name: "File name",
			});
			formData.append("pinataMetadata", metadata);

			const options = JSON.stringify({
				cidVersion: 0,
			});
			formData.append("pinataOptions", options);

			const res = await fetch(
				"https://api.pinata.cloud/pinning/pinFileToIPFS",
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`,
					},
					body: formData,
				},
			);
			const resData = await res.json();
			console.log("ipfshash========>>>>>>", resData.IpfsHash);
			return resData.IpfsHash;
		} catch (error) {
			console.log(error);
			return new Error("FAILED_TO_UPLOAD_IMAGE");
		} finally {
			setLoader({ loading: false, type: "default" });
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		//setLoader({ loading: true, type: 'default' })
		try {
			const networkID = wallet ? wallet.chainId?.split(":")[1] : null;
			const userAddress = user ? user.wallet?.address : null;
			console.log("wallet addreess", userAddress);
			console.log("network id", networkID);
			console.log("...formData", formData);
			setFormData({
				...formData,
				networkId: networkID,
				address: userAddress,
			});
			console.log("FORM_DATA ", formData);
			const contractAddress = await createCampaignContractCall(formData);

			console.log( "contractAddress", contractAddress );
			toast.success("Contest created successful..!");
			// const response = await axios.post(
			// 	`${import.meta.env.VITE_FRAME_URL}/api/contest`,
			// 	{
			// 		...formData,
			// 		networkId: networkID,
			// 		address: userAddress,
			// 	},
			// );
			// console.log(response.data); // handle success response
		} catch (error) {
			console.error("Error creating contest:", error);
		} finally {
			setLoader({ loading: false, type: "default" });
		}
	};

	const createCampaignContractCall = async (formData) => {
		console.log("form data ========>>>>>", formData);
		const provider = new providers.Web3Provider(window.ethereum);
		const signer = provider.getSigner();
		const factoryContractAddress = import.meta.env.VITE_FACTORY_CONTRACT_ADDRESS;
		console.log( "factoryContractAddress", factoryContractAddress );
		const campaignFactory = new ethers.Contract(
			factoryContractAddress,
			CampaignFactoryAbi,
			signer,
		);
		console.log(campaignFactory, "campaignFactory");
		try {
			const _startedAt = new Date(formData?.startedAt).getTime();
			const _endedAt = new Date(formData?.endedAt).getTime();
			const etherAmount = ethers.utils.parseEther(formData?.amount);
			console.log(_startedAt, _endedAt);
			const result = await campaignFactory.createCampaign(
				formData?.imageUrl,
				formData?.title,
				formData?.description,
				_startedAt,
				_endedAt,
				formData?.participantCounts,
				"Public",
				etherAmount,
				formData?.winnerCounts,
			);
			console.log("Method call result:", result);
			return result;
		} catch (error) {
			console.error("Error calling method:", error);
		}
	};

	const boxStyle = {
		width: "70%",
		margin: "0 auto",
		borderRadius: "10px",
		boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
		padding: "20px",
		backgroundColor: "#ffffff",
	};

	return (
		<Container>
			<Header>
				<motion.div
					className="header-content"
					variants={fadeTop}
					initial="hidden"
					animate="visible"
					transition={{ duration: 0.6 }}
				>
					<h2 className="">Create Contest</h2>
					<img src="" alt="" />
				</motion.div>
			</Header>
			<div style={boxStyle} className="rounded-box">
				<form
					style={{
						display: "flex",
						flexDirection: "row",
						justifyContent: "space-around",
					}}
					onSubmit={handleSubmit}
				>
					<div>
						<div
							style={{
								width: "400px",
								height: "400px",
								border: "2px dashed #ccc",
								borderRadius: "8px",
								display: "inline-flex",
								justifyContent: "center",
								alignItems: "center",
								cursor: "pointer",
								overflow: "hidden",
							}}
							onClick={handleUploadBoxClick}
						>
							{imagePreview ? (
								<img
									src={imagePreview}
									alt="Uploaded"
									style={{ maxWidth: "100%", maxHeight: "100%" }}
								/>
							) : (
								<div
									style={{
										fontSize: "16px",
										textAlign: "center",
									}}
								>
									<i
										style={{
											fontSize: "50px",
											textAlign: "center",
										}}
										className="fas fa-cloud-arrow-up"
									></i>
									<br />
									Click box to upload Image
								</div>
							)}
							<input
								type="file"
								id="imageUpload"
								accept="image/*"
								onChange={handleImageChange}
								style={{ display: "none" }}
								ref={fileInputRef}
							/>
						</div>
					</div>

					<div
						style={{
							display: "flex",
							flexDirection: "column",
							width: "100%",
							marginLeft: "30px",
							marginRight: "30px",
							justifyContent: "space-around",
						}}
						className="header-content"
					>
						<div style={{ display: "flex", justifyContent: "space-between" }}>
							<label htmlFor="title" style={{ textAlign: "left" }}>
								Title:
							</label>
							<input
								className="text btn"
								type="text"
								id="title"
								name="title"
								value={formData.title}
								onChange={(e) =>
									setFormData({ ...formData, title: e.target.value })
								}
								placeholder=""
								required
								style={{ width: "300px" }}
							/>
						</div>
						<div style={{ display: "flex", justifyContent: "space-between" }}>
							<label htmlFor="description" style={{ textAlign: "left" }}>
								Description:
							</label>
							<textarea
								className="text btn btn-light"
								id="description"
								name="description"
								value={formData.description}
								onChange={(e) =>
									setFormData({ ...formData, description: e.target.value })
								}
								placeholder=""
								required
								style={{ width: "300px" }}
							/>
						</div>
						<div style={{ display: "flex", justifyContent: "space-between" }}>
							<label htmlFor="startedAt" style={{ textAlign: "left" }}>
								Started At:
							</label>
							<input
								className="text btn btn-light"
								type="datetime-local"
								id="startedAt"
								name="startedAt"
								value={formData.startedAt}
								onChange={(e) =>
									setFormData({ ...formData, startedAt: e.target.value })
								}
								required
								style={{ textAlign: "right", width: "300px" }}
							/>
						</div>
						<div style={{ display: "flex", justifyContent: "space-between" }}>
							<label htmlFor="endedAt" style={{ textAlign: "left" }}>
								Ended At:
							</label>
							<input
								className="text btn btn-light"
								type="datetime-local"
								id="endedAt"
								name="endedAt"
								value={formData.endedAt}
								onChange={(e) =>
									setFormData({ ...formData, endedAt: e.target.value })
								}
								required
								style={{ textAlign: "right", width: "300px" }}
							/>
						</div>
						<div style={{ display: "flex", justifyContent: "space-between" }}>
							<label htmlFor="winnerCounts" style={{ textAlign: "left" }}>
								Number of Winners :
							</label>
							<input
								className="text btn btn-light"
								type="number"
								id="winnerCounts"
								name="winnerCounts"
								value={formData.winnerCounts}
								onChange={(e) =>
									setFormData({ ...formData, winnerCounts: e.target.value })
								}
								placeholder=""
								required
								style={{ textAlign: "right", width: "300px" }}
							/>
						</div>
						<div style={{ display: "flex", justifyContent: "space-between" }}>
							<label htmlFor="amount" style={{ textAlign: "left" }}>
								Amount :
							</label>
							<input
								className="text btn btn-light"
								type="number"
								id="amount"
								name="amount"
								value={formData.amount}
								onChange={(e) =>
									setFormData({ ...formData, amount: e.target.value })
								}
								placeholder=""
								required
								style={{ textAlign: "right", width: "300px" }}
							/>
						</div>
						<div style={{ display: "flex", justifyContent: "space-between" }}>
							<label htmlFor="amount" style={{ textAlign: "left" }}>
								Result Type :
							</label>
							<select
								className="text btn btn-light"
								type="select"
								id="amount"
								// name="amount"
								// value={formData.amount}
								// placeholder=""
								// required
								style={{  width: "300px" }}
							>
								<option value="Public VOting">Public Voting</option>
								<option value="Admin">Admin</option>
								<option value="Chainlink Random">Chainlink Random</option>
							</select>
						</div>
						<br />
						<br />
						<br />
						<button className="btn btn-primary" type="submit">
							<b> Submit</b>
						</button>
					</div>
				</form>
			</div>
		</Container>
	);
}

export default CreateContest;
