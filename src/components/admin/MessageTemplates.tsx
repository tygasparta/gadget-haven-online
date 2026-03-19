import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, MessageSquare, Save, X } from 'lucide-react';
import { toast } from 'sonner';

interface MessageTemplate {
  id: string; name: string; content: string; type: string; variables: string[]; created_at: string;
}

const MessageTemplates = () => {
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<MessageTemplate | null>(null);
  const [formData, setFormData] = useState({ name: '', content: '', type: 'welcome' });

  const fetchTemplates = async () => {
    const mockTemplates: MessageTemplate[] = [
      { id: '1', name: 'Welcome Message', content: 'Hello {{name}}! 👋 Welcome to Gadget Genie! How can I help you today?', type: 'welcome', variables: ['name'], created_at: new Date().toISOString() },
      { id: '2', name: 'Product Inquiry', content: "Hi! I see you're interested in {{product}}. Would you like to know more about its features and pricing?", type: 'product', variables: ['product'], created_at: new Date().toISOString() },
      { id: '3', name: 'Support Response', content: "Thank you for contacting support. We've received your request about {{issue}} and will get back to you within 24 hours.", type: 'support', variables: ['issue'], created_at: new Date().toISOString() }
    ];
    setTemplates(mockTemplates);
    setLoading(false);
  };

  const extractVariables = (content: string): string[] => {
    const matches = content.match(/\{\{(\w+)\}\}/g);
    return matches ? matches.map(match => match.replace(/[{}]/g, '')) : [];
  };

  const handleSaveTemplate = async () => {
    if (!formData.name || !formData.content) { toast.error('Please fill in all required fields'); return; }
    const variables = extractVariables(formData.content);
    const templateData = { ...formData, variables, id: editingTemplate?.id || `temp_${Date.now()}`, created_at: editingTemplate?.created_at || new Date().toISOString() };
    if (editingTemplate) {
      setTemplates(prev => prev.map(t => t.id === editingTemplate.id ? templateData : t));
      toast.success('Template updated successfully!');
    } else {
      setTemplates(prev => [...prev, templateData]);
      toast.success('Template created successfully!');
    }
    setShowDialog(false);
    setEditingTemplate(null);
    setFormData({ name: '', content: '', type: 'welcome' });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'welcome': return 'bg-emerald-100 text-emerald-800';
      case 'product': return 'bg-accent text-primary';
      case 'support': return 'bg-amber-100 text-amber-800';
      case 'goodbye': return 'bg-violet-100 text-violet-800';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  useEffect(() => { fetchTemplates(); }, []);

  if (loading) return <div className="flex items-center justify-center p-8"><span className="text-muted-foreground">Loading templates...</span></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Message Templates</h3>
          <p className="text-sm text-muted-foreground">Manage pre-built message templates for your bot</p>
        </div>
        <Button onClick={() => setShowDialog(true)}><Plus className="w-4 h-4 mr-2" />Add Template</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.length === 0 ? (
          <div className="col-span-2 text-center py-8 text-muted-foreground">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No templates found</p>
            <Button onClick={() => setShowDialog(true)} variant="outline" className="mt-4">Create Your First Template</Button>
          </div>
        ) : (
          templates.map((template) => (
            <Card key={template.id} className="border">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium text-foreground">{template.name}</h4>
                    <Badge className={`text-xs ${getTypeColor(template.type)}`}>{template.type}</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => { setEditingTemplate(template); setFormData({ name: template.name, content: template.content, type: template.type }); setShowDialog(true); }}><Edit className="w-3 h-3" /></Button>
                    <Button size="sm" variant="outline" onClick={() => { setTemplates(prev => prev.filter(t => t.id !== template.id)); toast.success('Template deleted!'); }}><Trash2 className="w-3 h-3" /></Button>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground mb-3 p-2 bg-muted/50 rounded">{template.content}</div>
                {template.variables.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    <span className="text-xs text-muted-foreground">Variables:</span>
                    {template.variables.map((variable, index) => (<Badge key={index} variant="secondary" className="text-xs">{variable}</Badge>))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle className="text-foreground">{editingTemplate ? 'Edit Template' : 'Add New Template'}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Template Name</label>
              <Input placeholder="Enter template name..." value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Template Type</label>
              <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="welcome">Welcome</SelectItem>
                  <SelectItem value="product">Product</SelectItem>
                  <SelectItem value="support">Support</SelectItem>
                  <SelectItem value="goodbye">Goodbye</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Message Content</label>
              <Textarea rows={4} placeholder="Enter your message template... Use {{variable}} for dynamic content" value={formData.content} onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))} />
              <p className="text-xs text-muted-foreground mt-1">Use {`{{variable}}`} syntax for dynamic content</p>
            </div>
            {formData.content && extractVariables(formData.content).length > 0 && (
              <div>
                <label className="text-sm font-medium text-foreground">Detected Variables:</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {extractVariables(formData.content).map((variable, index) => (<Badge key={index} variant="outline">{variable}</Badge>))}
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setShowDialog(false)}><X className="w-4 h-4 mr-2" />Cancel</Button>
            <Button onClick={handleSaveTemplate}><Save className="w-4 h-4 mr-2" />{editingTemplate ? 'Update' : 'Create'} Template</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MessageTemplates;
