import { ExpandableCardDemo } from "./ExpandableCards";

export default function Token() {
  return (
    <div className="my-10 p-10 rounded-lg">
      <ExpandableCardDemo />
    </div>
  );
}


// import {
//   IconCurrencyBitcoin,
//   IconCurrencyDollar,
//   IconCurrencyEthereum,
//   IconCurrencySolana,
// } from "@tabler/icons-react";

// export default function Token() {
//   const tokens = [
//     {
//       symbol: "SOL",
//       name: "Solana",
//       balance: "0",
//       value: "$2,260.00",
//       change: "+12.4%",
//       positive: true,
//       icon: <IconCurrencySolana />,
//     },
//     {
//       symbol: "ETH",
//       name: "Ethereum",
//       balance: "0",
//       value: "$4,892.50",
//       change: "+5.2%",
//       positive: true,
//       icon: <IconCurrencyEthereum />,
//     },
//     {
//       symbol: "USDC",
//       name: "USD Coin",
//       balance: "0",
//       value: "$1,250.00",
//       change: "0.0%",
//       positive: true,
//       icon: <IconCurrencyDollar />,
//     },
//     {
//       symbol: "BTC",
//       name: "Bitcoin",
//       balance: "0",
//       value: "$5,425.75",
//       change: "-2.1%",
//       positive: false,
//       icon: <IconCurrencyBitcoin />,
//     },
//   ];

//   return (
//     <div className="mt-10">
//       <div className="space-y-4">
//         {tokens.map((token, index) => (
//           <div
//             key={index}
//             className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl border border-gray-700/30 hover:bg-gray-800/50 transition-colors"
//           >
//             <div className="flex items-center space-x-4">
//               <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-lg font-bold">
//                 {token.icon}
//               </div>
//               <div>
//                 <h3 className="text-white font-medium">{token.symbol}</h3>
//                 <p className="text-gray-400 text-sm">{token.name}</p>
//               </div>
//             </div>

//             <div className="text-right">
//               <p className="text-white font-medium">{token.balance}</p>
//               <div className="flex items-center space-x-2">
//                 <p className="text-gray-400 text-sm">{token.value}</p>
//                 {/* <span
//                   className={`text-sm font-medium ${
//                     token.positive ? "text-green-400" : "text-red-400"
//                   }`}
//                 >
//                   {token.change}
//                 </span> */}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

