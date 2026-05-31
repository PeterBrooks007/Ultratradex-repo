import { useEffect, useRef, useState } from "react";
import { Box, Fade, Paper, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import LogoImg from "./../../assets/favicon_logo.png";

// ─── Data that was hard-coded in the original ───────────────────────────────────
const listNames = [
  "John Smith",
  "Maria Garcia",
  "Hiroshi Tanaka",
  "Sophia Müller",
  "Carlos Rodriguez",
  "Elena Petrov",
  "Ahmed Khan",
  "Isabella Kim",
  "Luca Rossi",
  "Olivia Patel",
  "André Silva",
  "Léa Dupont",
  "Diego Fernandez",
  "Ava Lee",
  "Nikolai Ivanov",
  "Emma Wang",
  "Rafael Santos",
  "Mia Nguyen",
  "Matías López",
  "Amelia Schmidt",
  "Yusuf Al-Mansoori",
  "Chloe O'Connell",
  "Connor Jackson",
  "Antonio Costa",
  "Liam Park",
  "Ananya Gupta",
  "Gabriel Hernandez",
  "Zara Khan",
  "Sebastian Müller",
  "Luna Kim",
  "Ibrahim Ali",
  "Emily Johnson",
  "Lucas Barbosa",
  "Grace Lee",
  "Omar El-Amin",
  "Ella Fischer",
  "David García",
  "Aria Patel",
  "Alexandre Dubois",
  "Lily Chen",
  "Mohammed Rahman",
  "Victoria Smith",
  "Andrea Bianchi",
  "Harper Wilson",
  "Javier Rodríguez",
  "Aiden Brown",
  "Sofia Santos",
  "Khaled Al-Farsi",
  "Zoe Taylor",
  "Alice Johnson",
  "Bob Williams",
  "Catherine Davis",
  "Daniel Miller",
  "Elizabeth Wilson",
  "Frank Moore",
  "Grace Taylor",
  "Henry Anderson",
  "Ivy Thomas",
  "Jack White",
  "Karen Harris",
  "Leo Martin",
  "Mia Thompson",
  "Noah Garcia",
  "Olivia Martinez",
  "Peter Robinson",
  "Quinn Clark",
  "Rachel Lewis",
  "Sam Walker",
  "Tina Hall",
  "Umar Young",
  "Victoria King",
  "William Wright",
  "Xavier Green",
  "Yara Baker",
  "Zack Nelson",
  "Anna Scott",
  "Ben Adams",
  "Carla Hill",
  "Damon Carter",
  "Eva Rodriguez",
  "Felix Perez",
  "Gina Roberts",
  "Harry Turner",
  "Iris Phillips",
  "Jake Campbell",
  "Kim Parker",
  "Louis Evans",
  "Megan Edwards",
  "Nathan Collins",
  "Pamela Stewart",
  "Oscar Sanchez",
  "Rebecca Morris",
  "Steven Rogers",
  "Tracy Reed",
  "Ursula Cook",
  "Vincent Bell",
  "Wendy Murphy",
  "Yvonne Kelly",
  "Zane Howard",
  "Abigail Price",
  "Brandon Foster",
  "Cynthia Barnes",
  "Dennis Ross",
  "Erica Sanders",
  "Fred Powell",
  "Georgia Long",
  "Harold Bennett",
  "Jessica Gray",
  "Kevin James",
  "Laura Brooks",
  "Mark Jenkins",
  "Nancy Perry",
  "Paul Butler",
  "Ruth Coleman",
  "Scott Russell",
  "Teresa Ward",
  "Victor Cox",
  "Valerie Diaz",
  "Walter Flores",
  "Yvette Cooper",
  "Zachary Bailey",
  "Aaliyah Green",
  "Abdullah Khan",
  "Akira Sato",
  "Amara Singh",
  "Arjun Sharma",
  "Bianca Oliveira",
  "Chen Wei",
  "Dae-hyun Kim",
  "Fatima Hassan",
  "Guillermo Vargas",
  "Hana Al-Qahtani",
  "Ismail Omar",
  "Jian Li",
  "Kai Schröder",
  "Lena Popova",
  "Manuela Santos",
  "Niamh Murphy",
  "Oscar Schmidt",
  "Priya Devi",
  "Ramiro Gómez",
  "Sana Ahmed",
  "Tariq Mahmood",
  "Uma Devi",
  "Vinay Kumar",
  "Ximena Torres",
  "Yasmine Hassan",
  "Zara Singh",
  "Aisha Mohamed",
  "Björn Gustafsson",
  "Celine Dubois",
  "Dario Conte",
  "Eleni Papadopoulos",
  "Fernando Navarro",
  "Gia Nguyen",
  "Hideki Nakamura",
  "Ingrid Bergman",
  "Juan Perez",
  "Katarina Novák",
  "Lars Hansen",
  "Mei Ling",
  "Niko Virtanen",
  "Olga Ivanova",
  "Pablo Ruiz",
  "Qian Wang",
  "Ricardo Morales",
  "Sofia Johansson",
  "Tae-hee Lee",
  "Uriel Mendoza",
  "Valeria Romanov",
  "Wei Chen",
  "Xiao Li",
  "Youssef Benali",
  "Zeynep Demir",
  "Arthur King",
  "Beatrix Potter",
  "Charles Dickens",
  "Diana Prince",
  "Edward Cullen",
  "Fiona Gallagher",
  "George Costanza",
  "Hermione Granger",
  "Ivan Drago",
  "Jessica Rabbit",
  "Kevin McCallister",
  "Leia Organa",
  "Mickey Mouse",
  "Nancy Drew",
  "Optimus Prime",
  "Peter Parker",
  "Queenie Goldstein",
  "Ron Weasley",
  "Sherlock Holmes",
  "Tyrion Lannister",
  "Ursula K. Le Guin",
  "Voltaire",
  "Wednesday Addams",
  "Xena Warrior Princess",
  "Yoda",
  "Zorro",
  "Anya Petrova",
  "Boris Volkov",
  "Carmen Lopez",
  "Dimitri Belikov",
  "Elara Vance",
  "Fedor Emelianenko",
  "Gita Singh",
  "Hans Gruber",
  "Irina Petrov",
  "Javier Hernandez",
  "Katya Volkov",
  "Leon S. Kennedy",
  "Mila Kuznetsov",
  "Nadia Petrova",
  "Oleg Popov",
  "Polina Ivanova",
  "Rina Tanaka",
  "Sergei Orlov",
  "Tatyana Volkova",
  "Ulyana Makarova",
  "Vadim Kolesnikov",
  "Whitney Houston",
  "Yelena Smirnova",
  "Zinaida Sokolova",
];

const listCountries = [
  "South Africa",
  "USA",
  "Germany",
  "France",
  "Italy",
  "Australia",
  "United Kingdom",
  "Canada",
  "Argentina",
  "Saudi Arabia",
  "Mexico",
  "Venezuela",
  "Sweden",
  "Spain",
  "Netherlands",
  "Switzerland",
  "Belgium",
  "Israel",
  "Cyprus",
  "Greece",
  "Cuba",
  "Portugal",
  "Austria",
  "Panama",
];

// Mapping of countries to their currency codes and preferred locales for formatting
const countryCurrencyMap = {
  "South Africa": { code: "ZAR", locale: "en-ZA" }, // South African Rand
  "USA": { code: "USD", locale: "en-US" }, // United States Dollar
  "Germany": { code: "EUR", locale: "de-DE" }, // Euro
  "France": { code: "EUR", locale: "fr-FR" }, // Euro
  "Italy": { code: "EUR", locale: "it-IT" }, // Euro
  "Australia": { code: "AUD", locale: "en-AU" }, // Australian Dollar
  "United Kingdom": { code: "GBP", locale: "en-GB" }, // British Pound
  "Canada": { code: "CAD", locale: "en-CA" }, // Canadian Dollar
  "Argentina": { code: "ARS", locale: "es-AR" }, // Argentine Peso
  "Saudi Arabia": { code: "SAR", locale: "ar-SA" }, // Saudi Riyal
  "Mexico": { code: "MXN", locale: "es-MX" }, // Mexican Peso
  "Venezuela": { code: "VES", locale: "es-VE" }, // Venezuelan Bolívar Soberano (current)
  "Sweden": { code: "SEK", locale: "sv-SE" }, // Swedish Krona
  "Spain": { code: "EUR", locale: "es-ES" }, // Euro
  "Netherlands": { code: "EUR", locale: "nl-NL" }, // Euro
  "Switzerland": { code: "CHF", locale: "de-CH" }, // Swiss Franc
  "Belgium": { code: "EUR", locale: "fr-BE" }, // Euro
  "Israel": { code: "ILS", locale: "he-IL" }, // Israeli New Shekel
  "Cyprus": { code: "EUR", locale: "el-CY" }, // Euro
  "Greece": { code: "EUR", locale: "el-GR" }, // Euro
  "Cuba": { code: "CUP", locale: "es-CU" }, // Cuban Peso
  "Portugal": { code: "EUR", locale: "pt-PT" }, // Euro
  "Austria": { code: "EUR", locale: "de-AT" }, // Euro
  "Panama": { code: "PAB", locale: "es-PA" }, // Panamanian Balboa (USD also widely used)
  // Add more countries and their currency codes/locales as needed
};

const transarray = ["just invested", "has withdrawn", "is trading with"];

// ─── Component ──────────────────────────────────────────────────────────────────
export default function MatrixPopup() {
  const theme = useTheme(); // respects your ColorModeContext etc.
  const timer = useRef(); // stores setTimeout id
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  // Helper to pick a random item from an array
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  // Show a popup and queue the next one
  const enqueue = () => {
    // Generate a random plan amount between 500 and 100,000
    const minPlan = 500;
    const maxPlan = 100000;
    const randomPlanAmount =
      Math.floor(Math.random() * (maxPlan - minPlan + 1)) + minPlan;

    const name = pick(listNames);
    const country = pick(listCountries); // Pick a random country

    // Get currency information based on the selected country
    const currencyInfo = countryCurrencyMap[country] || { code: "USD", locale: "en-US" }; // Default to USD if country not found

    // Format the randomPlanAmount with the correct currency
    const formattedPlan = new Intl.NumberFormat(currencyInfo.locale, {
      style: "currency",
      currency: currencyInfo.code,
      minimumFractionDigits: 0, // No decimal places for whole dollar amounts
      maximumFractionDigits: 0, // No decimal places
    }).format(randomPlanAmount);

    // Assemble new message
    const transtypeselect = pick(transarray);
    const msg = `${name} from ${country} ${transtypeselect} the sum of ${formattedPlan} `;

    setMessage(msg);
    setOpen(true);

    // Hide after 10 s
    timer.current = setTimeout(() => setOpen(false), 8_000);

    // Schedule the *next* popup 8-40 s from now
    const nextDelay = Math.floor(Math.random() * (15_000 - 8_000 + 1)) + 8_000;
    timer.current = setTimeout(enqueue, nextDelay);
  };

  // Start the loop on mount; clean up on unmount
  useEffect(() => {
    enqueue();
    return () => clearTimeout(timer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Fade in={open} timeout={{ enter: 300, exit: 300 }}>
      <Paper
        elevation={6}
        sx={{
          position: "fixed",
          zIndex: 90,
          top: { xs: "10%", sm: "9%" },
          left: 20,
          px: 2,
          py: 0.5,
          width: { xs: "calc(100% - 50px)", sm: 400 },
          borderRadius: 2,
          fontSize: { xs: 16, sm: 18 },
          boxShadow: "0px 5px 13px rgba(0,0,0,0.3)",
          display: open ? "block" : "none",
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            gap: 1,
          }}
        >
          <Typography
            variant="body1"
            component="div"
            sx={{ flex: 1, color: theme.palette.text.primary }}
            // dangerouslySetInnerHTML={{ __html: message }}
          >
            {message}
          </Typography>

          {/* Replace the src with your own path in /public or wherever you store assets */}
          {/* <Box
            component="img"
            src={LogoImg}
            alt="icon"
            sx={{ width: { xs: 50, sm: 50 }, flexShrink: 0 }}
          /> */}
        </Box>
      </Paper>
    </Fade>
  );
}