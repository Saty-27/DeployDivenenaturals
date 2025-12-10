import { useState, useEffect } from "react";
import MainPageLayout from "@/components/layout/main-page-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

export default function ContactPage() {
  const [contact, setContact] = useState<any>(null);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const response = await fetch("/api/cms/contact/public");
        const data = await response.json();
        setContact(data);
      } catch (error) {
        console.error("Error fetching contact data:", error);
      }
    };
    fetchContact();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast({ description: "Please fill all fields", variant: "destructive" });
      return;
    }

    setSending(true);
    try {
      const response = await fetch("/api/contact-submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        toast({ description: "✅ Message sent! We'll get back to you soon." });
        setFormData({ name: "", email: "", message: "" });
      } else {
        toast({ description: "Error sending message. Please try again.", variant: "destructive" });
      }
    } catch (error) {
      toast({ description: "Error sending message. Please try again.", variant: "destructive" });
    }
    setSending(false);
  };

  if (!contact)
    return (
      <MainPageLayout>
        <div className="flex items-center justify-center min-h-96">
          <span className="text-4xl">⏳</span>
        </div>
      </MainPageLayout>
    );

  return (
    <MainPageLayout>
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
        <div className="max-w-6xl mx-auto px-4 py-16 lg:py-24">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl lg:text-6xl font-bold text-green-900 mb-4">
              {contact.title || "Contact Us"}
            </h1>
            <p className="text-2xl text-green-700">
              {contact.subtitle || "We'd love to hear from you"}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Get in Touch</h2>

              {contact.phone && (
                <div className="flex gap-4 mb-8 pb-8 border-b">
                  <Phone className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Phone</p>
                    <a href={`tel:${contact.phone}`} className="text-green-600 hover:text-green-700 text-lg">
                      {contact.phone}
                    </a>
                  </div>
                </div>
              )}

              {contact.email && (
                <div className="flex gap-4 mb-8 pb-8 border-b">
                  <Mail className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Email</p>
                    <a href={`mailto:${contact.email}`} className="text-green-600 hover:text-green-700 text-lg">
                      {contact.email}
                    </a>
                  </div>
                </div>
              )}

              {contact.address && (
                <div className="flex gap-4 mb-8 pb-8 border-b">
                  <MapPin className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Address</p>
                    <p className="text-gray-700 text-lg leading-relaxed">
                      {contact.address}
                    </p>
                  </div>
                </div>
              )}

              {contact.businessHours && (
                <div className="flex gap-4">
                  <Clock className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Business Hours</p>
                    <p className="text-gray-700 whitespace-pre-line text-lg">
                      {contact.businessHours}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Send us a Message</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Your Name
                  </label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    className="text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                    className="text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Message
                  </label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us how we can help..."
                    rows={6}
                    className="text-base"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={sending}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg font-semibold rounded-lg"
                >
                  {sending ? "Sending..." : "✉️ Send Message"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </MainPageLayout>
  );
}
