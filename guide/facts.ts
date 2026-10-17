// Fact sheets the guide is allowed to draw from. Gemini rewrites these in a
// fun voice but must not add anything that isn't listed here.
//
// DRAFT: written from well-documented public history. Have a teammate check
// each line against a source (Wikipedia + one biography/museum page is fine)
// before the demo, and delete anything you can't confirm.

export type FactSheet = {
  life: readonly string[];
  work: readonly string[];
  legacy: readonly string[];
};

export const FACTS: Record<string, FactSheet> = {
  "ada-lovelace": {
    life: [
      "Born Augusta Ada Byron on 10 December 1815 in London; died in 1852 at age 36.",
      "Her father was the poet Lord Byron, but he left when she was a baby; her mother pushed her to study math and science.",
      "Her tutors included the mathematician Augustus De Morgan.",
      "She met inventor Charles Babbage in 1833, when she was 17.",
      "She described her approach to math as \"poetical science\".",
    ],
    work: [
      "Babbage designed the Analytical Engine, a mechanical general-purpose computer that was never built in her lifetime; it was to be controlled by punched cards, an idea borrowed from the Jacquard loom.",
      "In 1842-43 she translated an article about the engine by Luigi Menabrea and added her own Notes, which were about three times longer than the article.",
      "Her Note G laid out a step-by-step method for the engine to calculate Bernoulli numbers, often called the first published computer program.",
      "She wrote that the engine weaves algebraic patterns just as the Jacquard loom weaves flowers and leaves.",
      "She imagined such a machine could work with more than numbers, for example composing music, if rules could be written for it.",
    ],
    legacy: [
      "The programming language Ada, developed for the U.S. Department of Defense, was named after her.",
      "Ada Lovelace Day is celebrated every October to honor women in science and technology.",
      "Her work helped establish the idea of a general-purpose computer that follows instructions, including repeating steps (loops).",
      "In 1950 Alan Turing discussed \"Lady Lovelace's Objection\" (that machines can only do what we tell them) in his paper on machine intelligence.",
    ],
  },
  "hedy-lamarr": {
    life: [
      "Born Hedwig Kiesler on 9 November 1914 in Vienna, Austria; died in 2000.",
      "She became a film star, moving to the United States and signing with the studio MGM in the late 1930s.",
      "She was a self-taught inventor who tinkered in her spare time alongside her acting career.",
      "She became a U.S. citizen in 1953.",
    ],
    work: [
      "With composer George Antheil she designed a secret communication system for radio-guided torpedoes during World War II.",
      "Their idea was frequency hopping: the transmitter and receiver switch together between radio frequencies so the signal is hard to jam or intercept.",
      "Antheil had experience synchronizing player pianos, and their design used a paper roll, like a player-piano roll, to keep both sides hopping in sync.",
      "They received U.S. patent 2,292,387 in 1942.",
      "The Navy did not use it at the time.",
    ],
    legacy: [
      "Frequency hopping and related spread-spectrum ideas later became important in secure and reliable wireless communication, including Bluetooth.",
      "She received the Electronic Frontier Foundation's Pioneer Award in 1997.",
      "She was inducted into the National Inventors Hall of Fame in 2014.",
      "Her birthday, 9 November, is celebrated as Inventors' Day in Germany, Austria and Switzerland.",
    ],
  },
  "joan-clarke": {
    life: [
      "Born 24 June 1917 in London; died in 1996.",
      "She studied mathematics at Newnham College, Cambridge, and earned top (first-class) honors.",
      "She was recruited to the codebreaking center at Bletchley Park in 1940.",
      "Because of the rules of the time, women could not be paid as cryptanalysts, so she was officially graded as a \"linguist\" despite doing the same work as the men.",
      "She became deputy head of Hut 8.",
      "She was awarded an MBE in 1947.",
    ],
    work: [
      "She worked in Hut 8, which broke the German Navy's Enigma messages, alongside Alan Turing.",
      "Enigma was a machine that scrambled messages electrically, with settings that changed every day.",
      "Codebreaking meant strict logical deduction, such as testing a guess about a message and ruling out settings that contradicted it.",
      "Turing's Banburismus method used statistics to cut down how many Enigma settings had to be tested, and she was highly skilled at it.",
    ],
    legacy: [
      "Breaking German naval Enigma helped the Allies protect supply ships crossing the Atlantic.",
      "Historians estimate that Bletchley Park's codebreaking shortened the war by around two years.",
      "She was portrayed by Keira Knightley in the 2014 film The Imitation Game.",
      "Her story, like those of many women at Bletchley Park, was little known for decades because the work was kept secret.",
    ],
  },
  "hidden-figures": {
    life: [
      "Dorothy Vaughan (1910-2008) was a math teacher before joining NASA's predecessor, NACA, at Langley in 1943.",
      "Mary Jackson (1921-2005) became NASA's first Black female engineer in 1958.",
      "Katherine Johnson (1918-2020) graduated from college at 18 and joined NACA at Langley in 1953.",
      "In the 1940s and 50s at Langley, Black women mathematicians worked in a segregated unit called West Area Computing.",
      "Mary Jackson needed special permission to attend engineering classes at a segregated school in Hampton, Virginia.",
    ],
    work: [
      "Dorothy Vaughan became the first Black supervisor at NACA, leading the West Area Computing group.",
      "When electronic computers arrived, Vaughan taught herself FORTRAN, an early programming language, and taught it to her team.",
      "Mary Jackson worked on wind-tunnel experiments about how air flows around aircraft.",
      "Katherine Johnson calculated the flight path (trajectory) for Alan Shepard's 1961 flight, the first American in space.",
      "Before his 1962 orbit of Earth, astronaut John Glenn asked for Katherine Johnson to double-check the computer's numbers.",
    ],
    legacy: [
      "Their story was told in Margot Lee Shetterly's 2016 book Hidden Figures and the 2016 film of the same name.",
      "Katherine Johnson received the Presidential Medal of Freedom in 2015.",
      "In 2019 Congress awarded the Congressional Gold Medal to Katherine Johnson, Dorothy Vaughan, Mary Jackson and Christine Darden.",
    ],
  },
  "margaret-hamilton": {
    life: [
      "Born 17 August 1936 in Paoli, Indiana; she studied mathematics at Earlham College.",
      "She worked at MIT writing programs for weather prediction before joining the Apollo project.",
      "She led the software engineering team at MIT's Instrumentation Laboratory (later Draper Laboratory) that wrote the Apollo flight software.",
      "She has said she helped popularize the term \"software engineering\" to give the new field the same respect as other kinds of engineering.",
    ],
    work: [
      "The Apollo guidance computer had very little memory, so the software had to be extremely efficient.",
      "Her team designed the software to run tasks by priority, so the most important jobs always got done first.",
      "During the Apollo 11 landing on 20 July 1969, the computer showed 1201 and 1202 alarms because it was overloaded with extra work.",
      "Thanks to the priority design, it dropped lower-priority tasks and kept running the landing tasks, and Mission Control decided to continue the landing.",
      "She pushed for the software to detect and recover from errors rather than assuming nothing would go wrong.",
    ],
    legacy: [
      "She received the Presidential Medal of Freedom in 2016.",
      "A famous photo shows her standing next to a stack of printed Apollo code about as tall as she is.",
      "Priority scheduling and error recovery are core ideas in modern operating systems and safety-critical software.",
      "NASA gave her its Exceptional Space Act Award in 2003.",
    ],
  },
  "adele-goldberg": {
    life: [
      "Born in 1945 in Cleveland, Ohio.",
      "She studied mathematics at the University of Michigan and earned a PhD in information science from the University of Chicago in 1973.",
      "She joined Xerox PARC, a famous research lab, in 1973.",
      "She served as president of the Association for Computing Machinery (ACM) from 1984 to 1986.",
      "She co-founded the company ParcPlace Systems in 1988.",
    ],
    work: [
      "At Xerox PARC she was a key member of the team that created Smalltalk, one of the first object-oriented programming languages.",
      "In Smalltalk, a class is a blueprint, and objects are individual things built from that blueprint that send messages to each other.",
      "Smalltalk came with a graphical environment with windows, menus and a mouse.",
      "She co-wrote the books Smalltalk-80: The Language and its Implementation (with David Robson) and Smalltalk-80: The Interactive Programming Environment.",
      "She focused on making computers and programming usable for learners, including children.",
    ],
    legacy: [
      "Smalltalk influenced many later languages, including Objective-C, Java, Python and Ruby.",
      "Object-oriented programming with classes and objects is now one of the most common ways to organize software.",
      "The Smalltalk team received the ACM Software System Award in 1987.",
    ],
  },
};
