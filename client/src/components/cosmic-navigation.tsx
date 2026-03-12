import { useState, useEffect } from "react";

export default function CosmicNavigation() {
  const [activeSection, setActiveSection] = useState("hero");

  const sections = [
    { id: "hero", label: "Hero" },
    { id: "books", label: "Books" },
    { id: "characters", label: "Characters" },
    { id: "lore", label: "Lore" },
    { id: "shop", label: "Shop" },
    { id: "contact", label: "Contact" }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = sections.map(section => ({
        id: section.id,
        element: document.getElementById(section.id)
      }));

      let current = "hero";
      
      for (const section of sectionElements) {
        if (section.element) {
          const rect = section.element.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
            current = section.id;
            break;
          }
        }
      }

      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="fixed top-1/2 right-5 transform -translate-y-1/2 z-50">
      <div className="flex flex-col space-y-3">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              activeSection === section.id
                ? "bg-cosmic-gold transform scale-150 energy-glow"
                : "bg-electric-blue/50 hover:bg-electric-blue/80"
            }`}
            title={section.label}
          />
        ))}
      </div>
    </div>
  );
}
