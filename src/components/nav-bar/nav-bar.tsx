import { Calendar, Clock, ListTodo, Tags } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

interface NavBarProps {
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
}

const navTabs = [
  { id: "tasks", label: "Tasks", icon: ListTodo },
  { id: "tags", label: "Tags", icon: Tags },
  { id: "routines", label: "Routines", icon: Clock },
  { id: "calendar", label: "Calendar", icon: Calendar },
];

export default function NavBar({ activeTab, setActiveTab }: NavBarProps) {
  return (
    <nav className="font-barlow border-b border-neutral-800 backdrop-blur overflow-auto">
      <div className="max-w-6xl mx-auto px-6 flex gap-8">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`cursor-pointer py-4 px-2 border-b-2 transition-all duration-200 flex items-center gap-2 text-xs font-normal tracking-widest ${
                activeTab === tab.id
                  ? "border-neutral-800 text-neutral-400"
                  : "border-transparent text-neutral-500 hover:text-neutral-300"
              }`}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
