import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";

// Pages
import Home from "@/pages/home";
import Directory from "@/pages/directory";
import PoliticianProfile from "@/pages/politician/[id]";
import Compare from "@/pages/compare";
import NotFound from "@/pages/not-found";

// Admin Pages
import AdminLogin from "@/pages/admin/login";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminPoliticians from "@/pages/admin/politicians/index";
import AdminAddPolitician from "@/pages/admin/politicians/add";
import AdminEditPolitician from "@/pages/admin/politicians/edit/[id]";
import AdminComments from "@/pages/admin/comments";
import AdminSettings from "@/pages/admin/settings";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Switch>
          {/* Public routes */}
          <Route path="/" component={Home} />
          <Route path="/directory" component={Directory} />
          <Route path="/politician/:id" component={PoliticianProfile} />
          <Route path="/compare" component={Compare} />
          
          {/* Admin routes */}
          <Route path="/admin/login" component={AdminLogin} />
          <Route path="/admin" component={AdminDashboard} />
          <Route path="/admin/dashboard" component={AdminDashboard} />
          <Route path="/admin/politicians" component={AdminPoliticians} />
          <Route path="/admin/politicians/add" component={AdminAddPolitician} />
          <Route path="/admin/politicians/edit/:id" component={AdminEditPolitician} />
          <Route path="/admin/comments" component={AdminComments} />
          <Route path="/admin/settings" component={AdminSettings} />
          
          {/* Fallback to 404 */}
          <Route component={NotFound} />
        </Switch>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
