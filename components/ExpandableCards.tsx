"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { toast } from "sonner";

export function ExpandableCardDemo() {
  const [active, setActive] = useState<(typeof cards)[number] | boolean | null>(
    null
  );
  const [publicKey, setPublicKey] = useState("");
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(false);
      }
    }

    if (active && typeof active === "object") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => {
    setActive(null);
    setBalance(null);
    setError(null);
  });

  const fetchBalance = async () => {
    if (!publicKey.trim()) {
      setError("Please enter a valid public key");
      return;
    }

    setLoading(true);
    setError(null);
    setBalance(null);

    try {
      let apiUrl = "";
      let responseData: any;

      if (active && typeof active === "object") {
        switch (active.title) {
          case "Solana (SOL)":
            apiUrl = "https://api.devnet.solana.com";
            const solanaResponse = await fetch(apiUrl, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                jsonrpc: "2.0",
                id: 1,
                method: "getBalance",
                params: [publicKey],
              }),
            });
            responseData = await solanaResponse.json();
            setBalance(
              responseData.result?.value
                ? (responseData.result.value / 1000000000).toFixed(4) + " SOL"
                : "0 SOL"
            );
            break;

          case "Ethereum (ETH)":
            toast.success("Right now, this feature works only with Solana. Support for this token is coming soon!");
            // For Ethereum, you would typically use a service like Etherscan or Infura
            // setBalance("Ethereum balance fetching would be implemented here");
            break;

          case "USD Coin (USDC)":
            toast.success("Right now, this feature works only with Solana. Support for this token is coming soon!");
            // For USDC on Solana, you'd need to get token accounts
            // setBalance("USDC balance fetching would be implemented here");
            break;

          case "Bitcoin (BTC)":
            toast.success("Right now, this feature works only with Solana. Support for this token is coming soon!");
            // For Bitcoin, you'd use a Bitcoin blockchain explorer API
            // setBalance("Bitcoin balance fetching would be implemented here");
            break;

          default:
            setBalance(null);
        }
      }
    } catch (err) {
      setError("Failed to fetch balance. Please try again.");
      console.error("Error fetching balance:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {active && typeof active === "object" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 backdrop-blur-sm h-full w-full z-10"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && typeof active === "object" ? (
          <div className="fixed inset-0 grid place-items-center z-[100] mt-10">
            <motion.button
              key={`button-${active.title}-${id}`}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.05 } }}
              className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-5 w-5"
              onClick={() => {
                setActive(null);
                setBalance(null);
                setError(null);
              }}
            >
              <CloseIcon />
            </motion.button>
            <motion.div
              layoutId={`card-${active.title}-${id}`}
              ref={ref}
              className="w-full max-w-[400px] h-fit md:h-fit md:max-h-[80%] flex flex-col bg-white dark:bg-neutral-900 sm:rounded-2xl overflow-hidden"
            >
              <motion.div layoutId={`image-${active.title}-${id}`}>
                <img
                  width={200}
                  height={200}
                  src={active.src}
                  alt={active.title}
                  className="w-full h-60 lg:h-60 sm:rounded-tr-lg sm:rounded-tl-lg object-cover object-top"
                />
              </motion.div>

              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <motion.h3
                      layoutId={`title-${active.title}-${id}`}
                      className="font-bold text-sm text-neutral-700 dark:text-neutral-200"
                    >
                      {active.title}
                    </motion.h3>
                    <motion.p
                      layoutId={`description-${active.description}-${id}`}
                      className="text-xs text-neutral-600 dark:text-neutral-400"
                    >
                      {active.description}
                    </motion.p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Account Public Key
                    </label>
                    <input
                      type="text"
                      value={publicKey}
                      onChange={(e) => setPublicKey(e.target.value)}
                      placeholder="Enter public key"
                      className="w-full px-3 py-2 text-xs border text-black border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 dark:bg-neutral-800 dark:border-neutral-700"
                    />
                  </div>

                  <button
                    onClick={fetchBalance}
                    disabled={loading}
                    className="w-full px-4 py-2 text-xs font-bold text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-1 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Checking..." : "Check Balance"}
                  </button>

                  {error && (
                    <p className="text-xs text-red-500 dark:text-red-400">
                      {error}
                    </p>
                  )}

                  {balance && (
                    <div className="mt-2 p-3 bg-neutral-100 dark:bg-neutral-800 rounded-md">
                      <p className="text-xs font-medium text-neutral-800 dark:text-neutral-200">
                        Balance:{" "}
                        <span className="font-bold text-green-500">
                          {balance}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
      <ul className="max-w-xl mx-auto w-full gap-3">
        {cards.map((card, index) => (
          <motion.div
            layoutId={`card-${card.title}-${id}`}
            key={`card-${card.title}-${id}`}
            onClick={() => setActive(card)}
            className="p-3 flex flex-col md:flex-row justify-between items-center hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-lg cursor-pointer  border-2 border-white my-3 hover:border hover:border-black"
          >
            <div className="flex gap-3 flex-col md:flex-row">
              <motion.div layoutId={`image-${card.title}-${id}`}>
                <img
                  width={80}
                  height={80}
                  src={card.src}
                  alt={card.title}
                  className="h-32 w-32 md:h-12 md:w-12 rounded-md object-cover object-top"
                />
              </motion.div>
              <div className="">
                <motion.h3
                  layoutId={`title-${card.title}-${id}`}
                  className="font-medium text-sm text-neutral-800 dark:text-neutral-200 text-center md:text-left"
                >
                  {card.title}
                </motion.h3>
                <motion.p
                  layoutId={`description-${card.description}-${id}`}
                  className="text-xs text-yellow-500 dark:text-neutral-400 text-center md:text-left"
                >
                  {card.description}
                </motion.p>
              </div>
            </div>
            <motion.button
              layoutId={`button-${card.title}-${id}`}
              className="px-3 py-1.5 text-xs rounded-full font-bold bg-gray-100 hover:bg-green-500 hover:text-white text-black mt-3 md:mt-0"
            >
              {card.ctaText}
            </motion.button>
          </motion.div>
        ))}
      </ul>
    </>
  );
}

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.05 } }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3 w-3 text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};

