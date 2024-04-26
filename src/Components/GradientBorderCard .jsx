import React from "react";

const GradientBorderCard = ({ children }) => {
	const cardStyle = {
		position: "relative",
		padding: "20px",
		borderRadius: "20px",
		backgroundColor: "white",
		margin: "5px",
		overflow: "hidden",
	};

	const containerStyle = {
		backgroundColor: "#FFCF4B",
		width: "calc(33% - 10px)", // Adjusted width for two cards in a row with margin
		marginBottom: "10px",
		padding: "5px",
        borderRadius: "3px",
        marginRight:"10px",
		display: "inline-block", // Display inline-block to put cards in a row
        boxSizing: "border-box", // Ensure padding and border are included in width calculation
	};

	return (
		<>
			<div style={containerStyle}>
				<div style={cardStyle}>{children}</div>
			</div>
		</>
	);
};

export default GradientBorderCard;
