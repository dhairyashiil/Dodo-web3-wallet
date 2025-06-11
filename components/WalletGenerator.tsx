"use client";
import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import nacl from "tweetnacl";
import { generateMnemonic, mnemonicToSeedSync, validateMnemonic } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import { Input } from "./ui/input";
import { motion } from "framer-motion";
import bs58 from "bs58";
import { ethers } from "ethers";
import {
  ChevronDown,
  ChevronUp,
  Copy,
  Eye,
  EyeOff,
  Grid2X2,
  List,
  Trash,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { TextRevealCardPreview } from "./TextRevealCard";

interface Wallet {
  publicKey: string;
  privateKey: string;
  mnemonic: string;
  path: string;
}

interface CombinedWallet {
  mnemonic: string;
  solanaPublicKey: string;
  solanaPrivateKey: string;
  solanaPath: string;
  ethereumPublicKey: string;
  ethereumPrivateKey: string;
  ethereumPath: string;
}

const WalletGenerator = () => {
  const [mnemonicWords, setMnemonicWords] = useState<string[]>(
    Array(12).fill(" ")
  );
  const [pathTypes, setPathTypes] = useState<string[]>([]);
  const [wallets, setWallets] = useState<CombinedWallet[]>([]);
  const [showMnemonic, setShowMnemonic] = useState<boolean>(false);
  const [mnemonicInput, setMnemonicInput] = useState<string>("");
  const [visiblePrivateKeys, setVisiblePrivateKeys] = useState<boolean[]>([]);
  const [visiblePhrases, setVisiblePhrases] = useState<boolean[]>([]);
  const [gridView, setGridView] = useState<boolean>(false);
  const pathTypeNames: { [key: string]: string } = {
    "501": "Solana",
    "60": "Ethereum",
  };

  const pathTypeName = pathTypeNames[pathTypes[0]] || "";

  useEffect(() => {
    const storedWallets = localStorage.getItem("wallets");
    const storedMnemonic = localStorage.getItem("mnemonics");
    const storedPathTypes = localStorage.getItem("paths");

    if (storedWallets && storedMnemonic && storedPathTypes) {
      setWallets(JSON.parse(storedWallets));
      setMnemonicWords(JSON.parse(storedMnemonic));
      setPathTypes(JSON.parse(storedPathTypes));
      setVisiblePrivateKeys(JSON.parse(storedWallets).map(() => false));
      setVisiblePhrases(JSON.parse(storedWallets).map(() => false));
    } else {
      window.location.href = "/";
    }
  }, []);

  const handleDeleteWallet = (index: number) => {
    // Prevent deletion if only one wallet remains
    if (wallets.length <= 1) {
      toast.success("You must keep at least one wallet");
      return;
    }

    const updatedWallets = wallets.filter((_, i) => i !== index);
    const updatedPathTypes = pathTypes.filter((_, i) => i !== index);

    setWallets(updatedWallets);
    setPathTypes(updatedPathTypes);
    localStorage.setItem("wallets", JSON.stringify(updatedWallets));
    localStorage.setItem("paths", JSON.stringify(updatedPathTypes));
    setVisiblePrivateKeys(visiblePrivateKeys.filter((_, i) => i !== index));
    setVisiblePhrases(visiblePhrases.filter((_, i) => i !== index));
    toast.success("Wallet deleted successfully!");
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success("Copied to clipboard!");
  };

  const togglePrivateKeyVisibility = (index: number) => {
    setVisiblePrivateKeys(
      visiblePrivateKeys.map((visible, i) => (i === index ? !visible : visible))
    );
  };

  const togglePhraseVisibility = (index: number) => {
    setVisiblePhrases(
      visiblePhrases.map((visible, i) => (i === index ? !visible : visible))
    );
  };

  const generateWalletFromMnemonic = (
    pathType: string,
    mnemonic: string,
    accountIndex: number
  ): Wallet | null => {
    try {
      const seedBuffer = mnemonicToSeedSync(mnemonic);
      const path = `m/44'/${pathType}'/0'/${accountIndex}'`;
      const { key: derivedSeed } = derivePath(path, seedBuffer.toString("hex"));

      let publicKeyEncoded: string;
      let privateKeyEncoded: string;

      if (pathType === "501") {
        // Solana
        const { secretKey } = nacl.sign.keyPair.fromSeed(derivedSeed);
        const keypair = Keypair.fromSecretKey(secretKey);

        privateKeyEncoded = bs58.encode(secretKey);
        publicKeyEncoded = keypair.publicKey.toBase58();
      } else if (pathType === "60") {
        // Ethereum
        const privateKey = Buffer.from(derivedSeed).toString("hex");
        privateKeyEncoded = privateKey;

        const wallet = new ethers.Wallet(privateKey);
        publicKeyEncoded = wallet.address;
      } else {
        toast.success("Unsupported path type.");
        return null;
      }

      return {
        publicKey: publicKeyEncoded,
        privateKey: privateKeyEncoded,
        mnemonic,
        path,
      };
    } catch (error) {
      toast.success("Failed to generate wallet. Please try again.");
      return null;
    }
  };

  const handleAddWallet = () => {
    if (!mnemonicWords) {
      toast.success("No mnemonic found. Please generate a wallet first.");
      return;
    }

    const solanaWallet = generateWalletFromMnemonic(
      "501",
      mnemonicWords.join(" "),
      wallets.length
    );
    const ethereumWallet = generateWalletFromMnemonic(
      "60",
      mnemonicWords.join(" "),
      wallets.length
    );

    if (solanaWallet && ethereumWallet) {
      const combinedWallet = {
        mnemonic: solanaWallet.mnemonic,
        solanaPublicKey: solanaWallet.publicKey,
        solanaPrivateKey: solanaWallet.privateKey,
        solanaPath: solanaWallet.path,
        ethereumPublicKey: ethereumWallet.publicKey,
        ethereumPrivateKey: ethereumWallet.privateKey,
        ethereumPath: ethereumWallet.path,
      };

      const updatedWallets = [...wallets, combinedWallet];
      // const updatedPathType = [pathTypes, pathTypes];
      const updatedPathType = [...pathTypes, pathTypes[0]];
      setWallets(updatedWallets);
      localStorage.setItem("wallets", JSON.stringify(updatedWallets));
      localStorage.setItem("pathTypes", JSON.stringify(updatedPathType));
      setVisiblePrivateKeys([...visiblePrivateKeys, false]);
      setVisiblePhrases([...visiblePhrases, false]);
      toast.success("Wallet generated successfully!");
    }
  };
  return (
    <div className="flex flex-col gap-4">
      {/* Display Secret Phrase */}
      {mnemonicWords && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.3,
            ease: "easeInOut",
          }}
          className="group flex flex-col items-center gap-4 cursor-pointer rounded-lg border border-primary/10 p-8"
        >
          <div
            className="flex w-full justify-between items-center"
            onClick={() => setShowMnemonic(!showMnemonic)}
          >
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              Your Recovery Phrase
            </h2>
            <Button
              onClick={() => setShowMnemonic(!showMnemonic)}
              variant="ghost"
            >
              {showMnemonic ? (
                <ChevronUp className="size-4" />
              ) : (
                <ChevronDown className="size-4" />
              )}
            </Button>
          </div>

          {showMnemonic && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
              className="flex flex-col w-full items-center justify-center"
              onClick={() => copyToClipboard(mnemonicWords.join(" "))}
            >
              <TextRevealCardPreview />

              <div className="text-sm md:text-base text-primary/50 flex w-full gap-2 items-center group-hover:text-primary/80 transition-all duration-300 mt-3">
                <Copy className="size-4" /> Copy
              </div>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Display wallet pairs */}
      {wallets.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.3,
            ease: "easeInOut",
          }}
          className="flex flex-col gap-8 mt-6"
        >
          <div className="flex md:flex-row flex-col justify-between w-full gap-4 md:items-center">
            <h2 className="tracking-tight text-3xl md:text-4xl font-extrabold">
              Dodo Wallet
            </h2>
            <div className="flex gap-2">
              {wallets.length > 1 && (
                <Button
                  variant={"ghost"}
                  onClick={() => setGridView(!gridView)}
                  className="hidden md:block"
                >
                  {gridView ? <Grid2X2 /> : <List />}
                </Button>
              )}
              <Button onClick={() => handleAddWallet()}>Add Account</Button>
              <AlertDialog>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you sure you want to delete all wallets?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      the wallet.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                    // onClick={() => handleClearWallets()}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
          <div
            className={`grid gap-6 grid-cols-1 col-span-1  ${
              gridView ? "md:grid-cols-2 lg:grid-cols-3" : ""
            }`}
          >
            {wallets.map((wallet: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.3 + index * 0.1,
                  duration: 0.3,
                  ease: "easeInOut",
                }}
                className="flex flex-col rounded-2xl border border-primary/10"
              >
                <div className="flex justify-between px-8 py-6">
                  <h3 className="font-bold text-2xl md:text-3xl tracking-tight ">
                    Account {index + 1}
                  </h3>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        className="flex gap-2 items-center"
                      >
                        <Trash className="size-4 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you sure you want to delete this account?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete the account. This action
                          cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteWallet(index)}
                          className="text-destructive"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
                <div className="flex flex-col gap-8 px-8 py-4 rounded-2xl bg-secondary/50">
                  <div className="flex flex-col w-full gap-2">
                    <div
                      onClick={() => copyToClipboard(wallet.solanaPublicKey)}
                    >
                      <span className="text-lg md:text-xl font-bold tracking-tight">
                        Solana Public Key
                      </span>
                      <p className="text-primary/80 font-medium cursor-pointer hover:text-primary transition-all duration-300 truncate">
                        {wallet.solanaPublicKey}
                      </p>
                    </div>
                    <div
                      className="mt-3"
                      onClick={() => copyToClipboard(wallet.ethereumPublicKey)}
                    >
                      <span className="text-lg md:text-xl font-bold tracking-tight">
                        Ethereum Public Key
                      </span>
                      <p className="text-primary/80 font-medium cursor-pointer hover:text-primary transition-all duration-300 truncate">
                        {wallet.ethereumPublicKey}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col w-full gap-2">
                    <span className="text-lg md:text-xl font-bold tracking-tight">
                      Solana Private Key
                    </span>
                    <div className="flex justify-between w-full items-center gap-2">
                      <p
                        onClick={() => copyToClipboard(wallet.solanaPrivateKey)}
                        className="text-primary/80 font-medium cursor-pointer hover:text-primary transition-all duration-300 truncate"
                      >
                        {visiblePrivateKeys[index]
                          ? wallet.solanaPrivateKey
                          : "•".repeat(wallet.mnemonic.length)}
                      </p>
                      <Button
                        variant="ghost"
                        onClick={() => togglePrivateKeyVisibility(index)}
                      >
                        {visiblePrivateKeys[index] ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </Button>
                    </div>

                    <span className="text-lg md:text-xl font-bold tracking-tight">
                      Ethereum Private Key
                    </span>
                    <div className="flex justify-between w-full items-center gap-2">
                      <p
                        onClick={() =>
                          copyToClipboard(wallet.ethereumPrivateKey)
                        }
                        className="text-primary/80 font-medium cursor-pointer hover:text-primary transition-all duration-300 truncate"
                      >
                        {visiblePrivateKeys[index]
                          ? wallet.ethereumPrivateKey
                          : "•".repeat(wallet.mnemonic.length)}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default WalletGenerator;
