import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function StrategyBuilder() {
  const [strategyType, setStrategyType] = useState("strategy");
  const [useMACD, setUseMACD] = useState(true);
  const [useVWAP, setUseVWAP] = useState(false);
  const [useFib, setUseFib] = useState(true);
  const [useVolumeProfile, setUseVolumeProfile] = useState(true);
  const [swingLength, setSwingLength] = useState(10);
  const [outputCode, setOutputCode] = useState("// Generated Pine Script will appear here...");

  const generateCode = () => {
    let code = `//@version=6\n`;
    code += `${strategyType}("Custom ${strategyType} - PINEREE", overlay=true)\n`;

    if (useFib) {
      code += `\n// === Fibonacci ===\n`;
      code += `swingHigh = ta.highest(high, ${swingLength})\n`;
      code += `swingLow = ta.lowest(low, ${swingLength})\n`;
      code += `fibLow = swingLow\n`;
      code += `fibHigh = swingHigh\n`;
      code += `goldenPocketLow = fibHigh - (fibHigh - fibLow) * 0.618\n`;
      code += `goldenPocketHigh = fibHigh - (fibHigh - fibLow) * 0.65\n`;
    }

    if (useMACD) {
      code += `\n// === MACD ===\n`;
      code += `macdLine = ta.ema(close, 12) - ta.ema(close, 26)\n`;
      code += `signalLine = ta.ema(macdLine, 9)\n`;
      code += `bullishMACD = ta.crossover(macdLine, signalLine)\n`;
    }

    if (useVWAP) {
      code += `\n// === VWAP ===\n`;
      code += `vwap = ta.vwap(close)\n`;
    }

    if (useVolumeProfile) {
      code += `\n// === Volume Profile ===\n`;
      code += `poc = ta.sma(volume, 100)\n`;
    }

    code += `\n// === Base Plot ===\n`;
    if (useFib) {
      code += `plot(goldenPocketLow, color=color.green, title="Fib 0.618")\n`;
    } else if (useMACD) {
      code += `plot(macdLine, color=color.orange, title="MACD Line")\n`;
    } else {
      code += `plot(close, color=color.gray, title="Close Price")\n`;
    }

    if (strategyType === "strategy") {
      code += `\n// === Example Entry ===\n`;
      code += `if close > open\n    strategy.entry("Long", strategy.long)\n`;
    }

    setOutputCode(code);
  };

  return (
    <div className="p-6 grid gap-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold">PINEREE Strategy Builder</h1>
      <Card>
        <CardContent className="grid gap-4 p-4">
          <div className="grid grid-cols-2 gap-4 items-center">
            <Label>Strategy Type</Label>
            <select
              className="border p-2 rounded"
              value={strategyType}
              onChange={(e) => setStrategyType(e.target.value)}
            >
              <option value="strategy">Strategy</option>
              <option value="indicator">Indicator</option>
            </select>
            <Label>Use MACD</Label>
            <Switch checked={useMACD} onCheckedChange={setUseMACD} />
            <Label>Use VWAP</Label>
            <Switch checked={useVWAP} onCheckedChange={setUseVWAP} />
            <Label>Use Fibonacci</Label>
            <Switch checked={useFib} onCheckedChange={setUseFib} />
            <Label>Use Volume Profile</Label>
            <Switch checked={useVolumeProfile} onCheckedChange={setUseVolumeProfile} />
            <Label>Swing Length</Label>
            <Input
              type="number"
              value={swingLength}
              onChange={(e) => setSwingLength(Number(e.target.value))}
            />
          </div>
          <Button onClick={generateCode}>Generate Code</Button>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <Label>Generated Pine Script</Label>
          <Textarea
            className="font-mono text-sm mt-2"
            rows={16}
            value={outputCode}
            readOnly
          />
        </CardContent>
      </Card>
    </div>
  );
}
