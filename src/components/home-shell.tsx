"use client";
import NavBar from "./nav-bar";
import MainContainer from "./main-container";
import { useState } from "react";
import { Tag, Task } from "@/core/domain/models";

export default function HomeShell({
  tasks,
  tags,
}: {
  tasks: Task[];
  tags: Tag[];
}) {
  const [activeTab, setActiveTab] = useState("tasks");

  return (
    <>
      <NavBar setActiveTab={setActiveTab} activeTab={activeTab} />
      <MainContainer tasks={tasks} tags={tags} activeTab={activeTab} />
    </>
  );
}
