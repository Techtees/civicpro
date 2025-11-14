import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PartyEnum, Politician } from "@shared/schema";
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

const AdminEditPolitician = () => {
  const [, params] = useRoute<{ id: string }>("/admin/politicians/edit/:id");
  const politicianId = params?.id ? parseInt(params.id) : 0;
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("basic-information");
  
  // State for the promises and voting records
  const [bill1Title, setBill1Title] = useState("");
  const [bill1Vote, setBill1Vote] = useState("For");
  const [bill1Description, setBill1Description] = useState("");
  
  const [bill2Title, setBill2Title] = useState("");
  const [bill2Vote, setBill2Vote] = useState("For");
  const [bill2Description, setBill2Description] = useState("");
  
  const [promise1Title, setPromise1Title] = useState("");
  const [promise1Description, setPromise1Description] = useState("");
  const [promise1Status, setPromise1Status] = useState("Unfulfilled");
  
  const [promise2Title, setPromise2Title] = useState("");
  const [promise2Description, setPromise2Description] = useState("");
  const [promise2Status, setPromise2Status] = useState("Unfulfilled");

  // Fetch politician data
  const { data: politicianData, isLoading, error } = useQuery<{ politician: Politician }>({
    queryKey: [`/api/politicians/${politicianId}`],
    enabled: politicianId > 0,
  });

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

  // Set form values when politician data is loaded
  useEffect(() => {
    if (politicianData?.politician) {
      const politician = politicianData.politician;
      
      // Format the date for the input field (YYYY-MM-DD)
      const formattedDate = politician.firstElected 
        ? new Date(politician.firstElected).toISOString().split('T')[0] 
        : "";
      
      form.reset({
        name: politician.name,
        party: politician.party === "Independent" || politician.party === "Forward Guernsey" ? politician.party : "Independent",
        parish: politician.parish,
        numberOfVotes: politician.numberOfVotes || 0,
        status: politician.status === "Current" || politician.status === "New" ? politician.status : "Current",
        bio: politician.bio || "",
        firstElected: formattedDate,
        profileImageUrl: politician.profileImageUrl || "",
        manifestoPoint1: politician.manifestoPoint1 || "",
        manifestoPoint2: politician.manifestoPoint2 || "",
        manifestoPoint3: politician.manifestoPoint3 || "",
        manifestoPoint4: politician.manifestoPoint4 || "",
        manifestoPoint5: politician.manifestoPoint5 || "",
      });
    }
  }, [politicianData, form]);

  // Fetch promises
  const { data: promisesData } = useQuery<{ promises: any[] }>({
    queryKey: [`/api/politicians/${politicianId}/promises`],
    enabled: politicianId > 0,
  });

  // Load promises data
  useEffect(() => {
    if (promisesData?.promises?.length > 0) {
      const promises = promisesData.promises;
      if (promises[0]) {
        setPromise1Title(promises[0].title || "");
        setPromise1Description(promises[0].description || "");
        setPromise1Status(promises[0].status || "Unfulfilled");
      }
      
      if (promises[1]) {
        setPromise2Title(promises[1].title || "");
        setPromise2Description(promises[1].description || "");
        setPromise2Status(promises[1].status || "Unfulfilled");
      }
    }
  }, [promisesData]);

  // Fetch voting records
  const { data: votingData } = useQuery<{ votingRecords: any[], bills: any }>({
    queryKey: [`/api/politicians/${politicianId}/voting-records`],
    enabled: politicianId > 0,
  });

  // Load voting records data
  useEffect(() => {
    if (votingData?.votingRecords?.length > 0 && votingData.bills) {
      const records = votingData.votingRecords;
      
      if (records[0]) {
        const billId = records[0].billId;
        const bill = votingData.bills[billId];
        if (bill) {
          setBill1Title(bill.title || "");
          setBill1Description(bill.description || "");
          setBill1Vote(records[0].vote || "For");
        }
      }
      
      if (records[1]) {
        const billId = records[1].billId;
        const bill = votingData.bills[billId];
        if (bill) {
          setBill2Title(bill.title || "");
          setBill2Description(bill.description || "");
          setBill2Vote(records[1].vote || "For");
        }
      }
    }
  }, [votingData]);

  // Update politician mutation
  const updatePoliticianMutation = useMutation({
    mutationFn: (data: any) => 
      apiRequest("PUT", `/api/admin/politicians/${politicianId}`, data),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Politician updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/politicians"] });
      queryClient.invalidateQueries({ queryKey: [`/api/politicians/${politicianId}`] });
      navigate("/admin/politicians");
    },
    onError: (error) => {
      console.error("Error updating politician:", error);
      toast({
        title: "Error",
        description: "Failed to update politician. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Form submission handler
  const onSubmit = (data: PoliticianFormValues) => {
    // Add promises
    const promises = [];
    
    if (promise1Title) {
      promises.push({
        title: promise1Title,
        description: promise1Description,
        status: promise1Status,
        politicianId
      });
    }
    
    if (promise2Title) {
      promises.push({
        title: promise2Title,
        description: promise2Description,
        status: promise2Status,
        politicianId
      });
    }
    
    // Add voting records
    const votingRecords = [];
    
    if (bill1Title) {
      votingRecords.push({
        billTitle: bill1Title,
        billDescription: bill1Description,
        vote: bill1Vote,
        politicianId
      });
    }
    
    if (bill2Title) {
      votingRecords.push({
        billTitle: bill2Title,
        billDescription: bill2Description,
        vote: bill2Vote,
        politicianId
      });
    }
    
    // Submit all data
    updatePoliticianMutation.mutate({
      ...data,
      promises,
      votingRecords
    });
  };

  const handleCancel = () => {
    navigate("/admin/politicians");
  };

  if (isLoading) {
    return (
      <AdminLayout title="Edit Politician">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !politicianData) {
    return (
      <AdminLayout title="Edit Politician">
        <div className="p-8 text-center bg-red-50 rounded-lg border border-red-100">
          <h2 className="text-xl font-bold text-red-800 mb-2">Error Loading Politician</h2>
          <p className="text-red-600 mb-4">
            We couldn't load this politician's data. Please try again later.
          </p>
          <Button onClick={() => navigate("/admin/politicians")}>Return to Politicians</Button>
        </div>
      </AdminLayout>
    );
  }

  const politician = politicianData.politician;

  return (
    <AdminLayout title={`Edit ${politician.name}`}>
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate("/admin/politicians")} className="mr-2">
          <ArrowLeft className="h-4 w-4 mr-1" />
        </Button>
        <h2 className="text-2xl font-bold text-gray-900">Edit {politician.name}</h2>
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
                          <Input {...field} />
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
                        <FormLabel>Party</FormLabel>
                        <Select 
                          value={field.value} 
                          onValueChange={field.onChange}
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
                          <Input {...field} />
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
                          value={field.value} 
                          onValueChange={field.onChange}
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

                  <FormField
                    control={form.control}
                    name="profileImageUrl"
                    render={({ field }) => (
                      <FormItem className="col-span-full">
                        <FormLabel>Profile Image URL</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem className="col-span-full">
                        <FormLabel>Biography</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter politician biography"
                            rows={4}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              <TabsContent value="manifesto" className="p-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Key Manifesto Points</h3>
                  <p className="text-sm text-gray-500 mb-4">Enter up to 5 key points from this politician's manifesto</p>
                  
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
                    <p className="text-sm text-gray-500 mb-6">Add up to 2 significant votes</p>
                    
                    {/* Voting Record 1 */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                      <div className="md:col-span-2">
                        <div className="form-control w-full">
                          <label className="block text-sm font-medium mb-1">Bill</label>
                          <input
                            type="text"
                            placeholder="e.g. Climate Protection Act"
                            className="w-full p-2 border border-gray-300 rounded"
                            value={bill1Title}
                            onChange={(e) => setBill1Title(e.target.value)}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="form-control w-full">
                          <label className="block text-sm font-medium mb-1">Vote</label>
                          <select
                            className="w-full p-2 border border-gray-300 rounded"
                            value={bill1Vote}
                            onChange={(e) => setBill1Vote(e.target.value)}
                          >
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
                          <textarea
                            placeholder="Brief description of the bill"
                            className="w-full p-2 border border-gray-300 rounded"
                            rows={2}
                            value={bill1Description}
                            onChange={(e) => setBill1Description(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Voting Record 2 */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                      <div className="md:col-span-2">
                        <div className="form-control w-full">
                          <label className="block text-sm font-medium mb-1">Bill</label>
                          <input
                            type="text"
                            placeholder="e.g. Infrastructure Funding Bill"
                            className="w-full p-2 border border-gray-300 rounded"
                            value={bill2Title}
                            onChange={(e) => setBill2Title(e.target.value)}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="form-control w-full">
                          <label className="block text-sm font-medium mb-1">Vote</label>
                          <select
                            className="w-full p-2 border border-gray-300 rounded"
                            value={bill2Vote}
                            onChange={(e) => setBill2Vote(e.target.value)}
                          >
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
                          <textarea
                            placeholder="Brief description of the bill"
                            className="w-full p-2 border border-gray-300 rounded"
                            rows={2}
                            value={bill2Description}
                            onChange={(e) => setBill2Description(e.target.value)}
                          />
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
                        <input
                          type="text"
                          placeholder="e.g. Will reduce taxes by 10%"
                          className="w-full p-2 border border-gray-300 rounded"
                          value={promise1Title}
                          onChange={(e) => setPromise1Title(e.target.value)}
                        />
                      </div>
                      <div className="form-control w-full mb-2">
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea
                          placeholder="Details of the promise"
                          className="w-full p-2 border border-gray-300 rounded"
                          rows={2}
                          value={promise1Description}
                          onChange={(e) => setPromise1Description(e.target.value)}
                        />
                      </div>
                      <div className="flex space-x-8 mt-4">
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="promise1-kept"
                            className="w-4 h-4"
                            name="promise1Status"
                            value="Fulfilled"
                            checked={promise1Status === "Fulfilled"}
                            onChange={() => setPromise1Status("Fulfilled")}
                          />
                          <label htmlFor="promise1-kept" className="ml-2 text-sm font-medium text-gray-700">
                            Kept
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="promise1-partial"
                            className="w-4 h-4"
                            name="promise1Status"
                            value="InProgress"
                            checked={promise1Status === "InProgress"}
                            onChange={() => setPromise1Status("InProgress")}
                          />
                          <label htmlFor="promise1-partial" className="ml-2 text-sm font-medium text-gray-700">
                            Partially
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="promise1-not-kept"
                            className="w-4 h-4"
                            name="promise1Status"
                            value="Unfulfilled"
                            checked={promise1Status === "Unfulfilled"}
                            onChange={() => setPromise1Status("Unfulfilled")}
                          />
                          <label htmlFor="promise1-not-kept" className="ml-2 text-sm font-medium text-gray-700">
                            Not Kept
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Promise 2 */}
                    <div className="mb-6">
                      <div className="form-control w-full mb-2">
                        <label className="block text-sm font-medium mb-1">Promise</label>
                        <input
                          type="text"
                          placeholder="e.g. Will introduce education reform"
                          className="w-full p-2 border border-gray-300 rounded"
                          value={promise2Title}
                          onChange={(e) => setPromise2Title(e.target.value)}
                        />
                      </div>
                      <div className="form-control w-full mb-2">
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea
                          placeholder="Details of the promise"
                          className="w-full p-2 border border-gray-300 rounded"
                          rows={2}
                          value={promise2Description}
                          onChange={(e) => setPromise2Description(e.target.value)}
                        />
                      </div>
                      <div className="flex space-x-8 mt-4">
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="promise2-kept"
                            className="w-4 h-4"
                            name="promise2Status"
                            value="Fulfilled"
                            checked={promise2Status === "Fulfilled"}
                            onChange={() => setPromise2Status("Fulfilled")}
                          />
                          <label htmlFor="promise2-kept" className="ml-2 text-sm font-medium text-gray-700">
                            Kept
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="promise2-partial"
                            className="w-4 h-4"
                            name="promise2Status"
                            value="InProgress"
                            checked={promise2Status === "InProgress"}
                            onChange={() => setPromise2Status("InProgress")}
                          />
                          <label htmlFor="promise2-partial" className="ml-2 text-sm font-medium text-gray-700">
                            Partially
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="promise2-not-kept"
                            className="w-4 h-4"
                            name="promise2Status"
                            value="Unfulfilled"
                            checked={promise2Status === "Unfulfilled"}
                            onChange={() => setPromise2Status("Unfulfilled")}
                          />
                          <label htmlFor="promise2-not-kept" className="ml-2 text-sm font-medium text-gray-700">
                            Not Kept
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end space-x-4 p-6 border-t">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={updatePoliticianMutation.isPending}>
                {updatePoliticianMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </AdminLayout>
  );
};

export default AdminEditPolitician;