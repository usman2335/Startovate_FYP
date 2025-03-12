import React from "react";
import { lazy, Suspense } from "react";
import templateMapping from "../../content/templateMapping";

const TemplateComponent = ({ templateKey }) => {
  const DynamicComponent = templateMapping[templateKey] || Template1;

  return <DynamicComponent />;
};

export default TemplateComponent;
