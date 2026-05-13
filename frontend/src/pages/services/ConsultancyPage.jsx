import React from "react";
import ServiceDetailPage from "../../components/services/ServiceDetailPage";
import { SERVICE_BY_SLUG } from "../../data/servicesCatalog";

export default function ConsultancyPage() {
  return <ServiceDetailPage service={SERVICE_BY_SLUG["consultancy"]} />;
}
