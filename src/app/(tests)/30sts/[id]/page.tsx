"use client";
import { useParams } from "next/navigation";
import { EvaluationDetailedPage } from "@/features/evaluations/features/30sts";

export default function Detail30STSPageRoute() {
  const paramsParsed = useParams();
  const id = String(paramsParsed.id);

  return <EvaluationDetailedPage id={id} />;
}
