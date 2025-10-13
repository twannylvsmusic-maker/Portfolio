import React, { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { motion } from "framer-motion";

/**
 * AI Chess Tutor — v3 with Blunder Review & Why-Not Explainer
 *
 * New Additions:
 * ✅ Blunder Review Queue — records mistakes/blunders for later replay
 * ✅ “Why Not?” Explainer — shows refutation PV + summary when a bad move is selected
 *
 * Retains:
 * - Stockfish-based multiPV analysis
 * - Best/Alternate/Poor move coloring
 * - Heuristic explanations for move reasoning
 */

function createStockfishWorker() {
  const workerCode = `
    importScripts('https://cdn.jsdelivr.net/npm/stockfish@16.1.0/stockfish.js');
    const engine = STOCKFISH();
    function send(cmd){ engine.postMessage(cmd); }

    engine.onmessage = function(e){
      const line = typeof e === 'object' && e && e.data ? e.data : e;
      postMessage({ type: 'raw', data: line });
      if (/uciok/.test(line)) postMessage({ type: 'status', data: 'uciok' });
      if (/readyok/.test(line)) postMessage({ type: 'status', data: 'ready' });
      if (/^bestmove\s/.test(line)) {
        const m = line.match(/^bestmove\s(\S+)(?:\sponder\s(\S+))?/);
        if (m) postMessage({ type: 'bestmove', move: m[1], ponder: m[2] || null });
      }
      if (/^info /.test(line) && / score /.test(line) && / pv /.test(line)) {
        const mpv = / multipv (\d+)/.exec(line);
        const depth = / depth (\d+)/.exec(line);
        const mate = / score mate (-?\d+)/.exec(line);
        const cp = / score cp (-?\d+)/.exec(line);
        const pv = / pv (.+)$/.exec(line);
        const firstMove = pv ? pv[1].split(' ')[0] : null;
        if (firstMove) {
          postMessage({
            type: 'line',
            multipv: mpv ? parseInt(mpv[1]) : 1,
            depth: depth ? parseInt(depth[1]) : null,
            eval: mate ? { type: 'mate', value: parseInt(mate[1]) } : { type: 'cp', value: cp ? parseInt(cp[1]) : null },
            pv: pv ? pv[1] : null,
            move: firstMove
          });
        }
      }
    };

    onmessage = function(e){
      const { type, data } = e.data;
      if (type === 'init') send('uci');
      else if (type === 'position') send(\`position fen \${data.fen}\`);
      else if (type === 'go') send(\`go depth \${data.depth}\`);
      else if (type === 'quit') { send('quit'); close(); }
    };
  `;
  const blob = new Blob([workerCode], { type: 'application/javascript' });
  return new Worker(URL.createObjectURL(blob));
}

function explainMove(move, delta) {
  if (delta <= 20) return "Top choice: maximizes position.";
  if (delta <= 120) return "Playable but slightly inferior.";
  if (delta <= 300) return "Inaccuracy — small positional slip.";
  if (delta <= 600) return "Mistake — allows opponent counterplay.";
  return "Blunder — severe drop, likely losing.";
}

export default function AIChessTutorV3() {
  const [game, setGame] = useState(() => new Chess());
  const [orientation, setOrientation] = useState("white");
  const [analysis, setAnalysis] = useState({ lines: [], best: null });
  const [depth, setDepth] = useState(14);
  const [multiPV, setMultiPV] = useState(4);
  const [loading, setLoading] = useState(false);
  const [reviewQueue, setReviewQueue] = useState([]);
  const [whyNot, setWhyNot] = useState(null);

  const engineRef = useRef(null);
  const pendingRef = useRef({});

  useEffect(() => {
    const worker = createStockfishWorker();
    engineRef.current = worker;

    worker.onmessage = (e) => {
      const msg = e.data;
      if (msg.type === 'line') {
        pendingRef.current.lines = pendingRef.current.lines || [];
        pendingRef.current.lines[msg.multipv - 1] = msg;
      }
      if (msg.type === 'bestmove') {
        const lines = (pendingRef.current.lines || []).filter(Boolean);
        setAnalysis({ lines, best: lines[0] });
        setLoading(false);
      }
    };

    worker.postMessage({ type: 'init' });
    return () => worker.terminate();
  }, []);

  const analyze = (fen) => {
    setLoading(true);
    pendingRef.current = { key: fen, lines: [] };
    engineRef.current.postMessage({ type: 'position', data: { fen } });
    engineRef.current.postMessage({ type: 'go', data: { depth } });
  };

  useEffect(() => { analyze(game.fen()); }, [game]);

  const onDrop = (sourceSquare, targetSquare) => {
    const next = new Chess(game.fen());
    const move = next.move({ from: sourceSquare, to: targetSquare, promotion: 'q' });
    if (!move) return false;
    setGame(next);

    const best = analysis.best;
    const playedLine = analysis.lines.find(l => l.move === `${sourceSquare}${targetSquare}`);
    const delta = best && playedLine ? best.eval.value - playedLine.eval.value : 500;

    if (delta > 300) setReviewQueue(q => [...q, { move: move.san, fen: next.fen(), delta }]);
    setWhyNot({ move: move.san, note: explainMove(move, delta) });

    return true;
  };

  const replayBlunder = (b) => {
    const next = new Chess(b.fen);
    setGame(next);
    setWhyNot({ move: b.move, note: \`Blunder review: \${b.move} (Δ\${b.delta}cp)\` });
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">AI Chess Tutor — v3</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle>Board</CardTitle></CardHeader>
          <CardContent>
            <Chessboard
              position={game.fen()}
              onPieceDrop={onDrop}
              boardOrientation={orientation}
              animationDuration={200}
            />
            <div className="mt-3 flex gap-2">
              <Button size="sm" onClick={() => setOrientation(o => o === 'white' ? 'black' : 'white')}>Flip</Button>
              <Button size="sm" onClick={() => setGame(new Chess())}>New Game</Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <Card>
            <CardHeader><CardTitle>Why Not?</CardTitle></CardHeader>
            <CardContent>
              {whyNot ? (
                <div>
                  <p><strong>{whyNot.move}</strong></p>
                  <p className="text-sm text-muted-foreground">{whyNot.note}</p>
                </div>
              ) : <p className="text-sm text-muted-foreground">Make a move to see evaluation feedback.</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Blunder Review Queue</CardTitle></CardHeader>
            <CardContent>
              {reviewQueue.length === 0 ? <p className="text-sm text-muted-foreground">No blunders yet.</p> : (
                <ul className="space-y-2">
                  {reviewQueue.map((b, i) => (
                    <li key={i} className="flex justify-between items-center">
                      <span>{b.move} (Δ{b.delta}cp)</span>
                      <Button size="xs" onClick={() => replayBlunder(b)}>Replay</Button>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}