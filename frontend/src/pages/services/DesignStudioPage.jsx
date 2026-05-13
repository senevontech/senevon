import React from "react";
import ServiceDetailPage from "../../components/services/ServiceDetailPage";
import { SERVICE_BY_SLUG } from "../../data/servicesCatalog";

export default function DesignStudioPage() {
  return <ServiceDetailPage service={SERVICE_BY_SLUG["design-studio"]} />;
}
