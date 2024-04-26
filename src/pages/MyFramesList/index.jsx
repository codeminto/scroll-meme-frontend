import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Container, Header } from "./Contact.styled";
import { usePrivy } from "@privy-io/react-auth";
import "./ImageListPage.css";
import API_URLS from "../../config.js";
 

function MyFramesList() {
	const [frames, setFrames] = useState([]);
	const [loading, setLoading] = useState(true);

	const fadeTop = {
		hidden: { opacity: 0, y: -30 },
		visible: { opacity: 1, y: 0 },
	};

	const { ready, authenticated, user, logout } = usePrivy();

	useEffect(() => {
		const fetchMemes = async () => {
			try {
				const response = await axios.get(
					`${import.meta.env.VITE_BACKEND_URL}/meme`,
				);
				setMemes(response.data);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching memes:", error);
				setLoading(false);
			}
		};

		if (ready && !authenticated) {
			window.location.href = "/login";
		} else {
			fetchMemes();
		}
	}, [ready, authenticated]);

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
					<h2 className="">Frames List</h2>
				</motion.div>
			</Header>
			<div style={boxStyle} className="rounded-box">
				<div className="image-list">
					
				</div>
			</div>
		</Container>
	);
}

export default MyFramesList;
