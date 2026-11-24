export const PROGRAM_SLUGS = [
  "computer-engineering-technology",
  "electronics-engineering-technology",
  "electrical-engineering-technology",
  "tourism-technology",
  "hospitality-technology",
  "restaurant-operations-technology",
  "culinary-arts-technology",
] as const;

export type ProgramSlug = (typeof PROGRAM_SLUGS)[number];

export type ProgramScope = {
  title: string;
  body: string;
};

export type Program = {
  slug: ProgramSlug;
  name: string;
  shortName: string;
  shortDescription: string;
  /** Optional while a program's copy is still being written. */
  tagline?: string;
  image: string;
  imageAlt: string;
  overview?: string[];
  scope?: ProgramScope[];
  careers?: string[];
};

// Draft website copy — descriptions of the field each program belongs to.
// Detailed subject lists and admission requirements are still being confirmed
// with KM100; nothing here should be read as an approved curriculum.
export const programs: Program[] = [
  {
    slug: "computer-engineering-technology",
    name: "Diploma in Computer Engineering Technology",
    shortName: "Computer Engineering Technology",
    shortDescription:
      "Computer hardware, operating systems and the networks that connect them.",
    tagline: "The hardware side of computing — built, repaired and kept running.",
    image: "/programs/computer-engineering-technology.jpg",
    imageAlt:
      "KM100 program poster for Computer Engineering Technology, showing a computer mainboard, cooling fan and a laptop running code",
    overview: [
      "Computer Engineering Technology sits where electronics and computing meet. It is the discipline behind the machines themselves: the components inside a computer, how they are assembled, the systems installed on them, and the networks that connect them to each other.",
      "It is offered at KM100 as a three-year Diploma Program at PQF Level 5, alongside four other technical programs. Of the five, it is the closest to information technology, and it is a good fit for learners who are as comfortable opening a machine as they are working inside the software running on it.",
    ],
    scope: [
      {
        title: "Computer hardware",
        body: "Assembling, upgrading and repairing desktop and laptop systems, and understanding how the components work together.",
      },
      {
        title: "Operating systems",
        body: "Installing and configuring the software a computer runs on, and tracing a fault when it misbehaves.",
      },
      {
        title: "Networking",
        body: "How devices are connected, how a small network is set up, and how to follow a problem from one end of it to the other.",
      },
      {
        title: "Technical support",
        body: "Listening to a user's problem, diagnosing it methodically, and explaining the fix in plain terms.",
      },
    ],
    careers: [
      "Computer and hardware technician",
      "IT and technical support staff",
      "Network and systems support",
      "Sales and service work in computer retail",
    ],
  },
  {
    slug: "electronics-engineering-technology",
    name: "Diploma in Electronics Engineering Technology",
    shortName: "Electronics Engineering Technology",
    shortDescription:
      "Circuits, components and the instruments used to test and repair them.",
    tagline: "Small currents, precise work — circuits, signals and instruments.",
    image: "/programs/electronics-engineering-technology.jpg",
    imageAlt:
      "KM100 program poster for Electronics Engineering Technology, showing a circuit board, test probes and an oscilloscope trace",
    overview: [
      "Electronics Engineering Technology deals with the small and precise end of electrical work: circuits, components, signals, and the instruments used to test them. It is the field behind consumer devices, control systems, and much of the equipment industrial operations depend on.",
      "It is offered at KM100 as a three-year Diploma Program at PQF Level 5. The work rewards patience and attention to detail: a fault can be a single component out of hundreds, found one measurement at a time.",
    ],
    scope: [
      {
        title: "Circuit fundamentals",
        body: "How components behave, how they are arranged into working circuits, and what happens when a circuit is powered.",
      },
      {
        title: "Measurement and instrumentation",
        body: "Using multimeters and oscilloscopes to read what a circuit is actually doing, rather than what it should be doing.",
      },
      {
        title: "Assembly and soldering",
        body: "Building and reworking circuit boards carefully, and recognising a sound joint from a doubtful one.",
      },
      {
        title: "Fault-finding and repair",
        body: "Working through a faulty device in a logical order until the failed part is found and replaced.",
      },
    ],
    careers: [
      "Electronics technician",
      "Instrumentation and calibration support",
      "Repair and maintenance of electronic equipment",
      "Assembly and quality work in electronics manufacturing",
    ],
  },
  {
    slug: "electrical-engineering-technology",
    name: "Diploma in Electrical Engineering Technology",
    shortName: "Electrical Engineering Technology",
    shortDescription:
      "Wiring, distribution, motors and controls — the systems that carry power.",
    tagline: "The systems that carry power, and the safety that goes with them.",
    image: "/programs/electrical-engineering-technology.jpg",
    imageAlt:
      "KM100 program poster for Electrical Engineering Technology, showing a distribution board of breakers and coloured wiring",
    overview: [
      "Electrical Engineering Technology covers the systems that carry power: wiring, distribution, motors and controls, and the safety practices that hold all of it together. It is a hands-on discipline: what matters is what gets installed, and whether it holds up.",
      "It is offered at KM100 as a three-year Diploma Program at PQF Level 5. The field is steady and local: buildings, shops, plants and facilities all need someone who can install a circuit properly, maintain it, and find the fault when it stops working.",
    ],
    scope: [
      {
        title: "Wiring and installation",
        body: "Sizing, running and terminating conductors, and putting a circuit together to a safe and tidy standard.",
      },
      {
        title: "Motors and controls",
        body: "How motors are started and controlled, and what the components around them are there to protect.",
      },
      {
        title: "Plans and diagrams",
        body: "Reading electrical plans and schematic diagrams, and marking up what was actually installed.",
      },
      {
        title: "Testing and safety",
        body: "Isolating and testing a circuit before touching it, and working to the safety practice the trade requires.",
      },
    ],
    careers: [
      "Electrical technician",
      "Building and facilities maintenance",
      "Industrial and plant electrical work",
      "Work with electrical contractors and utilities",
    ],
  },
  {
    slug: "tourism-technology",
    name: "Diploma in Tourism Technology",
    shortName: "Tourism Technology",
    shortDescription:
      "Travel, destinations and the service a visitor experiences end to end.",
    tagline: "Travel as an industry, and travel as an experience.",
    image: "/programs/tourism-technology.jpg",
    imageAlt:
      "KM100 program poster for Tourism Technology, showing a globe, passport, boarding passes and a departing aircraft",
    overview: [
      "Tourism Technology looks at travel from both sides: as an industry of routes, bookings and destinations, and as an experience that begins with a first enquiry and ends long after the trip. It brings together destination knowledge, service, and the systems that keep itineraries moving.",
      "It is offered at KM100 as a three-year Diploma Program at PQF Level 5. Northern Cebu, where the school is based, is a tourism area in its own right, so the subject can be studied close to home as well as in the classroom.",
    ],
    scope: [
      {
        title: "Travel and tour operations",
        body: "How trips are put together — itineraries, transfers, timings and the arrangements behind a smooth journey.",
      },
      {
        title: "Destinations",
        body: "Knowing a place well enough to present it: what it offers, when to go, and how to describe it honestly.",
      },
      {
        title: "Front-line guest service",
        body: "Receiving enquiries, handling requests and complaints, and keeping a visitor's experience consistent.",
      },
      {
        title: "Reservations and systems",
        body: "Booking and record-keeping — the administrative side that decides whether a trip actually holds together.",
      },
    ],
    careers: [
      "Tour and travel operations",
      "Reservations and ticketing support",
      "Tourism office and guiding roles",
      "Front office in hotels and resorts",
    ],
  },
  {
    slug: "hospitality-technology",
    name: "Diploma in Hospitality Technology",
    shortName: "Hospitality Technology",
    shortDescription:
      "Food and beverage, accommodation and the standards that hold them together.",
    tagline: "Service delivered well, and delivered the same way every time.",
    image: "/programs/hospitality-technology.jpg",
    imageAlt:
      "KM100 program poster for Hospitality Technology, showing a neatly laid dining table with folded napkins and glassware",
    overview: [
      "Hospitality Technology is about service done properly: food and beverage, accommodation, front office, and the standards that hold them together. The work is practical and people-facing, and it is judged on details guests notice without being able to name them.",
      "It is offered at KM100 as a three-year Diploma Program at PQF Level 5. It sits naturally beside Tourism Technology — one program looks at how visitors arrive and what they do, the other at how they are received and looked after.",
    ],
    scope: [
      {
        title: "Food and beverage service",
        body: "Setting up, serving and clearing correctly, and looking after a table from the first guest to the last.",
      },
      {
        title: "Housekeeping and accommodation",
        body: "Room standards, linen and cleaning routines, and the checks that keep a property consistent.",
      },
      {
        title: "Front office",
        body: "Check-in and check-out, guest records, and the telephone and email contact that frames a stay.",
      },
      {
        title: "Service standards",
        body: "Grooming, courtesy, hygiene and timing — the small conventions that make service feel effortless.",
      },
    ],
    careers: [
      "Hotel and resort service roles",
      "Food and beverage service",
      "Front office and reservations",
      "Housekeeping and accommodation",
    ],
  },
  {
    slug: "restaurant-operations-technology",
    name: "Diploma in Restaurant Operations Technology",
    shortName: "Restaurant Operations Technology",
    shortDescription:
      "Food and beverage management, dining service, and restaurant operations.",
    tagline: "Service, timing and cost — a restaurant run as a business.",
    image: "/programs/restaurant-operations-technology.jpg",
    imageAlt: "KM100 program poster for Restaurant Operations Technology",
    overview: [
      "Restaurant Operations Technology looks at the restaurant as a whole: the dining room and the kitchen behind it, the order in which a service runs, and the money and stock that decide whether a good night of service is also a viable one. It brings together guest service, food and beverage management, and the routines that keep a floor working across shifts.",
      "It is offered at KM100 as a three-year Diploma Program at PQF Level 5. It sits beside Culinary Arts Technology, which covers the kitchen itself, and Hospitality Technology, which covers service standards across hotels and resorts; this program is the operating side where those meet.",
    ],
    scope: [
      {
        title: "Dining service and floor flow",
        body: "How a service period is planned and paced — covers, table timing, and keeping the dining room and kitchen working to the same rhythm.",
      },
      {
        title: "Food and beverage cost control",
        body: "Portions, waste, pricing and the records that show where a restaurant's money is actually going.",
      },
      {
        title: "Menu and stock management",
        body: "Planning what is sold against what is bought, stored and used, and ordering suppliers to match.",
      },
      {
        title: "Supervision and scheduling",
        body: "Rosters, briefings and holding a standard steady across staff, shifts and busy periods.",
      },
    ],
    careers: [
      "Restaurant supervisory roles",
      "Food and beverage operations",
      "Dining service and front-of-house coordination",
      "Restaurant administration and stock control",
    ],
  },
  {
    slug: "culinary-arts-technology",
    name: "Diploma in Culinary Arts Technology",
    shortName: "Culinary Arts Technology",
    shortDescription:
      "Culinary techniques, commercial kitchen operations, and gastronomy.",
    tagline: "Technique first: blade, heat and timing, repeated until it holds.",
    image: "/programs/culinary-arts-technology.jpg",
    imageAlt: "KM100 program poster for Culinary Arts Technology",
    overview: [
      "Culinary Arts Technology is the cooking side of the industry: preparation and knife work, the cooking methods that build a dish, seasoning and balance, and the kitchen routines that let all of it be repeated at volume. It treats cooking as a craft with a method behind it, and as work that has to be safe, consistent and quick at the same time.",
      "It is offered at KM100 as a three-year Diploma Program at PQF Level 5. It pairs with Restaurant Operations Technology — one program works the kitchen, the other runs the floor around it — and with Hospitality Technology, where kitchens serve hotels and resorts.",
    ],
    scope: [
      {
        title: "Preparation and knife work",
        body: "Handling, cutting and portioning ingredients accurately, and setting up a station before service rather than during it.",
      },
      {
        title: "Cooking methods",
        body: "The dry and moist methods that carry most dishes, and how stocks, sauces and seasoning are built and corrected.",
      },
      {
        title: "Kitchen hygiene and safety",
        body: "Food handling, storage temperatures, cleaning routines and the safe use of a commercial kitchen.",
      },
      {
        title: "Commercial kitchen workflow",
        body: "Working a station, timing several dishes to one service, and keeping a plate consistent on the busiest ticket.",
      },
    ],
    careers: [
      "Commis and station cook roles",
      "Kitchen work in hotels and resorts",
      "Catering and events food preparation",
      "Small food business kitchen operations",
    ],
  },
];

export function getProgramBySlug(slug: string): Program | undefined {
  return programs.find((program) => program.slug === slug);
}
