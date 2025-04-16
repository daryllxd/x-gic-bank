import { useState } from "react";

function App() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const handleCommand = (command: string) => {
    const [cmd, ...args] = command.trim().split(" ");

    switch (cmd.toUpperCase()) {
      case "A":
        setOutput("apple");
        break;
      case "B":
        setOutput("Banana");
        break;
      case "C":
        if (args.length === 0) {
          setOutput("Error: Command C requires an argument");
        } else {
          setOutput(`Calculate: ${args.join(" ")}`);
        }
        break;
      default:
        setOutput("Unknown command");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">Command App</h1>

        <div className="mb-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleCommand(input);
                setInput("");
              }
            }}
            placeholder="Enter command (A, B, or C)"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-gray-800">Output:</p>
          <p
            data-testid="command-output"
            className="mt-2 text-lg font-semibold"
          >
            {output || "No output yet"}
          </p>
        </div>

        <div className="mt-6 text-sm text-gray-600">
          <p>Available commands:</p>
          <ul className="list-disc pl-5 mt-2">
            <li>A - Says "apple"</li>
            <li>B - Says "Banana"</li>
            <li>C [argument] - Calculates with the given argument</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
