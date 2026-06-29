"use client";
import { useState } from "react";
import { Tag, Task } from "@/core/domain/models";
import { NavBar, MainContainer } from "./";

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
