import { useState, useEffect } from "react";
import MainPageLayout from "@/components/layout/main-page-layout";

export default function AboutPage() {
  const [about, setAbout] = useState<any>(null);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const response = await fetch("/api/cms/about-us/public");
        const data = await response.json();
        setAbout(data);
      } catch (error) {
        console.error("Error fetching about data:", error);
      }
    };
    fetchAbout();
  }, []);

  if (!about)
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
        {/* Hero Section */}
        <div className="max-w-6xl mx-auto px-4 py-16 lg:py-24">
          <div className="text-center mb-16">
            <h1 className="text-5xl lg:text-6xl font-bold text-green-900 mb-4">
              {about.title || "About Divine Naturals"}
            </h1>
            <p className="text-2xl text-green-700 font-medium">
              {about.subtitle || "Pure. Fresh. Daily."}
            </p>
          </div>

          {/* Image Section */}
          {about.imageUrl && (
            <div className="mb-16">
              <img
                src={about.imageUrl}
                alt="Divine Naturals"
                className="w-full h-96 lg:h-[500px] object-cover rounded-2xl shadow-2xl"
              />
            </div>
          )}

          {/* Main Content */}
          <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-12 mb-16">
            <p className="text-lg lg:text-xl text-gray-700 leading-relaxed">
              {about.content}
            </p>
          </div>

          {/* Mission & Vision Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {about.mission && (
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 lg:p-10 rounded-2xl border-2 border-green-200">
                <h2 className="text-3xl font-bold text-green-900 mb-4 flex items-center gap-2">
                  🎯 Our Mission
                </h2>
                <p className="text-gray-700 text-lg leading-relaxed">
                  {about.mission}
                </p>
              </div>
            )}

            {about.vision && (
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 lg:p-10 rounded-2xl border-2 border-blue-200">
                <h2 className="text-3xl font-bold text-blue-900 mb-4 flex items-center gap-2">
                  🔮 Our Vision
                </h2>
                <p className="text-gray-700 text-lg leading-relaxed">
                  {about.vision}
                </p>
              </div>
            )}
          </div>

          {/* Values Section */}
          {about.values && (
            <div className="mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-10 text-center">
                ⭐ Our Core Values
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {(Array.isArray(about.values) ? about.values : JSON.parse(about.values || "[]")).map((value: any, idx: number) => (
                  <div
                    key={idx}
                    className="bg-white border-2 border-gray-200 p-6 rounded-xl hover:shadow-lg hover:border-green-400 transition-all"
                  >
                    <h3 className="text-xl font-bold text-green-900 mb-3">
                      {value.title}
                    </h3>
                    <p className="text-gray-700">
                      {value.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </MainPageLayout>
  );
}
