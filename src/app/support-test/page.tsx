"use client";

import { useEffect, useState } from "react";
import { useCompletion } from "ai/react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

type Message = {
  id: string;
  type: "user" | "ai";
  content: string;
};

const prompts = [
  `Generate a support query from a financial trader
using the Artis or Folio market data grid application.
The trader should be rude, terse, and use trader slang with misspelled words.
The query should be about common issues like non-functioning buttons.
Example: "wtf folio login borked again cant see my fking charts fix asap".`,
  `Generate a support query from a financial trader
using the Artis or Folio market data grid application.
The trader should be polite, detailed, and use technical jargon.
The query should be about common issues like login problems.
Example: "Hello, I'm having trouble logging into my Folio account. I've tried resetting my password,
but it's still not working."`,
  `Generate a support query from a financial trader
using the Artis or Folio market data grid application.
The trader should be polite, detailed, and use technical jargon.
The query should be about common issues like grid data issues, chart problems, settings not saving, or highlight malfunctions.
Example: "Hello, I'm having trouble with my Artis grid data. The data is not updating correctly, and I'm missing some key information."`,
  `Generate a support query from a financial trader
using the Artis or Folio market data grid application.
The trader should be rude and use trader slang with misspelled words.
The query should be about common issues like grid data issues, chart problems, settings not saving, or highlight malfunctions.
Example: "yo artis grid is fked up again. my charts arent loading i got dis ting with 'server reconnecting'. fix it asap."`,
  `Generate a support query from a financial trader
using the Artis or Folio market data grid application.
The trader should be rude and unhelpful; his issue is actually the office network but he doesn't realize this.`,
];

