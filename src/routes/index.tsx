import { createFileRoute } from "@tanstack/react-router";
import { TrainApp } from "@/components/game/train-app";

export const Route = createFileRoute("/")({ component: TrainApp });
