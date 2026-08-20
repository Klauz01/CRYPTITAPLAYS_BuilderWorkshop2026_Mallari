const topics = [
  {
    title: 'Sui',
    body: 'Sui is a Layer 1 blockchain designed to make digital ownership and app interactions fast to verify.',
  },
  {
    title: 'Smart contract',
    body: 'A smart contract is code on chain that defines what data can be created and who owns it.',
  },
  {
    title: 'Move',
    body: 'Move is the language used here to model a portfolio object with fields for identity, links, and skills.',
  },
  {
    title: 'Wallet',
    body: 'A wallet proves who you are, signs transactions, and pays gas when you create your portfolio object.',
  },
  {
    title: 'Frontend',
    body: 'This frontend reads one configured object from Mainnet and can submit one transaction to create a new one.',
  },
]

export function Learn() {
  return (
    <section className="panel">
      <p className="eyebrow">Learn</p>
      <h2>What this workshop teaches</h2>
      <div className="learn-grid">
        {topics.map((topic) => (
          <article key={topic.title} className="learn-card">
            <h3>{topic.title}</h3>
            <p>{topic.body}</p>
          </article>
        ))}
      </div>
      <a href="https://docs.sui.io" target="_blank" rel="noopener noreferrer" className="inline-link">
        Learn more in the official Sui docs
      </a>
    </section>
  )
}
