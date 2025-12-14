import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/supabase';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Loader2, Plus, Trash2, Edit2, CheckCircle2, Circle, MonitorPlay, StickyNote, AlertCircle, Save, X, History, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// --- Sub-components ---

const ClientCard = ({ client, onEdit, onDelete, onMonitor, toggleStatus }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className={cn(
        "bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col relative group",
        client.status === 'completed' && "opacity-75 bg-gray-50/50 grayscale-[0.5]"
      )}
    >
      {/* Important Badge if sticky notes exist */}
      {client.sticky_notes?.length > 0 && (
        <motion.div 
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 z-10"
        >
             <span className="relative flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[8px] font-bold text-white items-center justify-center">!</span>
            </span>
        </motion.div>
      )}

      <div className="p-5 flex-1 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className={cn("font-bold text-lg text-gray-900 leading-tight", client.status === 'completed' && "line-through")}>
              {client.client_name}
            </h3>
            <p className="text-sm text-gray-500 font-medium">{client.company_name}</p>
            {/* Creator Tag */}
            <div className="mt-1 flex items-center gap-1">
                 <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded border border-gray-200">
                    Created by {client.creator_name || 'Unknown'}
                 </span>
            </div>
          </div>
          <button onClick={() => toggleStatus(client)} className="text-gray-300 hover:text-green-500 transition-colors">
            {client.status === 'completed' ? <CheckCircle2 className="h-6 w-6 text-green-500" /> : <Circle className="h-6 w-6" />}
          </button>
        </div>

        {/* Progress Bar Display */}
        <div className="space-y-1">
            <div className="flex justify-between text-xs font-medium text-gray-500">
                <span>Progress</span>
                <span>{client.progress || 0}%</span>
            </div>
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${client.progress || 0}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={cn("h-full rounded-full", 
                        (client.progress || 0) === 100 ? "bg-green-500" : 
                        (client.progress || 0) > 60 ? "bg-blue-500" : "bg-orange-500"
                    )}
                />
            </div>
        </div>

        {/* Work Tags */}
        <div className="flex flex-wrap gap-2">
            {client.work_details?.software?.selected && <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100">Software</Badge>}
            {client.work_details?.editing?.selected && <Badge variant="secondary" className="bg-purple-50 text-purple-700 hover:bg-purple-100">Editing</Badge>}
            {client.work_details?.design?.selected && <Badge variant="secondary" className="bg-pink-50 text-pink-700 hover:bg-pink-100">Design</Badge>}
            {client.deadline && (
                <Badge variant="outline" className={cn("ml-auto", new Date(client.deadline) < new Date() && "text-red-500 border-red-200 bg-red-50")}>
                    {format(new Date(client.deadline), 'MMM d')}
                </Badge>
            )}
        </div>
      </div>

      <div className="bg-gray-50/50 p-3 flex justify-between items-center border-t border-gray-100">
         <Button variant="ghost" size="sm" className="text-xs gap-2 hover:bg-white hover:shadow-sm" onClick={() => onMonitor(client)}>
             <MonitorPlay className="w-3.5 h-3.5" /> Monitor
         </Button>
         <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-blue-600" onClick={() => onEdit(client)}>
                <Edit2 className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-600" onClick={() => onDelete(client.id)}>
                <Trash2 className="h-3.5 w-3.5" />
            </Button>
         </div>
      </div>
    </motion.div>
  );
};

