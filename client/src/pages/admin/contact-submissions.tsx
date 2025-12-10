import { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/admin-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ContactSubmissionsPage() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await fetch("/api/admin/contact-submissions", {
        credentials: "include"
      });
      if (response.ok) {
        const data = await response.json();
        setSubmissions(data);
      } else {
        console.error("Failed to fetch:", response.status);
      }
    } catch (error) {
      console.error("Error fetching submissions:", error);
    }
    setLoading(false);
  };

  const markAsRead = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/contact-submissions/${id}/read`, {
        method: "PUT",
        credentials: "include"
      });
      if (response.ok) {
        fetchSubmissions();
        toast({ description: "✅ Marked as read" });
      }
    } catch (error) {
      toast({ description: "Error updating submission", variant: "destructive" });
    }
  };

  const deleteSubmission = async (id: number) => {
    if (!confirm("Delete this submission?")) return;
    try {
      const response = await fetch(`/api/admin/contact-submissions/${id}`, {
        method: "DELETE",
        credentials: "include"
      });
      if (response.ok) {
        fetchSubmissions();
        toast({ description: "✅ Deleted" });
      }
    } catch (error) {
      toast({ description: "Error deleting submission", variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <span className="text-4xl">⏳</span>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-gray-900">Contact Submissions</h1>
          <Badge variant="secondary">{submissions.length} messages</Badge>
        </div>

        {submissions.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center text-gray-500">
            No contact submissions yet.
          </div>
        ) : (
          <div className="bg-white rounded-lg overflow-hidden shadow">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Message</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {submissions.map((sub: any) => (
                  <tr key={sub.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">{sub.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{sub.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{sub.message}</td>
                    <td className="px-6 py-4 text-sm">
                      <Badge variant={sub.status === "new" ? "default" : "secondary"}>
                        {sub.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(sub.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      {sub.status === "new" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => markAsRead(sub.id)}
                          className="gap-2"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteSubmission(sub.id)}
                        className="gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
