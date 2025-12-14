import React, { useEffect, useState } from 'react';
import { supabase } from '@/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Loader2, Mail, Shield } from 'lucide-react';

export const TeamView = () => {
    const [team, setTeam] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeam = async () => {
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*');
                if (error) throw error;
                setTeam(data || []);
            } catch (error) {
                console.error("Error fetching team:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTeam();
    }, []);

    const getInitials = (name) => name ? name.substring(0, 2).toUpperCase() : 'U';

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Team Members</h2>
                <p className="text-sm text-gray-500">Overview of all active users in the organization.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {team.map((member) => (
                    <Card key={member.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
                        <CardHeader className="flex flex-row items-center gap-4 pb-2">
                             <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                                <AvatarImage 
                                    src={`https://api.dicebear.com/9.x/notionists/svg?seed=${member.gender === 'Female' ? 'Lola' : 'Felix'}-${member.email}&backgroundColor=ffdfbf,c0aede`} 
                                />
                                <AvatarFallback>{getInitials(member.full_name)}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <CardTitle className="text-lg">{member.full_name || 'Unknown User'}</CardTitle>
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                    <Shield className="w-3 h-3" /> {member.role || 'Member'}
                                </span>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-2">
                             <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-md">
                                <Mail className="w-4 h-4 text-gray-400" />
                                {member.email}
                             </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};
