"use client";
import React, { useEffect, useState } from "react";
import {
  TextRevealCard,
  TextRevealCardDescription,
  TextRevealCardTitle,
} from "./ui/text-reveal-card";

export function TextRevealCardPreview() {
  const [mnemonicWords, setMnemonicWords] = useState<string>("");

  useEffect(() => {
    const storedMnemonic = localStorage.getItem("mnemonics");

    if (storedMnemonic) {
      const mnemonicArray = JSON.parse(storedMnemonic);
      const mnemonicString = mnemonicArray.join(" ");
      setMnemonicWords(mnemonicString);
    }
  }, []);

  return (
    // <div className="flex items-center justify-center bg-[#0E0E10] h-[10rem] rounded-xl w-full">
    <>
      <TextRevealCard
        text="Reveal only when you are alone. Trust no one. You are the sole keeper of this key. Dododododo xD"
        revealText={mnemonicWords}
      >
        {/* <TextRevealCardTitle>
          Sometimes, you just need to see it.
        </TextRevealCardTitle>
        <TextRevealCardDescription>
          This is a text reveal card. Hover over the card to reveal the hidden
          text.
        </TextRevealCardDescription> */}
      </TextRevealCard>
      {/* </div> */}
    </>
  );
}
