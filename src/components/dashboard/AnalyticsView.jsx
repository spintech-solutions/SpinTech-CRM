import React, { useEffect, useState } from 'react';
import { supabase } from '@/supabase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { Loader2, TrendingUp, Users, CheckCircle2, Clock } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export const AnalyticsView = () => {
    const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, workTypes: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
             const { data: clients } = await supabase.from('clients').select('*');
             
             if (clients) {
                 const total = clients.length;
                 const completed = clients.filter(c => c.status === 'completed').length;
                 const pending = total - completed;
                 
                 // Calc work types distribution
                 let types = { Software: 0, Editing: 0, Design: 0 };
                 clients.forEach(c => {
                     if (c.work_details?.software?.selected) types.Software++;
                     if (c.work_details?.editing?.selected) types.Editing++;
                     if (c.work_details?.design?.selected) types.Design++;
                 });
                 
                 const workTypes = Object.keys(types).map((key, index) => ({
                    name: key, 
                    value: types[key],
                    fill: COLORS[index % COLORS.length]
                 }));

                 setStats({ total, completed, pending, workTypes });
             }
             setLoading(false);
        };
        fetchStats();
    }, []);

    const chartConfig = {
        count: { label: "Projects" },
        Software: { label: "Software", color: "#0088FE" },
        Editing: { label: "Editing", color: "#00C49F" },
        Design: { label: "Design", color: "#FFBB28" },
    };

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
             <div>
                <h2 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h2>
                <p className="text-sm text-gray-500">Deep dive into project performance and distribution.</p>
            </div>

            {/* Top Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
                        </div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completed</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{stats.completed}</div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending</CardTitle>
                        <Clock className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Work Type Distribution Chart */}
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Work Type Distribution</CardTitle>
                        <CardDescription>Breakdown of projects by category.</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[300px] w-full">
                            <ChartContainer config={chartConfig} className="w-full h-full">
                                <BarChart data={stats.workTypes}>
                                    <XAxis dataKey="name" />
                                    <YAxis allowDecimals={false} />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                        {stats.workTypes.map((entry, index) => (
                                          <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ChartContainer>
                        </div>
                    </CardContent>
                </Card>

                 {/* Completion Chart (Reused from dashboard concept but standalone here) */}
                 <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Status Overview</CardTitle>
                        <CardDescription>Completed vs Pending ratio.</CardDescription>
                    </CardHeader>
                    <CardContent>
                          <div className="h-[250px] w-full flex items-center justify-center">
                              <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Tooltip />
                                    <Pie
                                        data={[
                                            { name: 'Completed', value: stats.completed, fill: '#22c55e' },
                                            { name: 'Pending', value: stats.pending, fill: '#f97316' }
                                        ]}
                                        dataKey="value"
                                        nameKey="name"
                                        innerRadius={60} 
                                        outerRadius={80} 
                                        paddingAngle={5}
                                    >
                                    </Pie>
                                </PieChart>
                             </ResponsiveContainer>
                          </div>
                          <div className="flex justify-center gap-4 text-sm mt-4">
                              <div className="flex items-center gap-1">
                                  <div className="w-3 h-3 rounded-full bg-green-500"></div> Completed
                              </div>
                               <div className="flex items-center gap-1">
                                  <div className="w-3 h-3 rounded-full bg-orange-500"></div> Pending
                              </div>
                          </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
