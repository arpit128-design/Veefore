import { useWorkspaceContext } from "@/hooks/useWorkspace";
import { WorkspaceSwitchingOverlay } from "./WorkspaceSwitchingOverlay";
import { useState, useEffect } from "react";

export function GlobalWorkspaceSwitchingOverlay() {
  const { isSwitching, currentWorkspace } = useWorkspaceContext();
  const [targetWorkspace, setTargetWorkspace] = useState<any>(null);

  useEffect(() => {
    if (isSwitching && !targetWorkspace) {
      // Set a placeholder target workspace during switching
      setTargetWorkspace({ name: "Loading...", id: "temp" });
    } else if (!isSwitching) {
      setTargetWorkspace(null);
    }
  }, [isSwitching, targetWorkspace]);

  return (
    <WorkspaceSwitchingOverlay
      isVisible={isSwitching}
      currentWorkspace={currentWorkspace}
      targetWorkspace={targetWorkspace}
    />
  );
}