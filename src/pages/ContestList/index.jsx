import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Container, Header } from "./Contact.styled.js";
import { usePrivy } from "@privy-io/react-auth";
import "./ImageListPage.css";
import API_URLS from "../../config.js";
import GradientBorderCard from "../../Components/GradientBorderCard .jsx";
 

function ContestList() {
	

	const fadeTop = {
		hidden: { opacity: 0, y: -30 },
		visible: { opacity: 1, y: 0 },
	};

	const { ready, authenticated, user, logout } = usePrivy();

	useEffect(() => {
	const fetchContests = async () => {
		try {
			const response = await axios.get(
				`${import.meta.env.VITE_FRAME_URL}/api/contest`,
			);
			setContests(response.data);
		} catch (error) {
			console.error("Error fetching contests:", error);
		}
	};

	fetchContests();

		// if (ready && !authenticated) {
		// 	window.location.href = "/login";
		// } else {
			
		// }
	}, [ ] );
	
	const [ contests, setContests ] = useState( [] );
	const calculateDaysRemaining = (startDate, endDate) => {
		const start = new Date(startDate);
		const end = new Date(endDate);
		const differenceInTime = end.getTime() - start.getTime();
		const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
		return differenceInDays;
	};

	 const getStatus = (startDate, endDate) => {
			const daysRemaining = calculateDaysRemaining(startDate, endDate);
			if (daysRemaining <= 0) {
				return "Expired";
			} else {
				return "Ongoing";
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

	 const cardStyle = {
			border: "2px solid transparent",
			padding: "20px",
			borderRadius: "10px",
			backgroundColor: "white",
			backgroundClip: "padding-box",
			position: "relative",
			margin: "20px",
		};

		const gradientBorderStyle = {
			content: '""',
			position: "absolute",
			top: "-5px",
			left: "-5px",
			right: "-5px",
			bottom: "-5px",
			zIndex: "-1",
			background: "linear-gradient(45deg, #ffd700, #ffff00)",
			borderRadius: "12px",
		};

		const gradientBorderStyleInner = {
			content: '""',
			position: "absolute",
			top: "-3px",
			left: "-3px",
			right: "-3px",
			bottom: "-3px",
			zIndex: "-1",
			background: "linear-gradient(45deg, #ffd700, #ffff00)",
			borderRadius: "12px",
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
					<h2 className="">Contests</h2>
					{/* <img
						// style={{
						// 	margin: "-165px",
						// }}
						
						src="/images/yellow-bg.png"
					/> */}
				</motion.div>
			</Header>
			<div style={boxStyle}>
				{contests.map((contest) => (
					<GradientBorderCard>
						<Link to={`/contest/${contest._id}`} key={contest._id}>
							<div style={{ textAlign: "center" }}>
								<img
									style={{
										textAlign: "center",
										borderRadius: "10px",
										objectFit: "contain",
									}}
									width={"100%"}
									src={contest.imageUrl}
									alt="Contest"
								/>
							</div>
						</Link>

						<div style={{ textAlign: "center", margin: "10px" }}>
							<Link to={`/contest/${contest._id}`} key={contest._id}>
								<h1>{contest.title}</h1>
							</Link>
							<p
								style={{
									marginTop: "5px",
									fontSize: "14px",
								}}
							>
								{contest.description}
							</p>
							{/* <p>Start Date: {contest.startedAt}</p>
											<p>End Date: {contest.endedAt}</p> */}
							<p
								style={{
									marginTop: "5px",
									fontSize: "12px",
								}}
							>
								<i className="fas fa-clock"></i>{" "}
								{calculateDaysRemaining(contest.startedAt, contest.endedAt)}days{" "}
								
							</p>
							<a
								style={{
									marginTop: "5px",
									fontSize: "8px",

									backgroundColor: "green",
									color: "white",
									borderRadius: "20px",
									padding: "8px",
								}}
								className="btn btn-primary highlight"
							>
								{getStatus(contest.startedAt, contest.endedAt)}
							</a>
							<br />

							<Link to={`/participate/${contest._id}`} key={contest._id}>
								<a
									style={{ marginTop: "10px" }}
									className="btn btn-primary highlight"
								>
									Participate
								</a>
							</Link>
						</div>
					</GradientBorderCard>
				))}
			</div>
		</Container>
	);
}

export default ContestList;
