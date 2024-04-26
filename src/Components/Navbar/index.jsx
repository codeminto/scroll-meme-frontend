import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { usePrivy, useWallets } from "@privy-io/react-auth";

const Nav = styled.nav`
	background: var(--bg-light);
	border-bottom: var(--border-light);
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 80px;
	padding: 0 1.5rem;
	font-size: var(--font-xsmall);
	z-index: 5;

	.navbar {
		max-width: 1200px;
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: nowrap;
		.logo {
			display: flex;
			align-items: center;
		}
	}

	.logo {
		display: flex;
		align-items: center;
		margin: 1.5rem 0;
	}

	.nav-menu {
		display: flex;
		align-items: center;

		.hide {
			display: none;
		}
	}

	/* Navbar links */
	.nav-links {
		padding: 0.7rem 1rem;
		transition: all 0.2s ease-out;
		margin-right :10px;
	}

	.fa-bars-staggered {
		font-size: 1.5rem;
	}

	.fa-angle-down {
		margin-left: 0.2rem;

		@media (max-width: 800px) {
			display: none;
		}
	}

	.nav-links-mobile {
		display: none;
	}

	.menu-icon {
		display: none;
	}

	@media (max-width: 800px) {
		.nav-menu {
			display: flex;
			align-items: stretch;
			justify-content: center;
			flex-direction: column;
			min-width: 400px;
			min-height: 200px;
			position: absolute;
			top: 75px;
			right: -100%;
			opacity: 1;
			transition: 0.2s cubic-bezier(0.98, 0.01, 0, 0.96);
			box-shadow: var(--shadow-primary);
			border: var(--border-mid);
			border-radius: 3px;
			padding: 0.5rem 0;

			.hide {
				display: inherit;
			}
		}

		/* Dropdown bubble  */
		.nav-menu::before {
			content: "";
			position: absolute;
			width: 0;
			height: 0;
			bottom: 100%;
			right: 8px;
			border: 0.8rem solid transparent;
			border-bottom-color: #fff;
			filter: drop-shadow(0 -0.0625rem 0.0625rem rgba(0, 0, 10, 0.1));
		}

		.nav-menu.active {
			background: var(--bg-light);
			right: 10px;
			opacity: 1;
			transition: all 0.2s cubic-bezier(0.2, 0.01, 0, 1);
			z-index: 55;
		}

		.nav-item {
			font-size: 0.9rem;
			margin: 1.5rem 1rem 0;

			&:nth-child(3) {
				margin-bottom: 0.5rem;
			}
		}

		.menu-icon {
			display: block;
			cursor: pointer;
			margin-left: 1rem;
		}

		.nav-links-mobile {
			display: block;
			margin: 1rem auto 1.5rem;
			border-radius: 3px;
			width: 80%;
			text-align: center;
		}

		button {
			display: none;
		}
	}
`;

const Container = styled.div`
	max-width: 1200px;
	margin: 0 auto;
	display: flex;
	align-items: center;
	justify-content: space-between;

	.logo {
		display: flex;
		align-items: center;
	}

	@media (max-width: 800px) {
		.hidden {
			display: none;
		}
	}
`;

const NavContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
`;

const Create = styled.div`
	margin-right: 1rem;
`;

const SubMenu = styled.ul`
	position: absolute;
	top: calc(100% + 10px); /* Adjusted positioning */
	// left: 50%; /* Adjusted positioning */
	transform: translateX(-50%); /* Adjusted positioning */
	background-color: #fff;
	padding: 10px 0;
	border-radius: 5px;
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
	z-index: 10;
	width: 200px;
`;

const SubMenuItem = styled.li`
	list-style: none;
	padding: 10px 20px;
	cursor: pointer;

	&:hover {
		background-color: #f0f0f0;
	}

	a {
		text-decoration: none;
		color: #333;
	}
`;

function Navbar() {
	const [showSubMenu, setShowSubMenu] = useState(false);
	const { ready, authenticated, user, logout } = usePrivy();
	const { wallets } = useWallets();
	const wallet = wallets[0]; // Replace this with your desired wallet
	const networkID = wallet ? wallet.chainId?.split(":")[1] : null;
	const userAddress = user ? user.wallet?.address : null;

	const toggleSubMenu = () => {
		setShowSubMenu(!showSubMenu);
	};

	const closeMobileMenu = () => {
		setShowSubMenu(false);
	};

	return (
		<Nav>
			<Container className="navbar">
				<a href="/" className="logo" onClick={closeMobileMenu}>
					<img
						src="/images/logo.png"
						alt="logo"
						width="40px"
						height="40px"
						loading="eager"
					/>
					<span className="hidden">Memester</span>
				</a>
				<NavContainer>
					<ul className="nav-menu">
						<li>
							<Link
								to={`/`}
								className="btn btn-light nav-links"
								onClick={closeMobileMenu}
							>
								<i className="fa fa-home"> </i>
								{" "}
								<b>Home</b>
							</Link>
						</li>
						<li>
							<Link
								to={`/create-meme`}
								className="btn btn-light nav-links"
								onClick={closeMobileMenu}
							>
								<b>Create Meme</b>
							</Link>
						</li>
						<li>
							<Link
								to={`/mymemes`}
								className="btn btn-light nav-links"
								onClick={closeMobileMenu}
							>
								<b>My Memes List</b>
							</Link>
						</li>
						<li>
							<span className="btn btn-light nav-links" onClick={toggleSubMenu}>
								<b>Contest </b>
								<i
									className={
										showSubMenu ? "fas fa-chevron-up" : "fas fa-chevron-down"
									}
									style={{ marginLeft: "5px" }}
								/>
							</span>
							{showSubMenu && (
								<SubMenu>
									<Link to={`/create-contest`} onClick={closeMobileMenu}>
										<SubMenuItem>
											<b>Create Contest</b>
										</SubMenuItem>
									</Link>

									<SubMenuItem>
										<Link to={`/contest-list`} onClick={closeMobileMenu}>
											<b>All Contests</b>
										</Link>
									</SubMenuItem>
									<SubMenuItem>
										<Link
											to={`/mycontest/${userAddress}`}
											onClick={closeMobileMenu}
										>
											<b>My Contests</b>
										</Link>
									</SubMenuItem>
								</SubMenu>
							)}
						</li>
					</ul>
					{ready && authenticated ? (
						<a
							style={{ marginRight: "5px" }}
							className="btn btn-primary highlight"
						>
							@{user.farcaster ? user.farcaster.username : ""}
						</a>
					) : (
						<a
							style={{ marginRight: "5px" }}
							className="btn btn-primary highlight"
						>
							@
						</a>
					)}
					{ready && authenticated ? (
						<a className="btn btn-primary highlight" onClick={logout}>
							<b> Logout</b>
						</a>
					) : (
						<Link to={`/login`} onClick={closeMobileMenu}>
							<a className="btn btn-primary highlight">
								<b> Login</b>
							</a>
						</Link>
					)}
					<div className="menu-icon" onClick={toggleSubMenu}>
						<i
							className={
								showSubMenu ? "fas fa-chevron-up" : "fas fa-chevron-down"
							}
						/>
					</div>
				</NavContainer>
			</Container>
		</Nav>
	);
}

export default Navbar;
