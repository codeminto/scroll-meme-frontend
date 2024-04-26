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
import temp11 from "../../assets/images/memeTemplate/temp11.png";
import temp12 from "../../assets/images/memeTemplate/temp12.png";
import temp13 from "../../assets/images/memeTemplate/temp13.png";
import temp14 from "../../assets/images/memeTemplate/temp14.png";
import temp15 from "../../assets/images/memeTemplate/temp15.png";
import temp16 from "../../assets/images/memeTemplate/temp16.png";
import temp17 from "../../assets/images/memeTemplate/temp17.png";
import temp18 from "../../assets/images/memeTemplate/temp18.png";
import temp19 from "../../assets/images/memeTemplate/temp19.png";
import temp20 from "../../assets/images/memeTemplate/temp20.png";
import temp21 from "../../assets/images/memeTemplate/temp21.png";
import temp22 from "../../assets/images/memeTemplate/temp22.png";
import temp23 from "../../assets/images/memeTemplate/temp23.png";
import temp24 from "../../assets/images/memeTemplate/temp24.png";
import temp25 from "../../assets/images/memeTemplate/temp25.png";
import temp26 from "../../assets/images/memeTemplate/temp26.png";
import temp27 from "../../assets/images/memeTemplate/temp27.png";
import temp28 from "../../assets/images/memeTemplate/temp28.png";
import temp29 from "../../assets/images/memeTemplate/temp29.png";
import temp30 from "../../assets/images/memeTemplate/temp30.png";
import temp31 from "../../assets/images/memeTemplate/temp31.png";
import temp32 from "../../assets/images/memeTemplate/temp32.png";
import temp33 from "../../assets/images/memeTemplate/temp33.png";
import temp34 from "../../assets/images/memeTemplate/temp34.png";
import temp35 from "../../assets/images/memeTemplate/temp35.png";
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
import { usePrivy } from "@privy-io/react-auth";

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
	const imageContainer = useRef();
	const offScreenImage = useRef();
	const [memeTemplateView, setMemeTemplate] = useState(temp1);
	const [selectedText, setSelectedText] = useState(""); // Id of generated element
	const [currentText, setCurrentText] = useState("");
	const [memeTemplates, setMemeTemplates] = useState([]);
	const dispatch = useDispatch();

	const { ready, authenticated, user, logout } = usePrivy();
	const [formData, setFormData] = useState({
		title: "",
		userId: "",
		imagelink: "",
	} );
	
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
	
	const handleuUploadSubmission = async () => {
		try {
			const formData = new FormData();
			formData.append("file", selectedFile);
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
			console.log(resData);
		} catch (error) {
			console.log(error);
		}
	};

	

	function dragMoveListener ( event )
	{
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

	const handleSubmit = async () => {
		try {
			const response = await axios.post(
				"http://localhost:5000/meme/create",
				formData,
			);
			console.log(response.data); // Log response data if needed
			// Clear form data after successful submission
			setFormData({
				title: "",
				userId: "",
				imagelink: "",
			});
		} catch (error) {
			console.error("Error submitting meme:", error);
		}
	};


	const saveMeme = async () => {
		try {
			html2canvas(imageContainer.current).then(async function (canvas) {
				const blob = await new Promise((resolve) => canvas.toBlob(resolve));
				const hash = await uploadToPinata(blob); // Call the function to upload blob to Pinata and get the hash
				console.log("hash=====>>>", hash);
				if (hash) {
					const imagelink = await `${
						import.meta.env.VITE_GATEWAY_URL
					}/ipfs/${hash}`;
					console.log("imagelink is", imagelink);

					// Update formData with imagelink
					setFormData({
						...formData,
						imagelink: imagelink,
					});

					const response = await axios.post(
						"http://localhost:5000/meme/create",
						formData,
					);
					console.log(response.data); // Log response data if needed

					// Clear form data after successful submission
					setFormData({
						title: "",
						userId: "",
						imagelink: "",
					});
				} else {
					console.error("Error uploading image to Pinata.");
				}
			});
		} catch (error) {
			console.error("Error submitting meme:", error);
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
			console.log("ipfshash========>>>>>>",resData.IpfsHash);
			 return resData.IpfsHash; 
		} catch (error) {
			console.log(error);
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
						<LazyLoadImage src={temp1} alt="Memster Template" effect="blur" />
						<h3 className="tag">X, X Everywhere</h3>
					</div>
					<div className="card" onClick={useTemplate}>
						<LazyLoadImage src={temp2} alt="Memster Template" effect="blur" />
						<h3 className="tag">Success Kid</h3>
					</div>
					<div className="card" onClick={useTemplate}>
						<LazyLoadImage src={temp3} alt="Memster Template" effect="blur" />
						<h3 className="tag">Distracted Boyfriend</h3>
					</div>
					<div className="card" onClick={useTemplate}>
						<LazyLoadImage src={temp4} alt="Memster Template" effect="blur" />
						<h3 className="tag">Two Buttons</h3>
					</div>
					<div className="card" onClick={useTemplate}>
						<LazyLoadImage src={temp5} alt="Memster Template" effect="blur" />
						<h3 className="tag">Finding Neverland</h3>
					</div>
					<div className="card" onClick={useTemplate}>
						<LazyLoadImage src={temp6} alt="Memster Template" effect="blur" />
						<h3 className="tag">Woman Yelling At Cat</h3>
					</div>
					<div className="card" onClick={useTemplate}>
						<LazyLoadImage src={temp7} alt="Memster Template" effect="blur" />
						<h3 className="tag">Leonardo Dicaprio Cheers</h3>
					</div>
					<div className="card" onClick={useTemplate}>
						<LazyLoadImage src={temp8} alt="Memster Template" effect="blur" />
						<h3 className="tag">Charlie Conspiracy</h3>
					</div>
					<div className="card" onClick={useTemplate}>
						<LazyLoadImage src={temp9} alt="Memster Template" effect="blur" />
						<h3 className="tag">I am once again asking</h3>
					</div>
					<div className="card" onClick={useTemplate}>
						<LazyLoadImage src={temp10} alt="Memster Template" effect="blur" />
						<h3 className="tag">Drake Hotline Bling</h3>
					</div>
					<div className="card" onClick={useTemplate}>
						<LazyLoadImage src={temp11} alt="Memster Template" effect="blur" />
						<h3 className="tag">Futurama Fry</h3>
					</div>
					<div className="card" onClick={useTemplate}>
						<LazyLoadImage src={temp12} alt="Memster Template" effect="blur" />
						<h3 className="tag">Monkey Puppet</h3>
					</div>
					<div className="card" onClick={useTemplate}>
						<LazyLoadImage src={temp13} alt="Memster Template" effect="blur" />
						<h3 className="tag">Bike Fall</h3>
					</div>
					<div className="card" onClick={useTemplate}>
						<LazyLoadImage src={temp14} alt="Memster Template" effect="blur" />
						<h3 className="tag">Guy Holding Sign</h3>
					</div>
					<div className="card" onClick={useTemplate}>
						<LazyLoadImage src={temp15} alt="Memster Template" effect="blur" />
						<h3 className="tag">Clown Applying Makeup</h3>
					</div>
					<div className="card" onClick={useTemplate}>
						<LazyLoadImage src={temp16} alt="Memster Template" effect="blur" />
						<h3 className="tag">One Does Not Simply</h3>
					</div>
					<div className="card" onClick={useTemplate}>
						<LazyLoadImage src={temp17} alt="Memster Template" effect="blur" />
						<h3 className="tag">They're The Same Picture</h3>
					</div>
					<div className="card" onClick={useTemplate}>
						<LazyLoadImage src={temp18} alt="Memster Template" effect="blur" />
						<h3 className="tag">Hide the Pain Harold</h3>
					</div>
					<div className="card" onClick={useTemplate}>
						<LazyLoadImage src={temp19} alt="Memster Template" effect="blur" />
						<h3 className="tag">Left Exit 12 Off Ramp</h3>
					</div>
					<div className="card" onClick={useTemplate}>
						<LazyLoadImage src={temp20} alt="Memster Template" effect="blur" />
						<h3 className="tag">Always Has Been</h3>
					</div>
					<div className="card" onClick={useTemplate}>
						<LazyLoadImage src={temp21} alt="Memster Template" effect="blur" />
						<h3 className="tag">Epic Handshake</h3>
					</div>
					<div className="card" onClick={useTemplate}>
						<LazyLoadImage src={temp22} alt="Memster Template" effect="blur" />
						<h3 className="tag">Sad Pablo Escobar</h3>
					</div>
					<div className="card" onClick={useTemplate}>
						<LazyLoadImage src={temp23} alt="Memster Template" effect="blur" />
						<h3 className="tag">Disaster Girl</h3>
					</div>
					<div className="card" onClick={useTemplate}>
						<LazyLoadImage src={temp24} alt="Memster Template" effect="blur" />
						<h3 className="tag">Here?</h3>
					</div>
					<div className="card" onClick={useTemplate}>
						<LazyLoadImage src={temp25} alt="Memster Template" effect="blur" />
						<h3 className="tag">Think About it</h3>
					</div>
					<div className="card" onClick={useTemplate}>
						<LazyLoadImage src={temp26} alt="Memster Template" effect="blur" />
						<h3 className="tag">Slap Button</h3>
					</div>
					<div className="card" onClick={useTemplate}>
						<LazyLoadImage src={temp27} alt="Memster Template" effect="blur" />
						<h3 className="tag">Panik Calm Panik</h3>
					</div>
					<div className="card" onClick={useTemplate}>
						<LazyLoadImage src={temp28} alt="Memster Template" effect="blur" />
						<h3 className="tag">Is this a Pigeon</h3>
					</div>
					<div className="card" onClick={useTemplate}>
						<LazyLoadImage src={temp29} alt="Memster Template" effect="blur" />
						<h3 className="tag">The Scroll Of Truth</h3>
					</div>
					<div className="card" onClick={useTemplate}>
						<LazyLoadImage src={temp30} alt="Memster Template" effect="blur" />
						<h3 className="tag">Who shot Hannibal</h3>
					</div>
					<div className="card" onClick={useTemplate}>
						<LazyLoadImage src={temp31} alt="Memster Template" effect="blur" />
						<h3 className="tag">Evil Kermit</h3>
					</div>
					<div className="card" onClick={useTemplate}>
						<LazyLoadImage src={temp32} alt="Memster Template" effect="blur" />
						<h3 className="tag">Unesttled Tom</h3>
					</div>
					<div className="card" onClick={useTemplate}>
						<LazyLoadImage src={temp33} alt="Memster Template" effect="blur" />
						<h3 className="tag">Ight Imma Head Out</h3>
					</div>
					<div className="card" onClick={useTemplate}>
						<LazyLoadImage src={temp34} alt="Memster Template" effect="blur" />
						<h3 className="tag">I Should Buy A Boat Cat</h3>
					</div>
					<div className="card" onClick={useTemplate}>
						<LazyLoadImage src={temp35} alt="Memster Template" effect="blur" />
						<h3 className="tag">Change My Mind</h3>
					</div>
				</div>
			</HomeCategory>

			{/*  */}
			<Flex>
				{/* Editing View */}
				<div className="editContainer">
					<img src="." alt="off-screen" hidden ref={offScreenImage} />
					<EditView
						ref={imageContainer}
						className="editorView"
						style={{
							backgroundImage: `url(${memeTemplateView})`,
							height: "290px",
						}}
					></EditView>
					<div>
						<input
							type="text"
							name="title"
							placeholder="Title"
							value={formData.title}
							onChange={handleChange}
						/>
						<input
							type="text"
							name="userId"
							placeholder="User ID"
							value={formData.userId}
							onChange={handleChange}
						/>
						
						{/* <button onClick={handleSubmit}>Save</button> */}

						<label className="form-label"> Choose File</label>
						<input type="file" onChange={changeHandler} />
						<button onClick={handleuUploadSubmission}>Submit</button>
					</div>
					<Actions>
						<ActionButton
							style={{ backgroundColor: "black", color: "white" }}
							className="btn"
							onClick={downloadMeme}
						>
							Download <i className="fas fa-cloud-arrow-down"></i>
						</ActionButton>
						<ActionButton
							style={{ backgroundColor: "green", color: "white" }}
							className="btn btn-tertiary"
							onClick={handleSubmit}
						>
							Save <i className="fas fa-save"></i>
						</ActionButton>
						<ActionButton
							style={{ backgroundColor: "green", color: "white" }}
							className="btn btn-tertiary"
							onClick={saveMeme}
						>
							SaveMemew <i className="fas fa-save"></i>
						</ActionButton>

						<ActionButton className="btn btn-primary">
							<a
								target="_blank"
								href="https://warpcast.com/~/compose?embeds[]=https://awesome-open-frames-opal.vercel.app/"
								// style={{  color: "white" }}
							>
								<b> Cast</b> <i className="fas fa-share-from-square"></i>
							</a>{" "}
						</ActionButton>
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
						/>
					</div>

					{/* Font Size */}
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
					<div>
						<ActionButton className="btn delete" onClick={deleteSelected}>
							Delete <i className="fas fa-delete-from-square"></i>
						</ActionButton>
					</div>
				</Controls>
			</Flex>
			<FileButtons></FileButtons>
		</Container>
	);
}
