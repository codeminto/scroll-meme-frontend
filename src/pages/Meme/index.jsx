import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom"; // Import useParams hook
import { motion } from "framer-motion";
import { Container, Header } from "./Contact.styled";
import API_URLS from "../../config.js";
import { useTableland } from "../../contexts/Tableland";
// import { toast } from 'react-toastify';
import toast, { Toaster } from "react-hot-toast";
function Meme() {
	const { id } = useParams(); // Get the ID parameter from the URL

	const fadeTop = {
		hidden: { opacity: 0, y: -30 },
		visible: { opacity: 1, y: 0 },
	};

	const [meme, setMeme] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchMeme = async () => {
			try {
				const response = await axios.get(`${API_URLS.development}/meme/${id}`);
				setMeme(response.data);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching meme:", error);
				setLoading(false);
			}
		};

		fetchMeme();
	}, [id]); // Fetch data whenever the ID parameter changes

	if (loading) {
		return <div>Loading...</div>;
	}

	if (!meme) {
		return <div>Meme not found</div>;
	}

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
					{/* <h2 className="">{meme.title}</h2> */}
					<div className="meme-detail">
						<h2>{meme.title}</h2>
						<img
							style={{ borderRadius: "10px", width: "600px" }}
							src={meme.imagelink}
							alt={meme.title}
						/>
						<div
							style={{ margin:"10px" }}
							className="meme-details"
						>
							<p>Posted by: {meme.userId}</p>
							<p>Description: {meme.description}</p>
							<p>Likes: {meme.likes}</p>
						</div>
					</div>
				</motion.div>
			</Header>
		</Container>
	);
}

export default Meme;
