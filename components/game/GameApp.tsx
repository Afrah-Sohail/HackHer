"use client";

import { GameHeader } from "@/components/header/GameHeader";
import { DebugPanel } from "@/components/overlays/DebugPanel";
import { GameView } from "@/components/screens/GameView";
import { OpeningScreen } from "@/components/screens/OpeningScreen";
import { TravelScreen } from "@/components/screens/TravelScreen";
import { VictoryScreen } from "@/components/screens/VictoryScreen";
import { WelcomeScreen } from "@/components/screens/WelcomeScreen";
import { GameProvider, useGame } from "@/state/game-context";

function GameFrame() {
  const { state } = useGame();

  // Full-screen scenes show no game header.
  const splash =
    state.screen === "welcome" ||
    state.screen === "opening" ||
    state.screen === "travel" ||
    state.screen === "victory";

  return (
    <div className={"min-h-screen"}>
      {splash ? null : <GameHeader />}
      <main>
        {state.screen === "welcome" ? <WelcomeScreen /> : null}
        {state.screen === "opening" ? <OpeningScreen /> : null}
        {state.screen === "travel" ? <TravelScreen /> : null}
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
