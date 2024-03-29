"use client";
import { CircularProgress } from "@nextui-org/react";
import { observer } from "mobx-react-lite";
import React from "react";

interface loadingOverlayProps {
  activateLoading?: boolean;
}

const LoadingOverlay = ({ activateLoading = true }: loadingOverlayProps) => {
  return (
    <div className="absolute z-50 w-full h-full bg-mainWhite/50 flex justify-center items-center">
      {activateLoading && (
        <CircularProgress
          color="secondary"
          size="lg"
          classNames={{
            indicator: "stroke-mainPink",
            track: "stroke-mainPink/10",
          }}
        />
      )}
    </div>
  );
};

export default LoadingOverlay;