export default function SupportQuerySpeedTest() {
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [queryCount, setQueryCount] = useState(0);
  const [userResponse, setUserResponse] = useState("");
  const [isTestComplete, setIsTestComplete] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [scores, setScores] = useState<string[]>([]);
  const [currentScore, setCurrentScore] = useState<string>("");

  const {
    completion: queryCompletion,
    complete: completeQuery,
    isLoading: isLoadingQuery,
  } = useCompletion({
    api: "/api/support-ai",
  });

  const {
    completion: scoreCompletion,
    complete: completeScore,
    isLoading: isLoadingScore,
  } = useCompletion({
    api: "/api/support-ai",
    onFinish: (prompt, completion) => {
      setCurrentScore(completion);
    },
  });

  useEffect(() => {
    if (scoreCompletion) {
      setCurrentScore(scoreCompletion);
    }
  }, [scoreCompletion]);

  const generateQuery = () => {
    const prompt = prompts[queryCount];
    completeQuery(prompt, {
      body: { action: "generate_query" },
    });
  };

  const scoreResponse = (query: string, response: string) => {
    const prompt = `Trader query: "${query}"
Support response: "${response}"
Evaluate this support response for a financial trading application. Score it out of 10 based on how well it addresses the trader's issue, maintains professionalism despite the trader's rudeness, and provides clear next steps or solutions. Consider the response's ability to handle technical jargon and trader slang.
Format your response as: "Score: [X/10]. [Brief explanation]"`;
    completeScore(prompt, {
      body: { action: "score_response" },
    });
  };

  const startTest = () => {
    setIsTestStarted(true);
    setQueryCount(0);
    setIsTestComplete(false);
    setMessages([]);
    setScores([]);
    setCurrentScore("");
    generateQuery();
  };

  const handleSubmitResponse = () => {
    if (userResponse.trim()) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), type: "user", content: userResponse },
      ]);
      const lastAIMessage = queryCompletion || "";
      setUserResponse(""); // Clear input
      scoreResponse(lastAIMessage, userResponse);
    }
  };

  const resetTest = () => {
    setIsTestStarted(false);
    setQueryCount(0);
    setUserResponse("");
    setIsTestComplete(false);
    setMessages([]);
    setScores([]);
    setCurrentScore("");
  };

  const handleNextQuery = () => {
    setScores((prevScores) => [...prevScores, currentScore]);
    setMessages([]);
    setQueryCount((prev) => prev + 1);
    setUserResponse("");
    setCurrentScore("");
    generateQuery();
  };

  return (
    <div className="flex justify-center items-center p-4">
      <div className="w-[300px] h-[600px] bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col">
        <div className="bg-black text-white p-2 text-center">
          <h1 className="text-lg font-bold">Trader Support Speed Test</h1>
        </div>
        <div className="flex-grow flex flex-col p-4 overflow-hidden">
          {!isTestStarted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-grow flex flex-col justify-center"
            >
              <p className="mb-4 text-sm">
                Respond to 5 trader support queries as quickly and
                professionally as possible.
              </p>
              <Button onClick={startTest}>Start Test</Button>
            </motion.div>
          )}
          {isTestStarted && !isTestComplete && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-grow flex flex-col"
            >
              <div className="max-h-[450px] flex-grow overflow-y-auto mb-2 bg-gray-100 p-2 rounded-lg text-sm">
                <AnimatePresence>
                  {(isLoadingQuery || queryCompletion) && (
                    <motion.div
                      key="query-completion"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mb-2 text-left"
                    >
                      <span className="inline-block p-2 rounded-lg bg-white text-black">
                        {queryCompletion}
                      </span>
                    </motion.div>
                  )}
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`mb-2 ${
                        message.type === "user" ? "text-right" : "text-left"
                      }`}
                    >
                      <span
                        className={`inline-block p-2 rounded-lg ${
                          message.type === "user"
                            ? "bg-blue-500 text-white"
                            : "bg-white text-black"
                        }`}
                      >
                        {message.content}
                      </span>
                    </motion.div>
                  ))}
                  {(isLoadingScore || currentScore) && (
                    <motion.div
                      key="score-completion"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mb-2 text-center"
                    >
                      <span className="inline-block p-2 rounded-lg bg-yellow-200 text-black text-xs">
                        {isLoadingScore ? "Scoring: " : ""}
                        {currentScore}
                      </span>
                    </motion.div>
                  )}
                  {currentScore && !isLoadingScore && (
                    <motion.div
                      key="next-query-button"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mb-2 text-center"
                    >
                      {queryCount < 4 ? (
                        <Button onClick={handleNextQuery}>Next Query</Button>
                      ) : (
                        <Button
                          onClick={() => {
                            setScores((prevScores) => [
                              ...prevScores,
                              currentScore,
                            ]);
                            setIsTestComplete(true);
                          }}
                        >
                          Finish Test
                        </Button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="flex items-center mt-2">
                <Textarea
                  value={userResponse}
                  onChange={(e) => setUserResponse(e.target.value)}
                  placeholder="Type your response..."
                  className="flex-grow mr-2 text-sm text-black resize-none overflow-y-auto"
                  rows={1}
                  style={{ maxHeight: "6rem" }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmitResponse();
                    }
                  }}
                />
                <Button
                  onClick={handleSubmitResponse}
                  disabled={!userResponse.trim() || isLoadingScore}
                  className="bg-green-500 hover:bg-green-600 p-2"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="mt-2 text-center text-xs">
                Query {queryCount + 1} of 5
              </p>
            </motion.div>
          )}
          {isTestComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-center flex-grow flex flex-col justify-center"
            >
              <h2 className="text-xl font-bold mb-2">Test Complete!</h2>
              <p className="mb-2 text-sm">
                You've handled all 5 trader queries.
              </p>
              <p className="mb-2 text-sm">Your scores:</p>
              <ul className="list-disc list-inside mb-2 text-sm">
                {scores.map((score, index) => (
                  <li key={`score-${index}`}>{score}</li>
                ))}
              </ul>
              <p className="mb-2 text-sm">
                Average score:{" "}
                {(
                  scores.reduce(
                    (a, b) =>
                      a + Number.parseFloat(b.split(":")[1].split("/")[0]),
                    0
                  ) / scores.length
                ).toFixed(2)}
              </p>
              <Button onClick={resetTest} className="mt-2">
                Try Again
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
