import React, { useEffect } from "react";
import { useProduct } from "./Store";
import Loader from "./Components/Loader";
import Gallery from "./Components/Gallery";
import Body from "./Components/Body";

const ErrorComponent = (props: {error: unknown}) => {
	throw new Error(`${props.error}`)
}

const App:React.FC = () => {
	const [loading, error, fetchProductInitData] = useProduct(state => [state.loading, state.error, state.fetchProductInitData]);

	useEffect(() => {
		fetchProductInitData()
	}, [fetchProductInitData])

	useEffect(() => {
		return useProduct.subscribe(
			(data) => {
				const art = data?.current?.article;
				const alias = data?.series?.alias;
				if (art ?? alias) {
					{
						const currentUrl = window.location.href;
						const regex = new RegExp(`/${alias}.*?(?:[#?]|$)`);
						// Создаем новый URL, добавляя новую часть
						const newUrl = currentUrl.replace(regex, `/${alias}/${art}`);
						window.history.pushState({ path: newUrl }, "", newUrl);
					}
					document.querySelector("body")?.dispatchEvent(new CustomEvent("productSelect", { detail: data.current }));
				}
			}
		);
	});

	return (
		loading
			? <Loader />
			: error
				? <ErrorComponent error={error} />
				: <>
					<div className="col-12 col-lg-4">
						<Gallery />
					</div>
					<div className="col-12 col-lg-8">
						<Body />
					</div>
				</>
	)
}

export default App
