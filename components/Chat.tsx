import FinalInputArea from "./FinalInputArea";
import { useEffect, useRef, useState } from "react";
import simpleLogo from "../public/simple-logo.png";
import Image from "next/image";
import ReactMarkdown from "react-markdown";

export default function Chat({
  messages,
  disabled,
  promptValue,
  setPromptValue,
  setMessages,
  handleChat,
  topic,
}: {
  messages: { role: string; content: string }[];
  disabled: boolean;
  promptValue: string;
  setPromptValue: React.Dispatch<React.SetStateAction<string>>;
  setMessages: React.Dispatch<
    React.SetStateAction<{ role: string; content: string }[]>
  >;
  handleChat: () => void;
  topic: string;
}) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollableContainerRef = useRef<HTMLDivElement>(null);
  const [didScrollToBottom, setDidScrollToBottom] = useState(true);

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
  }

  useEffect(() => {
    if (didScrollToBottom) {
      scrollToBottom();
    }
  }, [didScrollToBottom, messages]);

  useEffect(() => {
    let el = scrollableContainerRef.current;
    if (!el) {
      return;
    }

    function handleScroll() {
      if (scrollableContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } =
          scrollableContainerRef.current;
        setDidScrollToBottom(scrollTop + clientHeight >= scrollHeight);
      }
    }

    el.addEventListener("scroll", handleScroll);

    return () => {
      el.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="flex grow flex-col gap-4 overflow-hidden">
      <div className="flex grow flex-col overflow-hidden lg:p-4">
        <p className="uppercase text-gray-900">
          <b>Topic: </b>
          {topic}
        </p>
        <div
          ref={scrollableContainerRef}
          className="mt-2 overflow-y-scroll rounded-lg border border-solid border-[#C2C2C2] bg-white px-5 lg:p-7"
        >
          {messages.length > 2 ? (
            <div className="prose-sm max-w-5xl lg:prose lg:max-w-full">
              {messages.slice(2).map((message, index) =>
                message.role === "assistant" ? (
                  <div className="relative w-full" key={index}>
                    <Image
                      src={simpleLogo}
                      alt=""
                      className="absolute left-0 top-0 !my-0 size-7"
                    />
                    <div className="w-full pl-10 whitespace-pre-wrap">
                      <div className="prose prose-sm lg:prose-base max-w-none">
                        <ReactMarkdown
                          components={{
                            p: ({ children }) => <p className="mb-6 leading-relaxed">{children}</p>,
                            ul: ({ children }) => <ul className="list-disc pl-8 mb-6 space-y-2">{children}</ul>,
                            ol: ({ children }) => <ol className="list-decimal pl-8 mb-6 space-y-2">{children}</ol>,
                            li: ({ children }) => <li className="mb-1">{children}</li>,
                            h1: ({ children }) => <h1 className="text-3xl font-bold mb-6 mt-8">{children}</h1>,
                            h2: ({ children }) => <h2 className="text-2xl font-bold mb-4 mt-6">{children}</h2>,
                            h3: ({ children }) => <h3 className="text-xl font-bold mb-3 mt-5">{children}</h3>,
                            code: ({ children }) => <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">{children}</code>,
                            pre: ({ children }) => (
                              <pre className="bg-gray-100 p-4 rounded-lg mb-6 overflow-x-auto text-sm font-mono">
                                {children}
                              </pre>
                            ),
                            blockquote: ({ children }) => (
                              <blockquote className="border-l-4 border-gray-300 pl-4 italic mb-6 text-gray-700">
                                {children}
                              </blockquote>
                            ),
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p
                    key={index}
                    className="ml-auto w-fit rounded-xl bg-blue-500 p-4 font-medium text-white"
                  >
                    {message.content}
                  </p>
                ),
              )}
              <div ref={messagesEndRef} />
            </div>
          ) : (
            <div className="flex w-full flex-col gap-4 py-5">
              {Array.from(Array(10).keys()).map((i) => (
                <div
                  key={i}
                  className={`${i < 5 && "hidden sm:block"} h-10 animate-pulse rounded-md bg-gray-300`}
                  style={{ animationDelay: `${i * 0.05}s` }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white lg:p-4">
        <FinalInputArea
          disabled={disabled}
          promptValue={promptValue}
          setPromptValue={setPromptValue}
          handleChat={handleChat}
          messages={messages}
          setMessages={setMessages}
        />
      </div>
    </div>
  );
}
