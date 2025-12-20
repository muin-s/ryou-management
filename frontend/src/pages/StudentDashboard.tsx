import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { IssueCard } from '@/components/IssueCard';
import { IssueModal } from '@/components/IssueModal';
import { IssueForm } from '@/components/IssueForm';
import { NoticeBoard } from '@/components/NoticeBoard';
import { MessBoard } from '@/components/MessBoard';
import { Issue } from '@/contexts/DataContext';
import { Home, PlusCircle, Megaphone, LogOut, User, UtensilsCrossed, Bus, Bandage } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import ProfileAvatar from "@/components/ui/ProfileAvatar";
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
import ThemeToggle from "@/components/ui/ThemeToggle";
import BusTimetableView from "@/components/BusTimetableView"; // ✅ Import Bus Timetable
import StudentMarket from "./StudentMarket";
import StudentMarketplace from "./StudentMarketplace";
import { Store } from "lucide-react";
import HostelExit from "./HostelExit";



const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<
    | "all"
    | "my"
    | "notices"
    | "mess"
    | "bus"
    | "medical"
    | "market"
    | "marketplace"
    | "hostel-exit"   // ✅ ADD
  >("all");

  const { issues, notices, messItems, addIssue, deleteIssue, updateIssue, doctors } = useData();
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [issueFormOpen, setIssueFormOpen] = useState(false);
  const [issueToEdit, setIssueToEdit] = useState<Issue | null>(null);
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [issueToDelete, setIssueToDelete] = useState<number | null>(null);

  const myIssues = issues.filter((issue) => issue.createdBy === user?.name);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleView = (issue: Issue) => {
    setSelectedIssue(issue);
    setViewModalOpen(true);
  };

  const handleEdit = (issue: Issue) => {
    if (issue.status === "Resolved") {
      toast({
        title: "Cannot edit",
        description: "Resolved issues cannot be edited",
        variant: "destructive",
      });
      return;
    }
    setEditingIssue(issue);
    setFormModalOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setIssueToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!issueToDelete) return;

    const success = await deleteIssue(issueToDelete);
    toast({
      title: success ? "Issue deleted" : "Error",
      description: success
        ? "Your issue has been removed"
        : "Failed to delete issue",
      variant: success ? "default" : "destructive",
    });

    setDeleteDialogOpen(false);
    setIssueToDelete(null);
  };

  const handleNewIssue = () => {
    setEditingIssue(null);
    setFormModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <header className="border-b bg-white dark:bg-gray-800 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Student Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <ProfileAvatar />
          </div>
        </div>
      </header>

      <nav className="border-b bg-white dark:bg-gray-800 dark:border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto py-2">
            <Button
              variant={activeTab === "all" ? "default" : "ghost"}
              onClick={() => setActiveTab("all")}
              className="gap-2"
            >
              <Home className="h-4 w-4" />
              All Issues
            </Button>
            <Button
              variant={activeTab === "my" ? "default" : "ghost"}
              onClick={() => setActiveTab("my")}
              className="gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              My Issues
            </Button>
            <Button
              variant={activeTab === "notices" ? "default" : "ghost"}
              onClick={() => setActiveTab("notices")}
              className="gap-2"
            >
              <Megaphone className="h-4 w-4" />
              Notice Board
            </Button>
            <Button
              variant={activeTab === "mess" ? "default" : "ghost"}
              onClick={() => setActiveTab("mess")}
              className="gap-2"
            >
              <UtensilsCrossed className="h-4 w-4" />
              Mess Menu
            </Button>
            <Button
              variant={activeTab === "bus" ? "default" : "ghost"}
              onClick={() => setActiveTab("bus")}
              className="gap-2"
            >
              <Bus className="h-4 w-4" />
              Bus Timetable
            </Button>
            <Button
              variant={activeTab === "medical" ? "default" : "ghost"}
              onClick={() => setActiveTab("medical")}
              className="gap-2"
            >
              <Bandage className="h-4 w-4" />
              Medical
            </Button>
            <Button
              variant={activeTab === "market" ? "default" : "ghost"}
              onClick={() => setActiveTab("market")}
              className="gap-2"
            >
              🛒 Nearby Shops
            </Button>
            <Button
              variant={activeTab === "marketplace" ? "default" : "ghost"}
              onClick={() => setActiveTab("marketplace")}
              className="gap-2"
            >
              <Store className="h-4 w-4" />
              Marketplace
            </Button>
            <Button
              variant={activeTab === "hostel-exit" ? "default" : "ghost"}
              onClick={() => setActiveTab("hostel-exit")}
              className="gap-2"
            >
              🚪 Hostel Exit
            </Button>


          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {activeTab === "all" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                All Issues
              </h2>
              <Button onClick={handleNewIssue}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Raise New Issue
              </Button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {issues.map((issue) => (
                <IssueCard key={issue.id} issue={issue} onView={handleView} showActions={false} />
              ))}
            </div>
          </div>
        )}

        {activeTab === "my" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                My Issues
              </h2>
              <Button onClick={handleNewIssue}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Raise New Issue
              </Button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myIssues.length === 0 ? (
                <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400">
                  You haven't raised any issues yet
                </div>
              ) : (
                myIssues.map((issue) => (
                  <IssueCard
                    key={issue.id}
                    issue={issue}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                    showActions={true}
                  />
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === "notices" && <NoticeBoard notices={notices} />}
        {activeTab === "mess" && <MessBoard messItems={messItems} />}

        {activeTab === "bus" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              Bus Timetable
            </h2>
            <BusTimetableView />
          </div>
        )}
        {activeTab === "market" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">
              Nearby Shops (NLP + OpenStreetMap)
            </h2>

            <StudentMarket />
          </div>
        )}
        {activeTab === "marketplace" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              Student Marketplace
            </h2>

            <StudentMarketplace />
          </div>
        )}
        {activeTab === "hostel-exit" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              Hostel Exit Request
            </h2>

            <HostelExit />
          </div>
        )}



        {/* ---------- Medical Tab (student view - read-only) ---------- */}
        {activeTab === "medical" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              Medical Facility
            </h2>

            {/* Replace this static table with your doctors state / API data */}
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white dark:bg-gray-800 rounded-md overflow-hidden border">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-700 text-left">
                    <th className="p-3">Doctor Name</th>
                    <th className="p-3">Available Today</th>
                    <th className="p-3">Arrival Time</th>
                    <th className="p-3">Leave Time</th>
                  </tr>
                </thead>
                <tbody>
                  {(!doctors || doctors.length === 0) ? (
                    <tr>
                      <td colSpan={4} className="p-3 text-center text-gray-500 dark:text-gray-400">
                        No doctors available at the moment.
                      </td>
                    </tr>
                  ) : (
                    doctors.map((doctor) => (
                      <tr key={doctor.id} className="border-t border-gray-200 dark:border-gray-700">
                        <td className="p-3">{doctor.name}</td>
                        <td className="p-3">
                          <span className={doctor.availableToday ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                            {doctor.availableToday ? "Yes" : "No"}
                          </span>
                        </td>
                        <td className="p-3">{doctor.arrivalTime || "N/A"}</td>
                        <td className="p-3">{doctor.leaveTime || "N/A"}</td>
                      </tr>
                    ))
                  )}
                </tbody>

              </table>
            </div>
          </div>
        )}
      </main>

      <IssueModal issue={selectedIssue} open={viewModalOpen} onOpenChange={setViewModalOpen} />
      <IssueForm
        open={formModalOpen}
        onOpenChange={setFormModalOpen}
        issue={editingIssue}
        addIssue={addIssue}
      />
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Issue</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this issue? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default StudentDashboard;
