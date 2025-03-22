import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const dummyPurchases = [
  { title: "Golden Pocket Scalper", date: "2025-03-22", price: 25, status: "Downloaded" },
  { title: "MACD Trend Indicator", date: "2025-03-20", price: 0, status: "Downloaded" }
];

const dummyUploads = [
  { title: "Reversal RSI Zone", status: "Pending Review", submitted: "2025-03-18" },
  { title: "Liquidity Sweep Sniper", status: "Published", submitted: "2025-03-15" }
];

export default function UserDashboard() {
  return (
    <div className="p-6 max-w-5xl mx-auto grid gap-6">
      <h1 className="text-2xl font-bold">Welcome to Your Dashboard</h1>

      <Tabs defaultValue="purchases">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="purchases">My Purchases</TabsTrigger>
          <TabsTrigger value="uploads">My Uploads</TabsTrigger>
        </TabsList>

        <TabsContent value="purchases">
          <div className="grid gap-4 mt-4">
            {dummyPurchases.map((item, idx) => (
              <Card key={idx}>
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <h2 className="font-semibold">{item.title}</h2>
                    <p className="text-sm text-muted-foreground">Purchased on {item.date}</p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <Badge variant="outline">{item.status}</Badge>
                    <Button>Download</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="uploads">
          <div className="grid gap-4 mt-4">
            {dummyUploads.map((item, idx) => (
              <Card key={idx}>
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <h2 className="font-semibold">{item.title}</h2>
                    <p className="text-sm text-muted-foreground">Submitted: {item.submitted}</p>
                  </div>
                  <Badge variant={item.status === "Published" ? "success" : "outline"}>
                    {item.status}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}