"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Monitor, 
  BarChart3, 
  FileText, 
  Settings, 
  Users, 
  Database,
  Activity,
  Server,
  List,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { useState } from "react";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const menuItems = [
  {
    title: "Data Center",
    icon: Database,
    children: [
      { title: "Monitor", icon: Monitor, active: true },
      { title: "Usage Statistics", icon: BarChart3 },
      { title: "clientErrLog", icon: FileText }
    ]
  },
  {
    title: "Applications",
    icon: Server,
    children: [
      { title: "Reserve Applications", icon: List },
      { title: "Run Applications", icon: Activity },
      { title: "Synchronization List", icon: List },
      { title: "Client List", icon: Users }
    ]
  },
  {
    title: "Group Mgt",
    icon: Users
  },
  {
    title: "System Setting",
    icon: Settings,
    children: [
      { title: "Users", icon: Users }
    ]
  }
];

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>(["Data Center"]);

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  return (
    <div className={cn(
      "bg-white border-r border-gray-200 transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="font-semibold text-gray-900">propr</span>
          </div>
        )}
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <div key={item.title}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  collapsed ? "px-2" : "px-3",
                  item.children && expandedItems.includes(item.title) && "bg-blue-50"
                )}
                onClick={() => item.children && toggleExpanded(item.title)}
              >
                <item.icon className={cn("h-4 w-4", collapsed ? "mr-0" : "mr-3")} />
                {!collapsed && (
                  <>
                    <span className="flex-1">{item.title}</span>
                    {item.children && (
                      expandedItems.includes(item.title) ? 
                        <ChevronDown className="h-4 w-4" /> : 
                        <ChevronRight className="h-4 w-4" />
                    )}
                  </>
                )}
              </Button>
              
              {!collapsed && item.children && expandedItems.includes(item.title) && (
                <div className="ml-6 mt-1 space-y-1">
                  {item.children.map((child) => (
                    <Button
                      key={child.title}
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        child.active && "bg-blue-600 text-white hover:bg-blue-700 hover:text-white"
                      )}
                    >
                      <child.icon className="h-4 w-4 mr-3" />
                      {child.title}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </ScrollArea>

      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          {!collapsed && (
            <>
              <div>Version: 3.3.3.2</div>
              <div>LicenceType: dev edition (Overseas)</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
