"use client"

import { useState } from "react"
import { Search, Settings, Folder, FileText, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"

interface SearchResult {
  id: string
  type: "person" | "folder" | "file" | "video"
  name: string
  subtitle?: string
  location?: string
  timestamp?: string
  fileCount?: number
  avatar?: string
  isActive?: boolean
}

const mockResults: SearchResult[] = [
  {
    id: "1",
    type: "person",
    name: "Randall Johnsson",
    subtitle: "Active now",
    avatar: "/professional-man.png",
    isActive: true,
  },
  {
    id: "2",
    type: "folder",
    name: "Random Michal Folder",
    location: "Photos",
    timestamp: "12m ago",
    fileCount: 12,
  },
  {
    id: "3",
    type: "file",
    name: "creative_file_frankies.jpg",
    location: "Photos/Assets",
    timestamp: "12m ago",
  },
  {
    id: "4",
    type: "person",
    name: "Kristinge Karand",
    subtitle: "Active 2d ago",
    avatar: "/professional-woman.png",
  },
  {
    id: "5",
    type: "video",
    name: "files_krande_michelle.avi",
    location: "Videos",
    timestamp: "12m ago",
  },
]

export default function SearchInterface() {
  const [searchQuery, setSearchQuery] = useState("Randl")
  const [activeTab, setActiveTab] = useState<"all" | "files" | "people">("all")
  const [showSettings, setShowSettings] = useState(false)
  const [contentFilters, setContentFilters] = useState({
    files: true,
    people: true,
    chats: false,
    lists: false,
  })

  const filteredResults = mockResults.filter((result) => {
    const matchesQuery = result.name.toLowerCase().includes(searchQuery.toLowerCase())

    if (!contentFilters.files && ["folder", "file", "video"].includes(result.type)) return false
    if (!contentFilters.people && result.type === "person") return false

    if (activeTab === "all") return matchesQuery
    if (activeTab === "files") return matchesQuery && ["folder", "file", "video"].includes(result.type)
    if (activeTab === "people") return matchesQuery && result.type === "person"

    return false
  })

  const getResultCounts = () => {
    const allCount = mockResults.filter((r) => r.name.toLowerCase().includes(searchQuery.toLowerCase())).length
    const filesCount = mockResults.filter(
      (r) => r.name.toLowerCase().includes(searchQuery.toLowerCase()) && ["folder", "file", "video"].includes(r.type),
    ).length
    const peopleCount = mockResults.filter(
      (r) => r.name.toLowerCase().includes(searchQuery.toLowerCase()) && r.type === "person",
    ).length

    return { allCount, filesCount, peopleCount }
  }

  const { allCount, filesCount, peopleCount } = getResultCounts()

  const clearSearch = () => {
    setSearchQuery("")
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "folder":
        return <Folder className="h-4 w-4 text-blue-500" />
      case "file":
        return <FileText className="h-4 w-4 text-gray-500" />
      case "video":
        return <Play className="h-4 w-4 text-purple-500" />
      case "person":
        return null
      default:
        return <FileText className="h-4 w-4 text-gray-500" />
    }
  }

  const toggleContentFilter = (type: keyof typeof contentFilters) => {
    setContentFilters((prev) => ({
      ...prev,
      [type]: !prev[type],
    }))
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-lg overflow-hidden relative">
      {/* Search Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-20 border-0 bg-gray-50 focus:bg-white focus:ring-1 focus:ring-blue-500"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="absolute right-12 top-1/2 transform -translate-y-1/2 h-6 px-2 text-xs text-blue-600 hover:text-blue-800"
            >
              Clear
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
          >
            <Settings className="h-4 w-4 text-gray-400" />
          </Button>
        </div>
      </div>

      {/* Settings Dropdown */}
      {showSettings && (
        <div className="absolute top-16 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4 w-48 z-10">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Files</span>
              </div>
              <Switch checked={contentFilters.files} onCheckedChange={() => toggleContentFilter("files")} />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full bg-gray-300 flex items-center justify-center">
                  <div className="h-2 w-2 bg-white rounded-full"></div>
                </div>
                <span className="text-sm font-medium">People</span>
              </div>
              <Switch checked={contentFilters.people} onCheckedChange={() => toggleContentFilter("people")} />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full border-2 border-gray-300"></div>
                <span className="text-sm text-gray-400">Chats</span>
              </div>
              <Switch checked={contentFilters.chats} onCheckedChange={() => toggleContentFilter("chats")} disabled />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 flex flex-col gap-0.5">
                  <div className="h-0.5 bg-gray-300 rounded"></div>
                  <div className="h-0.5 bg-gray-300 rounded"></div>
                  <div className="h-0.5 bg-gray-300 rounded"></div>
                </div>
                <span className="text-sm text-gray-400">Lists</span>
              </div>
              <Switch checked={contentFilters.lists} onCheckedChange={() => toggleContentFilter("lists")} disabled />
            </div>
          </div>
        </div>
      )}

      {/* Click outside handler to close settings */}
      {showSettings && <div className="fixed inset-0 z-0" onClick={() => setShowSettings(false)} />}

      {/* Filter Tabs */}
      <div className="flex border-b border-gray-100">
        <button
          onClick={() => setActiveTab("all")}
          className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "all" ? "border-black text-black" : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          All <span className="ml-1 text-gray-400">{allCount}</span>
        </button>
        <button
          onClick={() => setActiveTab("files")}
          className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "files" ? "border-black text-black" : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Files <span className="ml-1 text-gray-400">{filesCount}</span>
        </button>
        <button
          onClick={() => setActiveTab("people")}
          className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "people" ? "border-black text-black" : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          People <span className="ml-1 text-gray-400">{peopleCount}</span>
        </button>
      </div>

      {/* Search Results */}
      <div className="max-h-96 overflow-y-auto">
        {filteredResults.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p>No results found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filteredResults.map((result) => (
              <div key={result.id} className="p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                <div className="flex items-center gap-3">
                  {result.type === "person" ? (
                    <div className="relative">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={result.avatar || "/placeholder.svg"} alt={result.name} />
                        <AvatarFallback className="text-xs">
                          {result.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      {result.isActive && (
                        <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                  ) : (
                    <div className="h-8 w-8 bg-gray-100 rounded-md flex items-center justify-center">
                      {getIcon(result.type)}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900 truncate">{result.name}</p>
                      {result.fileCount && (
                        <Badge variant="secondary" className="text-xs">
                          {result.fileCount} Files
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                      {result.subtitle && <span>{result.subtitle}</span>}
                      {result.location && (
                        <>
                          <span>in {result.location}</span>
                          {result.timestamp && (
                            <>
                              <span>•</span>
                              <span>Edited {result.timestamp}</span>
                            </>
                          )}
                        </>
                      )}
                      {result.type === "video" && result.timestamp && <span>Added {result.timestamp}</span>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
