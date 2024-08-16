import { useEffect } from 'react'
import { useDots } from './Store'
import Loader from './Components/Loader'
import StepList from './Components/StepList'
import Showcase from './Components/Showcase'
import Selector from './Components/Selector'
import Results from './Components/Results'
import Total from './Components/Total'

const ThrowError = () => {
	throw new Error("Dots data request error in component App.tsx!")
}

const App:React.FC = () => {
	const loading = useDots(store => store.loading)
	const error = useDots(store => store.error)
	const fetchDotsInitData = useDots(store => store.fetchDotsInitData)
	const isLastStep = useDots(store => store.getActiveStep()?.isLast)

	useEffect(() => {
		fetchDotsInitData()
	}, [fetchDotsInitData])

	return (
		loading
			? <Loader />
			: error
				? <ThrowError />
				: <>
					<div className="col-12">
						<StepList />
					</div>
					<div className="col-12 col-lg-4">
						<Showcase />
					</div>
					<div className="col-12 col-lg-4">
						<Selector />
					</div>
					<div className="col-12 col-lg-4">
						<Results />
					</div>

					{/* <Total /> */}


					{ !isLastStep
						? null
						: <div className="col-12">
							<Total />
						</div>
					}
				</>
	)
}

export default App