const cards = [
  {
    description: "Cryptocurrency",
    title: "Solana (SOL)",
    src: "/solana-sol-logo.png",
    ctaText: "Check Balance",
    ctaLink: "https://www.binance.com/en/trade/SOL_USDT",
    content: () => {
      return (
        <p className="text-xs">
          Solana is a high-performance blockchain supporting decentralized apps
          and crypto-currencies.
        </p>
      );
    },
  },
  {
    description: "Cryptocurrency",
    title: "Ethereum (ETH)",
    src: "/ethereum-eth-logo.png",
    ctaText: "Check Balance",
    ctaLink: "https://www.binance.com/en/trade/ETH_USDT",
    content: () => {
      return (
        <p className="text-xs">
          Ethereum is a decentralized, open-source blockchain with smart
          contract functionality.
        </p>
      );
    },
  },
  {
    description: "Stablecoin",
    title: "USD Coin (USDC)",
    src: "/usd-coin-usdc-logo.png",
    ctaText: "Check Balance",
    ctaLink: "https://www.binance.com/en/trade/USDC_USDT",
    content: () => {
      return (
        <p className="text-xs">
          USD Coin is a stablecoin pegged to the US dollar and regulated by
          financial authorities.
        </p>
      );
    },
  },
  {
    description: "Cryptocurrency",
    title: "Bitcoin (BTC)",
    src: "/bitcoin-btc-logo.png",
    ctaText: "Check Balance",
    ctaLink: "https://www.binance.com/en/trade/BTC_USDT",
    content: () => {
      return (
        <p className="text-xs">
          Bitcoin is the first decentralized cryptocurrency, created in 2009 by
          an anonymous person or group.
        </p>
      );
    },
  },
];
