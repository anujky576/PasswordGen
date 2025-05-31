import { useState, useCallback, useEffect, useRef} from 'react'
//useRef is used to create a mutable object that persists for the full lifetime of the component
//useEffect is used to run side effects in a functional component
//useCallback is used to memoize the passwordGenerator function to avoid unnecessary re-renders

function App() {
  const [length, setLength] = useState(6)
  const [numberAllowed, setNumberAllowed] = useState(false)
  const [charAllowed, setCharAllowed] = useState(false)
  const [password, setPassword] = useState("")

  //useRef hook
  const passwordRef = useRef(null)
  //useRef is used to create a mutable object that persists for the full lifetime of the component
  //passwordRef is used to store a reference to the input element so that we can copy the password to clipboard


  const passwordGenerator = useCallback(() =>{
    let pass = ""
    let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
    if (numberAllowed) {
      str += "0123456789"
    }
    if (charAllowed) {
      str += "!@#$%^&*()_+[]{}|;:,.<>?/~`"
    }
    for (let i = 0; i < length; i++) {
      let char = Math.floor(Math.random() * str.length + 1)
      //Math.random() generates a random number between 0 and 1, multiplying it by str.length gives a number between 0 and str.length
      //Adding 1 ensures that the index is never out of bounds
      //Math.floor() rounds down to the nearest integer
      pass += str.charAt(char)
    }
    setPassword(pass)
  } , [length, numberAllowed, charAllowed, setPassword])
  //setPassword is here for more optimization, it is used to update the password state
    //syntax of useCallback: useCallback(function, dependencies)

    const copyPasswordToClipboard = useCallback(() => {
      passwordRef.current?.select()
      //passwordRef.current.select() is used to select the text in the input element
      passwordRef.current?.setSelectionRange(0, 20)
      //setSelectionRange is used to set the selection range of the input element, 0 is the start index and 99999 is the end index
      //?. is used to check if passwordRef.current is not null or undefined before calling the method
      //this prevents errors if the ref is not set
      window.navigator.clipboard.writeText(password)
      //window.navigator.clipboard.writeText() is used to copy the password to clipboard
    }, [password])

    useEffect(() => {
    passwordGenerator()
  }
  , [length, numberAllowed, charAllowed, passwordGenerator])
  //useEffect is used to run side effects in a functional component, it runs the passwordGenerator function whenever the dependencies change
  //dependencies are length, numberAllowed, charAllowed, and passwordGenerator

  return (
    <>
      <div className='w-full max-w-md mx-auto shadow-md rounded-lg px-4 py-3 my-8 text-orange-500 bg-gray-700'>
        <h1 className='text-white text-center my-3'>Password Generator</h1>
        <div className="flex shadow rounded-lg overflow-hidden mb-4">

          <input 
          type="text" 
          value = {password}
          className='outline-none w-full py-1 px-3'
          placeholder="Generated Password"
          readOnly
          ref={passwordRef}
          />

          <button
          onClick={copyPasswordToClipboard}
          //onClick event handler to copy the password to clipboard  
          className='outline-none bg-blue-700 text-white px-3 py-0.5 shrink-0 hover:bg-blue-600 transition-colors duration-200'
          >copy</button>
    
        </div>

        <div className='flex text-sm gap-x-2'>
          <div className='flex items-center gap-x-1'>
            <input 
            type="range" 
            min={6}
            max={20}
            value={length}
            className='cursor-pointer'
            onChange={(e) => setLength(e.target.value)}
            />
            <label >Length: {length}</label>
          </div>

          <div className='flex items-center gap-x-1'>
            <input 
            type="checkbox" 
            defaultChecked={numberAllowed}
            onChange={() => setNumberAllowed((prev) => !prev)}
            />
            <label>Numbers</label>
          </div>

          <div className='flex items-center gap-x-1'>
            <input 
            type="checkbox" 
            defaultChecked={charAllowed}
            onChange={() => setCharAllowed((prev) => !prev)}
            />
            <label>Characters</label>
          </div>

        </div>
      </div>
    </>
  )
}

export default App
