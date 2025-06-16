"use client";
import React from "react";

interface SafeDividerProps {
  className?: string;
}

const SafeDivider = ({ className = "" }: SafeDividerProps) => {
  return (
    <div suppressHydrationWarning={true}>
      <hr
        style={{
          border: 'none',
          borderTop: '1px solid #e5e7eb',
          margin: 0,
          width: '100%'
        }}
        role="separator"
        className={className}
      />
    </div>
  );
};

export default SafeDivider;

