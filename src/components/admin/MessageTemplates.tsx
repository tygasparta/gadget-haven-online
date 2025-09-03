import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare, Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface MessageTemplate {
  id: string;
  name: string;
  content: string;
  type: 'greeting' | 'product_info' | 'order_status' | 'help' | 'fallback';
  variables: string[];
  created_at: string;
}

const MessageTemplates = () => {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<MessageTemplate | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    content: string;
    type: 'greeting' | 'product_info' | 'order_status' | 'help' | 'fallback';
    variables: string[];
  }>({
    name: '',
    content: '',
    type: 'greeting',
    variables: []
  });

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      
      // For now, we'll use mock data since we don't have a templates table
      // In a real implementation, you'd fetch from a bot_message_templates table
      const mockTemplates: MessageTemplate[] = [
        {
          id: '1',
          name: 'Welcome Message',
          content: 'Hello {{name}}! Welcome to our store. How can I help you today?',
          type: 'greeting',
          variables: ['name'],
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Product Info',
          content: 'Here\'s information about {{product_name}}: {{product_description}}. Price: ${{price}}',
          type: 'product_info',
          variables: ['product_name', 'product_description', 'price'],
          created_at: new Date().toISOString()
        },
        {
          id: '3',
          name: 'Order Status',
          content: 'Your order #{{order_id}} is currently {{status}}. Expected delivery: {{delivery_date}}',
          type: 'order_status',
          variables: ['order_id', 'status', 'delivery_date'],
          created_at: new Date().toISOString()
        },
        {
          id: '4',
          name: 'Help Message',
          content: 'I can help you with:\n• Browse products\n• Check order status\n• Get support\n\nJust type what you need!',
          type: 'help',
          variables: [],
          created_at: new Date().toISOString()
        }
      ];

      setTemplates(mockTemplates);
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast({
        title: "Error",
        description: "Failed to fetch message templates",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const extractVariables = (content: string): string[] => {
    const regex = /\{\{(\w+)\}\}/g;
    const variables = [];
    let match;
    while ((match = regex.exec(content)) !== null) {
      if (!variables.includes(match[1])) {
        variables.push(match[1]);
      }
    }
    return variables;
  };

  const handleSaveTemplate = async () => {
    try {
      const variables = extractVariables(formData.content);
      
      if (editingTemplate) {
        // Update existing template
        const updatedTemplates = templates.map(t => 
          t.id === editingTemplate.id 
            ? { ...t, ...formData, variables }
            : t
        );
        setTemplates(updatedTemplates);
        
        toast({
          title: "Template Updated",
          description: "Message template updated successfully",
        });
      } else {
        // Add new template
        const newTemplate: MessageTemplate = {
          id: Date.now().toString(),
          ...formData,
          variables,
          created_at: new Date().toISOString()
        };
        setTemplates([...templates, newTemplate]);
        
        toast({
          title: "Template Added",
          description: "New message template created successfully",
        });
      }

      // Reset form
      setFormData({
        name: '',
        content: '',
        type: 'greeting',
        variables: []
      });
      setEditingTemplate(null);
      setShowAddDialog(false);
    } catch (error) {
      console.error('Error saving template:', error);
      toast({
        title: "Error",
        description: "Failed to save template",
        variant: "destructive",
      });
    }
  };

  const handleEditTemplate = (template: MessageTemplate) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      content: template.content,
      type: template.type,
      variables: template.variables
    });
    setShowAddDialog(true);
  };

  const handleDeleteTemplate = async (templateId: string) => {
    try {
      setTemplates(templates.filter(t => t.id !== templateId));
      toast({
        title: "Template Deleted",
        description: "Message template deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting template:', error);
      toast({
        title: "Error",
        description: "Failed to delete template",
        variant: "destructive",
      });
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'greeting': return 'bg-green-100 text-green-800';
      case 'product_info': return 'bg-blue-100 text-blue-800';
      case 'order_status': return 'bg-yellow-100 text-yellow-800';
      case 'help': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Message Templates</h3>
          <p className="text-sm text-muted-foreground">
            Manage automated response templates for your WhatsApp bot
          </p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingTemplate ? 'Edit Template' : 'Add New Template'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="templateName">Template Name</Label>
                  <Input
                    id="templateName"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Welcome Message"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="templateType">Type</Label>
                  <Select 
                    value={formData.type} 
                    onValueChange={(value: 'greeting' | 'product_info' | 'order_status' | 'help' | 'fallback') => 
                      setFormData({ ...formData, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="greeting">Greeting</SelectItem>
                      <SelectItem value="product_info">Product Info</SelectItem>
                      <SelectItem value="order_status">Order Status</SelectItem>
                      <SelectItem value="help">Help</SelectItem>
                      <SelectItem value="fallback">Fallback</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="templateContent">Message Content</Label>
                <Textarea
                  id="templateContent"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Enter your message template. Use {{variable}} for dynamic content."
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  Use double curly braces for variables: {"{"}{"{"} name {"}"}{"}"}, {"{"}{"{"} product {"}"}{"}"}, etc.
                </p>
              </div>
              {formData.content && (
                <div className="space-y-2">
                  <Label>Detected Variables</Label>
                  <div className="flex flex-wrap gap-2">
                    {extractVariables(formData.content).map(variable => (
                      <Badge key={variable} variant="outline">
                        {variable}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => {
                  setShowAddDialog(false);
                  setEditingTemplate(null);
                  setFormData({ name: '', content: '', type: 'greeting', variables: [] });
                }}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSaveTemplate} disabled={!formData.name || !formData.content}>
                  <Save className="h-4 w-4 mr-2" />
                  {editingTemplate ? 'Update' : 'Save'} Template
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {templates.map((template) => (
          <Card key={template.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <CardTitle className="text-base">{template.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getTypeColor(template.type)}>
                        {template.type.replace('_', ' ')}
                      </Badge>
                      {template.variables.length > 0 && (
                        <Badge variant="outline">
                          {template.variables.length} variables
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditTemplate(template)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteTemplate(template.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Content:</Label>
                  <p className="text-sm text-muted-foreground mt-1 p-2 bg-muted rounded">
                    {template.content}
                  </p>
                </div>
                {template.variables.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium">Variables:</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {template.variables.map(variable => (
                        <Badge key={variable} variant="secondary" className="text-xs">
                          {variable}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {templates.length === 0 && !loading && (
          <Card>
            <CardContent className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Templates Yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first message template to get started
              </p>
              <Button onClick={() => setShowAddDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Template
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MessageTemplates;