import React from "react";
import templateMapping from "../../content/templateMapping";

const TemplateComponent = ({ templateKey }) => {
  const DynamicComponent =
    templateMapping[templateKey] ||
    templateMapping["ProblemIdentification-Step1"];

  return <DynamicComponent />;
};

export default TemplateComponent;
