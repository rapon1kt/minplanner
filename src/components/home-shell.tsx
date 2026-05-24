"use client";
import NavBar from "./nav-bar";
import MainContainer from "./main-container";
import { useState } from "react";
import { Task } from "@/core/domain/models";

export default function HomeShell({ tasks }: { tasks: Task[] }) {
  const [activeTab, setActiveTab] = useState("tasks");

  return (
    <>
      <NavBar setActiveTab={setActiveTab} activeTab={activeTab} />
      <MainContainer tasks={tasks} activeTab={activeTab} />
    </>
  );
}
