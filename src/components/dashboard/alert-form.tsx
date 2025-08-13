'use client';
/**
 * @fileoverview This component renders a form for creating or editing an alert.
 * It uses `react-hook-form` for form state management and `zod` for validation.
 * It also includes a feature to suggest an alert justification using an AI model.
 */

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useEffect, useState } from 'react';
import type { Alert, Country, Region, Severity } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Sparkles, Upload, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { suggestJustificationAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { ScrollArea } from '../ui/scroll-area';

// Defines the schema for the alert form using Zod for validation.
const alertFormSchema = z.object({
  eventType: z.string().min(2, { message: 'Event type must be at least 2 characters.' }),
  severity: z.enum(['yellow', 'orange', 'red']),
  pushDateTime: z.date({ required_error: 'Push date is required.' }),
  eventDateFrom: z.date({ required_error: 'Event start date is required.' }),
  eventDateTo: z.date().optional(),
  justification: z.string().min(10, { message: 'Justification must be at least 10 characters.' }),
  imageUrl: z.string().optional(),
});

type AlertFormValues = z.infer<typeof alertFormSchema>;

interface AlertFormProps {
  alert: Alert | null; // The alert to edit, or null if creating a new one.
  country: Country; // The currently selected country.
  selectedRegions: Region[]; // The regions selected on the map for this alert.
  onSave: (alert: Alert) => void; // Callback function when the alert is saved.
  onDelete: (alertId: string) => void; // Callback function when the alert is deleted.
  onCancel: () => void; // Callback function to cancel the editing/creation process.
}

export function AlertForm({ alert, country, selectedRegions, onSave, onDelete, onCancel }: AlertFormProps) {
  const { toast } = useToast();
  const [isSuggesting, setIsSuggesting] = useState(false); // State to manage the loading status of the AI suggestion.

  // Initialize the form with react-hook-form.
  const form = useForm<AlertFormValues>({
    resolver: zodResolver(alertFormSchema),
    // Set default values based on the passed alert prop or empty for a new alert.
    defaultValues: {
      eventType: alert?.eventType || '',
      severity: alert?.severity || 'yellow',
      pushDateTime: alert?.pushDateTime,
      eventDateFrom: alert?.eventDates.from,
      eventDateTo: alert?.eventDates.to,
      justification: alert?.justification || '',
      imageUrl: alert?.imageUrl || '',
    },
  });

  // Effect to reset the form whenever the selected alert changes.
  useEffect(() => {
    form.reset({
      eventType: alert?.eventType || '',
      severity: alert?.severity || 'yellow',
      pushDateTime: alert?.pushDateTime,
      eventDateFrom: alert?.eventDates.from,
      eventDateTo: alert?.eventDates.to,
      justification: alert?.justification || '',
      imageUrl: alert?.imageUrl || '',
    });
  }, [alert, form]);

  /**
   * Handles the AI-powered justification suggestion.
   * It calls a server action which in turn calls a Genkit flow.
   * @backend-note This is where the frontend calls the AI backend. The `ensembleForecasts`
   * is currently mocked. This should be replaced with real forecast data to provide
   * more accurate and relevant suggestions.
   */
  const handleSuggestJustification = async () => {
    setIsSuggesting(true);
    const formData = form.getValues();
    if(selectedRegions.length === 0) {
        toast({ variant: 'destructive', title: 'Cannot suggest justification without selected regions.' });
        setIsSuggesting(false);
        return;
    }
    try {
      const result = await suggestJustificationAction({
        regions: selectedRegions.map(r => r.name),
        eventDate: formData.eventDateFrom.toISOString(),
        eventType: formData.eventType,
        severity: formData.severity as Severity,
        // FAKE DATA: This should be replaced with actual forecast data.
        ensembleForecasts: 'Sample forecast data for suggestion.', 
      });

      if (result.success && result.justification) {
        form.setValue('justification', result.justification);
        toast({ title: 'Justification suggested successfully!' });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({ variant: 'destructive', title: 'Failed to suggest justification', description: (error as Error).message });
    }
    setIsSuggesting(false);
  };
  
  /**
   * Handles the form submission.
   * It constructs a new alert object and calls the onSave prop.
   * @backend-note The `onSave` function currently updates the local state in `MainDashboard`.
   * This should be replaced with an API call to the backend to persist the alert data.
   */
  function onSubmit(data: AlertFormValues) {
    if (selectedRegions.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Please select at least one region on the map.',
      });
      return;
    }

    const newAlert: Alert = {
      // FAKE DATA: A temporary ID is generated. The backend should generate a proper unique ID.
      id: alert?.id || `alert-${Date.now()}`,
      countryId: country.id,
      regionIds: selectedRegions.map(r => r.id),
      severity: data.severity as Severity,
      eventType: data.eventType,
      pushDateTime: data.pushDateTime,
      eventDates: { from: data.eventDateFrom, to: data.eventDateTo },
      justification: data.justification,
      imageUrl: data.imageUrl,
      status: alert?.status || 'draft',
      // FAKE DATA: Author should come from the authenticated user's session.
      author: 'MeteOps Lead',
      lastUpdated: new Date(),
      version: (alert?.version || 0) + 1,
    };
    onSave(newAlert);
    toast({ title: `Alert ${alert ? 'updated' : 'created'} successfully!` });
  }

  const title = alert ? 'Edit Alert' : 'Create New Alert';

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <div className="flex-grow overflow-y-auto">
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Region Display */}
              <div className="space-y-2">
                  <FormLabel>Regions</FormLabel>
                  <div className="flex flex-wrap gap-2 p-2 rounded-md border min-h-10">
                      {selectedRegions.length > 0 ? selectedRegions.map(r => <Badge key={r.id}>{r.name}</Badge>) : <p className="text-sm text-muted-foreground">Select regions from the map</p>}
                  </div>
              </div>

              {/* Event Type Input */}
              <FormField
                control={form.control}
                name="eventType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Type</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Heavy Rainfall" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Severity Selector */}
              <FormField
                control={form.control}
                name="severity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Severity</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select severity" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="yellow">Yellow</SelectItem>
                        <SelectItem value="orange">Orange</SelectItem>
                        <SelectItem value="red">Red</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Date Pickers */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="pushDateTime"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Push Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button variant={'outline'} className={cn('justify-start text-left font-normal', !field.value && 'text-muted-foreground')}>
                              {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="eventDateFrom"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Event Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button variant={'outline'} className={cn('justify-start text-left font-normal', !field.value && 'text-muted-foreground')}>
                              {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Justification Textarea with AI Suggestion */}
              <FormField
                control={form.control}
                name="justification"
                render={({ field }) => (
                  <FormItem>
                     <div className="flex items-center justify-between">
                       <FormLabel>Justification</FormLabel>
                       <Button type="button" variant="outline" size="sm" onClick={handleSuggestJustification} disabled={isSuggesting}>
                         <Sparkles className={cn("mr-2 h-4 w-4", isSuggesting && "animate-spin")} />
                         Suggest
                       </Button>
                     </div>
                    <FormControl>
                      <Textarea placeholder="Explain the rationale for this alert..." rows={5} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Image Upload */}
              <FormItem>
                  <FormLabel>Image (Optional)</FormLabel>
                   {/* @backend-note Image upload functionality is currently a placeholder.
                       This needs to be connected to a file storage service (e.g., Firebase Storage)
                       and the `imageUrl` field in the form should be updated with the uploaded image's URL. */}
                  <FormControl>
                      <div className="flex items-center gap-4">
                          {form.watch('imageUrl') && <Image src={form.watch('imageUrl')!} alt="Justification" width={64} height={64} className="rounded-md object-cover" data-ai-hint="forecast map"/>}
                          <Button type="button" variant="outline">
                              <Upload className="mr-2 h-4 w-4" />
                              Upload Image
                          </Button>
                      </div>
                  </FormControl>
              </FormItem>
              
              {/* Form Actions */}
              <CardFooter className="flex-col !p-0 gap-2 !pt-0">
                  <Button type="submit" className="w-full" disabled={selectedRegions.length === 0}>{alert?.status === 'draft' ? 'Save and Push' : 'Save Draft'}</Button>
                   {alert?.status === 'active' && <Button type="submit" className="w-full">Update and Notify</Button>}
                  <div className="flex w-full gap-2">
                      <Button type="button" variant="outline" className="w-full" onClick={onCancel}>Cancel</Button>
                      {alert && <Button type="button" variant="destructive" className="w-full" onClick={() => onDelete(alert.id)}><Trash2 className="mr-2 h-4 w-4"/> Delete</Button>}
                  </div>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </div>
    </Card>
  );
}
