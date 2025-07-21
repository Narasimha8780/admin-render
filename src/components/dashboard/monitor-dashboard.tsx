"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Search, Server, Cpu, HardDrive, Activity, Settings, ExternalLink } from "lucide-react";
import { nodeDetector, type RenderNode } from "@/lib/node-detector";

export function MonitorDashboard() {
  const [searchFilters, setSearchFilters] = useState({
    regionId: "",
    ip: "",
    serverName: "",
    nodeStatus: "All"
  });
  const [refreshRate, setRefreshRate] = useState("5s");
  const [renderNodes, setRenderNodes] = useState<RenderNode[]>([]);
  const [isDetecting, setIsDetecting] = useState(true);
  const [adminNodeIP] = useState('10.6.0.10');

  // Calculate resource overview based on detected nodes
  const resourceOverview = {
    gpuServer: renderNodes.length,
    totalRunning: renderNodes.filter(n => n.nodeStatus === 'Online').reduce((sum, n) => sum + n.instanceMax, 0),
    offline: renderNodes.filter(n => n.nodeStatus === 'Offline').length,
    inactive: renderNodes.filter(n => n.nodeStatus === 'Offline').length,
    cpuAlarm: renderNodes.filter(n => parseInt(n.cpuUsage) > 80).length,
    gpuAlarm: renderNodes.filter(n => parseInt(n.gpuUsage) > 80).length,
    memoryAlarm: renderNodes.filter(n => parseInt(n.memoryUsagePercent) > 80).length,
    diskAlarm: renderNodes.filter(n => parseInt(n.diskUsage) > 80).length
  };

  useEffect(() => {
    // Subscribe to node detection updates
    const unsubscribe = nodeDetector.subscribe((nodes) => {
      setRenderNodes(nodes);
      setIsDetecting(false);
    });

    // Initial load
    setRenderNodes(nodeDetector.getNodes());
    setIsDetecting(false);

    return unsubscribe;
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Online":
        return "bg-green-100 text-green-800";
      case "Offline":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getUsageColor = (usage: string) => {
    const percent = parseInt(usage.replace('%', ''));
    if (percent >= 80) return "text-red-600 font-semibold";
    if (percent >= 50) return "text-yellow-600 font-semibold";
    return "text-green-600 font-semibold";
  };

  const handleNodeOperation = async (nodeId: string, operation: 'detail' | 'freeze' | 'restart' | 'remote') => {
    const node = renderNodes.find(n => n.id === nodeId);
    if (!node) return;

    switch (operation) {
      case 'detail':
        console.log('📊 Node details:', node);
        // In real implementation: open detailed modal
        alert(`Node Details:\n\nServer: ${node.serverName}\nIP: ${node.ip}\nRegion: ${node.regionId}\nGPU: ${node.gpuInfo.name}\nCPU: ${node.systemInfo.cpu}\nRAM: ${node.systemInfo.ram}\nUptime: ${node.systemInfo.uptime}`);
        break;
      
      case 'freeze':
        if (confirm(`Are you sure you want to freeze ${node.serverName}?`)) {
          // In real implementation: call nodeManager.freezeNode(nodeId)
          console.log(`🧊 Freezing node: ${node.serverName}`);
        }
        break;
      
      case 'restart':
        if (confirm(`Are you sure you want to restart ${node.serverName}?`)) {
          // In real implementation: call nodeManager.restartNode(nodeId)
          console.log(`🔄 Restarting node: ${node.serverName}`);
        }
        break;
      
      case 'remote':
        const connectionUrl = `ssh://admin@${node.ip}:22`;
        console.log(`🔗 Remote connection: ${connectionUrl}`);
        // In real implementation: open SSH/RDP client
        alert(`Remote connection URL:\n${connectionUrl}\n\nIn production, this would open your SSH client.`);
        break;
    }
  };

  const filteredNodes = renderNodes.filter(node => {
    if (searchFilters.regionId && !node.regionId.includes(searchFilters.regionId)) return false;
    if (searchFilters.ip && !node.ip.includes(searchFilters.ip)) return false;
    if (searchFilters.serverName && !node.serverName.toLowerCase().includes(searchFilters.serverName.toLowerCase())) return false;
    if (searchFilters.nodeStatus !== 'All' && node.nodeStatus !== searchFilters.nodeStatus) return false;
    return true;
  });

  return (
    <div className="space-y-6 min-h-screen">
      {/* Admin Node Info */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Server className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="text-sm font-medium text-blue-900">Admin Node IP: {adminNodeIP}</div>
              <div className="text-xs text-blue-700">VPC: 10.6.0.0/24 • Port: 8080</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isDetecting ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
            <span className="text-xs text-gray-600">
              {isDetecting ? 'Scanning...' : `${renderNodes.length} nodes detected`}
            </span>
          </div>
        </div>
      </div>

      {/* GPU Server Resource Overview */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">GPU Server Resource Overview</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-900">{resourceOverview.gpuServer}</div>
                  <div className="text-sm text-gray-600">GPU Servers</div>
                </div>
                <Server className="h-8 w-8 text-blue-500 opacity-20" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-green-600">{resourceOverview.totalRunning}</div>
                  <div className="text-sm text-gray-600">Running Tasks</div>
                </div>
                <Activity className="h-8 w-8 text-green-500 opacity-20" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-red-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-red-600">{resourceOverview.offline}</div>
                  <div className="text-sm text-gray-600">Offline</div>
                </div>
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-yellow-600">{resourceOverview.inactive}</div>
                  <div className="text-sm text-gray-600">Inactive</div>
                </div>
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-orange-600">{resourceOverview.cpuAlarm}</div>
                  <div className="text-sm text-gray-600">CPU Alerts</div>
                </div>
                <Cpu className="h-8 w-8 text-orange-500 opacity-20" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-purple-600">{resourceOverview.gpuAlarm}</div>
                  <div className="text-sm text-gray-600">GPU Alerts</div>
                </div>
                <Activity className="h-8 w-8 text-purple-500 opacity-20" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-red-600">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-red-600">{resourceOverview.memoryAlarm}</div>
                  <div className="text-sm text-gray-600">Memory Alerts</div>
                </div>
                <HardDrive className="h-8 w-8 text-red-500 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Search Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Region ID</label>
              <Input 
                placeholder="Please Input Region ID"
                value={searchFilters.regionId}
                onChange={(e) => setSearchFilters({...searchFilters, regionId: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">IP</label>
              <Input 
                placeholder="Please Input IP"
                value={searchFilters.ip}
                onChange={(e) => setSearchFilters({...searchFilters, ip: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Server Name</label>
              <Input 
                placeholder="Server Name"
                value={searchFilters.serverName}
                onChange={(e) => setSearchFilters({...searchFilters, serverName: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Node Status</label>
              <Select value={searchFilters.nodeStatus} onValueChange={(value) => setSearchFilters({...searchFilters, nodeStatus: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="Online">Online</SelectItem>
                  <SelectItem value="Offline">Offline</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchFilters({
                  regionId: "",
                  ip: "",
                  serverName: "",
                  nodeStatus: "All"
                });
              }}
            >
              Reset
            </Button>
            <Button>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Render Server Resource Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>View Of Render Server Resource</CardTitle>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" disabled={filteredNodes.length === 0}>
                  Freeze
                </Button>
                <Button variant="outline" size="sm" disabled={filteredNodes.length === 0}>
                  Restart
                </Button>
                <span className="text-sm text-gray-600">Detected {filteredNodes.length} nodes</span>
              </div>
              <div className="flex items-center space-x-2">
                <Select value={refreshRate} onValueChange={setRefreshRate}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5s">5s Refresh Rate</SelectItem>
                    <SelectItem value="10s">10s Refresh Rate</SelectItem>
                    <SelectItem value="30s">30s Refresh Rate</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    setIsDetecting(true);
                    nodeDetector.refreshNodes().finally(() => setIsDetecting(false));
                  }}
                  disabled={isDetecting}
                >
                  <RefreshCw className={`h-4 w-4 ${isDetecting ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {isDetecting && filteredNodes.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-pulse" />
              <p className="text-gray-600">Detecting render nodes via admin node {adminNodeIP}...</p>
            </div>
          ) : filteredNodes.length === 0 ? (
            <div className="text-center py-8">
              <Server className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No render nodes detected. Ensure nodes are running and accessible from admin node {adminNodeIP}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <input type="checkbox" className="rounded" />
                    </TableHead>
                    <TableHead>Server Name</TableHead>
                    <TableHead>Region ID</TableHead>
                    <TableHead>IP</TableHead>
                    <TableHead>Instance Max</TableHead>
                    <TableHead>CPU Usage</TableHead>
                    <TableHead>GPU Usage</TableHead>
                    <TableHead>Memory Usage</TableHead>
                    <TableHead>Memory %</TableHead>
                    <TableHead>Disk Usage</TableHead>
                    <TableHead>Node Status</TableHead>
                    <TableHead>GPU Info</TableHead>
                    <TableHead>Last Seen</TableHead>
                    <TableHead>Operations</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredNodes.map((node) => (
                    <TableRow key={node.id}>
                      <TableCell>
                        <input type="checkbox" className="rounded" />
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          <Server className="h-4 w-4 text-gray-500" />
                          <span>{node.serverName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {node.regionId}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{node.ip}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{node.instanceMax}</Badge>
                      </TableCell>
                      <TableCell className={getUsageColor(node.cpuUsage)}>
                        <div className="flex items-center space-x-1">
                          <Cpu className="h-3 w-3" />
                          <span>{node.cpuUsage}</span>
                        </div>
                      </TableCell>
                      <TableCell className={getUsageColor(node.gpuUsage)}>
                        <div className="flex items-center space-x-1">
                          <Activity className="h-3 w-3" />
                          <span>{node.gpuUsage}</span>
                        </div>
                      </TableCell>
                      <TableCell className={getUsageColor(node.memoryUsagePercent)}>
                        <span>{node.memoryUsage}</span>
                      </TableCell>
                      <TableCell className={getUsageColor(node.memoryUsagePercent)}>
                        <span>{node.memoryUsagePercent}</span>
                      </TableCell>
                      <TableCell className={getUsageColor(node.diskUsage)}>
                        <div className="flex items-center space-x-1">
                          <HardDrive className="h-3 w-3" />
                          <span>{node.diskUsage}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(node.nodeStatus)}>
                          {node.nodeStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs">
                          <div className="font-medium">{node.gpuInfo.name}</div>
                          <div className="text-gray-500">{node.gpuInfo.memory}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs text-gray-500">
                          {node.lastSeen.toLocaleTimeString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-auto px-2 py-1 text-xs text-blue-600 hover:bg-blue-50"
                            onClick={() => handleNodeOperation(node.id, 'detail')}
                          >
                            Detail
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-auto px-2 py-1 text-xs text-orange-600 hover:bg-orange-50"
                            onClick={() => handleNodeOperation(node.id, 'freeze')}
                            disabled={node.nodeStatus === 'Offline' || !node.operations.canFreeze}
                          >
                            Freeze
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-auto px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                            onClick={() => handleNodeOperation(node.id, 'restart')}
                            disabled={node.nodeStatus === 'Offline' || !node.operations.canRestart}
                          >
                            Restart
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-auto px-2 py-1 text-xs text-green-600 hover:bg-green-50"
                            onClick={() => handleNodeOperation(node.id, 'remote')}
                            disabled={node.nodeStatus === 'Offline' || !node.operations.canRemote}
                          >
                            Remote
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
