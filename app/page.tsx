"use client";

import { useState } from "react";
import { createParser, ParsedEvent, ReconnectInterval } from "eventsource-parser";
import { getSystemPrompt } from "@/utils/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [topic, setTopic] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [sources, setSources] = useState<{ name: string; url: string }[]>([]);
  const [isLoadingSources, setIsLoadingSources] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [ageGroup, setAgeGroup] = useState("Middle School");
  const { toast } = useToast();

  const handleInitialChat = async () => {
    if (!inputValue.trim()) {
      toast({
        title: "Error",
        description: "Please enter a topic to learn about",
        variant: "destructive",
      });
      return;
    }

    setShowResult(true);
    setLoading(true);
    setTopic(inputValue);
    setInputValue("");

    try {
      await handleSourcesAndChat(inputValue);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch sources or start chat",
        variant: "destructive",
      });
    }

    setLoading(false);
  };

  const handleChat = async (messages?: { role: string; content: string }[]) => {
    setLoading(true);
    try {
      const chatRes = await fetch("/api/getChat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages }),
      });

      if (!chatRes.ok) {
        throw new Error(chatRes.statusText);
      }

      const data = chatRes.body;
      if (!data) {
        return;
      }
      let fullAnswer = "";

      const onParse = (event: ParsedEvent | ReconnectInterval) => {
        if (event.type === "event") {
          const data = event.data;
          try {
            const text = JSON.parse(data).text ?? "";
            fullAnswer += text;
            setMessages((prev) => {
              const lastMessage = prev[prev.length - 1];
              if (lastMessage.role === "assistant") {
                return [
                  ...prev.slice(0, -1),
                  { ...lastMessage, content: lastMessage.content + text },
                ];
              } else {
                return [...prev, { role: "assistant", content: text }];
              }
            });
          } catch (e) {
            console.error(e);
          }
        }
      };

      const reader = data.getReader();
      const decoder = new TextDecoder();
      const parser = createParser(onParse);
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);
        parser.feed(chunkValue);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get response from AI",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  async function handleSourcesAndChat(question: string) {
    setIsLoadingSources(true);
    try {
      let sourcesResponse = await fetch("/api/getSources", {
        method: "POST",
        body: JSON.stringify({ question }),
      });
      let sources;
      if (sourcesResponse.ok) {
        sources = await sourcesResponse.json();
        setSources(sources);
      } else {
        setSources([]);
      }

      const parsedSourcesRes = await fetch("/api/getParsedSources", {
        method: "POST",
        body: JSON.stringify({ sources }),
      });
      let parsedSources;
      if (parsedSourcesRes.ok) {
        parsedSources = await parsedSourcesRes.json();
      }

      const initialMessage = [
        { role: "system", content: getSystemPrompt(parsedSources, ageGroup) },
        { role: "user", content: `${question}` },
      ];
      setMessages(initialMessage);
      await handleChat(initialMessage);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process sources",
        variant: "destructive",
      });
    }
    setIsLoadingSources(false);
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container flex h-16 items-center px-4">
          <h1 className="text-2xl font-bold">Ash Personal Tutor</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {showResult ? (
          <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
            <Card className="col-span-1 max-h-[calc(100vh-200px)] overflow-y-auto">
              <CardHeader className="p-4">
                <CardTitle className="text-lg">Sources</CardTitle>
                <CardDescription className="text-xs">References used for learning</CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                {isLoadingSources ? (
                  <div>Loading sources...</div>
                ) : (
                  <div className="space-y-1">
                    {sources.map((source, index) => (
                      <a
                        key={index}
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary truncate"
                      >
                        <img
                          src={`https://www.google.com/s2/favicons?domain=${source.url}&sz=32`}
                          alt={`${source.name} favicon`}
                          className="w-4 h-4"
                        />
                        {source.name}
                      </a>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Chat about {topic}</CardTitle>
                <CardDescription>Ask questions and learn more</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {messages.filter(message => message.role !== 'system').map((message, index) => (
                    <div
                      key={index}
                      className={`rounded-lg p-4 ${
                        message.role === "assistant"
                          ? "bg-muted"
                          : "bg-primary text-primary-foreground"
                      }`}
                    >
                      {message.content}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="mx-auto max-w-2xl">
            <CardHeader>
              <CardTitle>Welcome to Ash Personal Tutor</CardTitle>
              <CardDescription>
                Learn about any topic with AI-powered tutoring
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Age Group</label>
                  <select
                    value={ageGroup}
                    onChange={(e) => setAgeGroup(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                  >
                    <option value="Elementary School">Elementary School</option>
                    <option value="Middle School">Middle School</option>
                    <option value="High School">High School</option>
                    <option value="College">College</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">What would you like to learn about?</label>
                  <Textarea
                    placeholder="Enter a topic..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <Button
                  onClick={handleInitialChat}
                  disabled={loading}
                  className="w-full"
                >
                  Start Learning
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
      {showResult && (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4">
          <div className="container mx-auto max-w-4xl">
            <div className="flex gap-2">
              <Textarea
                placeholder="Ask a question..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={loading}
                className="min-h-[60px]"
              />
              <Button
                onClick={() => {
                  if (inputValue.trim()) {
                    const newMessages = [
                      ...messages,
                      { role: "user", content: inputValue },
                    ];
                    setMessages(newMessages);
                    setInputValue("");
                    handleChat(newMessages);
                  }
                }}
                disabled={loading}
                className="h-[60px] px-6"
              >
                Send
              </Button>
            </div>
          </div>
        </div>
      )}
      <Toaster />
    </div>
  );
}
