import Link from "next/link"

export default function About() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <main className="text-center">
        <h1 className="text-4xl font-bold mb-4">About Us</h1>
        <p className="text-xl mb-8">We are a company dedicated to creating amazing websites.</p>
        <Link href="/" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
          Back to Home
        </Link>
      </main>
    </div>
  )
}

