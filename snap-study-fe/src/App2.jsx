function App2() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full px-6 py-3 mb-8">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <span className="text-sm font-semibold text-purple-300">
                AI-Powered Medical Learning Revolution
              </span>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>

            <h1 className="text-6xl md:text-8xl font-black mb-8 leading-none">
              <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                Your Medical
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent animate-pulse">
                Study Beast
              </span>
              <br />
              <span className="bg-gradient-to-r from-teal-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Unleashed
              </span>
            </h1>

            <p className="text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
              Drop your boring PDFs. Get{" "}
              <span className="text-purple-400 font-bold">insane quizzes</span>,
              <span className="text-pink-400 font-bold">
                {" "}
                unforgettable mnemonics
              </span>
              , and
              <span className="text-teal-400 font-bold">
                {" "}
                mind-blowing case simulations
              </span>{" "}
              that make you a medical genius.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <button className="group relative bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white px-12 py-6 rounded-3xl text-xl font-black hover:from-purple-700 hover:via-pink-700 hover:to-red-700 transition-all duration-300 transform hover:scale-110 shadow-2xl hover:shadow-purple-500/50">
                <span className="relative z-10 flex items-center">
                  UNLEASH THE BEAST
                  <Rocket className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </button>

              <button className="group border-2 border-purple-500 text-purple-300 px-12 py-6 rounded-3xl text-xl font-bold hover:bg-purple-500/10 transition-all duration-300 transform hover:scale-105">
                <span className="flex items-center">
                  Watch Magic Happen
                  <Zap className="w-6 h-6 ml-3 group-hover:text-yellow-400 transition-colors" />
                </span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="flex items-center justify-center space-x-3 bg-green-500/10 border border-green-500/30 rounded-2xl px-6 py-4">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <span className="text-green-300 font-semibold">
                  Zero Setup Required
                </span>
              </div>
              <div className="flex items-center justify-center space-x-3 bg-blue-500/10 border border-blue-500/30 rounded-2xl px-6 py-4">
                <Shield className="w-6 h-6 text-blue-400" />
                <span className="text-blue-300 font-semibold">
                  HIPAA Fortress
                </span>
              </div>
              <div className="flex items-center justify-center space-x-3 bg-purple-500/10 border border-purple-500/30 rounded-2xl px-6 py-4">
                <Clock className="w-6 h-6 text-purple-400" />
                <span className="text-purple-300 font-semibold">
                  Instant Results
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Superpowers
              </span>
              <br />
              for Medical Minds
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We don't just digitize your notes. We transform them into learning
              weapons of mass retention.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group relative bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-xl border border-purple-500/30 p-8 rounded-3xl hover:border-purple-400/60 transition-all duration-300 transform hover:scale-105 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-600/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-300">
                  <Upload className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Smart Ingestion
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  Drag, drop, boom! Our AI devours your PDFs, textbooks, and
                  scribbled notes faster than you can say "differential
                  diagnosis."
                </p>
              </div>
            </div>

            <div className="group relative bg-gradient-to-br from-blue-900/50 to-teal-900/50 backdrop-blur-xl border border-blue-500/30 p-8 rounded-3xl hover:border-blue-400/60 transition-all duration-300 transform hover:scale-105 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-teal-600/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-teal-500 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-300">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Quiz Generator
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  Get quizzes so good, they'll make your professors jealous.
                  Adaptive difficulty that grows with your genius brain.
                </p>
              </div>
            </div>

            <div className="group relative bg-gradient-to-br from-green-900/50 to-emerald-900/50 backdrop-blur-xl border border-green-500/30 p-8 rounded-3xl hover:border-green-400/60 transition-all duration-300 transform hover:scale-105 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 to-emerald-600/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-300">
                  <Lightbulb className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Mnemonic Magic
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  Forget forgetting! We create mnemonics so sticky, you'll
                  remember them during your morning coffee 20 years later.
                </p>
              </div>
            </div>

            <div className="group relative bg-gradient-to-br from-orange-900/50 to-red-900/50 backdrop-blur-xl border border-orange-500/30 p-8 rounded-3xl hover:border-orange-400/60 transition-all duration-300 transform hover:scale-105 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-600/10 to-red-600/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-300">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Case Simulations
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  Practice on virtual patients that are more realistic than your
                  medical school mannequins. No awkward small talk required.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-12">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div className="group">
                <div className="text-5xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                  127k+
                </div>
                <div className="text-gray-300 font-semibold">
                  Future Doctors
                </div>
                <div className="text-sm text-purple-400 mt-1">
                  Getting Smarter Daily
                </div>
              </div>
              <div className="group">
                <div className="text-5xl font-black bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                  8.2M+
                </div>
                <div className="text-gray-300 font-semibold">
                  Documents Devoured
                </div>
                <div className="text-sm text-blue-400 mt-1">
                  And Counting...
                </div>
              </div>
              <div className="group">
                <div className="text-5xl font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                  98.7%
                </div>
                <div className="text-gray-300 font-semibold">
                  Retention Boost
                </div>
                <div className="text-sm text-green-400 mt-1">Mind = Blown</div>
              </div>
              <div className="group">
                <div className="text-5xl font-black bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                  4.97★
                </div>
                <div className="text-gray-300 font-semibold">
                  User Love Score
                </div>
                <div className="text-sm text-yellow-400 mt-1">
                  Basically Perfect
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-32">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 blur-3xl"></div>
            <div className="relative bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-16">
              <h2 className="text-5xl md:text-6xl font-black text-white mb-8">
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
                  Ready to Become
                </span>
                <br />
                <span className="text-white">Unstoppable?</span>
              </h2>
              <p className="text-2xl text-gray-300 mb-12 leading-relaxed">
                Join the medical learning revolution. Your future patients are
                counting on you to be{" "}
                <span className="text-purple-400 font-bold">extraordinary</span>
                .
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <button className="group bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white px-12 py-6 rounded-3xl text-xl font-black hover:from-purple-700 hover:via-pink-700 hover:to-red-700 transition-all duration-300 transform hover:scale-110 shadow-2xl hover:shadow-purple-500/50">
                  <span className="flex items-center justify-center">
                    START DOMINATING NOW
                    <TrendingUp className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
                  </span>
                </button>
                <button className="group border-2 border-white text-white px-12 py-6 rounded-3xl text-xl font-bold hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-105">
                  <span className="flex items-center justify-center">
                    See Live Demo
                    <Award className="w-6 h-6 ml-3 group-hover:rotate-12 transition-transform" />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-black/50 backdrop-blur-xl border-t border-white/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-2xl flex items-center justify-center">
                  <Brain className="w-7 h-7 text-white" />
                </div>
                <div>
                  <span className="text-2xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
                    MedicoAI
                  </span>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Transforming medical minds, one upload at a time. The future of
                medical education is here.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Product</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-400 transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-400 transition-colors"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-400 transition-colors"
                  >
                    Success Stories
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-400 transition-colors"
                  >
                    API
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Company</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-400 transition-colors"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-400 transition-colors"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-400 transition-colors"
                  >
                    Press
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-400 transition-colors"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Support</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-400 transition-colors"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-400 transition-colors"
                  >
                    Community
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-400 transition-colors"
                  >
                    Privacy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-400 transition-colors"
                  >
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              &copy; 2024 MedicoAI. All rights reserved.
              <span className="text-purple-400 ml-2">
                Built for the future of medicine.
              </span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
