import { useEffect, useState } from "react";
import { Transaction } from "./types/transaction";
import { formatCurrency } from "./utils/formatCurrency";
import { formatDate } from "./utils/formatDate";

function App() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [awaitingAmount, setAwaitingAmount] = useState(false);
  const [lastCommand, setLastCommand] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  // Blinking cursor effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const handleCommand = (command: string) => {
    const cmd = command.trim().toUpperCase();

    if (awaitingAmount) {
      const amount = parseFloat(command);
      if (isNaN(amount) || amount <= 0) {
        setOutput("Invalid amount. Please enter a positive number.");
        setAwaitingAmount(false);
        return;
      }

      const newBalance =
        lastCommand === "D" ? currentBalance + amount : currentBalance - amount;

      if (lastCommand === "W" && newBalance < 0) {
        setOutput("Insufficient funds for withdrawal.");
        setAwaitingAmount(false);
        return;
      }

      const transaction: Transaction = {
        date: new Date(),
        amount: lastCommand === "D" ? amount : -amount,
        balance: newBalance,
      };

      setTransactions([...transactions, transaction]);
      setCurrentBalance(newBalance);
      setAwaitingAmount(false);

      const action = lastCommand === "D" ? "deposited" : "withdrawn";
      setOutput(
        `Thank you. ${formatCurrency(amount)} has been ${action} ${
          action === "withdrawn" ? "from" : "to"
        } your account.\n\n` +
          "Is there anything else you'd like to do?\n" +
          "[D]eposit\n" +
          "[W]ithdraw\n" +
          "[P]rint statement\n" +
          "[Q]uit"
      );
      return;
    }

    let statement: string;
    switch (cmd) {
      case "D":
        setOutput("Please enter the amount to deposit:");
        setAwaitingAmount(true);
        setLastCommand("D");
        break;
      case "W":
        setOutput("Please enter the amount to withdraw:");
        setAwaitingAmount(true);
        setLastCommand("W");
        break;
      case "P":
        if (transactions.length === 0) {
          setOutput("No transactions to display.");
          showMenu();
          return;
        }
        statement = [
          "Date                  | Amount  | Balance",
          ...transactions.map(
            (t) =>
              `${formatDate(t.date)} | ${formatCurrency(
                t.amount
              )} | ${formatCurrency(t.balance)}`
          ),
        ].join("\n");
        setOutput(statement);
        showMenu();
        break;
      case "Q":
        setOutput(
          "Thank you for banking with AwesomeGIC Bank.\nHave a nice day!"
        );
        break;
      default:
        setOutput("Invalid command. Please try again.");
        showMenu();
    }
  };

  const showMenu = () => {
    setOutput(
      (prev) =>
        prev +
        "\n\n" +
        [
          "Is there anything else you'd like to do?",
          "[D]eposit",
          "[W]ithdraw",
          "[P]rint statement",
          "[Q]uit",
        ].join("\n")
    );
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 w-full">
      <div className="w-full max-w-3xl bg-black text-green-500 font-mono p-6">
        <div className="mb-4">
          <pre className="whitespace-pre-wrap" data-testid="output">
            {output ||
              "Welcome to AwesomeGIC Bank! What would you like to do?\n[D]eposit\n[W]ithdraw\n[P]rint statement\n[Q]uit"}
          </pre>
        </div>

        <div className="flex items-center">
          <span className="text-green-500 mr-2">$</span>
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
            className="bg-black text-green-500 outline-none flex-1"
            autoFocus
          />
          <span
            className={`w-2 h-6 bg-green-500 ml-1 ${
              showCursor ? "opacity-100" : "opacity-0"
            }`}
          ></span>
        </div>
      </div>
    </div>
  );
}

export default App;
