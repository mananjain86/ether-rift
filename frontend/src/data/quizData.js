export const quizQuestions = [
  // Section 1: Core DeFi Concepts
  {
    id: 1,
    type: 'practical',
    question: "What is the primary purpose of a liquidity pool in DeFi?",
    options: [
      { id: 'a', text: "To securely store user funds in a centralized vault" },
      { id: 'b', text: "To facilitate decentralized trading without a traditional order book" },
      { id: 'c', text: "To vote on governance proposals" },
      { id: 'd', text: "To issue new tokens through mining" }
    ],
    correctAnswer: 'b',
    explanation: "Liquidity pools are the foundation of Automated Market Makers (AMMs). They contain pairs of tokens that users can trade against, enabling decentralized exchange without relying on order books."
  },
  {
    id: 2,
    type: 'practical',
    question: "When you provide liquidity to a Uniswap V2 pool, what do you receive in return?",
    options: [
      { id: 'a', text: "A fixed interest rate paid in ETH" },
      { id: 'b', text: "Governance tokens for the Uniswap DAO" },
      { id: 'c', text: "LP (Liquidity Provider) tokens representing your share of the pool" },
      { id: 'd', text: "A receipt for your locked tokens" }
    ],
    correctAnswer: 'c',
    explanation: "LP tokens act as a claim on your portion of the liquidity pool. You can redeem them at any time to get your underlying tokens back, plus any accrued trading fees."
  },
  {
    id: 3,
    type: 'practical',
    question: "What is the main advantage of using a Decentralized Exchange (DEX) over a Centralized Exchange (CEX)?",
    options: [
      { id: 'a', text: "They offer 24/7 customer phone support" },
      { id: 'b', text: "You maintain self-custody of your assets" },
      { id: 'c', text: "Transactions are always faster and cheaper" },
      { id: 'd', text: "They are regulated by government agencies" }
    ],
    correctAnswer: 'b',
    explanation: "On a DEX, you trade directly from your own wallet (e.g., MetaMask). This means you never give up control of your private keys, eliminating the counterparty risk of an exchange being hacked or becoming insolvent."
  },
  {
    id: 4,
    type: 'risk management',
    question: "You've supplied ETH and USDC to a liquidity pool. The price of ETH increases significantly. When you withdraw your liquidity, you notice you have less ETH and more USDC than you initially deposited. What is this phenomenon called?",
    options: [
      { id: 'a', text: "Slippage" },
      { id: 'b', text: "Impermanent Loss" },
      { id: 'c', text: "Gas fees" },
      { id: 'd', text: "A smart contract bug" }
    ],
    correctAnswer: 'b',
    explanation: "Impermanent loss is the difference in value between holding tokens in your wallet versus providing them to a liquidity pool. It occurs when the price of the tokens in the pool changes."
  },
  {
    id: 5,
    type: 'practical',
    question: "What is the role of a 'blockchain oracle' like Chainlink in the DeFi ecosystem?",
    options: [
      { id: 'a', text: "To predict the future price of crypto assets" },
      { id: 'b', text: "To connect smart contracts with real-world, off-chain data" },
      { id: 'c', text: "To audit the security of smart contracts" },
      { id: 'd', text: "To reduce the gas fees of transactions" }
    ],
    correctAnswer: 'b',
    explanation: "Smart contracts cannot access data outside of their native blockchain. Oracles act as a secure bridge, feeding them essential off-chain information like asset prices, weather data, or sports results."
  },
  {
    id: 6,
    type: 'practical',
    question: "What is the purpose of a Decentralized Autonomous Organization (DAO)?",
    options: [
      { id: 'a', text: "To build and maintain DeFi applications" },
      { id: 'b', text: "To allow a community to govern a protocol through voting" },
      { id: 'c', text: "To provide insurance for DeFi protocols" },
      { id: 'd', text: "To enforce regulations on the blockchain" }
    ],
    correctAnswer: 'b',
    explanation: "A DAO is an entity with no central leadership. Decisions are made from the bottom-up, governed by a community organized around a specific set of rules enforced on a blockchain."
  },
  {
    id: 7,
    type: 'practical',
    question: "In a DeFi lending protocol like Aave, what happens if the value of your collateral falls below a certain threshold?",
    options: [
      { id: 'a', text: "Your loan is automatically forgiven" },
      { id: 'b', text: "The protocol sends you a margin call email" },
      { id: 'c', text: "Your collateral is sold (liquidated) to repay the loan" },
      { id: 'd', text: "Your interest rate increases" }
    ],
    correctAnswer: 'c',
    explanation: "To protect lenders, protocols use over-collateralization. If your collateral's value drops too low (your 'Health Factor' decreases), other users can liquidate it to ensure the loan is repaid."
  },
  {
    id: 8,
    type: 'practical',
    question: "What defines a DeFi 'flash loan'?",
    options: [
      { id: 'a', text: "A loan that is approved in less than a minute" },
      { id: 'b', text: "A loan that must be borrowed and repaid within the same blockchain transaction" },
      { id: 'c', text: "A small loan for paying gas fees" },
      { id: 'd', text: "A loan provided by a centralized flash-lending company" }
    ],
    correctAnswer: 'b',
    explanation: "Flash loans are uncollateralized loans that are programmatically enforced to be repaid in the very same transaction. If the borrower cannot repay, the entire transaction fails. They are often used for arbitrage."
  },
  {
    id: 9,
    type: 'practical',
    question: "What is the primary benefit of using a Layer 2 scaling solution like Arbitrum or Optimism?",
    options: [
      { id: 'a', text: "It offers more token variety than the Ethereum mainnet" },
      { id: 'b', text: "It provides better security guarantees than Ethereum" },
      { id: 'c', text: "It allows for faster and cheaper transactions while leveraging Ethereum's security" },
      { id: 'd', text: "It is a completely separate blockchain with no connection to Ethereum" }
    ],
    correctAnswer: 'c',
    explanation: "Layer 2 solutions process transactions 'off-chain' and then bundle them into a single transaction submitted to the Ethereum mainnet (Layer 1). This significantly reduces gas fees and increases speed for users."
  },
  {
    id: 10,
    type: 'practical',
    question: "What is 'yield farming'?",
    options: [
      { id: 'a', text: "A way to grow digital crops in a blockchain game" },
      { id: 'b', text: "The process of staking or lending crypto assets to generate high returns or rewards" },
      { id: 'c', text: "Mining new cryptocurrencies using farm-based servers" },
      { id: 'd', text: "A type of long-term crypto investment strategy" }
    ],
    correctAnswer: 'b',
    explanation: "Yield farming involves strategically moving assets between different DeFi protocols to maximize returns from liquidity mining, lending, and other reward programs."
  },

  // Section 2: Technical Analysis (Graphs)
  {
    id: 11,
    type: 'graph',
    question: "This price chart shows two consecutive lows at roughly the same price level, followed by a breakout above a resistance line. What reversal pattern is this?",
    image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDQwMCAyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgYmFja2dyb3VuZD0iIzFmMjkzNyI+PHN0eWxlPmZvbnQgeyBmb250LWZhbWlseTogc2Fucy1zZXJpZjsgZm9udC1zaXplOiAxMnB4OyBmaWxsOiAjZmZmZmZmOyB9PC9zdHlsZT48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMWYyOTM3IiAvPjxwYXRoIGQ9Ik0gMjAgODAgQyA0MCA0MCA2MCA0MCA4MCA4MCBMIDEyMCAxMjAgQyAxNDAgMTYwIDE2MCAxNjAgMTgwIDEyMCBMIDIyMCA0MCBDIDI0MCAyMCAyNjAgMjAgMjgwIDQwIEwgMzAwIDgwIEMgMzIwIDEyMCAzNDAgMTIwIDM2MCA4MCBMIDM4MCA2MCIgc3Ryb2tlPSJyZWQiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIgLz48cGF0aCBkPSJNIDIyMCA0MCBDIDI0MCAyMCAyNjAgMjAgMjgwIDQwIEwgMzAwIDgwIEMgMzIwIDEyMCAzNDAgMTIwIDM2MCA4MCAxIDIyMCA0MCBDIDI0MCAyMCAyNjAgMjAgMjgwIDQwIEwgMzA1IDg1IEMgMzE1IDExMCAzMjUgMTEwIDMzNSA4NSBMIDM1MCA0MCBDIDM2MCAyMCAzNzAgMjAgMzgwIDQwIiBzdHJva2U9IiMyMmMyN2EiIHN0cm9rZS13aWR0aD0iMyIgZmlsbD0ibm9uZSIgLz48bGluZSB4MT0iMjEwIiB5MT0iNDAiIHgyPSIzOTUiIHkyPSI0MCIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWRhc2hhcnJheT0iNCw0IiAvPjx0ZXh0IHg9IjE1MCIgeT0iMjUiIGZpbGw9IiNmZmZmZmYiIGZvbnQtc2l6ZT0iMTQiIGZvbnQtd2VpZ2h0PSJib2xkIj5Eb3VibGUgQm90dG9tPC90ZXh0Pjx0ZXh0IHg9IjI1MCIgeT0iMTcwIiBjbGFzcz0iZm9udCI+Qm90dG9tIDE8L3RleHQ+PHRleHQgeD0iMzMwIiB5PSIxNzAiIGNsYXNzPSJmb250Ij5Cb3R0b20gMjwv dGV4dD48dGV4dCB4PSIxNTUiIHk9IjQ1IiBjbGFzcz0iZm9udCI+TmVja2xpbmUgUmVzaXN0YW5jZTwvdGV4dD48L3N2Zz4=",
    options: [
      { id: 'a', text: "Double Bottom" },
      { id: 'b', text: "Head and Shoulders" },
      { id: 'c', text: "Rising Wedge" },
      { id: 'd', text: "Bear Flag" }
    ],
    correctAnswer: 'a',
    explanation: "A Double Bottom is a bullish reversal pattern. It resembles the letter 'W' and indicates that selling pressure is exhausted at a support level, potentially leading to an uptrend."
  },
  {
    id: 12,
    type: 'graph',
    question: "In this Volume Profile chart, what does the 'Point of Control' (POC) signify?",
    image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDQwMCAyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHN0eWxlPmZvbnQgeyBmb250LWZhbWlseTogc2Fucy1zZXJpZjsgZm9udC1zaXplOiAxMnB4OyBmaWxsOiAjZmZmZmZmOyB9PC9zdHlsZT48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMWYyOTM3IiAvPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDIwLCAxMCkiPjxyZWN0IHg9IjAiIHk9IjEwIiB3aWR0aD0iNjAiIGhlaWdodD0iMTgiIGZpbGw9IiMzNzQxNTEiIC8+PHJlY3QgeD0iMCIgeT0iMzAiIHdpZHRoPSIxMTAiIGhlaWdodD0iMTgiIGZpbGw9IiMzNzQxNTEiIC8+PHJlY3QgeD0iMCIgeT0iNTAiIHdpZHRoPSIxNDAiIGhlaWdodD0iMTgiIGZpbGw9IiMzNzQxNTEiIC8+PHJlY3QgeD0iMCIgeT0iNzAiIHdpZHRoPSIxOTAiIGhlaWdodD0iMTgiIGZpbGw9IiM5OTEwMTYiIC8+PHJlY3QgeD0iMCIgeT0iOTAiIHdpZHRoPSIxNjAiIGhlaWdodD0iMTgiIGZpbGw9IiMzNzQxNTEiIC8+PHJlY3QgeD0iMCIgeT0iMTEwIiB3aWR0aD0iMTMwIiBoZWlnaHQ9IjE4IiBmaWxsPSIjMzc0MTUxIiAvPjxyZWN0IHg9IjAiIHk9IjEzMCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxOCIgZmlsbD0iIzM3NDE1MSIgLz48cmVjdCB4PSIwIiB5PSIxNTAiIHdpZHRoPSI3MCIgaGVpZ2h0PSIxOCIgZmlsbD0iIzM3NDE1MSIgLz48dGV4dCB4PSIyMDAiIHk9ODUgamF2YS1mZWF0dXJlLXNldHRpbmdzPSJmZWF0Ij48dHNwYW4gY2xhc3M9ImZvbnQiIGZvbnQtd2VpZ2h0PSJib2xkIj5Qb2ludCBvZiBDb250cm9sIChQT0MpPC90c3Bhbj48dHNwYW4gY2xhc3M9ImZvbnQiIGR5PSIxLjJlbSI+KExvbmdlc3QgVm9sdW1lIEJhcik8L3RzcGFuPjwvdGV4dD48bGluZSB4MT0iMTkwIiB5MT0iNzkiIHgyPSIxOTgiIHkyPSI3OSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIxIiAvPjwvZz48dGV4dCB4PSIzNDAiIHk9IjE4MCIgY2xhc3M9ImZvbnQiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc3R5bGU9ImZvbnQtc2l6ZTogMTBweDsiIHRleHQtYW5jaG9yPSJtaWRkbGUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0zMjUpIHRyYW5zbGF0ZSgtMTE4KSIgcm90YXRlKC05MCk+UHJpY2U8L3RleHQ+PHRleHQgeD0iMTAwIiB5PSIxOTUiIGNsYXNzPSJmb250IiBmb250LXNpemU9IjEwcHgiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlZvbHVtZTwvdGV4dD48L3N2Zz4=",
    options: [
      { id: 'a', text: "The price with the highest number of buyers" },
      { id: 'b', text: "The average price of the trading session" },
      { id: 'c', text: "The price level with the most trading volume" },
      { id: 'd', text: "The opening price of the day" }
    ],
    correctAnswer: 'c',
    explanation: "The POC is the price at which the most significant amount of trading occurred. It acts as a magnet for price and is a key level of support or resistance."
  },
  {
    id: 13,
    type: 'graph',
    question: "The chart shows a candlestick with a long lower wick, a small body, and little to no upper wick, appearing after a downtrend. What is this pattern called?",
    image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDQwMCAyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHN0eWxlPmZvbnQgeyBmb250LWZhbWlseTogc2Fucy1zZXJpZjsgZm9udC1zaXplOiAxNHB4OyBmaWxsOiAjZmZmZmZmOyB9PC9zdHlsZT48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMWYyOTM3IiAvPjxwYXRoIGQ9Ik0gNTAgNDAgTCA4MCA4MCBMIDExMCA1MCBMIDE0MCA5MCIgc3Ryb2tlPSIjZGMzNTQ1IiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiIC8+PHJlY3QgeD0iMTM4IiB5PSI5MCIgd2lkdGg9IjQiIGhlaWdodD0iNjAiIGZpbGw9IiMyMmMyN2EiIC8+PHJlY3QgeD0iMTMwIiB5PSIxMDAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIxMiIgZmlsbD0iIzIyYzI3YSIgLz48dGV4dCB4PSIxNzUiIHk9IjEzMCIgY2xhc3M9ImZvbnQiPkJ1bGxpc2ggSGFtbWVyPC90ZXh0Pjx0ZXh0IHg9IjgwIiB5PSIyNSIgY2xhc3M9ImZvbnQiIHN0eWxlPSJmb250LXNpemU6IDEycHg7Ij5Eb3dudHJlbmQ8L3RleHQ+PC9zdmc+",
    options: [
      { id: 'a', text: "Shooting Star" },
      { id: 'b', text: "Hanging Man" },
      { id: 'c', text: "Doji" },
      { id: 'd', text: "Hammer" }
    ],
    correctAnswer: 'd',
    explanation: "A Hammer is a bullish reversal candlestick pattern. It signifies that sellers pushed the price down, but buyers stepped in aggressively to close the price near its open."
  },
  {
    id: 14,
    type: 'graph',
    question: "This chart shows the price making a new high, but the Relative Strength Index (RSI) indicator makes a lower high. What is this phenomenon called?",
    image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDQwMCAyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHN0eWxlPmZvbnQgeyBmb250LWZhbWlseTogc2Fucy1zZXJpZjsgZm9udC1zaXplOiAxMnB4OyBmaWxsOiAjZmZmZmZmOyB9PC9zdHlsZT48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMWYyOTM3IiAvPjxwYXRoIGQ9Ik0gMjAgODAgQyA4MCAxMDAgMTIwIDYwIDE4MCAzMCBMIDI0MCA1MCBDIDI4MCAyMCAzMjAgNDAgMzgwIDMwIiBzdHJva2U9IiMyMmMyN2EiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIgLz48bGluZSB4MT0iMTgwIiB5MT0iMzAiIHgyPSIzODAiIHkyPSIzMCIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjEiIHN0cm9rZS1kYXNoYXJyYXk9IjIsMiIgLz48cGF0aCBkPSJNIDIwIDE4MCBDIDgwIDE0MCAxMjAgMTYwIDE4MCAxNTAgTCAyNDAgMTcwIEMgMjgwIDE0NSAzMjAgMTU1IDM4MCAxNjUiIHN0cm9rZT0ib3JhbmdlIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiIC8+PGxpbmUgeDE9IjE4MCIgeTE9IjE1MCIgeDI9IjM4MCIgeTI9IjE2NSIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjEiIHN0cm9rZS1kYXNoYXJyYXk9IjIsMiIgLz48dGV4dCB4PSIyMCIgeT0iMjAiIGNsYXNzPSJmb250Ij5QcmljZSAoSGlnaGVyIEhpZ2gpPC90ZXh0Pjx0ZXh0IHg9IjIwIiB5PSIxMzUiIGNsYXNzPSJmb250Ij5SU0kgKExvd2VyIEhpZ2gpPC90ZXh0Pjx0ZXh0IHg9IjE0MCIgeT0iMTAwIiBjbGFzcz0iZm9udCIgZm9udC1zaXplPSIxNHB4IiBmb250LXdlaWdodD0iYm9sZCI+QmVhcmlzaCBEaXZlcmdlbmNlPC90ZXh0Pjwvc3ZnPg==",
    options: [
      { id: 'a', text: "Bullish Convergence" },
      { id: 'b', text: "Bearish Divergence" },
      { id: 'c', text: "RSI Reset" },
      { id: 'd', text: "Volume Anomaly" }
    ],
    correctAnswer: 'b',
    explanation: "Bearish divergence is a warning sign that the upward momentum is weakening and a potential trend reversal or pullback could occur."
  },
  {
    id: 15,
    type: 'graph',
    question: "In a strong uptrend, which moving average is a trader most likely to watch for a short-term support level?",
    image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDQwMCAyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHN0eWxlPmZvbnQgeyBmb250LWZhbWlseTogc2Fucy1zZXJpZjsgZm9udC1zaXplOiAxMnB4OyBmaWxsOiAjZmZmZmZmOyB9PC9zdHlsZT48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMWYyOTM3IiAvPjxwYXRoIGQ9Ik0gMjAgMTgwIEMgODAgMTIwIDEyMCAxMDAgMTgwIDYwIEMgMjQwIDgwIDI4MCA1MCAzNDAgMzAiIHN0cm9rZT0iIzIyYzI3YSIgc3Ryb2tlLXdpZHRoPSIyLjUiIGZpbGw9Im5vbmUiIC8+PHBhdGggZD0iTSAyMCAxNzAgQyA3MC AxelIDE1MCAxMTUgMTEwIDE3MCA3MCAxOTAgNDAgMjEwIDIwIDI0MCA0MCAyODAgMzAgMzIwIDQwIDM1MCAyMCIgc3Ryb2tlPSIjMzQ5OGRiIiBzdHJva2Utd2lkdGg9IjEuNSIgZmlsbD0ibm9uZSIgLz48dGV4dCB4PSIxODAiIHk9IjE4MCIgY2xhc3M9ImZvbnQiIHN0eWxlPSJmaWxsOiAjMzQ5OGRiOyI+MjEtZGF5IEVNQSAoU3VwcG9ydCk8L3RleHQ+PHRleHQgeD0iMzAiIHk9IjMwIiBjbGFzcz0iZm9udCI+U3Ryb25nIFVwdHJlbmQ8L3RleHQ+PC9zdmc+",
    options: [
      { id: 'a', text: "200-day Simple Moving Average (SMA)" },
      { id: 'b', text: "50-day Simple Moving Average (SMA)" },
      { id: 'c', text: "21-day Exponential Moving Average (EMA)" },
      { id: 'd', text: "A horizontal support line" }
    ],
    correctAnswer: 'c',
    explanation: "Shorter-term moving averages like the 21 EMA are often used by traders to gauge dynamic support and resistance in a fast-moving trend."
  },
  {
    id: 16,
    type: 'graph',
    question: "This chart shows a large green candlestick body that completely engulfs the previous red candlestick. What pattern is this?",
    image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDQwMCAyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHN0eWxlPmZvbnQgeyBmb250LWZhbWlseTogc2Fucy1zZXJpZjsgZm9udC1zaXplOiAxNHB4OyBmaWxsOiAjZmZmZmZmOyB9PC9zdHlsZT48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMWYyOTM3IiAvPjxyZWN0IHg9IjEzMCIgeT0iOTAiIHdpZHRoPSIyMCIgaGVpZ2h0PSI0MCIgZmlsbD0iI2RjMzU0NSIgLz48cmVjdCB4PSIxNjAiIHk9IjcwIiB3aWR0aD0iMzAiIGhlaWdodD0iODAiIGZpbGw9IiMyMmMyN2EiIC8+PHRleHQgeD0iMTAwIiB5PSI0MCIgY2xhc3M9ImZvbnQiPkJ1bGxpc2ggRW5ndWxmaW5nPC90ZXh0Pjx0ZXh0IHg9IjEyOCIgeT0iMTQ1IiBjbGFzcz0iZm9udCIgZm9udC1zaXplPSIxMnB4Ij5CZWFyaXNoPC90ZXh0Pjx0ZXh0IHg9IjE2MCIgeT0iMTY1IiBjbGFzcz0iZm9udCIgZm9udC1zaXplPSIxMnB4Ij5CdWxsaXNoPC90ZXh0Pjwvc3ZnPg==",
    options: [
      { id: 'a', text: "Bearish Engulfing" },
      { id: 'b', text: "Piercing Pattern" },
      { id: 'c', text: "Bullish Engulfing" },
      { id: 'd', text: "Tweezer Bottoms" }
    ],
    correctAnswer: 'c',
    explanation: "A Bullish Engulfing pattern is a strong reversal signal, suggesting that buyers have overpowered sellers and a potential move upwards is imminent."
  },
  {
    id: 17,
    type: 'graph',
    question: "During an uptrend, price pulls back to a certain level before continuing up. When a tool is drawn from the swing low to the swing high, this level aligns with 61.8%. What tool is being used?",
    image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDQwMCAyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHN0eWxlPmZvbnQgeyBmb250LWZhbWlseTogc2Fucy1zZXJpZjsgZm9udC1zaXplOiAxMnB4OyBmaWxsOiAjZmZmZmZmOyB9PC9zdHlsZT48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMWYyOTM3IiAvPjxwYXRoIGQ9Ik0gMjAgMTgwIEwgMTQwIDQwIEwgMTkwIDEyMCBMIDM4MCA1MCIgc3Ryb2tlPSIjMmJjMDdjIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiIC8+PGxpbmUgeDE9IjIwIiB5MT0iMTgwIiB4Mj0iMTQwIiB5Mj0iNDAiIHN0cm9rZT0iI2YxYzQwZiIgc3Ryb2tlLXdpZHRoPSIxIiBzdHJva2UtZGFzaGFycmF5PSIyLDMiIC8+PGxpbmUgeDE9IjAiIHkyPSIxMjEuNTIiIHgyPSI0MDAiIHkxPSIxMjEuNTIiIHN0cm9rZT0iIzM0OTRkYiIgc3Ryb2tlLXdpZHRoPSIxIiAvPjxsaW5lIHgxPSIwIiB5Mj0iMTEwIiB4Mj0iNDAwIiB5MT0iMTEwIiBzdHJva2U9IiNlNmI4NTciIHN0cm9rZS13aWR0aD0iMSIgLz48bGluZSB4MT0iMCIgeTI9Ijk4LjQ4IiB4Mj0iNDAwIiB5MT0iOTguNDgiIHN0cm9rZT0iI2QzNTQwYyIgc3Ryb2tlLXdpZHRoPSIxIiAvPjx0ZXh0IHg9IjM0MCIgeT0iMTI1IiBjbGFzcz0iZm9udCI+MC42MTg8L3RleHQ+PHRleHQgeD0iMzQwIiB5PSIxMTQiIGNsYXNzPSJmb250Ij4wLjU8L3RleHQ+PHRleHQgeD0iMzQwIiB5PSIxMDQiIGNsYXNzPSJmb250Ij4wLjM4Mjwv dGV4dD48dGV4dCB4PSIxMCIgeT0iMTk1IiBjbGFzcz0iZm9udCI+U3dpbmcgTG93PC90ZXh0Pjx0ZXh0IHg9IjEyMCIgeT0iMzUiIGNsYXNzPSJmb250Ij5Td2luZyBIaWdoPC90ZXh0Pjx0ZXh0IHg9IjE5MCIgeT0iMTM1IiBjbGFzcz0iZm9udCI+UHVsbGJhY2s8L3RleHQ+PC9zdmc+",
    options: [
      { id: 'a', text: "Gann Fan" },
      { id: 'b', text: "Pitchfork" },
      { id: 'c', text: "Fibonacci Retracement" },
      { id: 'd', text: "Pivot Points" }
    ],
    correctAnswer: 'c',
    explanation: "The Fibonacci Retracement tool uses key ratios (like 23.6%, 38.2%, 61.8%) to identify potential support and resistance levels. The 61.8% level is often called the 'golden ratio'."
  },
  {
    id: 18,
    type: 'graph',
    question: "This MACD indicator shows the MACD line crossing above the signal line. What does this typically signal?",
    image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDQwMCAyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHN0eWxlPmZvbnQgeyBmb250LWZhbWlseTogc2Fucy1zZXJpZjsgZm9udC1zaXplOiAxMnB4OyBmaWxsOiAjZmZmZmZmOyB9PC9zdHlsZT48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMWYyOTM3IiAvPjxwYXRoIGQ9Ik0gMjAgODAgQyA4MCAxMjAgMTQwIDExMCAyMDAgMTAwIEMgMjYwIDkwIDMyMCA1MCAzODAgNzUiIHN0cm9rZT0icmVkIiBzdHJva2Utd2lkdGg9IjEuNSIgZmlsbD0ibm9uZSIgLz48cGF0aCBkPSJNIDIwIDEyMCBDIDgwIDEyNSAxNDAgMTAwIDIwMCA5MCBDIDI2MCA4MCAzMjAgNzAgMzgwIDYwIiBzdHJva2U9IiMzNDk4ZGIiIHN0cm9rZS13aWR0aD0iMS41IiBmaWxsPSJub25lIiAvPjxjaXJjbGUgY3g9IjIwMCIgY3k9Ijk1IiByPSI1IiBmaWxsPSIjMjJjMjdhIiAvPjx0ZXh0IHg9IjIwIiB5PSIyMCIgY2xhc3M9ImZvbnQiIHN0eWxlPSJmaWxsOiAjMzQ5OGRiOyI+TUFDRCBsaW5lPC90ZXh0Pjx0ZXh0IHg9IjIwIiB5PSI0MCIgY2xhc3M9ImZvbnQiIHN0eWxlPSJmaWxsOiByZWQ7Ij5TaWduYWwgbGluZTwvdGV4dD48dGV4dCB4PSIyMjAiIHk9Ijg1IiBjbGFzcz0iZm9udCIgZm9udC1zaXplPSIxNHB4IiBmb250LXdlaWdodD0iYm9sZCI+QnVsbGlzaCBDcm9zc292ZXI8L3RleHQ+PC9zdmc+",
    options: [
      { id: 'a', text: "A sell signal" },
      { id: 'b', text: "A sign of market consolidation" },
      { id: 'c', text: "A buy signal or bullish momentum" },
      { id: 'd', text: "An overbought condition" }
    ],
    correctAnswer: 'c',
    explanation: "A bullish crossover in the MACD (Moving Average Convergence Divergence) indicator suggests that upward momentum is increasing and could be a good entry point for a long position."
  },
  {
    id: 19,
    type: 'graph',
    question: "A chart shows the price breaking below a key horizontal support level that has been respected multiple times. What is this event called?",
    image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDQwMCAyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHN0eWxlPmZvbnQgeyBmb250LWZhbWlseTogc2Fucy1zZXJpZjsgZm9udC1zaXplOiAxMnB4OyBmaWxsOiAjZmZmZmZmOyB9PC9zdHlsZT48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMWYyOTM3IiAvPjxwYXRoIGQ9Ik0gMjAgNjAgTCA4MCAzMCBMIDE0MCA4MCBMIDIwMCA0MCBMIDI2MCAxMjAgTCAzMjAgMTUwIEwgMzgwIDE4MCIgc3Ryb2tlPSIjZGMzNTQ1IiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiIC8+PGxpbmUgeDE9IjAiIHkxPSIxMDAiIHgyPSIzMDAiIHkyPSIxMDAiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1kYXNoYXJyYXk9IjQsNCIgLz48dGV4dCB4PSIyMCIgeT0iMTI1IiBjbGFzcz0iZm9udCI+S2V5IFN1cHBvcnQgTGV2ZWw8L3RleHQ+PHRleHQgeD0iMzEwIiB5PSIxNDAiIGNsYXNzPSJmb250IiBmb250LXNpemU9IjE0cHgiIGZvbnQtd2VpZ2h0PSJib2xkIj5CcmVha2Rvd248L3RleHQ+PGNpcmNsZSBjeD0iMjYwIiBjeT0iMTIwIiByPSIyMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZjFjNDBmIiBzdHJva2Utd2lkdGg9IjIiIC8+PC9zdmc+",
    options: [
      { id: 'a', text: "A fakeout" },
      { id: 'b', text: "A change of character" },
      { id: 'c', text: "A breakdown" },
      { id: 'd', text: "A liquidity grab" }
    ],
    correctAnswer: 'c',
    explanation: "A breakdown occurs when the price moves below a well-defined support level, often signaling the start of a new downtrend or a significant price drop."
  },
  {
    id: 20,
    type: 'graph',
    question: "A candlestick with very little or no body, where the open and close prices are nearly identical, indicates what about the market?",
    image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDQwMCAyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHN0eWxlPmZvbnQgeyBmb250LWZhbWlseTogc2Fucy1zZXJpZjsgZm9udC1zaXplOiAxNHB4OyBmaWxsOiAjZmZmZmZmOyB9PC9zdHlsZT48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMWYyOTM3IiAvPjxyZWN0IHg9IjE3OCIgeT0iNzgiIHdpZHRoPSI0IiBoZWlnaHQ9IjQ0IiBmaWxsPSIjYmNiY2JjIiAvPjxyZWN0IHg9IjE3MCIgeT0iOTgiIHdpZHRoPSIyMCIgaGVpZ2h0PSI0IiBmaWxsPSIjYmNiY2JjIiAvPjx0ZXh0IHg9IjEzMCIgeT0iNDAiIGNsYXNzPSJmb250Ij5Eb2ppIENhbmRsZXN0aWNrPC90ZXh0Pjx0ZXh0IHg9IjEyMCIgeT0iMTYwIiBjbGFzcz0iZm9udCI+SW5kZWNpc2lvbiBQb2ludDwvdGV4dD48L3N2Zz4=",
    options: [
      { id: 'a', text: "Strong bullish conviction" },
      { id: 'b', text: "Strong bearish conviction" },
      { id: 'c', text: "A trend continuation" },
      { id: 'd', text: "Indecision between buyers and sellers" }
    ],
    correctAnswer: 'd',
    explanation: "This is a Doji candlestick. It shows an equilibrium between buying and selling pressure and can often signal a potential turning point or pause in a trend."
  },

  // Section 3: Scenarios & Decision Making
  {
    id: 21,
    type: 'scenario',
    question: "You want to trade a brand new, low-cap token that is not listed on any centralized exchange. Where is the most likely place you'll be able to buy it?",
    options: [
      { id: 'a', text: "On Coinbase" },
      { id: 'b', text: "Through a bank wire transfer" },
      { id: 'c', text: "On a DEX like Uniswap or PancakeSwap" },
      { id: 'd', text: "On the stock market" }
    ],
    correctAnswer: 'c',
    explanation: "DEXs allow for permissionless listing, meaning anyone can create a liquidity pool for a new token. This makes them the primary venue for trading new and emerging crypto assets."
  },
  {
    id: 22,
    type: 'scenario',
    question: "You have 1 ETH and want to provide liquidity to an ETH/USDC pool on a DEX. What else do you need?",
    options: [
      { id: 'a', text: "You don't need anything else" },
      { id: 'b', text: "You need an equal value of USDC" },
      { id: 'c', text: "You need more ETH than USDC" },
      { id: 'd', text: "You need some Bitcoin for collateral" }
    ],
    correctAnswer: 'b',
    explanation: "Standard liquidity pools require you to deposit an equal value of both tokens in the pair. So if 1 ETH is worth $3,000, you would need to deposit $3,000 worth of USDC as well."
  },
  {
    id: 23,
    type: 'scenario',
    question: "Your transaction on the Ethereum network has been pending for a long time. What is the most likely reason?",
    options: [
      { id: 'a', text: "The network is offline" },
      { id: 'b', text: "You set the gas fee (priority fee) too low" },
      { id: 'c', text: "The recipient's wallet is full" },
      { id: 'd', text: "You sent too large an amount" }
    ],
    correctAnswer: 'b',
    explanation: "Miners/validators prioritize transactions with higher gas fees. If the network is busy, a transaction with a low fee may be ignored or delayed until congestion eases."
  },
  {
    id: 24,
    type: 'scenario',
    question: "You want to borrow DAI from the Compound protocol. What is the first step you must take?",
    options: [
      { id: 'a', text: "Complete a KYC (Know Your Customer) application" },
      { id: 'b', text: "Supply a different crypto asset (like ETH or WBTC) as collateral" },
      { id: 'c', text: "Request the loan from the Compound DAO" },
      { id: 'd', text: "Pre-pay the interest on the loan" }
    ],
    correctAnswer: 'b',
    explanation: "DeFi lending is over-collateralized. You must first supply assets to the protocol, which then allows you to borrow other assets against that collateral value."
  },
  {
    id: 25,
    type: 'scenario',
    question: "A new DeFi protocol is offering an extremely high APY of 5,000%. What should be your primary concern?",
    options: [
      { id: 'a', text: "That the APY is not high enough" },
      { id: 'b', text: "The risk of the protocol's token price collapsing" },
      { id: 'c', text: "How to calculate the exact daily returns" },
      { id: 'd', text: "Whether the protocol is on the right blockchain" }
    ],
    correctAnswer: 'b',
    explanation: "Extremely high yields are often sustained by issuing a native token. This creates intense selling pressure, and the value of the token (and thus the yield) can collapse rapidly. High APY often equals high risk."
  },
  {
    id: 26,
    type: 'scenario',
    question: "You're about to swap tokens on a DEX and the interface warns you about 'Price Impact'. What does this mean?",
    options: [
      { id: 'a', text: "The trade will have a positive impact on your wallet" },
      { id: 'b', text: "Your trade is large enough to change the token's price in the liquidity pool" },
      { id: 'c', text: "The price of the token is about to be updated by an oracle" },
      { id: 'd', text: "The trade will impact the global market price of the token" }
    ],
    correctAnswer: 'b',
    explanation: "Price impact (or slippage) happens when a trade is large relative to the pool's liquidity. It means the price you get will be less favorable than the current market price because your own trade moved the price."
  },
  {
    id: 27,
    type: 'scenario',
    question: "You want to vote on a proposal in a DAO, but you don't have enough voting power. How could you potentially increase your influence?",
    options: [
      { id: 'a', text: "Email the developers and ask them to vote for you" },
      { id: 'b', text: "Acquire more of the protocol's governance token" },
      { id: 'c', text: "Lodge a complaint on social media" },
      { id: 'd', text: "Wait for the next voting round" }
    ],
    correctAnswer: 'b',
    explanation: "In most DAOs, voting power is proportional to the number of governance tokens a user holds. To have a greater say, you need to hold more tokens."
  },
  {
    id: 28,
    type: 'scenario',
    question: "You've found a DeFi strategy that involves 5 different protocols. To execute it manually would be complex and slow. What DeFi tool could help you execute this complex transaction all at once?",
    options: [
      { id: 'a', text: "A hardware wallet like Ledger" },
      { id: 'b', text: "A blockchain explorer like Etherscan" },
      { id: 'c', text: "A DeFi aggregator or dashboard like Zapper or Zerion" },
      { id: 'd', text: "A centralized exchange like Binance" }
    ],
    correctAnswer: 'c',
    explanation: "DeFi aggregators bundle complex actions into a single transaction. They can help you zap into liquidity pools, manage positions, and execute multi-step strategies efficiently."
  },
  {
    id: 29,
    type: 'scenario',
    question: "You are considering providing liquidity for a brand new token pair. What is the primary risk you should evaluate?",
    options: [
      { id: 'a', text: "The risk of the platform going down for maintenance" },
      { id: 'b', text: "The risk that one of the tokens is a scam ('rug pull') and its value goes to zero" },
      { id: 'c', text: "The risk of earning too many fees" },
      { id: 'd', text: "The risk that the DEX runs out of gas" }
    ],
    correctAnswer: 'b',
    explanation: "With new, unvetted tokens, the risk of a rug pull (where developers abandon the project and drain the liquidity) is extremely high. This would result in a total loss of your investment."
  },
  {
    id: 30,
    type: 'scenario',
    question: "To save on gas fees, you decide to perform a token swap on a Layer 2 network. After the swap, where will your new tokens be located?",
    options: [
      { id: 'a', text: "In your Ethereum mainnet wallet" },
      { id: 'b', text: "In your wallet, but on the Layer 2 network" },
      { id: 'c', text: "In a centralized exchange account" },
      { id: 'd', text: "Held in escrow by the Layer 2 network" }
    ],
    correctAnswer: 'b',
    explanation: "Assets on a Layer 2 exist on that specific network. To use them on the Ethereum mainnet, you would need to 'bridge' them back, which is a separate transaction."
  },

  // Section 4: Risk Management & Security
  {
    id: 31,
    type: 'risk management',
    question: "When you interact with a DeFi app, your wallet asks you to 'Approve' token spending. What is the safest practice?",
    options: [
      { id: 'a', text: "Approve an infinite amount so you don't have to do it again" },
      { id: 'b', text: "Approve only the exact amount you intend to use" },
      { id: 'c', text: "Reject the approval and try a different app" },
      { id: 'd', text: "Approve a random, large number" }
    ],
    correctAnswer: 'b',
    explanation: "Approving an infinite amount gives the smart contract permission to spend all of that token from your wallet, forever. If that contract is exploited, your funds could be drained. Approving only the necessary amount limits this risk."
  },
  {
    id: 32,
    type: 'risk management',
    question: "What does it mean if a DeFi project's smart contracts have NOT been audited?",
    options: [
      { id: 'a', text: "The project is new and innovative" },
      { id: 'b', text: "It carries a significantly higher risk of bugs or exploits" },
      { id: 'c', text: "The developers are very confident in their code" },
      { id: 'd', text: "The project is more decentralized" }
    ],
    correctAnswer: 'b',
    explanation: "A smart contract audit by a reputable security firm is a crucial step to identify potential vulnerabilities. Interacting with unaudited contracts is highly risky, as they may contain flaws that could lead to a loss of funds."
  },
  {
    id: 33,
    type: 'risk management',
    question: "You receive a DM on Discord with a link to a new 'mint' event for a popular project, promising a free NFT. What should you be most suspicious of?",
    options: [
      { id: 'a', text: "The gas fees for the mint" },
      { id: 'b', text: "That it might be a phishing scam to drain your wallet" },
      { id: 'c', text: "The artistic quality of the NFT" },
      { id: 'd', text: "The server bandwidth of the website" }
    ],
    correctAnswer: 'b',
    explanation: "Scammers often create convincing fake websites that trick users into signing malicious transactions. Always verify links through official sources like Twitter or a project's official website. Never trust unsolicited links."
  },
  {
    id: 34,
    type: 'risk management',
    question: "What is the primary difference between a 'hot wallet' (like MetaMask) and a 'cold wallet' (like a Ledger or Trezor)?",
    options: [
      { id: 'a', text: "Hot wallets can store more types of tokens" },
      { id: 'b', text: "Hot wallets are connected to the internet; cold wallets are offline" },
      { id: 'c', text: "Cold wallets have higher transaction fees" },
      { id: 'd', text: "Cold wallets are only for Bitcoin" }
    ],
    correctAnswer: 'b',
    explanation: "Hot wallets offer convenience as they are always online, but this also makes them more vulnerable to hacks. Cold wallets keep your private keys completely offline, providing the highest level of security."
  },
  {
    id: 35,
    type: 'risk management',
    question: "After using many DeFi apps, you want to clean up your wallet's permissions. What should you do?",
    options: [
      { id: 'a', text: "Create a new wallet and send your assets there" },
      { id: 'b', text: "Use a tool like Revoke.cash to view and cancel old approvals" },
      { id: 'c', text: "Wait for the approvals to expire automatically" },
      { id: 'd', text: "Delete and reinstall your wallet extension" }
    ],
    correctAnswer: 'b',
    explanation: "Token approvals do not expire. Tools like Revoke.cash or Etherscan's Token Approval Checker allow you to see which contracts can spend your tokens and let you revoke those permissions, enhancing your security."
  },
  {
    id: 36,
    type: 'risk management',
    question: "What is a 'rug pull' in the context of DeFi?",
    options: [
      { id: 'a', text: "A sudden, sharp drop in the price of a major asset like ETH" },
      { id: 'b', text: "When developers of a project abandon it and run away with investors' funds" },
      { id: 'c', text: "A failed transaction due to high network congestion" },
      { id: 'd', text: "A type of advanced trading strategy" }
    ],
    correctAnswer: 'b',
    explanation: "A rug pull is a malicious maneuver where developers drain the liquidity from a project's pool, causing the token's value to plummet to zero and leaving investors with worthless assets."
  },
  {
    id: 37,
    type: 'risk management',
    question: "How can you best protect your crypto seed phrase?",
    options: [
      { id: 'a', text: "Store it in a password manager in the cloud" },
      { id: 'b', text: "Write it down and store it in multiple secure, offline locations" },
      { id: 'c', text: "Take a screenshot of it and save it in your phone's photo gallery" },
      { id: 'd', text: "Send it to yourself in an email for safekeeping" }
    ],
    correctAnswer: 'b',
    explanation: "Your seed phrase is the master key to all your crypto. It should NEVER be stored digitally or online. The safest method is to write it down on paper or stamp it into metal and store it somewhere safe from fire, water, and theft."
  },
  {
    id: 38,
    type: 'risk management',
    question: "What is the primary risk associated with 'cross-chain bridges'?",
    options: [
      { id: 'a', text: "They are typically very slow and expensive" },
      { id: 'b', text: "They are complex and can be major targets for exploits and hacks" },
      { id: 'c', text: "They only support a limited number of blockchains" },
      { id: 'd', text: "They require users to complete KYC" }
    ],
    correctAnswer: 'b',
    explanation: "Cross-chain bridges often hold vast amounts of assets in smart contracts, making them a lucrative target for hackers. Many of the largest DeFi hacks have been on bridges."
  },
  {
    id: 39,
    type: 'risk management',
    question: "What does 'slippage tolerance' mean when you are swapping tokens?",
    options: [
      { id: 'a', text: "How much you tolerate the project's developers" },
      { id: 'b', text: "Your tolerance for transactions failing" },
      { id: 'c', text: "The maximum percentage of price change you're willing to accept for your trade" },
      { id: 'd', text: "How much the token's price has slipped in the last 24 hours" }
    ],
    correctAnswer: 'c',
    explanation: "Setting a slippage tolerance (e.g., 1%) protects you from large, unexpected price swings during your transaction. If the price changes by more than your set tolerance while the trade is processing, the transaction will fail."
  },
  {
    id: 40,
    type: 'risk management',
    question: "An anonymous developer team is a common red flag in DeFi. Why?",
    options: [
      { id: 'a', text: "It means they cannot write good code" },
      { id: 'b', text: "It is impossible to get customer support" },
      { id: 'c', text: "It removes accountability and makes it easier to perform a rug pull" },
      { id: 'd', text: "It means the project cannot form a DAO" }
    ],
    correctAnswer: 'c',
    explanation: "While anonymity is a part of crypto's ethos, it's also a risk. A public, doxxed team has a reputation to protect, making them less likely to act maliciously. Anonymous teams have no such accountability."
  },

  // Section 5: Advanced Concepts & Terminology
  {
    id: 41,
    type: 'practical',
    question: "What is a 'wrapped' token, such as Wrapped Bitcoin (WBTC)?",
    options: [
      { id: 'a', text: "A Bitcoin that has been secured in a physical vault" },
      { id: 'b', text: "A token that represents Bitcoin on another blockchain, like Ethereum" },
      { id: 'c', text: "A promotional version of Bitcoin" },
      { id: 'd', text: "A new, upgraded version of the Bitcoin protocol" }
    ],
    correctAnswer: 'b',
    explanation: "Wrapping allows assets from one blockchain (like Bitcoin) to be used in the DeFi ecosystem of another (like Ethereum). Each WBTC is backed 1:1 by actual BTC held in custody."
  },
  {
    id: 42,
    type: 'practical',
    question: "In the context of staking, what is 'slashing'?",
    options: [
      { id: 'a', text: "A bonus reward for stakers" },
      { id: 'b', text: "A penalty where a validator loses some of their staked tokens for bad behavior" },
      { id: 'c', text: "The process of withdrawing staked tokens" },
      { id: 'd', text: "A sharp decrease in the APY for staking" }
    ],
    correctAnswer: 'b',
    explanation: "Slashing is a mechanism in Proof-of-Stake networks to punish validators for actions that harm the network, such as going offline for too long or validating fraudulent transactions. It helps keep the network secure."
  },
  {
    id: 43,
    type: 'practical',
    question: "What distinguishes an 'algorithmic stablecoin' from a collateralized one like USDC?",
    options: [
      { id: 'a', text: "It is pegged to a different currency than the US Dollar" },
      { id: 'b', text: "It uses an algorithm and market incentives to maintain its peg, rather than direct collateral" },
      { id: 'c', text: "It can only be used by advanced algorithms" },
      { id: 'd', text: "It is audited more frequently" }
    ],
    correctAnswer: 'b',
    explanation: "While USDC is backed 1:1 by real dollars or equivalents, algorithmic stablecoins try to maintain their price peg through code, for example by automatically expanding or contracting the token supply."
  },
  {
    id: 44,
    type: 'graph',
    question: "What do 'Bollinger Bands' represent on a price chart?",
    image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDQwMCAyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHN0eWxlPmZvbnQgeyBmb250LWZhbWlseTogc2Fucy1zZXJpZjsgZm9udC1zaXplOiAxMnB4OyBmaWxsOiAjZmZmZmZmOyB9PC9zdHlsZT48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMWYyOTM3IiAvPjxwYXRoIGQ9Ik0gMjAgMTAwIEMgNjAgMTIwIDEwMCA4MCAxNDAgMTAwIEMgMTgwIDEyMCAyMjAgODAgMjYwIDEwMCBDIDMwMCAxMjAgMzQwIDgwIDM4MCAxMDAiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiAvPjxwYXRoIGQ9Ik0gMjAgMTAwIEMgNjAgOTAgMTAwIDcwIDE0MCA5MCBDIDE4MCAxMTAgMjIwIDYwIDI2MCA3MCBDIDMwMCA5MCAzNDAgNzAgMzgwIDkwIiBzdHJva2U9IiNmMWM0MGYiIHN0cm9rZS13aWR0aD0iMS41IiBmaWxsPSJub25lIiAvPjxwYXRoIGQ9Ik0gMjAgMTAwIEMgNjAgMTUwIDEwMCA5MCAxNDAgMTEwIEMgMTgwIDEzMCAyMjAgMTAwIDI2MCAxMzAgQyAzMDAgMTUwIDM0MCA5MCAzODAgMTEwIiBzdHJva2U9IiNmMWM0MGYiIHN0cm9rZS13aWR0aD0iMS41IiBmaWxsPSJub25lIiAvPjx0ZXh0IHg9IjMwIiB5PSI0MCIgY2xhc3M9ImZvbnQiPkJvbGxpbmdlciBCYW5kczwvdGV4dD48dGV4dCB4PSIxOTAiIHk9IjcwIiBjbGFzcz0iZm9udCIgZm9udC1zaXplPSIxMHB4Ij5VcHBlciBCYW5kPC90ZXh0Pjx0ZXh0IHg9IjE3MCIgeT0iMTQ1IiBjbGFzcz0iZm9udCIgZm9udC1zaXplPSIxMHB4Ij5Mb3dlciBCYW5kPC90ZXh0Pjwvc3ZnPg==",
    options: [
      { id: 'a', text: "Fixed support and resistance levels" },
      { id: 'b', text: "The 50-day and 200-day moving averages" },
      { id: 'c', text: "A measure of market volatility around a central moving average" },
      { id: 'd', text: "The trading volume at different price levels" }
    ],
    correctAnswer: 'c',
    explanation: "Bollinger Bands consist of a middle band (a simple moving average) and an upper and lower band. The bands widen during high volatility and contract during low volatility, providing clues about potential price moves."
  },
  {
    id: 45,
    type: 'practical',
    question: "What is 'MEV' (Maximal Extractable Value)?",
    options: [
      { id: 'a', text: "The maximum value a user can extract from a DeFi protocol" },
      { id: 'b', text: "The profit a miner or validator can make by reordering or inserting transactions in a block" },
      { id: 'c', text: "A measure of a project's total value locked (TVL)" },
      { id: 'd', text: "The highest APY available in the DeFi market" }
    ],
    correctAnswer: 'b',
    explanation: "MEV refers to the value that can be extracted by those who have the power to order transactions, often through strategies like front-running or sandwich attacks on DEX trades."
  },
  {
    id: 46,
    type: 'practical',
    question: "What is the function of a 'vesting schedule' for team or investor tokens?",
    options: [
      { id: 'a', text: "It's a schedule for when the team must buy more tokens" },
      { id: 'b', text: "It's a plan for how the tokens will be marketed to new investors" },
      { id: 'c', text: "It's a timeline that dictates when locked tokens are released for selling" },
      { id: 'd', text: "It's a schedule of project development milestones" }
    ],
    correctAnswer: 'c',
    explanation: "Vesting schedules prevent team members and early investors from selling all their tokens at once after launch, which would crash the price. Tokens are unlocked gradually over a set period."
  },
  {
    id: 47,
    type: 'practical',
    question: "What differentiates Uniswap V3 from V2 for liquidity providers?",
    options: [
      { id: 'a', text: "V3 has lower gas fees" },
      { id: 'b', text: "V3 introduces 'concentrated liquidity', allowing LPs to be more capital efficient" },
      { id: 'c', text: "V3 does not have impermanent loss" },
      { id: 'd', text: "V3 only allows for stablecoin pools" }
    ],
    correctAnswer: 'b',
    explanation: "In V3, liquidity providers can choose a specific price range to provide their liquidity. This concentrates their capital where most trading happens, allowing them to earn more fees with less capital compared to V2."
  },
  {
    id: 48,
    type: 'practical',
    question: "What is a 'liquid staking' protocol like Lido or Rocket Pool?",
    options: [
      { id: 'a', text: "A protocol that allows you to borrow against your staked ETH" },
      { id: 'b', text: "A protocol that stakes your ETH for you and gives you a liquid token (like stETH) in return" },
      { id: 'c', text: "A DEX that specializes in trading staked assets" },
      { id: 'd', text: "A protocol that automatically unstakes your ETH for a fee" }
    ],
    correctAnswer: 'b',
    explanation: "Liquid staking solves the problem of illiquidity for staked assets. By giving you a tradable token that represents your staked position, you can use it in other DeFi applications while still earning staking rewards."
  },
  {
    id: 49,
    type: 'graph',
    question: "A price chart shows a series of higher highs and higher lows. What market structure is this?",
    image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDQwMCAyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHN0eWxlPmZvbnQgeyBmb250LWZhbWlseTogc2Fucy1zZXJpZjsgZm9udC1zaXplOiAxMnB4OyBmaWxsOiAjZmZmZmZmOyB9PC9zdHlsZT48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMWYyOTM3IiAvPjxwYXRoIGQ9Ik0gMjAgMTgwIEwgODAgMTMwIEwgMTIwIDE1MCBMIDE4MCAxMDAgTCAyNDAgMTIwIEwgMzAwIDcwIEwgMzYwIDkwIiBzdHJva2U9IiMyMmMyN2EiIHN0cm9rZS13aWR0aD0iMi41IiBmaWxsPSJub25lIiAvPjxjaXJjbGUgY3g9IjgwIiBjeT0iMTMwIiByPSI1IiBmaWxsPSIjZGMzNTQ1IiAvPjxjaXJjbGUgY3g9IjE4MCIgY3k9IjEwMCIgcj0iNSIgZmlsbD0iI2RjMzU0NSIgLz48Y2lyY2xlIGN4PSIzMDAiIGN5PSI3MCIgcj0iNSIgZmlsbD0iI2RjMzU0NSIgLz48Y2lyY2xlIGN4PSIxMjAiIGN5PSIxNTAiIHI9IjUiIGZpbGw9IiMyMmMyN2EiIC8+PGNpcmNsZSBjeD0iMjQwIiBjeT0iMTIwIiByPSI1IiBmaWxsPSIjMjJjMjdhIiAvPjxjaXJjbGUgY3g9IjM2MCIgY3k9IjkwIiByPSI1IiBmaWxsPSIjMjJjMjdhIiAvPjx0ZXh0IHg9IjEwMCIgeT0iNTUiIGNsYXNzPSJmb250IiBmb250LXdlaWdodD0iYm9sZCI+QnVsbGlzaCBUcmVuZCAoVXB0cmVuZCk8L3RleHQ+PHRleHQgeD0iMjc1IiB5PSIxMTAiIGNsYXNzPSJmb250IiBmaWxsPSIjMjJjMjdhIj5ISDwvdGV4dD48dGV4dCB4PSIzMzUiIHk9IjExMCIgY2xhc3M9ImZvbnQiIGZpbGw9IiMyMmMyN2EiPkhIPC90ZXh0Pjx0ZXh0IHg9IjE5MCIgeT0iMTQwIiBjbGFzcz0iZm9udCIgZmlsbD0iI2RjMzU0NSI+SEw8L3RleHQ+PHRleHQgeD0iMTMwIiB5PSIxNzMiIGNsYXNzPSJmb250IiBmaWxsPSIjZGMzNTQ1ciI+SEw8L3RleHQ+PC9zdmc+",
    options: [
      { id: 'a', text: "A bearish trend" },
      { id: 'b', text: "A consolidation range" },
      { id: 'c', text: "A bullish trend" },
      { id: 'd', text: "A reversal pattern" }
    ],
    correctAnswer: 'c',
    explanation: "The definition of a bullish trend is a consistent pattern of price making higher swing highs (HH) and higher swing lows (HL), indicating strong buying pressure."
  },
  {
    id: 50,
    type: 'practical',
    question: "What is the purpose of 'gas fees' on a blockchain like Ethereum?",
    options: [
      { id: 'a', text: "To pay for the electricity cost of the entire network" },
      { id: 'b', text: "To compensate validators for processing and securing transactions" },
      { id: 'c', text: "A tax paid to the Ethereum Foundation" },
      { id: 'd', text: "To prevent the blockchain from getting too large" }
    ],
    correctAnswer: 'b',
    explanation: "Gas fees are paid by users to reward validators (or miners in Proof-of-Work) for including their transaction in a block. This fee market also helps prevent network spam."
  }
];