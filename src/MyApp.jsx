import { useState, useCallback, useEffect, useRef } from 'react'

function getPasswordStrength(password) {
  let strength = 0
  if (password.length >= 8) strength++
  if (/[A-Z]/.test(password)) strength++
  if (/[0-9]/.test(password)) strength++
  if (/[^A-Za-z0-9]/.test(password)) strength++
  if (strength <= 1) return { label: "Weak", color: "bg-red-500" }
  if (strength === 2) return { label: "Medium", color: "bg-yellow-500" }
  return { label: "Strong", color: "bg-green-500" }
}

function MyApp() {
  const [length, setLength] = useState(12)
  const [numberAllowed, setNumberAllowed] = useState(true)
  const [charAllowed, setCharAllowed] = useState(true)
  const [password, setPassword] = useState("")
  const [show, setShow] = useState(false)
  const [copied, setCopied] = useState(false)
  const passwordRef = useRef(null)

  const passwordGenerator = useCallback(() => {
    if (!length || isNaN(length)) return setPassword("")
    let pass = ""
    let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
    if (numberAllowed) str += "0123456789"
    if (charAllowed) str += "!@#$%^&*()_+[]{}|;:,.<>?/~`"
    for (let i = 0; i < length; i++) {
      let char = Math.floor(Math.random() * str.length)
      pass += str.charAt(char)
    }
    setPassword(pass)
  }, [length, numberAllowed, charAllowed])

  const copyPasswordToClipboard = useCallback(() => {
    passwordRef.current?.select()
    window.navigator.clipboard.writeText(password)
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }, [password])

  useEffect(() => {
    passwordGenerator()
  }, [length, numberAllowed, charAllowed, passwordGenerator])

  const strength = getPasswordStrength(password)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600 transition-all duration-500">
      <div className="w-full max-w-lg mx-4 glassmorphism rounded-2xl px-6 py-8 shadow-2xl text-orange-100 relative">
        <h1 className="text-3xl font-bold text-center mb-6 text-white drop-shadow">🔐 Password Generator</h1>
        <div className="flex shadow rounded-lg overflow-hidden mb-4 bg-white/10 backdrop-blur">
          <input
            type={show ? "text" : "password"}
            value={password}
            className="outline-none w-full py-2 px-3 bg-transparent text-lg text-white placeholder:text-gray-300 focus:ring-2 focus:ring-pink-400 transition"
            placeholder="Generated Password"
            readOnly
            ref={passwordRef}
          />
          <button
            onClick={() => setShow((prev) => !prev)}
            className="px-2 text-gray-300 hover:text-white transition text-xl"
            title={show ? "Hide Password" : "Show Password"}
          >
            {show ? "🙈" : "👁️"}
          </button>
          <div className="relative">
            <button
              onClick={copyPasswordToClipboard}
              className={`outline-none bg-blue-600 hover:bg-blue-500 active:scale-95 transition-all duration-200 text-white px-4 py-2 font-semibold ${copied ? "scale-105" : ""}`}
              title="Copy to clipboard"
            >
              {copied ? "✔️" : "Copy"}
            </button>
            {copied && (
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 text-xs text-white px-2 py-1 rounded shadow transition-all animate-fade-in">
                Copied!
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-24 h-2 rounded bg-gray-600 overflow-hidden">
            <div
              className={`h-2 rounded transition-all duration-500 ${strength.color}`}
              style={{
                width: `${strength.label === "Weak" ? 33 : strength.label === "Medium" ? 66 : 100}%`
              }}
            ></div>
          </div>
          <span className={`text-xs font-semibold ${strength.label === "Strong" ? "text-green-300" : strength.label === "Medium" ? "text-yellow-300" : "text-red-300"}`}>
            {strength.label}
          </span>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 text-sm mb-2">
          <div className="flex items-center gap-2 flex-1">
            <input
              type="range"
              min={6}
              max={32}
              value={length}
              className="cursor-pointer accent-pink-500 w-full"
              onChange={(e) => setLength(Number(e.target.value))}
            />
            <input
              type="number"
              min={6}
              max={32}
              value={length}
              onChange={e => {
                const val = e.target.value;
                if (val === "") {
                  setLength("");
                } else {
                  setLength(Number(val));
                }
              }}
              onBlur={e => {
                let val = Number(e.target.value);
                if (isNaN(val) || val < 6) val = 6;
                if (val > 32) val = 32;
                setLength(val);
              }}
              className="w-16 px-2 py-1 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
            />
            <label className="whitespace-nowrap">Length</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={numberAllowed}
              id="numbers"
              onChange={() => setNumberAllowed((prev) => !prev)}
              className="accent-pink-500"
            />
            <label htmlFor="numbers">Numbers</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={charAllowed}
              id="symbols"
              onChange={() => setCharAllowed((prev) => !prev)}
              className="accent-pink-500"
            />
            <label htmlFor="symbols">Symbols</label>
          </div>
        </div>
        <button
          onClick={passwordGenerator}
          className="w-full mt-4 bg-gradient-to-r from-pink-500 to-indigo-500 hover:from-indigo-500 hover:to-pink-500 text-white font-bold py-2 rounded-lg shadow-lg transition-all duration-200 text-lg active:scale-95"
        >
          🔄 Regenerate Password
        </button>
        <p className="text-xs text-center text-gray-300 mt-6">Tip: Use a long password with numbers and symbols for best security.</p>
      </div>
      {/* Glassmorphism effect & fade-in animation */}
      <style>{`
        .glassmorphism {
          background: rgba(30, 41, 59, 0.7);
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.18);
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px);}
          to { opacity: 1; transform: translateY(0);}
        }
        .animate-fade-in {
          animation: fade-in 0.5s;
        }
      `}</style>
    </div>
  )
}

export default MyApp