const MonitoringSheet = ({ client, isOpen, onClose, onUpdate }) => {
    const [progress, setProgress] = useState(client?.progress || 0);
    const [isShaking, setIsShaking] = useState(false);
    const [note, setNote] = useState("");
    const [logMessage, setLogMessage] = useState("");
    
    useEffect(() => {
        if (client) {
            setProgress(client.progress || 0);
        }
    }, [client]);

    const handleProgressChange = (value) => {
        const newVal = value[0];
        if (newVal < (client?.progress || 0)) {
            setIsShaking(true);
            setTimeout(() => setIsShaking(false), 500);
            toast.error("Progress cannot be decreased!", { position: 'bottom-center' });
            return; 
        }
        setProgress(newVal);
    };

    const saveProgress = async () => {
        if (!client) return;
        
        let newLogs = client.timeline_logs || [];
        if (progress > (client.progress || 0)) {
            newLogs = [{
                id: Date.now(),
                date: new Date().toISOString(),
                message: `Progress updated from ${client.progress || 0}% to ${progress}%`,
                type: 'progress'
            }, ...newLogs];
        }

        await onUpdate(client.id, { 
            progress,
            timeline_logs: newLogs
        });
        toast.success("Progress saved!");
    };

    const addLog = async () => {
        if (!logMessage.trim()) return;
        const newLog = {
            id: Date.now(),
            date: new Date().toISOString(),
            message: logMessage,
            type: 'manual'
        };
        const updatedLogs = [newLog, ...(client.timeline_logs || [])];
        await onUpdate(client.id, { timeline_logs: updatedLogs });
        setLogMessage("");
    };

    const addStickyNote = async () => {
        if (!note.trim()) return;
        const newNote = {
            id: Date.now(),
            message: note,
            created_at: new Date().toISOString()
        };
        const updatedNotes = [newNote, ...(client.sticky_notes || [])];
        await onUpdate(client.id, { sticky_notes: updatedNotes });
        setNote("");
    };

    const deleteStickyNote = async (noteId) => {
        const updatedNotes = client.sticky_notes.filter(n => n.id !== noteId);
        await onUpdate(client.id, { sticky_notes: updatedNotes });
    };

    if (!client) return null;

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="sm:max-w-md md:max-w-lg overflow-y-auto w-full">
                <SheetHeader className="px-1">
                    <SheetTitle className="flex items-center gap-2">
                        <MonitorPlay className="w-5 h-5 text-blue-600" />
                        Monitoring: {client.client_name}
                    </SheetTitle>
                    <SheetDescription>Track progress and updates for this project.</SheetDescription>
                </SheetHeader>

                <div className="py-6 px-4 sm:px-6 space-y-8">
                    {/* Progress Monitor */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <Label className="text-base font-semibold">Project Progress</Label>
                            <span className="text-2xl font-bold font-mono text-blue-600">{progress}%</span>
                        </div>
                        <motion.div
                            animate={isShaking ? { x: [-5, 5, -5, 5, 0] } : {}}
                            transition={{ duration: 0.4 }}
                        >
                            <Slider
                                value={[progress]}
                                max={100}
                                step={1}
                                onValueChange={handleProgressChange}
                                className="py-4 cursor-pointer"
                            />
                        </motion.div>
                        <Button onClick={saveProgress} className="w-full" disabled={progress === client.progress}>
                            <Save className="w-4 h-4 mr-2" /> Update Progress
                        </Button>
                    </div>

                    <Separator />

                    {/* Sticky Notes */}
                    <div className="space-y-4">
                        <Label className="text-base font-semibold flex items-center gap-2">
                            <StickyNote className="w-4 h-4" /> Sticky Notes
                        </Label>
                        <div className="flex gap-2">
                            <Input 
                                placeholder="Add an important note..." 
                                value={note} 
                                onChange={(e) => setNote(e.target.value)}
                            />
                            <Button size="icon" variant="outline" onClick={addStickyNote}>
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <AnimatePresence>
                                {client.sticky_notes?.map(n => (
                                    <motion.div
                                        key={n.id}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg relative shadow-sm text-sm"
                                    >
                                        <p className="text-gray-800 pr-4 break-words">{n.message}</p>
                                        <button 
                                            onClick={() => deleteStickyNote(n.id)}
                                            className="absolute top-1 right-1 text-yellow-400 hover:text-red-500"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>

                    <Separator />

                    {/* Timeline / Git-like Log */}
                    <div className="space-y-4">
                        <Label className="text-base font-semibold flex gap-2">
                             <History className="w-4 h-4" /> Timeline
                        </Label>
                        <div className="flex gap-2">
                             <Textarea 
                                placeholder="Commit a manual update log..." 
                                className="resize-none h-20"
                                value={logMessage}
                                onChange={(e) => setLogMessage(e.target.value)}
                             />
                        </div>
                        <Button size="sm" variant="secondary" onClick={addLog} className="w-full">
                            Commit Update
                        </Button>

                        <ScrollArea className="h-[300px] pr-4 mt-4 bg-gray-50 rounded-md p-4 border border-gray-100">
                            <div className="space-y-4 border-l-2 border-gray-200 ml-2 pl-4 py-2">
                                {client.timeline_logs?.map((log, i) => (
                                    <div key={log.id || i} className="relative">
                                        <div className={cn(
                                            "absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 border-white",
                                            log.type === 'progress' ? "bg-blue-500" : "bg-gray-400"
                                        )}></div>
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-400">{format(new Date(log.date), 'MMM d, h:mm a')}</span>
                                            <p className="text-sm text-gray-700 font-medium">{log.message}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
};


// --- Main Component ---

export const ClientManager = () => {
  const { user, profile } = useAuth();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [monitoringClient, setMonitoringClient] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    client_name: '',
    company_name: '',
    work_details: {
      software: { selected: false, subtypes: [], details: '' },
      editing: { selected: false, details: '' },
      design: { selected: false, details: '' },
    },
    deadline: undefined
  });

  useEffect(() => {
    if (user) fetchClients();
  }, [user]);

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast.error('Failed to load clients');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateClient = async (id, updates) => {
      try {
          const { error } = await supabase.from('clients').update(updates).eq('id', id);
          if (error) throw error;
          
          setClients(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
          
          if (monitoringClient?.id === id) {
              setMonitoringClient(prev => ({ ...prev, ...updates }));
          }
      } catch (err) {
          console.error(err);
          toast.error("Update failed");
      }
  };

  const confirmDelete = async () => {
      if (!deleteId) return;
      try {
          const { error } = await supabase.from('clients').delete().eq('id', deleteId);
          if (error) throw error;
          toast.success("Client disconnected");
          setClients(prev => prev.filter(c => c.id !== deleteId));
      } catch (err) {
          toast.error("Failed to delete");
      } finally {
          setDeleteId(null);
      }
  };

  const executeDelete = (id) => {
      setDeleteId(id);
  };

  const handleInputChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));
  const handleWorkTypeChange = (type, checked) => setFormData(prev => ({...prev, work_details: {...prev.work_details, [type]: {...prev.work_details[type], selected: checked}}}));
  const handleSubtypeChange = (checked, subtype) => {
      setFormData(prev => {
          const current = prev.work_details.software.subtypes || [];
          const updated = checked ? [...current, subtype] : current.filter(t => t !== subtype);
          return { ...prev, work_details: { ...prev.work_details, software: { ...prev.work_details.software, subtypes: updated } } };
      });
  };
  const handleDetailsChange = (type, value) => setFormData(prev => ({...prev, work_details: {...prev.work_details, [type]: {...prev.work_details[type], details: value}}}));

  const handleSubmit = async () => {
      if (!formData.client_name) { toast.error('Name required'); return; }
      setLoading(true);
      try {
          const payload = {
            user_id: user.id,
            client_name: formData.client_name,
            company_name: formData.company_name,
            work_details: formData.work_details,
            deadline: formData.deadline ? formData.deadline.toISOString() : null,
          };

          if (editingClient) {
              await handleUpdateClient(editingClient.id, payload);
              toast.success('Client updated');
          } else {
              const newClientPayload = {
                  ...payload,
                  creator_name: profile?.full_name || user?.email || 'Unknown User'
              };
              
              const { error } = await supabase.from('clients').insert([newClientPayload]);
              if (error) throw error;
              toast.success('Client added');
              fetchClients();
          }
          setIsDialogOpen(false);
          resetForm();
      } catch (e) {
          console.error(e);
          toast.error("Save failed");
      } finally {
          setLoading(false);
      }
  };

  const resetForm = () => {
    setFormData({
      client_name: '',
      company_name: '',
      work_details: {
        software: { selected: false, subtypes: [], details: '' },
        editing: { selected: false, details: '' },
        design: { selected: false, details: '' },
      },
      deadline: undefined
    });
    setEditingClient(null);
  };

  const openEdit = (client) => {
    setEditingClient(client);
    setFormData({
        client_name: client.client_name,
        company_name: client.company_name,
        work_details: client.work_details || { software: { selected: false, subtypes: [], details: '' }, editing: { selected: false, details: '' }, design: { selected: false, details: '' } },
        deadline: client.deadline ? new Date(client.deadline) : undefined
    });
    setIsDialogOpen(true);
  };

  const toggleStatus = (client) => {
      const newStatus = client.status === 'completed' ? 'pending' : 'completed';
      handleUpdateClient(client.id, { status: newStatus });
  };
  
  const total = clients.length;
  const completed = clients.filter(c => c.status === 'completed').length;
  const pending = total - completed;
  const urgent = clients.filter(c => {
      if (c.status === 'completed') return false;
      const isOverdue = c.deadline && new Date(c.deadline) < new Date();
      const hasImportantNote = c.sticky_notes?.length > 0;
      return isOverdue || hasImportantNote;
  }).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      <div className="flex flex-wrap gap-4">
           <div className="flex items-center gap-3 px-5 py-3 bg-white border border-gray-200 rounded-full shadow-sm hover:shadow-md transition-shadow cursor-default">
               <div className="w-2.5 h-2.5 rounded-full bg-gray-900"></div>
               <span className="text-sm font-medium text-gray-600">Total Projects:</span>
               <span className="text-lg font-bold text-gray-900">{total}</span>
           </div>
           
           <div className="flex items-center gap-3 px-5 py-3 bg-white border border-gray-200 rounded-full shadow-sm hover:shadow-md transition-shadow cursor-default">
               <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
               <span className="text-sm font-medium text-gray-600">Completed:</span>
               <span className="text-lg font-bold text-green-600">{completed}</span>
           </div>

           <div className="flex items-center gap-3 px-5 py-3 bg-white border border-gray-200 rounded-full shadow-sm hover:shadow-md transition-shadow cursor-default">
               <div className="w-2.5 h-2.5 rounded-full bg-orange-500"></div>
               <span className="text-sm font-medium text-gray-600">Pending:</span>
               <span className="text-lg font-bold text-orange-600">{pending}</span>
           </div>

           {urgent > 0 && (
               <div className="flex items-center gap-3 px-5 py-3 bg-red-50 border border-red-100 rounded-full shadow-sm animate-pulse">
                   <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                   <span className="text-sm font-medium text-red-600">Urgent:</span>
                   <span className="text-lg font-bold text-red-700">{urgent}</span>
               </div>
           )}
      </div>

      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
         <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Active Workspaces</h2>
            <p className="text-sm text-gray-500">Manage monitoring, tracking and updates.</p>
         </div>
         <Button onClick={() => { resetForm(); setIsDialogOpen(true); }} className="bg-black hover:bg-gray-800 shadow-md hover:shadow-lg transition-all">
            <Plus className="mr-2 h-4 w-4" /> New Project
         </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
              {clients.map((client) => (
                  <ClientCard 
                    key={client.id} 
                    client={client} 
                    onEdit={openEdit} 
                    onDelete={executeDelete}
                    onMonitor={setMonitoringClient}
                    toggleStatus={toggleStatus}
                  />
              ))}
          </AnimatePresence>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px] overflow-y-auto max-h-[90vh]">
              <DialogHeader>
                  <DialogTitle>{editingClient ? 'Edit Project' : 'New Project'}</DialogTitle>
                  <DialogDescription>Define scope, deadline and requirements.</DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4">
                  <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                          <Label>Client Name</Label>
                          <Input value={formData.client_name} onChange={(e) => handleInputChange('client_name', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                          <Label>Company</Label>
                          <Input value={formData.company_name} onChange={(e) => handleInputChange('company_name', e.target.value)} />
                      </div>
                  </div>
                  
                  <div className="space-y-3 p-4 border rounded-lg bg-gray-50/50">
                      <div className="font-medium text-sm text-gray-900">Requirements Check</div>
                      <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                              <Checkbox id="sw" checked={formData.work_details.software.selected} onCheckedChange={(c) => handleWorkTypeChange('software', c)} />
                              <Label htmlFor="sw">Software Dev</Label>
                          </div>
                           {formData.work_details.software.selected && (
                               <div className="ml-6 space-y-2 animate-in slide-in-from-top-2">
                                   <div className="flex gap-4">
                                       <div className="flex items-center space-x-2">
                                           <Checkbox checked={formData.work_details.software.subtypes.includes('website')} onCheckedChange={(c) => handleSubtypeChange(c, 'website')} />
                                           <Label>Web</Label>
                                       </div>
                                       <div className="flex items-center space-x-2">
                                           <Checkbox checked={formData.work_details.software.subtypes.includes('mobile')} onCheckedChange={(c) => handleSubtypeChange(c, 'mobile')} />
                                           <Label>App</Label>
                                       </div>
                                   </div>
                                   <Textarea 
                                      className="bg-white min-h-[60px]" 
                                      placeholder="Tech stack..." 
                                      value={formData.work_details.software.details}
                                      onChange={(e) => handleDetailsChange('software', e.target.value)}
                                   />
                               </div>
                           )}
                      </div>
                       <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                              <Checkbox id="ed" checked={formData.work_details.editing.selected} onCheckedChange={(c) => handleWorkTypeChange('editing', c)} />
                              <Label htmlFor="ed">Editing</Label>
                          </div>
                           {formData.work_details.editing.selected && (
                               <div className="ml-6 space-y-2 animate-in slide-in-from-top-2">
                                   <Textarea 
                                      className="bg-white min-h-[60px]" 
                                      placeholder="Style & length..." 
                                      value={formData.work_details.editing.details}
                                      onChange={(e) => handleDetailsChange('editing', e.target.value)}
                                   />
                               </div>
                           )}
                      </div>
                       <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                              <Checkbox id="de" checked={formData.work_details.design.selected} onCheckedChange={(c) => handleWorkTypeChange('design', c)} />
                              <Label htmlFor="de">Design</Label>
                          </div>
                           {formData.work_details.design.selected && (
                               <div className="ml-6 space-y-2 animate-in slide-in-from-top-2">
                                   <Textarea 
                                      className="bg-white min-h-[60px]" 
                                      placeholder="Concept & Theme..." 
                                      value={formData.work_details.design.details}
                                      onChange={(e) => handleDetailsChange('design', e.target.value)}
                                   />
                               </div>
                           )}
                      </div>
                  </div>

                  <div className="flex flex-col space-y-2">
                      <Label>Deadline</Label>
                      <Popover>
                          <PopoverTrigger asChild>
                              <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !formData.deadline && "text-muted-foreground")}>
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {formData.deadline ? format(formData.deadline, "PPP") : <span>Pick a date</span>}
                              </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={formData.deadline} onSelect={(d) => handleInputChange('deadline', d)} initialFocus /></PopoverContent>
                      </Popover>
                  </div>
              </div>
              <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleSubmit} disabled={loading} className="bg-black hover:bg-gray-800">
                      {loading ? <Loader2 className="animate-spin mr-2"/> : <Save className="mr-2 h-4 w-4"/>} Save Project
                  </Button>
              </DialogFooter>
          </DialogContent>
      </Dialog>
      
      <MonitoringSheet 
        client={monitoringClient} 
        isOpen={!!monitoringClient} 
        onClose={() => setMonitoringClient(null)} 
        onUpdate={handleUpdateClient}
      />

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
          <AlertDialogContent>
              <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the client task
                      and all associated data from the servers.
                  </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
                      Delete Task
                  </AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
