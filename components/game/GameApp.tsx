"use client";

import { GameHeader } from "@/components/header/GameHeader";
import { DebugPanel } from "@/components/overlays/DebugPanel";
import { GameView } from "@/components/screens/GameView";
import { VictoryScreen } from "@/components/screens/VictoryScreen";
import { WelcomeScreen } from "@/components/screens/WelcomeScreen";
import { GameProvider, useGame } from "@/state/game-context";

function GameFrame() {
  const { state } = useGame();

  const splash = state.screen === "welcome";

  return (
    <div className={splash ? "min-h-screen" : "min-h-screen pb-24"}>
      {splash ? null : <GameHeader />}
      <main>
        {splash ? <WelcomeScreen /> : null}
        {state.screen === "playing" ? <GameView /> : null}
        {state.screen === "victory" ? <VictoryScreen /> : null}
      </main>
      {splash ? null : <DebugPanel />}
    </div>
  );
}

export function GameApp() {
  return (
    <GameProvider>
      <GameFrame />
    </GameProvider>
  );
}
