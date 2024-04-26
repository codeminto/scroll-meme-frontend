import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Container, Header } from "./Contact.styled";
import API_URLS from "../../config.js";
import { useTableland } from "../../contexts/Tableland";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";
import GradientBorderCard from "../../Components/GradientBorderCard .jsx";
import CampaignAbi from "../../abi/Campaign.json";
import { providers } from "ethers";
import { ethers } from "ethers";
import { usePrivy, useWallets } from "@privy-io/react-auth";

const boxStyle = {
	width: "70%",
	margin: "0 auto",
	borderRadius: "10px",
	boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
	padding: "20px",
	backgroundColor: "#ffffff",
};
function Contest() {
	const { id } = useParams(); // Get the ID parameter from the URL
		const { ready, authenticated, user, logout } = usePrivy();
	const { wallets } = useWallets();
	const wallet = wallets[0];
const networkID = wallet ? wallet.chainId?.split(":")[1] : null;
const userAddress = user ? user.wallet?.address : null;
	const fadeTop = {
		hidden: { opacity: 0, y: -30 },
		visible: { opacity: 1, y: 0 },
	};

	const [contest, setContest] = useState(null);
	const [ loading, setLoading ] = useState( true );
	const [ submissions, setSubmissions ] = useState( [] );
	const [submissionsContractAddress, setsubmissionsContractAddress] = useState([]);


	useEffect(() => {
		const fetchContest = async () => {
			try {
				const response = await axios.get(
					`${import.meta.env.VITE_FRAME_URL}/api/contest/${id}`,
				);
				setContest(response.data);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching contest:", error);
				setLoading(false);
			}
		};
			const fetchSubmissions = async () => {
				try {
					const response1 = await axios.get(
						`${import.meta.env.VITE_BACKEND_URL}/contest-submission`,
					);
					setSubmissions( response1.data );
			
				} catch (error) {
					console.error("Error fetching submissions:", error);
				}
			};

		fetchContest();
		fetchSubmissions()
	}, [id]); // Fetch data whenever the ID parameter changes

	if (loading) {
		return <div>Loading...</div>;
	}

	if (!contest) {
		return <div>Contest not found</div>;
	}

	const upvoteContractCall = async (submissionId, contractAddress) => {
		const provider = new providers.Web3Provider(window.ethereum);
		const signer = provider.getSigner();
		const campaignContractAddress = contractAddress || contest.campaignAddress;
		const campaign = new ethers.Contract(
			campaignContractAddress,
			CampaignAbi,
			signer,
		);
		console.log("signer =>>>>>>>", signer);
		console.log("contest campaign addresss =>>>>>>>", contest.campaignAddress);
		console.log("campaign submissionId =>>>>>>>", submissionId);
		try {
			const result = await campaign.upvoteSubmission(userAddress, submissionId);
			console.log( "UpVote Method call result:", result );
			toast.success("You have voted successful..!");

		} catch (error) {
			console.error("Error calling method:", error);
		}
	};

	const calculateWinnersContractCall = async () => {
		const provider = new providers.Web3Provider(window.ethereum);
		const signer = provider.getSigner();
		const campaignContractAddress = submissionsContractAddress || contest.campaignAddress;
		const campaign = new ethers.Contract(
			campaignContractAddress,
			CampaignAbi,
			signer,
		);
		try {
			const result = await campaign.calculateWinners();
			console.log("Method call result:", result);
		} catch (error) {
			console.error("Error calling method:", error);
		}
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
				></motion.div>
			</Header>

			<div style={boxStyle} className="rounded-box">
				<div
					style={{
						display: "flex",
						margin: "20px",
						justifyContent: "space-between",
					}}
				>
					<div style={{ width: "500px" }}>
						<h2 style={{}}>{contest.title}</h2>
						<img
							style={{
								marginTop: "10px",
								marginBottom: "10px",
								borderRadius: "10px",
								width: "400px",
							}}
							src={contest.imageUrl}
							alt={contest.title}
						/>
						<p style={{ textAlign: "justify" }}>
							<b> Description : </b>
							{contest.description}
							In publishing and graphic design, Lorem ipsum is a placeholder
							text commonly used to demonstrate the visual form of a document or
							a typeface without relying on meaningful content. Lorem ipsum may
							be used as a placeholder before the final copy is available.
						</p>
					</div>
					<hr style={{ color: "yellow" }} />
					<div>
						<div style={{ marginTop: "10px" }}>
							<h2>Schedule</h2>
							<p style={{ marginTop: "10px" }}>
								<b>Started At:</b>{" "}
								{new Date(parseInt(contest.startedAt)).toLocaleString()}
							</p>
							<p>
								<b>Started At:</b>{" "}
								{new Date(parseInt(contest.endedAt)).toLocaleString()}
							</p>
							
						</div>
						<div style={{ marginTop: "20px" }}>
							<Link to={`/participate/${contest._id}`} key={contest._id}>
								<button className="btn btn-primary">Participate</button>
							</Link>{" "}
							<button className="btn btn-secondary" type="submit">
								<b> Cast Now</b>
							</button>
							<h2 style={{ marginTop: "20px" }}>Winners</h2>
							<p style={{ marginTop: "10px" }}>
								<b>1st : </b>0x20613aB...c8697
							</p>
							<p>
								<b>2nd : </b>0x20613aB...c8697
							</p>
							<p>
								<b>3rd : </b>0x20613aB...c8697
							</p>
							<button
								style={{
									marginTop: "20px",
									width: "100%",
									background: "black",
									color: "white",
								}}
								className="btn btn-light"
							>
								Claim Price
							</button>
						</div>
					</div>
				</div>

				<div>
					<h2 style={{ marginTop: "40px", marginBottom: "20px" }}>
						Participants 1
					</h2>
					{submissions.map((submission) => (
						<GradientBorderCard>
							<Link
								to={`/contest-submission/${submission.submissionId}`}
								key={submission.submissionId}
							>
								<div style={{ textAlign: "center" }}>
									<img
										style={{ textAlign: "center", borderRadius: "5px" }}
										width={"100%"}
										height={"250px"}
										src={submission.imageUrlOrHash}
										alt="meme"
									/>
								</div>
							</Link>

							<div style={{ textAlign: "center", fontSize: "12px" }}>
								<h3>
									{" "}
									<b> {submission.description}</b>
								</h3>

								<div
									style={{
										display: "flex",
										flexDirection: "column",
										marginTop: "10px",
										fontSize: "10px",
										justifyContent: "space-around",
									}}
								>
									<a
										style={{ width: "100%" }}
										className="btn btn-primary highlight"
									>
										<b>
											{" "}
											Cast <i className="fas fa-share"></i>
										</b>
									</a>
									<a
										style={{ width: "100%", marginTop: "10px" }}
										className="btn btn-primary highlight"
										onClick={() =>
											upvoteContractCall(
												submission.submissionId,
												submission.contractAddress,
											)
										}
									>
										<b>
											Upvote <i className="fas fa-arrow-up"></i>{" "}
										</b>
									</a>
								</div>
							</div>
						</GradientBorderCard>
					))}
				</div>

				<div style={{ margin: "10px" }} className="contest-details"></div>
			</div>
		</Container>
	);
}

export default Contest;
