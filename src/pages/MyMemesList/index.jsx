import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Container, Header } from "./Contact.styled";
import { usePrivy } from "@privy-io/react-auth";
import "./ImageListPage.css";
import API_URLS from "../../config.js";
import { useTableland } from "../../contexts/Tableland";
import GradientBorderCard from "../../Components/GradientBorderCard .jsx";


function MyMemesList() {
	const [memes, setMemes] = useState([]);
	const [ loading, setLoading ] = useState( true );
	const { readTable } = useTableland();


	const fadeTop = {
		hidden: { opacity: 0, y: -30 },
		visible: { opacity: 1, y: 0 },
	};

	const { ready, authenticated, user, logout } = usePrivy();

	useEffect(() => {
		const fetchMemes = async () => {
			try {
				// const response = await axios.get( `${ API_URLS.development }/meme` );
				
				const result = await readTable();
				console.log("res", result);
				setMemes(result);
				setLoading(false);
				const data = await readTable()
				console.log({ data })
				setMemes([...data])
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

	if (loading) {
		return <div>Loading...</div>;
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
					<h1 className="">Meme List</h1>
					
				</motion.div>
			</Header>
			<div style={boxStyle} className="rounded-box">
				{memes.map((meme) => (
					<GradientBorderCard>
						<Link to={`/meme/${meme.f_id}`} key={meme.f_id}>
							<div style={{ textAlign: "center" }}>
								<img
									style={{
										textAlign: "center",
										borderRadius: "5px",
										objectFit: "cover",
									}}
									width={"100%"}
									height={"250px"}
									src={meme.uri}
									alt="my-meme"
								/>
							</div>
						</Link>

						<div style={{ textAlign: "center" }}>
							<h3>
								{" "}
								<b> {meme.title}</b>
							</h3>

							<div
								style={{
									display: "flex",
									marginTop: "10px",
									fontSize: "12px",
									justifyContent: "space-around",
								}}
							>
								<a style={{}} className="btn btn-primary highlight">
									<b>
										{" "}
										Cast <i className="fas fa-share"></i>
									</b>
								</a>
								<a
									style={{ marginLeft: "10px" }}
									className="btn btn-primary highlight"
								>
									<b>
										Upvote <i className="fas fa-arrow-up"></i>{" "}
									</b>
								</a>
							</div>
						</div>
					</GradientBorderCard>

					// <div style={{display:"flex",flexDirection:"column"}}>
					// 	<Link
					// 		to={`/meme/${meme.f_id}`}
					// 		key={meme.f_id}

					// 	>
					// 		<div className="image-box">
					// 			<img src={meme.uri} alt={meme.title} />
					// 		</div>
					// 		<div className="image-details">
					// 			<h3>{meme.title}</h3>
					// 			<p>{meme.description}</p>
					// 		</div>
					// 	</Link>
					// 	<button className="btn btn-primary highlight share-button">
					// 		Cast <i className="fas fa-share"></i>
					// 	</button>

					// 	<button className="btn btn-primary highlight share-button">
					// 		Upvote <i className="fas fa-arrow-up"></i>
					// 	</button>
					// </ div>
				))}
			</div>
		</Container>
	);
}

export default MyMemesList;
