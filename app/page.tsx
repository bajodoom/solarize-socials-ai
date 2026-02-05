export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-indigo-100">
      <main className="max-w-4xl w-full">
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Solarize Socials AI
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Social Network Automatisation System
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="p-6 bg-blue-50 rounded-lg">
              <h2 className="text-2xl font-semibold text-blue-900 mb-2">🤖 AI-Powered</h2>
              <p className="text-gray-700">Intelligent automation for your social media</p>
            </div>
            
            <div className="p-6 bg-indigo-50 rounded-lg">
              <h2 className="text-2xl font-semibold text-indigo-900 mb-2">⚡ Fast</h2>
              <p className="text-gray-700">Lightning-fast performance and deployment</p>
            </div>
            
            <div className="p-6 bg-purple-50 rounded-lg">
              <h2 className="text-2xl font-semibold text-purple-900 mb-2">🚀 Scalable</h2>
              <p className="text-gray-700">Built to grow with your needs</p>
            </div>
          </div>

          <div className="mt-12">
            <p className="text-sm text-gray-500">
              Ready to deploy on Vercel • Built with Next.js 15
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}