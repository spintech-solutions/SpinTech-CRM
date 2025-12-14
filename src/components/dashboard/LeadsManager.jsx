import React, { useState, useEffect } from 'react';
import { supabase } from '@/supabase';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { Plus, Trash2, Edit2, Phone, Mail, MapPin, Calendar as CalendarIcon, Check, X, Clock, Loader2, DollarSign, FileText, Download } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import logo from "../../assets/SpintechLogo.png"

export const LeadsManager = () => {
    const { user } = useAuth();
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('new'); // new (all unreviewed), accepted, pending, rejected

    // Dialog States
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isAcceptOpen, setIsAcceptOpen] = useState(false);
    const [isPendingOpen, setIsPendingOpen] = useState(false);
    const [isRejectOpen, setIsRejectOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    // Selected Lead for Actions
    const [selectedLead, setSelectedLead] = useState(null);

    // Forms
    const [formData, setFormData] = useState({});

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
        if (error) {
            toast.error("Failed to fetch leads");
        } else {
            setLeads(data || []);
        }
        setLoading(false);
    };

    const handleInputChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

    const submitAddLead = async () => {
        if (!formData.name || !formData.phone) {
            toast.error("Name and Phone are required");
            return;
        }
        try {
            const { error } = await supabase.from('leads').insert([{
                ...formData,
                status: 'new',
                user_id: user.id
            }]);
            if (error) throw error;
            toast.success("Client added successfully");
            setIsAddOpen(false);
            setFormData({});
            fetchLeads();
        } catch (e) {
            toast.error("Error adding client");
        }
    };

    const submitAccept = async () => {
        try {
            const { error } = await supabase.from('leads').update({
                status: 'accepted',
                requirements: formData.requirements,
                price: formData.price,
                service: formData.service
            }).eq('id', selectedLead.id);
            if (error) throw error;
            toast.success("Client Accepted!");
            setIsAcceptOpen(false);
            fetchLeads();
        } catch (e) {
            toast.error("Action failed");
        }
    };

    const submitPending = async () => {
        try {
            const { error } = await supabase.from('leads').update({
                status: 'pending',
                callback_date: formData.callback_date,
                callback_time: formData.callback_time
            }).eq('id', selectedLead.id);
            if (error) throw error;
            toast.success("Moved to Pending");
            setIsPendingOpen(false);
            fetchLeads();
        } catch (e) {
            toast.error("Action failed");
        }
    };

    const submitReject = async () => {
        try {
            const { error } = await supabase.from('leads').update({
                status: 'rejected',
                rejection_reason: formData.rejection_reason
            }).eq('id', selectedLead.id);
            if (error) throw error;
            toast.success("Client Rejected");
            setIsRejectOpen(false);
            fetchLeads();
        } catch (e) {
            toast.error("Action failed");
        }
    };

    const exportCSV = () => {
        if (!filteredLeads.length) {
            toast.error("No data to export");
            return;
        }

        const headers = ["Name", "Company", "Phone", "Email", "Status", "Service", "Price", "Requirements", "Callback Date", "Callback Time", "Rejection Reason"];
        
        const csvContent = [
            headers.join(","),
            ...filteredLeads.map(row => {
                const values = [
                    row.name,
                    `"${(row.company || '').replace(/"/g, '""')}"`,
                    `"${(row.phone || '').replace(/"/g, '""')}"`,
                    row.email || '',
                    row.status,
                    row.service || '',
                    row.price || '',
                    `"${(row.requirements || '').replace(/"/g, '""')}"`,
                    row.callback_date ? format(new Date(row.callback_date), 'yyyy-MM-dd') : '',
                    `"${(row.callback_time || '').replace(/"/g, '""')}"`,
                    `"${(row.rejection_reason || '').replace(/"/g, '""')}"`
                ];
                return values.join(",");
            })
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `leads_${filter}_${format(new Date(), 'yyyy-MM-dd')}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const confirmDelete = async () => {
        try {
            const { error } = await supabase.from('leads').delete().eq('id', deleteId);
            if (error) throw error;
            toast.success("Deleted successfully");
            setLeads(prev => prev.filter(l => l.id !== deleteId));
        } catch (e) {
            toast.error("Delete failed");
        } finally {
            setDeleteId(null);
        }
    };

    const openAction = (type, lead) => {
        setSelectedLead(lead);
        setFormData({}); // Reset form
        if (type === 'accept') setIsAcceptOpen(true);
        if (type === 'pending') setIsPendingOpen(true);
        if (type === 'reject') setIsRejectOpen(true);
    };

    // Stats
    const stats = {
        all: leads.length,
        new: leads.filter(l => l.status === 'new').length,
        accepted: leads.filter(l => l.status === 'accepted').length,
        pending: leads.filter(l => l.status === 'pending').length,
        rejected: leads.filter(l => l.status === 'rejected').length
    };

    // Filter Logic
    const filteredLeads = filter === 'all' ? leads : leads.filter(l => l.status === filter);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header & Capsules */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                   <h2 className="text-2xl font-bold tracking-tight">Marketing CRM</h2>
                   <p className="text-sm text-gray-500">Manage leads, track status and conversions.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={exportCSV}>
                        <Download className="mr-2 h-4 w-4" /> Export CSV
                    </Button>
                    <Button onClick={() => { setFormData({}); setIsAddOpen(true); }} className="bg-black hover:bg-gray-800">
                        <Plus className="mr-2 h-4 w-4" /> Add Client
                    </Button>
                </div>
            </div>

            <div className="flex flex-wrap gap-2">
                 <div 
                    onClick={() => setFilter('all')}
                    className={cn("cursor-pointer px-4 py-2 rounded-full border transition-all flex items-center gap-2", 
                        filter === 'all' ? "bg-gray-800 text-white border-gray-800" : "bg-white text-gray-600 hover:border-gray-400"
                    )}
                 >
                    <div className={cn("w-2 h-2 rounded-full", filter === 'all' ? "bg-white" : "bg-gray-900")}></div>
                    <span className="font-medium">All Clients</span>
                    <span className="text-xs bg-white/20 px-1.5 rounded-full">{stats.all}</span>
                 </div>
                 <div 
                    onClick={() => setFilter('new')}
                    className={cn("cursor-pointer px-4 py-2 rounded-full border transition-all flex items-center gap-2", 
                        filter === 'new' ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 hover:border-blue-400"
                    )}
                 >
                    <div className={cn("w-2 h-2 rounded-full", filter === 'new' ? "bg-white" : "bg-blue-500")}></div>
                    <span className="font-medium">New / Review</span>
                    <span className="text-xs bg-white/20 px-1.5 rounded-full">{stats.new}</span>
                 </div>
                 <div 
                    onClick={() => setFilter('accepted')}
                    className={cn("cursor-pointer px-4 py-2 rounded-full border transition-all flex items-center gap-2", 
                        filter === 'accepted' ? "bg-green-600 text-white border-green-600" : "bg-white text-gray-600 hover:border-green-400"
                    )}
                 >
                    <div className={cn("w-2 h-2 rounded-full", filter === 'accepted' ? "bg-white" : "bg-green-500")}></div>
                    <span className="font-medium">Accepted</span>
                    <span className="text-xs bg-white/20 px-1.5 rounded-full">{stats.accepted}</span>
                 </div>
                 <div 
                    onClick={() => setFilter('pending')}
                    className={cn("cursor-pointer px-4 py-2 rounded-full border transition-all flex items-center gap-2", 
                        filter === 'pending' ? "bg-orange-500 text-white border-orange-500" : "bg-white text-gray-600 hover:border-orange-400"
                    )}
                 >
                    <div className={cn("w-2 h-2 rounded-full", filter === 'pending' ? "bg-white" : "bg-orange-500")}></div>
                    <span className="font-medium">Pending</span>
                    <span className="text-xs bg-white/20 px-1.5 rounded-full">{stats.pending}</span>
                 </div>
                 <div 
                    onClick={() => setFilter('rejected')}
                    className={cn("cursor-pointer px-4 py-2 rounded-full border transition-all flex items-center gap-2", 
                        filter === 'rejected' ? "bg-red-600 text-white border-red-600" : "bg-white text-gray-600 hover:border-red-400"
                    )}
                 >
                    <div className={cn("w-2 h-2 rounded-full", filter === 'rejected' ? "bg-white" : "bg-red-500")}></div>
                    <span className="font-medium">Rejected</span>
                    <span className="text-xs bg-white/20 px-1.5 rounded-full">{stats.rejected}</span>
                 </div>
            </div>

            {/* Table */}
            <div className="rounded-md border bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50/50">
                            <TableHead className="w-[50px]">
                                <img src={logo} alt="Logo" className="h-5 w-5 opacity-50" />
                            </TableHead>
                            <TableHead>Client Details</TableHead>
                            <TableHead>Contact</TableHead>
                            {/* Show 'Status' column specifically for 'All' view */}
                            {filter === 'all' && <TableHead>Status</TableHead>}
                            <TableHead>Details / Notes</TableHead>
                            {/* Hide Actions column for 'All' view if no actions needed, else keep empty or restricted */}
                            {filter !== 'all' && <TableHead className="text-right">Actions</TableHead>}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={filter === 'all' ? 6 : 5} className="h-24 text-center">
                                    <div className="flex justify-center items-center gap-2 text-gray-400">
                                        <Loader2 className="animate-spin h-5 w-5" /> Loading...
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : filteredLeads.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={filter === 'all' ? 6 : 5} className="h-32 text-center text-gray-500">
                                    No clients found in {filter} list.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredLeads.map((lead, i) => (
                                <TableRow key={lead.id} className="group hover:bg-gray-50/50 transition-colors">
                                    <TableCell className="font-mono text-gray-400 text-xs">{i + 1}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-gray-900">{lead.name}</span>
                                            {lead.company && <span className="text-xs text-gray-500">{lead.company}</span>}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1 text-sm text-gray-600">
                                            <div className="flex items-center gap-2"><Phone className="w-3 h-3 text-gray-400"/> {lead.phone}</div>
                                            {lead.email && <div className="flex items-center gap-2"><Mail className="w-3 h-3 text-gray-400"/> {lead.email}</div>}
                                            {lead.address && <div className="flex items-center gap-2"><MapPin className="w-3 h-3 text-gray-400"/> {lead.address}</div>}
                                        </div>
                                    </TableCell>

                                    {/* Status Column for All View */}
                                    {filter === 'all' && (
                                        <TableCell>
                                            <Badge className={cn(
                                                "capitalize",
                                                lead.status === 'new' && "bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200",
                                                lead.status === 'accepted' && "bg-green-100 text-green-700 hover:bg-green-100 border-green-200",
                                                lead.status === 'pending' && "bg-orange-100 text-orange-700 hover:bg-orange-100 border-orange-200",
                                                lead.status === 'rejected' && "bg-red-100 text-red-700 hover:bg-red-100 border-red-200"
                                            )}>
                                                {lead.status === 'new' ? 'Review' : lead.status}
                                            </Badge>
                                        </TableCell>
                                    )}

                                    <TableCell>
                                        {lead.status === 'accepted' && (
                                            <div className="space-y-1">
                                                <Badge variant="outline" className="font-normal text-gray-600">{lead.service}</Badge>
                                                <div className="text-xs font-medium text-gray-600 flex items-center gap-1">
                                                    <DollarSign className="w-3 h-3"/> {lead.price}
                                                </div>
                                            </div>
                                        )}
                                        {lead.status === 'pending' && (
                                            <div className="space-y-1">
                                                 <div className="flex items-center gap-1 text-xs text-orange-600 font-medium">
                                                    <CalendarIcon className="w-3 h-3"/> 
                                                    {lead.callback_date ? format(new Date(lead.callback_date), "PPP") : "No date"}
                                                 </div>
                                                 {lead.callback_time && (
                                                     <div className="flex items-center gap-1 text-xs text-gray-500 font-medium">
                                                        <Clock className="w-3 h-3"/> {lead.callback_time}
                                                     </div>
                                                 )}
                                            </div>
                                        )}
                                        {lead.status === 'rejected' && (
                                            <div className="text-xs text-red-500 italic max-w-[200px] truncate" title={lead.rejection_reason}>
                                                "{lead.rejection_reason}"
                                            </div>
                                        )}
                                        {lead.status === 'new' && (
                                            <div className="space-y-1">
                                                <span className="text-xs text-gray-400 italic">Added {format(new Date(lead.created_at), 'MMM d, h:mm a')}</span>
                                            </div>
                                        )}
                                    </TableCell>
                                    
                                    {/* Action Column - Hidden for All view */}
                                    {filter !== 'all' && (
                                        <TableCell className="text-right">
                                            <div className="flex justify-end items-center gap-2">
                                                {filter === 'new' && (
                                                    <>
                                                        <Button size="icon" variant="outline" className="h-8 w-8 text-green-600 hover:bg-green-50 hover:text-green-700" onClick={() => openAction('accept', lead)}>
                                                            <Check className="h-4 w-4" />
                                                        </Button>
                                                        <Button size="icon" variant="outline" className="h-8 w-8 text-orange-600 hover:bg-orange-50 hover:text-orange-700" onClick={() => openAction('pending', lead)}>
                                                            <Clock className="h-4 w-4" />
                                                        </Button>
                                                        <Button size="icon" variant="outline" className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => openAction('reject', lead)}>
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </>
                                                )}
                                                {/* Allow edit/delete for specific tabs as requested */}
                                                {(filter === 'new' || filter === 'rejected') && (
                                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-400 hover:text-red-600" onClick={() => setDeleteId(lead.id)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                )}
                                                {lead.status !== 'new' && (
                                                     <Button size="sm" variant="outline" onClick={() => openAction(filter === 'accepted' ? 'accept' : filter === 'pending' ? 'pending' : 'reject', lead)}>
                                                         Edit
                                                     </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* --- Dialogs --- */}

            {/* Add Client Dialog */}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Potential Client</DialogTitle>
                        <DialogDescription>Enter lead details for the marketing pipeline.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <Input placeholder="Client Name *" value={formData.name || ''} onChange={(e) => handleInputChange('name', e.target.value)} />
                        <Input placeholder="Company (Optional)" value={formData.company || ''} onChange={(e) => handleInputChange('company', e.target.value)} />
                        <Input placeholder="Contact Number *" value={formData.phone || ''} onChange={(e) => handleInputChange('phone', e.target.value)} />
                        <Input placeholder="Email (Optional)" value={formData.email || ''} onChange={(e) => handleInputChange('email', e.target.value)} />
                        <Input placeholder="Address (Optional)" value={formData.address || ''} onChange={(e) => handleInputChange('address', e.target.value)} />
                    </div>
                    <DialogFooter>
                        <Button onClick={submitAddLead} className="bg-black">Add Client</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Accept Dialog */}
            <Dialog open={isAcceptOpen} onOpenChange={setIsAcceptOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-green-600">Accept Client Project</DialogTitle>
                        <DialogDescription>Define the project scope and agreement.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                             <Label>Service Type</Label>
                             <Select onValueChange={(v) => handleInputChange('service', v)} defaultValue={formData.service || selectedLead?.service}>
                                <SelectTrigger><SelectValue placeholder="Select Service" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Website Dev">Website Dev</SelectItem>
                                    <SelectItem value="App Dev">App Dev</SelectItem>
                                    <SelectItem value="UI/UX Design">UI/UX Design</SelectItem>
                                    <SelectItem value="Photo Editing">Photo Editing</SelectItem>
                                    <SelectItem value="Video Editing">Video Editing</SelectItem>
                                </SelectContent>
                             </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Project Requirements</Label>
                            <Textarea className="min-h-[100px]" placeholder="Detailed scope..." value={formData.requirements || selectedLead?.requirements || ''} onChange={(e) => handleInputChange('requirements', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                             <Label>Final Agreed Price</Label>
                             <div className="relative">
                                <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                                <Input className="pl-9" placeholder="0.00" value={formData.price || selectedLead?.price || ''} onChange={(e) => handleInputChange('price', e.target.value)} />
                             </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={submitAccept} className="bg-green-600 hover:bg-green-700">Confirm Acceptance</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Pending Dialog */}
             <Dialog open={isPendingOpen} onOpenChange={setIsPendingOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-orange-600">Schedule Follow-up</DialogTitle>
                        <DialogDescription>When should we contact this lead again?</DialogDescription>
                    </DialogHeader>
                    <div className="py-4 flex justify-center">
                        <Calendar 
                            mode="single" 
                            selected={formData.callback_date ? new Date(formData.callback_date) : (selectedLead?.callback_date ? new Date(selectedLead.callback_date) : undefined)} 
                            onSelect={(d) => handleInputChange('callback_date', d)} 
                            className="rounded-md border shadow"
                        />
                    </div>
                    <div className="space-y-2">
                         <Label>Time Range / Specific Time</Label>
                         <Input 
                             placeholder="e.g. 2:00 PM - 4:00 PM" 
                             value={formData.callback_time || selectedLead?.callback_time || ''}
                             onChange={(e) => handleInputChange('callback_time', e.target.value)}
                         />
                    </div>
                    <DialogFooter>
                        <Button onClick={submitPending} className="bg-orange-500 hover:bg-orange-600">Set Follow-up</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

             {/* Reject Dialog */}
             <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-red-600">Reject Lead</DialogTitle>
                        <DialogDescription>Reason for rejection?</DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Textarea 
                            placeholder="e.g. Budget too low, Not interested..." 
                            value={formData.rejection_reason || selectedLead?.rejection_reason || ''} 
                            onChange={(e) => handleInputChange('rejection_reason', e.target.value)} 
                        />
                    </div>
                    <DialogFooter>
                        <Button onClick={submitReject} variant="destructive">Reject Lead</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Alert Dialog */}
             <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Lead Record?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently remove this lead from the database.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};
