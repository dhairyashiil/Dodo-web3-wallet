import React, { useState } from "react";
import {
  Plus,
  Download,
  Key,
  Eye,
  Copy,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { IconFeatherFilled } from "@tabler/icons-react";
import { generateMnemonic, validateMnemonic } from "bip39";
import { toast } from "sonner";

interface WalletSetupProps {
  onCreateWallet: (seedPhrase: string) => void;
  onImportWallet: (seedPhrase: string) => void;
  onImportPrivateKey: (privateKey: string, name: string) => void;
}

const WalletSetup: React.FC<WalletSetupProps> = ({
  onCreateWallet,
  onImportWallet,
  onImportPrivateKey,
}) => {
  const [step, setStep] = useState<
    "welcome" | "create" | "import" | "private-key" | "confirm"
  >("welcome");
  const [seedPhrase, setSeedPhrase] = useState<string>("");
  const [importPhrase, setImportPhrase] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [accountName, setAccountName] = useState("");
  const [confirmPhrase, setConfirmPhrase] = useState("");
  const [showSeed, setShowSeed] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const generateSeedPhrase = () => {
    try {
      // Generate a 12-word mnemonic using BIP39 standard
      const mnemonic = generateMnemonic(128); // 128 bits for 12 words
      setSeedPhrase(mnemonic);
      setStep("create");
    } catch (error) {
      toast.success("Failed to generate seed phrase. Please try again.");
    }
  };

  const handleCreateWallet = () => {
    if (confirmPhrase === seedPhrase) {
      localStorage.setItem("mnemonics", JSON.stringify(seedPhrase.split(" "))); // Sync format
      localStorage.setItem("paths", JSON.stringify(["501"])); // Default to Solana
      onCreateWallet(seedPhrase);
      toast.success("Confirmed!");
      window.location.href = "/home";
    } else {
      toast.success("Recovery phrases don't match. Please try again.");
    }
  };

  const handleImportWallet = () => {
    const trimmedPhrase = importPhrase.trim();

    if (validateMnemonic(trimmedPhrase)) {
      // Store the imported mnemonic in localStorage (same format as create)
      localStorage.setItem(
        "mnemonics",
        JSON.stringify(trimmedPhrase.split(" "))
      );
      localStorage.setItem("paths", JSON.stringify(["501"])); // Default to Solana

      // Call parent handler
      onImportWallet(trimmedPhrase);

      toast.success("Wallet imported successfully!");
      window.location.href = "/home";
    } else {
      toast.success("Invalid recovery phrase. Please check and try again.");
    }
  };

  // const handleImportPrivateKey = () => {
  //   if (privateKey.trim() && accountName.trim()) {
  //     onImportPrivateKey(privateKey.trim(), accountName.trim());
  //   } else {
  //     toast.success("Please enter both private key and account name.");
  //   }
  // };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  // Standard modal container classes
  const modalContainerClasses =
    "w-full max-w-md border border-gray-700/50 rounded-2xl p-8 bg-white";
  const modalTitleClasses = "text-2xl font-bold text-black mb-4";
  const modalSubtitleClasses = "text-gray-700 mb-6";
  const buttonContainerClasses = "flex space-x-4 mt-6";
  const primaryButtonClasses =
    "flex-1 bg-orange-400 border border-gray-900 text-white py-3 rounded-xl font-medium hover:bg-gray-900 transition-opacity flex items-center justify-center space-x-2";
  const secondaryButtonClasses =
    "flex-1 bg-gray-200 border border-gray-300 text-black py-3 rounded-xl font-medium hover:bg-gray-300 transition-colors";

  if (step === "welcome") {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{ backgroundColor: "#001a2c" }}
      >
        <div className={modalContainerClasses}>
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center">
                <IconFeatherFilled className="h-16 w-16 text-neutral-800" />
              </div>
              <h1 className="text-5xl font-bold text-black">Dodo</h1>
            </div>
            <p className="text-gray-700 mb-8">
              To get started, create a new wallet or import an existing one.
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={generateSeedPhrase}
              className="w-full bg-orange-400 border border-gray-900 text-white py-4 rounded-xl font-medium hover:bg-gray-900 transition-opacity flex items-center justify-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Create New Wallet</span>
            </button>

            <button
              onClick={() => setStep("import")}
              className="w-full bg-orange-400 border border-gray-900 text-white py-4 rounded-xl font-medium hover:bg-gray-900 transition-colors flex items-center justify-center space-x-2"
            >
              <Download className="w-5 h-5" />
              <span>Import Existing Wallet</span>
            </button>

            {/* <button
              onClick={() => setStep("private-key")}
              className="w-full bg-orange-400 border border-gray-900 text-white py-4 rounded-xl font-medium hover:bg-gray-900 transition-colors flex items-center justify-center space-x-2"
            >
              <Key className="w-5 h-5" />
              <span>Import from Private Key</span>
            </button> */}
          </div>
        </div>
      </div>
    );
  }

  if (step === "create") {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{ backgroundColor: "#001a2c" }}
      >
        <div className={modalContainerClasses}>
          <div className="text-center mb-6">
            <h2 className={modalTitleClasses}>Recovery Phrase</h2>
            <p className={modalSubtitleClasses} style={{ color: "#F97316" }}>
              This phrase is the ONLY way to recover your wallet. Do NOT share
              it with anyone!
            </p>
          </div>

          <div className="relative mb-6">
            <div
              className={`grid grid-cols-3 gap-3 ${!showSeed ? "blur-sm" : ""}`}
            >
              {seedPhrase.split(" ").map((word, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1 rounded-lg p-3 border border-gray-800 text-center bg-gray-100"
                >
                  <span className="text-gray-500 text-xs">{index + 1}.</span>
                  <span className="text-black font-medium">{word}</span>
                </div>
              ))}
            </div>

            {!showSeed && (
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={() => setShowSeed(true)}
                  className="bg-orange-400 border border-gray-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-900 transition-opacity flex items-center space-x-2"
                >
                  <Eye className="w-5 h-5" />
                  <span>Click to reveal</span>
                </button>
              </div>
            )}
          </div>

          {showSeed && (
            <div className="flex justify-center mb-6">
              <button
                onClick={() => copyToClipboard(seedPhrase)}
                className="bg-gray-200 border border-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors flex items-center space-x-2"
              >
                <Copy className="w-4 h-4" />
                <span>Copy to Clipboard</span>
              </button>
            </div>
          )}

          <div className="flex items-center space-x-3 mb-6">
            <input
              type="checkbox"
              id="terms"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="w-4 h-4 text-orange-500 bg-gray-200 border-gray-300 rounded focus:ring-orange-500"
            />
            <label htmlFor="terms" className="text-gray-700 text-sm">
              I saved my Recovery Phrase
            </label>
          </div>

          <div className={buttonContainerClasses}>
            <button
              onClick={() => setStep("welcome")}
              className={secondaryButtonClasses}
            >
              Back
            </button>
            <button
              onClick={() => setStep("confirm")}
              disabled={!agreedToTerms || !showSeed}
              className={`${primaryButtonClasses} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === "confirm") {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{ backgroundColor: "#001a2c" }}
      >
        <div className={modalContainerClasses}>
          <div className="text-center mb-6">
            <h2 className={modalTitleClasses}>Confirm Your Recovery Phrase</h2>
            <p className={modalSubtitleClasses}>
              Enter your 12-word recovery phrase to confirm you've saved it
            </p>
          </div>

          <div className="mb-6">
            <textarea
              value={confirmPhrase}
              onChange={(e) => setConfirmPhrase(e.target.value)}
              placeholder="Enter your 12-word recovery phrase..."
              rows={4}
              className="w-full bg-gray-100 border border-gray-300 rounded-xl px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
            />
          </div>

          <div className={buttonContainerClasses}>
            <button
              onClick={() => setStep("create")}
              className={secondaryButtonClasses}
            >
              Back
            </button>
            <button
              onClick={handleCreateWallet}
              // disabled={!validateMnemonic(confirmPhrase) || confirmPhrase !== seedPhrase}
              className={`${primaryButtonClasses} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <CheckCircle className="w-4 h-4" />
              <span>Create Wallet</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === "import") {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{ backgroundColor: "#001a2c" }}
      >
        <div className={modalContainerClasses}>
          <div className="text-center mb-6">
            <h2 className={modalTitleClasses}>Import Wallet</h2>
            <p className={modalSubtitleClasses}>
              Enter your 12 word recovery phrase
            </p>
          </div>

          <div className="mb-6">
            <textarea
              value={importPhrase}
              onChange={(e) => setImportPhrase(e.target.value)}
              placeholder="Enter your recovery phrase..."
              rows={4}
              className="w-full bg-gray-100 border border-gray-300 rounded-xl px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
            />
            <p className="text-gray-500 text-xs mt-2">
              Separate each word with a space. Supports 12 or 24-word phrases.
            </p>
          </div>

          <div className={buttonContainerClasses}>
            <button
              onClick={() => setStep("welcome")}
              className={secondaryButtonClasses}
            >
              Back
            </button>
            <button
              onClick={handleImportWallet}
              disabled={!validateMnemonic(importPhrase.trim())}
              className={`${primaryButtonClasses} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Import Wallet
            </button>
          </div>
        </div>
      </div>
    );
  }

  // if (step === "private-key") {
  //   return (
  //     <div
  //       className="min-h-screen flex items-center justify-center p-4"
  //       style={{ backgroundColor: "#001a2c" }}
  //     >
  //       <div className={modalContainerClasses}>
  //         <div className="text-center mb-6">
  //           <h2 className={modalTitleClasses}>Import Private Key</h2>
  //           <p className={modalSubtitleClasses}>
  //             Import an account using a private key
  //           </p>
  //         </div>

  //         <div className="space-y-4 mb-6">
  //           <div>
  //             <label className="block text-gray-700 text-sm font-medium mb-2">
  //               Account Name
  //             </label>
  //             <input
  //               type="text"
  //               value={accountName}
  //               onChange={(e) => setAccountName(e.target.value)}
  //               placeholder="Enter account name"
  //               className="w-full bg-gray-100 border border-gray-300 rounded-xl px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
  //             />
  //           </div>

  //           <div>
  //             <label className="block text-gray-700 text-sm font-medium mb-2">
  //               Private Key
  //             </label>
  //             <textarea
  //               value={privateKey}
  //               onChange={(e) => setPrivateKey(e.target.value)}
  //               placeholder="Enter your private key..."
  //               rows={3}
  //               className="w-full bg-gray-100 border border-gray-300 rounded-xl px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
  //             />
  //           </div>
  //         </div>

  //         <div className={buttonContainerClasses}>
  //           <button
  //             onClick={() => setStep("welcome")}
  //             className={secondaryButtonClasses}
  //           >
  //             Back
  //           </button>
  //           <button
  //             onClick={handleImportPrivateKey}
  //             disabled={!privateKey.trim() || !accountName.trim()}
  //             className={`${primaryButtonClasses} disabled:opacity-50 disabled:cursor-not-allowed`}
  //           >
  //             Import Account
  //           </button>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  return null;
};

export default WalletSetup;
