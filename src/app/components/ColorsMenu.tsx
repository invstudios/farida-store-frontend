"use client";
import React, { useContext, useEffect } from "react";
import ColorChoice from "./ColorChoice";
import { StoreContext } from "@/contexts/StoreContext";
import { observer } from "mobx-react-lite";
import { useLocale } from "next-intl";

const ColorsMenu = () => {
  const { colors } = useContext(StoreContext);
  const locale = useLocale();

  useEffect(() => {
    colors.getAllColors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col gap-3">
      {colors.colors.map((clr) => (
        <ColorChoice
          key={clr.id}
          value={clr.attributes.name}
          name={
            locale === "en"
              ? clr.attributes.name
              : clr.attributes.localizations?.data[0].attributes.name
          }
          hex={clr.attributes.hex}
        />
      ))}
    </div>
  );
};

export default observer(ColorsMenu);
