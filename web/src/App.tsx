import { useEffect } from 'react'
import { CreateForm } from './components/CreateForm'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { AboutSkills } from './components/AboutSkills'
import { Learn } from './components/Learn'
import { Proof } from './components/Proof'
import { Footer } from './components/Footer'
import { packageId, portfolioObjectId, suiNetwork } from './config'
import { useCreatePortfolio } from './hooks/useCreatePortfolio'
import { usePortfolio } from './hooks/usePortfolio'

function App() {
  const portfolioState = usePortfolio(portfolioObjectId, suiNetwork)
  const createState = useCreatePortfolio(packageId, suiNetwork)

  useEffect(() => {
    document.title = portfolioState.data?.name
      ? `${portfolioState.data.name} · Cryptita Plays`
      : 'Cryptita Plays · Smart Contract to Website'
  }, [portfolioState.data?.name])

  return (
    <div className="page-shell">
      <Header />
      <main className="page-content">
        <Hero
          portfolio={portfolioState.data}
          loading={portfolioState.loading}
          error={portfolioState.error}
        />
        <AboutSkills
          about={portfolioState.data?.about ?? ''}
          skills={portfolioState.data?.skills ?? []}
          loading={portfolioState.loading}
        />
        <Learn />
        <CreateForm
          packageId={packageId}
          network={suiNetwork}
          state={createState.state}
          onSubmit={createState.createPortfolio}
        />
        <Proof
          objectId={createState.state.objectId ?? portfolioObjectId}
          digest={createState.state.digest}
          network={suiNetwork}
          loadError={portfolioState.error}
        />
      </main>
      <Footer />
    </div>
  )
}

export default App
