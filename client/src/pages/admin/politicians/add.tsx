import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PartyEnum } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";

// Form schema
const politicianFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  party: z.enum(["Independent", "Forward Guernsey"]),
  parish: z.string().min(2, "Parish must be at least 2 characters"),
  numberOfVotes: z.number().min(0, "Number of votes must be positive").optional(),
  status: z.enum(["Current", "New"]),
  bio: z.string().optional(),
  firstElected: z.string().optional(),
  profileImageUrl: z.string().url().optional().or(z.literal("")),
  manifestoPoint1: z.string().optional(),
  manifestoPoint2: z.string().optional(),
  manifestoPoint3: z.string().optional(),
  manifestoPoint4: z.string().optional(),
  manifestoPoint5: z.string().optional(),
});

type PoliticianFormValues = z.infer<typeof politicianFormSchema>;

const AdminAddPolitician = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("basic-information");

  // Form setup
  const form = useForm<PoliticianFormValues>({
    resolver: zodResolver(politicianFormSchema),
    defaultValues: {
      name: "",
      party: "Independent",
      parish: "",
      numberOfVotes: 0,
      status: "Current",
      bio: "",
      firstElected: "",
      profileImageUrl: "",
      manifestoPoint1: "",
      manifestoPoint2: "",
      manifestoPoint3: "",
      manifestoPoint4: "",
      manifestoPoint5: "",
    },
  });

  // Create politician mutation
  const createPoliticianMutation = useMutation({
    mutationFn: (data: PoliticianFormValues) => apiRequest("POST", "/api/admin/politicians", data),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Politician created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/politicians"] });
      navigate("/admin/politicians");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create politician. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Form submission handler
  const onSubmit = (data: PoliticianFormValues) => {
    createPoliticianMutation.mutate(data);
  };

  const handleCancel = () => {
    navigate("/admin/politicians");
  };

  return (
    <AdminLayout title="Add New Politician">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate("/admin/politicians")} className="mr-2">
          <ArrowLeft className="h-4 w-4 mr-1" />
        </Button>
        <h2 className="text-2xl font-bold text-gray-900">Add New Politician</h2>
      </div>

      <Card className="overflow-hidden shadow bg-white">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="border-b">
                <TabsList className="m-0 p-0 border-b-0 rounded-none bg-transparent h-12">
                  <TabsTrigger 
                    value="basic-information" 
                    className="data-[state=active]:border-b-2 data-[state=active]:border-primary-600 data-[state=active]:text-primary-600 rounded-none h-12 text-sm"
                  >
                    Basic Information
                  </TabsTrigger>
                  <TabsTrigger 
                    value="manifesto" 
                    className="data-[state=active]:border-b-2 data-[state=active]:border-primary-600 data-[state=active]:text-primary-600 rounded-none h-12 text-sm"
                  >
                    Manifesto
                  </TabsTrigger>
                  <TabsTrigger 
                    value="voting" 
                    className="data-[state=active]:border-b-2 data-[state=active]:border-primary-600 data-[state=active]:text-primary-600 rounded-none h-12 text-sm"
                  >
                    Voting & Promises
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="basic-information" className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Jane Smith" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="party"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Political Party</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select party" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Independent">Independent</SelectItem>
                            <SelectItem value="Forward Guernsey">Forward Guernsey</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="parish"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Parish</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. St. Peter Port" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="numberOfVotes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Votes</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0"
                            placeholder="e.g. 5000"
                            {...field} 
                            onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Current">Current</SelectItem>
                            <SelectItem value="New">New</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="firstElected"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Elected</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="md:col-span-2">
                    <FormField
                      control={form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bio</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Brief biography of the politician"
                              rows={4}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <FormField
                      control={form.control}
                      name="profileImageUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Profile Photo URL</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://example.com/photo.jpg"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="manifesto" className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Key Manifesto Highlights</h3>
                    <p className="text-sm text-gray-500 mb-6">Add up to 5 key points from the politician's manifesto</p>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="manifestoPoint1"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Point 1</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter manifesto point"
                            rows={2}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="manifestoPoint2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Point 2</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter manifesto point"
                            rows={2}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="manifestoPoint3"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Point 3</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter manifesto point"
                            rows={2}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="manifestoPoint4"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Point 4</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter manifesto point"
                            rows={2}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="manifestoPoint5"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Point 5</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter manifesto point"
                            rows={2}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              <TabsContent value="voting" className="p-6">
                <div className="space-y-8">
                  {/* Voting Record Section */}
                  <div>
                    <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Voting Record</h3>
                    <p className="text-sm text-gray-500 mb-6">Add up to 4 significant votes</p>
                    
                    {/* Voting Record 1 */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                      <div className="md:col-span-2">
                        <div className="form-control w-full">
                          <label className="block text-sm font-medium mb-1">Bill</label>
                          <input type="text" placeholder="e.g. Climate Protection Act" 
                            className="w-full p-2 border border-gray-300 rounded" />
                        </div>
                      </div>
                      <div>
                        <div className="form-control w-full">
                          <label className="block text-sm font-medium mb-1">Vote</label>
                          <select className="w-full p-2 border border-gray-300 rounded">
                            <option value="For">For</option>
                            <option value="Against">Against</option>
                            <option value="Abstained">Abstained</option>
                            <option value="Absent">Absent</option>
                          </select>
                        </div>
                      </div>
                      <div className="md:col-span-4">
                        <div className="form-control w-full">
                          <label className="block text-sm font-medium mb-1">Description</label>
                          <textarea placeholder="Brief description of the bill" 
                            className="w-full p-2 border border-gray-300 rounded" rows={2} />
                        </div>
                      </div>
                    </div>

                    {/* Voting Record 2 */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                      <div className="md:col-span-2">
                        <div className="form-control w-full">
                          <label className="block text-sm font-medium mb-1">Bill</label>
                          <input type="text" placeholder="e.g. Infrastructure Funding Bill" 
                            className="w-full p-2 border border-gray-300 rounded" />
                        </div>
                      </div>
                      <div>
                        <div className="form-control w-full">
                          <label className="block text-sm font-medium mb-1">Vote</label>
                          <select className="w-full p-2 border border-gray-300 rounded">
                            <option value="For">For</option>
                            <option value="Against">Against</option>
                            <option value="Abstained">Abstained</option>
                            <option value="Absent">Absent</option>
                          </select>
                        </div>
                      </div>
                      <div className="md:col-span-4">
                        <div className="form-control w-full">
                          <label className="block text-sm font-medium mb-1">Description</label>
                          <textarea placeholder="Brief description of the bill" 
                            className="w-full p-2 border border-gray-300 rounded" rows={2} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Promises vs. Reality Section */}
                  <div>
                    <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Promises vs. Reality</h3>
                    <p className="text-sm text-gray-500 mb-6">Compare campaign promises with actual performance</p>
                    
                    {/* Promise 1 */}
                    <div className="mb-6">
                      <div className="form-control w-full mb-2">
                        <label className="block text-sm font-medium mb-1">Promise</label>
                        <textarea placeholder="e.g. Will reduce taxes by 10%" 
                          className="w-full p-2 border border-gray-300 rounded" rows={2} />
                      </div>
                      <div className="form-control w-full mb-2">
                        <label className="block text-sm font-medium mb-1">Reality</label>
                        <textarea placeholder="What actually happened" 
                          className="w-full p-2 border border-gray-300 rounded" rows={2} />
                      </div>
                      <div className="flex space-x-4 mt-2">
                        <label className="inline-flex items-center">
                          <input type="radio" name="status1" value="Fulfilled" />
                          <span className="ml-2 text-sm">Kept</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input type="radio" name="status1" value="InProgress" />
                          <span className="ml-2 text-sm">Partially</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input type="radio" name="status1" value="Unfulfilled" />
                          <span className="ml-2 text-sm">Not Kept</span>
                        </label>
                      </div>
                    </div>

                    {/* Promise 2 */}
                    <div className="mb-6">
                      <div className="form-control w-full mb-2">
                        <label className="block text-sm font-medium mb-1">Promise</label>
                        <textarea placeholder="e.g. Will introduce education reform" 
                          className="w-full p-2 border border-gray-300 rounded" rows={2} />
                      </div>
                      <div className="form-control w-full mb-2">
                        <label className="block text-sm font-medium mb-1">Reality</label>
                        <textarea placeholder="What actually happened" 
                          className="w-full p-2 border border-gray-300 rounded" rows={2} />
                      </div>
                      <div className="flex space-x-4 mt-2">
                        <label className="inline-flex items-center">
                          <input type="radio" name="status2" value="Fulfilled" />
                          <span className="ml-2 text-sm">Kept</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input type="radio" name="status2" value="InProgress" />
                          <span className="ml-2 text-sm">Partially</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input type="radio" name="status2" value="Unfulfilled" />
                          <span className="ml-2 text-sm">Not Kept</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={createPoliticianMutation.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createPoliticianMutation.isPending}>
                {createPoliticianMutation.isPending ? "Saving..." : "Save Politician"}
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </AdminLayout>
  );
};

export default AdminAddPolitician;
