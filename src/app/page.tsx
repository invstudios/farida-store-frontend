import React from "react";
import "./globals.css";
import Store from "@/components/Store";



const page = () => {
  return (
    <main className="overflow-hidden">
      <div className="mt-12 oadding-x padding-y max-width " id="discover">
        <Store />
      </div>
    </main>
  );
};

export default page;
