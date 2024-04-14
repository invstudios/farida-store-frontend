import React from "react";
import CategoriesPageContainer from "./components/CategoriesPageContainer";

interface categoriesPageProps {
  params: { name: string };
}

const CategoriesPage = ({ params }: categoriesPageProps) => {
  return <CategoriesPageContainer name={params.name} />;
};

export default CategoriesPage;
