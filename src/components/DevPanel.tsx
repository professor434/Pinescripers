import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Label } from "./ui/label";

const dummyIdeas = [
  {
    id: 1,
    name: "John Trader",
    email: "john@trader.com",
    description: "VWAP + MACD strategy.",
    file: "setup.mp4",
    paid: true,
    status: "pending"
  },
  {
    id: 2,
    name: "Anna Algo",
    email: "anna@algo.dev",
    description: "RSI and EMA cross indicator.",
    file: "screenshot.jpg",
    paid: false,
    status: "pending"
  }
];

export default function DevPanel() {
  const [ideas, setIdeas] = useState(dummyIdeas);

  const handleStatus = (id: number, newStatus: string) => {
    setIdeas(ideas.map(idea => idea.id === id ? { ...idea, status: newStatus } : idea));
  };

  return (
    <div className="p-6 max-w-6xl mx-auto grid gap-6">
      <h1 className="text-2xl font-bold">Incoming Strategy Ideas</h1>
      <ScrollArea className="max-h-[80vh] space-y-4 pr-2">
        {ideas.map(idea => (
          <Card key={idea.id} className="border-l-4" style={{ borderColor: idea.paid ? '#16a34a' : '#0284c7' }}>
            <CardContent className="p-4 grid gap-2">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="font-semibold text-lg">{idea.name}</h2>
                  <p className="text-sm text-muted-foreground">{idea.email}</p>
                </div>
                <Badge variant={idea.paid ? "success" : "outline"}>
                  {idea.paid ? "Paid Request" : "Free Request"}
                </Badge>
              </div>
              <Label className="text-sm">Description</Label>
              <p>{idea.description}</p>
              <p className="text-sm mt-2">
                📎 File: <span className="underline text-blue-600">{idea.file}</span>
              </p>
              <div className="flex gap-2 pt-2">
                <Button onClick={() => handleStatus(idea.id, "accepted")} variant="success">Accept</Button>
                <Button onClick={() => handleStatus(idea.id, "rejected")} variant="destructive">Reject</Button>
              </div>
              {idea.status !== "pending" && (
                <p className="text-sm pt-2">Status: <strong>{idea.status}</strong></p>
              )}
            </CardContent>
          </Card>
        ))}
      </ScrollArea>
    </div>
  );
}
