import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

export default function StrategyBuilder() {
  const navigate = useNavigate();
  const [strategyType, setStrategyType] = useState("strategy");
  const [useMACD, setUseMACD] = useState(true);
  const [useVWAP, setUseVWAP] = useState(false);
  const [useFib, setUseFib] = useState(true);
  const [useVolumeProfile, setUseVolumeProfile] = useState(true);
  const [useBlockchain, setUseBlockchain] = useState(false);
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

    if (useBlockchain) {
      code += `\n// Blockchain Dynamic: This strategy could be used in a smart contract for on-chain signals.\n`;
    }

    setOutputCode(code);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center p-6"
      style={{ backgroundImage: "url('/assets/login-bg.png')" }}
    >
      <div className="bg-white/90 rounded-2xl shadow-2xl w-full max-w-5xl p-8">
        <h1 className="text-3xl font-bold text-center mb-6">PINEREE Strategy Builder</h1>

        <Card className="mb-6">
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
              <Label>Blockchain Dynamic</Label>
              <Switch checked={useBlockchain} onCheckedChange={setUseBlockchain} />
              <Label>Swing Length</Label>
              <Input
                type="number"
                value={swingLength}
                onChange={(e) => setSwingLength(Number(e.target.value))}
              />
            </div>
            <Button onClick={generateCode} className="bg-blue-600 hover:bg-blue-700 text-white">
              Generate Code
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <Label className="font-semibold text-lg mb-2 block">Generated Pine Script</Label>
            <Textarea
              className="font-mono text-sm p-4 bg-gray-100 rounded-md w-full h-[400px] resize-none"
              value={outputCode}
              readOnly
            />
          </CardContent>
        </Card>

        <Button
          onClick={() => navigate("/dashboard")}
          className="mt-6 bg-gray-800 text-white hover:bg-gray-900"
        >
          ← Back to Dashboard
        </Button>
      </div>
    </div>
  );
}
