import React, { useRef, useState, useEffect } from "react";
import interact from "interactjs";
import html2canvas from "html2canvas";
import { v4 as uuid } from "uuid";
import { saveAs } from "file-saver";
import { useDispatch } from "react-redux";
import { closeModal, showModal } from "../../redux/actions/modalAction";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import AddIconForm from "../../Components/AddIconForm";
import temp1 from "../../assets/images/memeTemplate/temp1.png";
import temp2 from "../../assets/images/memeTemplate/temp2.png";
import temp3 from "../../assets/images/memeTemplate/temp3.png";
import temp4 from "../../assets/images/memeTemplate/temp4.png";
import temp5 from "../../assets/images/memeTemplate/temp5.png";
import temp6 from "../../assets/images/memeTemplate/temp6.png";
import temp7 from "../../assets/images/memeTemplate/temp7.png";
import temp8 from "../../assets/images/memeTemplate/temp8.png";
import temp9 from "../../assets/images/memeTemplate/temp9.png";
import temp10 from "../../assets/images/memeTemplate/temp10.png";
import { useTableland } from "../../contexts/Tableland";
import { useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import {
	Container,
	HomeCategory,
	Flex,
	Actions,
	ActionButton,
	EditView,
	FileButtons,
	Controls,
} from "./Create.styled";

// import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import ApolloClient from "apollo-boost";
import { InMemoryCache } from "apollo-cache-inmemory";
import gql from "graphql-tag";
import { usePrivy, useWallets } from "@privy-io/react-auth";

import { providers } from "ethers";
import { ethers } from "ethers";
import CampaignAbi from "../../abi/Campaign.json";

const client = new ApolloClient({
	uri: import.meta.env.VITE_GRAPHQL_CLIENT,
	cache: new InMemoryCache(),
});

const getMemeTemplatesQuery = gql`
	query GetTemplates {
		meme_templates {
			id
			title
			image_link
		}
	}
`;

/**
 * Select file(s).
 * @param {String} contentType The content type of files you wish to select. For instance, use "image/*" to select all types of images.
 * @param {Boolean} multiple Indicates if the user can select multiple files.
 * @returns {Promise<File|File[]>} A promise of a file or array of files in case the multiple parameter is true.
 */
function selectFile(contentType, multiple = false) {
	return new Promise((resolve) => {
		let input = document.createElement("input");
		input.type = "file";
		input.multiple = multiple;
		input.accept = contentType;

		input.onchange = () => {
			let files = Array.from(input.files);
			if (multiple) resolve(files);
			else resolve(files[0]);
		};

		input.click();
	});
}

export default function Create() {
	//get contest details
	const { contestId } = useParams(); // Get the ID parameter from the URL
	const [pinataImgLink, setPinataImageLink] = useState();

	const [contest, setContest] = useState("");
	const { ready, authenticated, user, logout } = usePrivy();

	useEffect(() => {
		if (ready && !authenticated) {
			window.location.href = "/login";
		} else {
		}
	}, [ready, authenticated]);

	useEffect(() => {
		const fetchContest = async () => {
			try {
				const response = await axios.get(
					`${import.meta.env.VITE_FRAME_URL}/api/contest/${contestId}`,
				);
				setContest(response.data);
				console.log("contest response data =======>>>>", response.data);
			} catch (error) {
				console.error("Error fetching contest:", error);
			}
		};

		fetchContest();
	}, [contestId]);

	const imageContainer = useRef();
	const offScreenImage = useRef();
	const [memeTemplateView, setMemeTemplate] = useState(temp1);
	const [selectedText, setSelectedText] = useState(""); // Id of generated element
	const [currentText, setCurrentText] = useState("");
	const [memeTemplates, setMemeTemplates] = useState([]);
	const dispatch = useDispatch();

	const { readTable, writeTable, createTable } = useTableland();
	const { wallets } = useWallets();
	const wallet = wallets[0]; // Replace this with your desired wallet

	const [FrameID, setFrameID] = useState();

	const [formData, setFormData] = useState({
		title: "",
		userId: "",
		imagelink: "",
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const [selectedFile, setSelectedFile] = useState();
	const changeHandler = (event) => {
		setSelectedFile(event.target.files[0]);
	};

	function dragMoveListener(event) {
		var target = event.target;
		// keep the dragged position in the data-x/data-y attributes
		var x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
		var y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;

		// translate the element
		target.style.transform = "translate(" + x + "px, " + y + "px)";

		// update the posiion attributes
		target.setAttribute("data-x", x);
		target.setAttribute("data-y", y);
	}

	const downloadMeme = () => {
		html2canvas(imageContainer.current).then(function (canvas) {
			canvas.toBlob((blob) => saveAs(blob, `memecaster-${Date.now()}.png`));
		});
	};

	// const saevFrame = async () => {
	// 	try {
	// 		const response = await axios.post(
	// 			"http://localhost:3000/api/user-meme-frame",
	// 			formData,
	// 		);
	// 		console.log(response.data); // Log response data if needed
	// 		// Clear form data after successful submission
	// 		setFormData({
	// 			title: "",
	// 			userId: "",
	// 			imagelink: "",
	// 		});
	// 	} catch (error) {
	// 		console.error("Error submitting meme:", error);
	// 	}
	// };

	const saveMeme = async () => {
		try {
			html2canvas(imageContainer.current).then(async function (canvas) {
				const blob = await new Promise((resolve) => canvas.toBlob(resolve));
				console.log("blob ", blob);
				const hash = await uploadToPinata(blob); // Call the function to upload blob to Pinata and get the hash
				console.log("hash=====>>>", hash);
				if (hash && hash?.length) {
					const imagelink = await `https://${
						import.meta.env.VITE_GATEWAY_URL
					}/ipfs/${hash}`;

					// Update formData with imagelink
					setFormData({
						...formData,
						imagelink: imagelink,
					});

					// await writeTable({
					// 	user_address: user?.wallet?.address,
					// 	f_id: user?.wallet?.address,
					// 	title: formData.title,
					// 	tags: "fruits,mango",
					// 	uri: imagelink,
					// 	uri_type: "pinta",
					// });

					const chainId = wallet?.chainId?.split(":")[1];
					const userAddress = user.wallet?.address;
					console.log("user address", userAddress);
					console.log("chainid", chainId);
					//save frame
					const response = await axios.post(
						`${import.meta.env.VITE_FRAME_URL}/api/user-meme-frame`,
						{
							imageUrl: imagelink,
							address: userAddress,
							networkId: chainId,
						},
					);

					setPinataImageLink(imagelink);
					console.log("pinataImgLink =>>>>>> is", pinataImgLink);
					console.log("user meme frame=======>>>>>", response.data.insertedId);
					setFrameID(response.data.insertedId);
					// Clear form data after successful submission
					// setFormData({
					// 	title: "",
					// 	userId: "",
					// 	imagelink: "",
					// });
					toast.success("Saved successful now you can cast..!");
				} else {
					toast.error("Error uploading image to Pinata.");
				}
			});
		} catch (error) {
			toast.error("Error submitting meme:", error);
		}
	};

	const [submissionData, setSubmissionData] = useState({
		imageUrl:
			"https://amaranth-alleged-lynx-757.mypinata.cloud/ipfs/QmfKKcHzJD6mfZpvXiA1o2pc6zydY7gsPsujf7AqkjXC9a",
		networkId: wallet?.chainId?.split(":")[1],
		address: user?.wallet?.address,
		contest: contestId,
	});

	const handleuUploadSubmission = async () => {
		try {
			console.log("submissiondata usestate=========>>>>>>>", submissionData);
			const response = await axios.post(
				`${import.meta.env.VITE_FRAME_URL}/api/contest/user-frame-mapping`,
				submissionData,
			);
			console.log("wefdsnlcontest", contest);
			console.log(
				"submission to participate data =======>>>>> ",
				response.data,
				contest,
			); // handle success response
			const contractResponse = await submissionContractCall(formData);
			console.log("contract response:", contractResponse);
		} catch (error) {
			console.error("eror in paricipating=======>>>>>>>>", error);
		}
	};

	const submissionContractCall = async (formData) => {
		console.log("form data ========>>>>>", formData);
		console.log("contest", contest.campaignAddress);
		const provider = new providers.Web3Provider(window.ethereum);
		const signer = provider.getSigner();

		const campaignContractAddress = contest?.campaignAddress;
		const campaign = new ethers.Contract(
			campaignContractAddress,
			CampaignAbi,
			signer,
		);
		try {
			const result = await campaign.createSubmission(
				submissionData.imageUrl,
				formData.title,
			);
			console.log("Method call result:", result);
		} catch (error) {
			console.error("Error calling method:", error);
		}
	};

	const uploadToPinata = async (blob) => {
		try {
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
		}
	};

	const useTemplate = (e) => {
		if (!e.target.src) return;
		// const { width, height } = getComputedStyle(offScreenImage.current);
		const { width: ContainerWidth } = getComputedStyle(imageContainer.current);
		offScreenImage.current.src = e.target.src;
		const width = offScreenImage.current.width;
		const height = offScreenImage.current.height;
		const ratio = width / height;
		const newHeight = parseFloat(ContainerWidth) / ratio;
		imageContainer.current.style.height = newHeight + "px";
		setMemeTemplate(e.target.src);
	};

	const deleteSelected = (e) => {
		if (selectedText) {
			document.querySelector(`#${selectedText}`).remove();
		}
	};

	const addFile = async () => {
		try {
			const selectedFile = await selectFile("png, jpg");
			const fileReader = new FileReader();
			fileReader.readAsDataURL(selectedFile);

			fileReader.onload = function (oEvnt) {
				const newImage = document.createElement("img");
				newImage.src = oEvnt.target.result;
				newImage.setAttribute("alt", ".");
				const random_id = "meme-" + uuid();
				newImage.setAttribute("id", random_id);
				imageContainer.current.append(newImage);

				interactIcon(random_id);
				dispatch(closeModal());
			};
		} catch (error) {
			console.log(error);
		}
	};

	function interactIcon(id) {
		interact(`#${id}`)
			.on("tap", (e) => {
				// set state of to manipulate the element from the toolkit
			})
			.resizable({
				edges: { top: true, left: true, bottom: true, right: true },
				listeners: {
					move: function (event) {
						let { x, y } = event.target.dataset;

						x = (parseFloat(x) || 0) + event.deltaRect.left;
						y = (parseFloat(y) || 0) + event.deltaRect.top;

						Object.assign(event.target.style, {
							width: `${event.rect.width}px`,
							height: `${event.rect.height}px`,
							transform: `translate(${x}px, ${y}px)`,
						});

						Object.assign(event.target.dataset, { x, y });
					},
				},
			})
			.draggable({
				// enable inertial throwing
				inertia: true,
				// keep the element within the area of it's parent
				modifiers: [
					interact.modifiers.restrictRect({
						restriction: "parent",
						endOnly: true,
					}),
				],
				// enable autoScroll
				autoScroll: true,

				listeners: {
					// call this function on every dragmove event
					move: dragMoveListener,

					// call this function on every dragend event
					end(event) {
						// -------
					},
				},
			});
	}

	const AddImageToCanvas = (e) => {
		dispatch(
			showModal(<AddIconForm addFile={addFile} addIcon={AddIconToCanvas} />),
		);
	};

	const AddIconToCanvas = (e) => {
		const newImage = document.createElement("img");
		// newImage.src = templateFive;
		newImage.src = e.target.src;
		newImage.setAttribute("alt", ".");
		const random_id = "meme-" + uuid();
		newImage.setAttribute("id", random_id);
		imageContainer.current.append(newImage);
		dispatch(closeModal());

		interactIcon(random_id);
	};

	const AddTextToCanvas = (e) => {
		const newText = document.createElement("div");
		const random_id = "meme-" + uuid();
		newText.setAttribute("id", random_id);
		newText.toggleAttribute("data-text-underlined");
		newText.toggleAttribute("data-text-bold");
		newText.toggleAttribute("data-text-italics");
		newText.classList.add("meme_text");
		newText.innerText = "Enter text here...";
		newText.contentEditable = true;
		imageContainer.current.append(newText);
		newText.focus();

		// Text's are not resizable but are draggle. To change size of text use the toolkit
		interact(`#${random_id}`)
			.on("tap", (e) => {
				// set state of to manipulate the element from the toolkit
				setSelectedText(random_id);
				setCurrentText(e.target.innerText);
			})
			.on("keypress", (e) => {
				setCurrentText(e.target.innerText);
			})
			.draggable({
				// enable inertial throwing
				inertia: true,
				// keep the element within the area of it's parent
				modifiers: [
					interact.modifiers.restrictRect({
						restriction: "parent",
						endOnly: true,
					}),
				],
				// enable autoScroll
				autoScroll: true,

				listeners: {
					// call this function on every dragmove event
					move: dragMoveListener,

					// call this function on every dragend event
					end(event) {
						// -------
					},
				},
			});
	};

	// Reset selections
	const removeSelections = () => {
		setSelectedText("");
	};

	// Text functions
	const textFunctions = {
		toggleBold: function () {
			if (!selectedText) return;
			const textElem = document.querySelector(`#${selectedText}`);
			if (!textElem) return setSelectedText("");
			textElem.toggleAttribute("data-text-bold");
			if (textElem.hasAttribute("data-text-bold")) {
				textElem.style.fontWeight = "bolder";
				return;
			}
			textElem.style.fontWeight = "normal";
		},
		toggleItalics: function () {
			if (!selectedText) return;
			const textElem = document.querySelector(`#${selectedText}`);
			if (!textElem) return setSelectedText("");
			textElem.toggleAttribute("data-text-italic");
			if (textElem.hasAttribute("data-text-italic")) {
				textElem.style.fontStyle = "italic";
				return;
			}
			textElem.style.fontStyle = "normal";
		},
		toggleUnderline: function () {
			if (!selectedText) return;
			const textElem = document.querySelector(`#${selectedText}`);
			if (!textElem) return setSelectedText("");
			textElem.toggleAttribute("data-text-underlined");
			if (textElem.hasAttribute("data-text-underlined")) {
				textElem.style.textDecoration = "underline";
				return;
			}
			textElem.style.textDecoration = "none";
		},
		changeText: function (e) {
			setCurrentText(e.target.value);
			const textElem = document.getElementById(selectedText);
			if (!textElem) return setSelectedText("");
			textElem.innerText = e.target.value;
		},
		changeTextSize: function (e) {
			if (!selectedText) return;
			const textElem = document.querySelector(`#${selectedText}`);
			if (!textElem) return setSelectedText("");
			textElem.style.fontSize = `${e.target.value}px`;
		},
		changeTextColor: function (e) {
			if (!selectedText) return;
			const textElem = document.querySelector(`#${selectedText}`);
			if (!textElem) return setSelectedText("");
			textElem.style.color = e.target.value;
		},
		justify: function (e) {
			console.log(e.target.dataset["justification"]);
			if (!selectedText) return;
			const textElem = document.querySelector(`#${selectedText}`);
			if (!textElem) return setSelectedText("");
			textElem.style.textAlign = e.target.dataset["justification"];
		},
	};

	return (
		<Container>
			{/*  */}
			{contest?.title ? (
				<>
					<h2
						style={{
							textAlign: "center",
							marginTop: "10px",
						}}
					>
						You are now participating in {contest.title}
					</h2>
					<p
						style={{
							textAlign: "center",
							marginBottom: "20px",
						}}
					>
						Create your meme and submit now
					</p>
				</>
			) : (
				" "
			)}
			{/* <h2 style={{}}>You are participating in {contest.title}</h2> */}
			<Flex>
				{/* Editing View */}
				<div className="editContainer">
					<img
						style={{ borderRadius: "5px" }}
						src="."
						alt="off-screen"
						hidden
						ref={offScreenImage}
					/>
					<EditView
						ref={imageContainer}
						className="editorView"
						style={{
							backgroundImage: `url(${memeTemplateView})`,
							height: "290px",
							borderRadius: "0.2rem",
						}}
					></EditView>
					<div style={{ display: "flex", justifyContent: "center" }}>
						<input
							className="text btn btn-light"
							type="text"
							name="title"
							placeholder="Write your meme Title here"
							value={formData.title}
							onChange={handleChange}
							style={{
								width: "100%",
								marginTop: "20px",
								height: "35px",
								border: "1px solid #E5E7EB",
								padding: "15px",
							}}
						/>
						{/* <input
							type="text"
							name="userId"
							placeholder="User ID"
							value={formData.userId}
							onChange={handleChange}
						/> */}
					</div>
					<Actions>
						<ActionButton
							style={{ backgroundColor: "black", color: "white" }}
							className="btn"
							onClick={downloadMeme}
						>
							Download <i className="fas fa-cloud-arrow-down"></i>
						</ActionButton>
						{/* <ActionButton
							style={{ backgroundColor: "green", color: "white" }}
							className="btn btn-tertiary"
							onClick={handleSubmit}
						>
							Save <i className="fas fa-save"></i>
						</ActionButton> */}
						<ActionButton
							style={{ backgroundColor: "green", color: "white" }}
							className="btn btn-tertiary"
							onClick={saveMeme}
						>
							Save <i className="fas fa-save"></i>
						</ActionButton>

						<ActionButton className="btn btn-primary">
							<a
								target="_blank"
								href={`https://warpcast.com/~/compose?embeds[]=${
									import.meta.env.VITE_FRAME_URL
								}/api/frame/${FrameID}`}
								// style={{  color: "white" }}
							>
								<b> Cast</b> <i className="fas fa-share-from-square"></i>
							</a>{" "}
						</ActionButton>
					</Actions>
					<Actions>
						{contest?.title ? (
							<ActionButton
								style={{ width: "100%" }}
								className="btn btn-primary"
								onClick={handleuUploadSubmission}
							>
								<b> Submit to Participate</b>
							</ActionButton>
						) : (
							" "
						)}
					</Actions>
				</div>

				{/* Editing Controls */}
				<Controls>
					<Actions>
						<ActionButton className="btn btn-light" onClick={AddTextToCanvas}>
							Add Text <i className="fas fa-text-height"></i>
						</ActionButton>
						<ActionButton className="btn btn-light" onClick={AddImageToCanvas}>
							Add Image <i className="fas fa-image"></i>
						</ActionButton>
					</Actions>

					<div className="text">
						<textarea
							type="text"
							onChange={textFunctions.changeText}
							value={currentText}
							placeholder="Click on add to text and write your text here .."
						/>
					</div>
					<div
						style={{
							borderRadius: "0.5rem",

							border: "1px solid #E5E7EB",
							marginBottom: "10px",
						}}
					>
						<HomeCategory>
							<div className="categoryHeader">
								<h2>Meme Templates</h2>
								<div className="categoryOptions">
									<select className="category" name="category" id="category">
										<option defaultValue="Latest">Latest</option>
										<option defaultValue="Trending">Trending</option>
										<option defaultValue="Downloads">Downloads</option>
									</select>
								</div>
							</div>

							{/* Meme Templates */}
							<div className="memeTemplates">
								{/* {memeTemplates.map((i) => (
						<div className="card" key={i.id} onClick={useTemplate}>
							<LazyLoadImage
								src={i.image_link}
								alt="Memster Template"
								effect="blur"
							/>
							<h3 className="tag">{i.title}</h3>
						</div>
					))} */}
								<div className="card" onClick={useTemplate}>
									<LazyLoadImage
										src={temp1}
										alt="Memster Template"
										effect="blur"
									/>
								</div>
								<div className="card" onClick={useTemplate}>
									<LazyLoadImage
										src={temp2}
										alt="Memster Template"
										effect="blur"
									/>
								</div>
								<div className="card" onClick={useTemplate}>
									<LazyLoadImage
										src={temp3}
										alt="Memster Template"
										effect="blur"
									/>
									<h3 className="tag">Distracted Boyfriend</h3>
								</div>
								<div className="card" onClick={useTemplate}>
									<LazyLoadImage
										src={temp4}
										alt="Memster Template"
										effect="blur"
									/>
									<h3 className="tag">Two Buttons</h3>
								</div>
								<div className="card" onClick={useTemplate}>
									<LazyLoadImage
										src={temp5}
										alt="Memster Template"
										effect="blur"
									/>
									<h3 className="tag">Finding Neverland</h3>
								</div>
								<div className="card" onClick={useTemplate}>
									<LazyLoadImage
										src={temp6}
										alt="Memster Template"
										effect="blur"
									/>
									<h3 className="tag">Woman Yelling At Cat</h3>
								</div>
								<div className="card" onClick={useTemplate}>
									<LazyLoadImage
										src={temp7}
										alt="Memster Template"
										effect="blur"
									/>
									<h3 className="tag">Leonardo Dicaprio Cheers</h3>
								</div>
								<div className="card" onClick={useTemplate}>
									<LazyLoadImage
										src={temp8}
										alt="Memster Template"
										effect="blur"
									/>
									<h3 className="tag">Charlie Conspiracy</h3>
								</div>
								<div className="card" onClick={useTemplate}>
									<LazyLoadImage
										src={temp9}
										alt="Memster Template"
										effect="blur"
									/>
									<h3 className="tag">I am once again asking</h3>
								</div>
								<div className="card" onClick={useTemplate}>
									<LazyLoadImage
										src={temp10}
										alt="Memster Template"
										effect="blur"
									/>
									<h3 className="tag">Drake Hotline Bling</h3>
								</div>
							</div>
						</HomeCategory>
					</div>

					{/* Font Size */}
					<div
						style={{
							borderRadius: "0.5rem",
							padding: "1rem",
							border: "1px solid #E5E7EB",
							marginBottom: "10px",
						}}
					>
						<div className="formatting">
							{/* Bold, Italics, and Underline */}
							<div className="styling">
								<p>Font Style:</p>
								<div>
									<button className="bold" onClick={textFunctions.toggleBold}>
										B
									</button>
									<button
										className="italic"
										onClick={textFunctions.toggleItalics}
									>
										I
									</button>
									<button
										className="underline"
										onClick={textFunctions.toggleUnderline}
									>
										U
									</button>
								</div>
							</div>

							<div>
								<p>Font size:</p>
								<input
									type="text"
									defaultValue={16}
									maxLength={3}
									onChange={textFunctions.changeTextSize}
								/>
							</div>

							<div>
								<p>Font color:</p>
								<input
									type="color"
									defaultValue="#ffffff"
									onChange={textFunctions.changeTextColor}
								></input>
							</div>
						</div>
						<div className="formatting">
							{/* Text alignment */}
							<div className="styling">
								<p>Text alignment:</p>
								<div>
									<button
										className="leftAlign"
										onClick={textFunctions.justify}
										data-justification="left"
									>
										<i className="fas fa-align-left"></i>
									</button>
									<button
										className="midAlign"
										onClick={textFunctions.justify}
										data-justification="center"
									>
										<i className="fas fa-align-center"></i>
									</button>
									<button
										className="rightAlign"
										onClick={textFunctions.justify}
										data-justification="right"
									>
										<i className="fas fa-align-right"></i>
									</button>
								</div>
							</div>

							{/* Stroke */}
							<div>
								<p>Stroke width:</p>
								<div className="inputStroke">
									<input type="text" defaultValue="0" />
								</div>
							</div>

							<div>
								<p>Stroke color:</p>
								<div className="inputStroke">
									<input type="color" defaultValue="#000000" />
								</div>
							</div>
						</div>
						<div style={{ marginLeft: "5px", marginTop: "10px" }}>
							<ActionButton className="btn delete" onClick={deleteSelected}>
								Delete <i className="fas fa-delete-from-square"></i>
							</ActionButton>
						</div>
					</div>
				</Controls>
			</Flex>
			<FileButtons></FileButtons>
		</Container>
	);
}
