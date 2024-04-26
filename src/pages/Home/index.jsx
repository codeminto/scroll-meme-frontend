import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import MemeCard from "../../Components/MemeCard";
import InfiniteScroll from "react-infinite-scroller";
// import { LazyLoadImage } from "react-lazy-load-image-component";
import {
	Image,
	Container,
	ContentContainer,
	Content,
	Form,
	Input,
	HomeCategory,
	GridGallery,
} from "./Home.styled";

// import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import ApolloClient from "apollo-boost";
import { InMemoryCache } from "apollo-cache-inmemory";
import gql from "graphql-tag";
import MyMemesList from "../MyMemesList";
import ContestList from "../ContestList";

const client = new ApolloClient({
	uri: import.meta.env.VITE_GRAPHQL_CLIENT,
	cache: new InMemoryCache(),
});

const getCategoriesQuery = gql`
	query getPaginatedMemeCategories {
		meme_categories_aggregate(limit: 10, offset: 0) {
			nodes {
				id
				category_title
				no_of_memes
				thumb_nail
			}
		}

		count: memes_aggregate(offset: 0) {
			aggregate {
				count
			}
		}
	}
`;

const getPaginatedMemes = gql`
	query getPaginatedMemes($limit: Int, $offset: Int) {
		memes_aggregate(limit: $limit, offset: $offset) {
			nodes {
				id
				downloads
				likes
				views
				image_link
				category
				title
			}
		}
	}
`;

const getPaginatedMemeSearch = gql`
	query getPaginatedMemeSearch($searchTerm: String!) {
		memes(limit: 10, offset: 0, where: { category: { _ilike: $searchTerm } }) {
			id
			downloads
			likes
			views
			image_link
			category
			title
		}
	}
`;

export default function Home() {
	const [allMemes, setAllMemes] = useState([]);
	const [categories, setCategories] = useState([]);
	const [count, setCount] = useState();
	const [offset, setOffset] = useState(0);
	const [isInputEmpty, setInputEmpty] = useState(true);

	const loadMemes = () => {
		client
			.query({
				query: getPaginatedMemes,
				variables: { limit: 10, offset: offset },
			})
			.then((result) => {
				const memes = result.data.memes_aggregate.nodes;
				setAllMemes((prev) => prev.concat(memes));
				setCount((prev) => prev - 10);
				setOffset((prev) => prev + 10);
			});
	};

	const loadSearch = (e) => {
		e.preventDefault();
		const searchTerm = e.target.search.value;
		client
			.query({
				query: getPaginatedMemeSearch,
				variables: { searchTerm: `%${searchTerm}%` },
			})
			.then((result) => {
				const memes = result.data.memes;
				setAllMemes(memes);
				setInputEmpty(false);
			});
	};

	// fetch and set meme catehories
	useEffect(() => {
		(async () => {
			client
				.query({
					query: getCategoriesQuery,
				})
				.then((result) => {
					setCategories(result.data.meme_categories_aggregate.nodes);
					setCount(result.data.count.aggregate.count);
				});
		})();
	}, []);

	// Fade top
	const fadeTop = {
		hidden: { opacity: 0, y: -30 },
		visible: { opacity: 1, y: 0 },
	};

	return (
		<Container className="hero">
			<div style={{ display: "flex" }}>
				<div>
					<ContentContainer>
						<Content
							style={{
								paddingLeft: "5rem",
								marginRight: "-60px",
							}}
						>
							<h1>Decentralized Meme Hub</h1>
							<br />
							<Form onSubmit={loadSearch}>
								<Input
									type="search"
									name="search"
									id="Search"
									autocomplete="off"
									placeholder="Search for latest memes"
								/>
								<button
									type="submit"
									className="btn btn-primary highlight"
									aria-label="Search Button"
								>
									<i className="icon fas fa-search"></i>
								</button>
							</Form>
							<motion.h2
								variants={fadeTop}
								initial="hidden"
								animate="visible"
								transition={{ duration: 0.6 }}
								// style={{marginLeft:"5px"}}
							>
								{" "}
								Suggested: meme coin, nft, stackoverflow
								<br />
								<Link to={`/create-meme`}>
									<a
										style={{ marginTop: "10px" }}
										className="btn btn-primary highlight"
									>
										Create Meme Now
									</a>
								</Link>
							</motion.h2>

							<motion.h3
								variants={fadeTop}
								initial="hidden"
								animate="visible"
								transition={{ duration: 0.6 }}
								style={{
									width: "100%",
								}}
							>
								Welcome to Memester Your Ultimate Destination for Memes
								Competitions, and Community Engagement!
							</motion.h3>
						</Content>
					</ContentContainer>
				</div>
				<div>
					<ContentContainer>
						<Content>
							<motion.p
								variants={fadeTop}
								initial="hidden"
								animate="visible"
								transition={{ duration: 0.6 }}
							>
								<img
									// style={{
									// 	margin: "-165px",
									// }}
									src="/images/finalbg.png"
									width={800}
								/>
							</motion.p>
						</Content>
					</ContentContainer>
				</div>
			</div>
			<div style={{ marginTop: "-164px" }}>
				<ContestList></ContestList>
			</div>

			{/* <HomeCategory>
				<div className="categoryHeader">
					<h2>Browse Categories</h2>

					<div className="categoryOptions">
						<select className="category" name="category" id="category">
							<option value="Latest">Latest</option>
							<option value="Trending">Trending</option>
							<option value="Downloads">Downloads</option>
						</select>
					</div>
				</div>
				<div className="homeCategory">
					{categories.map((i) => (
						<NavLink to="/categories" className="card" key={i.id}>
							<figure
								className="img-hover"
								style={{
									backgroundImage: `url(${i.thumb_nail})`,
									backgroundColor: "grey",
								}}
							></figure>
							<div className="tag">
								<h3>{i.category_title}</h3>
								<p>{i.no_of_memes} posts</p>
							</div>
						</NavLink>
					))}
				</div>
			</HomeCategory> */}

			{/* {isInputEmpty ? (
				<GridGallery>
					<div className="gallery-container">
					
						<InfiniteScroll
							pageStart={0}
							loadMore={loadMemes}
							hasMore={count - 10 >= 0}
							loader={
								<div className="loader" key={0}>
									<img
										src="/images/loading.gif"
										alt="Loading..."
										width="60px"
									/>
								</div>
							}
						>
							{allMemes.map((i) => (
								<MemeCard
									link={i.image_link}
									key={i.id}
									downloads={i.downloads}
									likes={i.likes}
									views={i.views}
									category={i.category}
									title={i.title}
								/>
							))}
						</InfiniteScroll>
					</div>
				</GridGallery>
			) : (
				<GridGallery>
					<div className="gallery-container">
						{allMemes.map((i) => (
							<MemeCard
								link={i.image_link}
								key={i.id}
								downloads={i.downloads}
								likes={i.likes}
								views={i.views}
								category={i.category}
								title={i.title}
							/>
						))}
					</div>
				</GridGallery>
			)} */}
		</Container>
	);
}
