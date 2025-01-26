import MemeGenerator from "../components/MemeGenerator"

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-5xl text-white text-center mb-8 tracking-tight text-white">Dobby Meme Generator</h1>
        <MemeGenerator />
      </div>
    </main>
  )
}

