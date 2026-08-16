/* ==========================================================================
   DIGISYNQ — Client-Side Database & API State Engine
   Reactive Store for Verified Talents, Studios, and Live Project Workspace
   ========================================================================== */

(function (window) {
  'use strict';

  const STORAGE_KEY_TALENTS = 'digisynq_talents_v2';
  const STORAGE_KEY_ROOMS   = 'digisynq_active_room';

  // Seeded Verified Database
  const SEED_TALENTS = [
    {
      id: "DS-TAL-004821",
      name: "Aryan Sharma",
      role: "Director of Photography",
      category: "Cinematography",
      grade: "Grade A",
      rating: 4.8,
      reliability: 94,
      onTime: 97,
      repeatHire: 81,
      projects: 32,
      city: "Bengaluru",
      specialty: "Low Light, Anamorphic & High-Speed Commercials",
      gear: "ARRI Alexa Mini LF, Cooke Anamorphic /i",
      availability: "Sept 10–18",
      rate: "₹35,000 / day",
      badge: "Verified Grade A"
    },
    {
      id: "DS-TAL-003190",
      name: "Meera Krishnan",
      role: "Director / Showrunner",
      category: "Direction",
      grade: "Grade A",
      rating: 4.9,
      reliability: 98,
      onTime: 99,
      repeatHire: 92,
      projects: 24,
      city: "Bengaluru",
      specialty: "Narrative Thrillers & Brand Campaigns",
      gear: "ScriptE, Pre-Viz 3D, DaVinci Studio",
      availability: "Immediate Window",
      rate: "Project Retainer",
      badge: "Top Rated"
    },
    {
      id: "DS-TAL-007512",
      name: "Vikramaditya Roy",
      role: "Colorist (DI) & Post Supervisor",
      category: "Post-Production",
      grade: "Grade A",
      rating: 4.7,
      reliability: 92,
      onTime: 95,
      repeatHire: 88,
      projects: 48,
      city: "Mumbai / Remote",
      specialty: "ACES Color Pipeline, Theatrical HDR DI",
      gear: "DaVinci Resolve Advanced Panel, Flanders OLED",
      availability: "Next Week",
      rate: "₹25,000 / day",
      badge: "DI Master"
    },
    {
      id: "DS-TAL-008439",
      name: "Karthik R.",
      role: "Gaffer & Chief Lighting Tech",
      category: "Lighting & Grip",
      grade: "Grade A",
      rating: 4.8,
      reliability: 96,
      onTime: 98,
      repeatHire: 90,
      projects: 56,
      city: "Bengaluru / South",
      specialty: "Aputure Electro Storm, ARRI SkyPanels, CRMX Wireless",
      gear: "Full Lighting Truck Package",
      availability: "Sept 12–22",
      rate: "₹18,000 / day",
      badge: "Senior Crew"
    },
    {
      id: "DS-TAL-009210",
      name: "Tanvi Hegde",
      role: "Production Designer & Art Director",
      category: "Art & Production Design",
      grade: "Grade A",
      rating: 4.9,
      reliability: 95,
      onTime: 96,
      repeatHire: 89,
      projects: 19,
      city: "Bengaluru / Mysuru",
      specialty: "Period Sets, High-Concept Sci-Fi Commercials",
      gear: "AutoCAD 3D, Set Construction Bays",
      availability: "Immediate",
      rate: "₹22,000 / day",
      badge: "Verified Art"
    },
    {
      id: "DS-TAL-001044",
      name: "Siddharth Rao",
      role: "Sync Sound Recordist & Mixer",
      category: "Sound",
      grade: "Grade B",
      rating: 4.9,
      reliability: 97,
      onTime: 98,
      repeatHire: 85,
      projects: 29,
      city: "Bengaluru",
      specialty: "Acoustic Field Recording, Multi-Track RF Wireless",
      gear: "Sound Devices 833, Schoeps & DPA Mics",
      availability: "Open Calendar",
      rate: "₹16,000 / day",
      badge: "Sync Master"
    }
  ];

  class DigisynqDB {
    constructor() {
      this.init();
    }

    init() {
      try {
        const stored = localStorage.getItem(STORAGE_KEY_TALENTS);
        if (!stored) {
          localStorage.setItem(STORAGE_KEY_TALENTS, JSON.stringify(SEED_TALENTS));
        }
      } catch (e) {
        console.warn('LocalStorage unavailable, using in-memory store.');
      }
    }

    getTalents(filterCategory = 'All', search = '') {
      let list = SEED_TALENTS;
      try {
        const stored = localStorage.getItem(STORAGE_KEY_TALENTS);
        if (stored) list = JSON.parse(stored);
      } catch (e) {}

      return list.filter(item => {
        const matchesCat = (filterCategory === 'All' || item.category === filterCategory);
        const q = search.toLowerCase().trim();
        const matchesSearch = !q || (
          item.name.toLowerCase().includes(q) ||
          item.role.toLowerCase().includes(q) ||
          item.specialty.toLowerCase().includes(q) ||
          item.city.toLowerCase().includes(q)
        );
        return matchesCat && matchesSearch;
      });
    }

    addTalent(talent) {
      let list = SEED_TALENTS;
      try {
        const stored = localStorage.getItem(STORAGE_KEY_TALENTS);
        if (stored) list = JSON.parse(stored);
      } catch (e) {}

      const newRecord = {
        id: `DS-TAL-${String(Math.floor(1000 + Math.random() * 9000))}`,
        grade: "Grade A",
        rating: 5.0,
        reliability: 100,
        onTime: 100,
        repeatHire: 100,
        projects: 1,
        badge: "Newly Verified",
        ...talent
      };

      list.unshift(newRecord);
      try {
        localStorage.setItem(STORAGE_KEY_TALENTS, JSON.stringify(list));
      } catch (e) {}
      return newRecord;
    }
  }

  window.DigisynqDB = new DigisynqDB();

})(window);
