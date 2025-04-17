import { useEffect, useState } from "react";
import { BankState } from "./features/bank/BankState";
import { formatCurrency } from "./utils/formatCurrency";
import { formatDate } from "./utils/formatDate";

function App() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [bankState] = useState(() => new BankState());

  // Blinking cursor effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const handleCommand = (command: string) => {
    const cmd = command.trim().toUpperCase();
    const currentUIState = bankState.getUIState();

    // Handle 'Q' command to exit input states
    if (cmd === "Q" && bankState.isAwaitingInput()) {
      setOutput("Transaction cancelled.");
      bankState.returnToIdle();
      showMenu();
      return;
    }

    if (bankState.isAwaitingInput()) {
      const amount = parseFloat(command);
      if (isNaN(amount)) {
        setOutput("Invalid amount. Please enter a number or 'Q' to cancel.");
        return;
      }
      if (amount <= 0) {
        setOutput(
          "Invalid amount. Please enter a positive number or 'Q' to cancel."
        );
        return;
      }

      const success =
        currentUIState === "depositing"
          ? bankState.deposit(amount)
          : bankState.withdraw(amount);

      if (!success) {
        setOutput(
          currentUIState === "withdrawing"
            ? "Insufficient funds for withdrawal. Please try a different amount or 'Q' to cancel."
            : "Invalid amount. Please try again or 'Q' to cancel."
        );
        return;
      }

      const action =
        currentUIState === "depositing" ? "deposited" : "withdrawn";
      setOutput(
        `Thank you. ${formatCurrency(Math.abs(amount))} has been ${action} ${
          action === "withdrawn" ? "from" : "to"
        } your account.`
      );
      bankState.returnToIdle();
      showMenu();
      return;
    }

    switch (cmd) {
      case "D":
        setOutput("Please enter the amount to deposit (or 'Q' to cancel):");
        bankState.startDeposit();
        break;
      case "W":
        setOutput("Please enter the amount to withdraw (or 'Q' to cancel):");
        bankState.startWithdrawal();
        break;
      case "P":
        const transactions = bankState.getTransactions();
        if (transactions.length === 0) {
          setOutput("No transactions to display.");
          showMenu();
          return;
        }
        const statement = [
          "Date                  | Amount  | Balance",
          ...transactions.map(
            (t) =>
              `${formatDate(t.date)} | ${formatCurrency(t.amount, {
                showSymbol: false,
              })} | ${formatCurrency(t.balance, { showSymbol: false })}`
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
      case "":
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
        "\n" +
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
