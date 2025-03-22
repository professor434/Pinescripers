import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const products = [
  {
    id: 1,
    title: "Golden Pocket Scalper",
    author: "John Trader",
    price: 25,
    rating: 4.8,
    tags: ["Fibonacci", "Scalping"],
    description: "Strategy based on Golden Pocket retracement.",
    downloadable: true
  },
  {
    id: 2,
    title: "MACD Trend Indicator",
    author: "Anna Algo",
    price: 0,
    rating: 4.5,
    tags: ["Indicator", "MACD"],
    description: "MACD with signal cross coloring.",
    downloadable: true
  },
  {
    id: 3,
    title: "VWAP Volume Hybrid",
    author: "CryptoDevX",
    price: 19,
    rating: 4.9,
    tags: ["VWAP", "Volume"],
    description: "Intraday tool using VWAP and VAH/VAL.",
    downloadable: false
  }
];

export default function Marketplace() {
  const [search, setSearch] = useState("");

  const filtered = products.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-6 max-w-7xl mx-auto grid gap-6">
      <h1 className="text-2xl font-bold">PINEREE Marketplace</h1>
      <Input
        placeholder="Search indicators or strategies..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-4 grid gap-2">
              <h2 className="text-lg font-semibold">{item.title}</h2>
              <p className="text-sm text-muted-foreground">By {item.author}</p>
              <p className="text-sm">{item.description}</p>
              <div className="flex flex-wrap gap-2 pt-1">
                {item.tags.map((tag, i) => (
                  <Badge key={i} variant="outline">{tag}</Badge>
                ))}
              </div>
              <p className="text-sm pt-2">⭐ {item.rating} / 5</p>
              <div className="flex justify-between items-center pt-2">
                <p className="font-semibold">
                  {item.price === 0 ? "Free" : `$${item.price}`}
                </p>
                <Button disabled={!item.downloadable}>
                  {item.downloadable ? "Download" : "Request Access"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}