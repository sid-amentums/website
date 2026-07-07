-- Seed data: all 12 articles from the legacy prototype, content verbatim.
-- Category/author/date fields from admin/js/admin.js DEFAULT_ARTICLES
-- (authoritative); body HTML from the richer article-overlay markup in
-- index.html (the admin.js `body` field was just a one-paragraph teaser).
-- Idempotent via on conflict (slug).

insert into public.articles (slug, title, category, author, summary, read_time, body, status, published_at)
values
(
  'neeraj-90m',
  $t$Neeraj Chopra Breaks 90m — India's Greatest Athletic Milestone$t$,
  'India News', 'Amentum Editorial',
  $s$On May 16, 2025, Neeraj Chopra became the first Indian athlete to throw beyond 90 metres — 90.23m at the Doha Diamond League.$s$,
  '8 min',
  $b$<p>On May 16, 2025, Neeraj Chopra achieved what Indian athletics had long dreamed of — throwing the javelin beyond 90 metres for the first time. The Olympic champion launched a 90.23m effort at the Doha Diamond League, setting a new Indian national record and joining the elite 90m+ club.</p><h4>The Throw That Changed Everything</h4><p>Chopra's 90.23m came on his second attempt at Khalifa International Stadium in Doha. Conditions were near-perfect — a cool evening, light wind, and a passionate crowd. When the javelin sailed past 90m, Chopra sank to his knees. The milestone had been elusive: his previous best of 89.94m had stood since 2022.</p><h4>What 90 Metres Means</h4><p>Fewer than 30 athletes in history have ever crossed 90 metres. The world record of 98.48m belongs to Jan Železný, set in 1996 — and Železný is now Chopra's personal coach. Chopra's 90.23m places him 24th on the all-time list and proves South Asian athletes can compete at the absolute technical ceiling of the event.</p><h4>What This Means for Indian Javelin</h4><p>At Amentum Sports, Chopra's milestone validates everything we're building toward with Mission 2028. His achievement will inspire a new generation of Indian throwers. The depth is growing — India's Sachin Yadav threw a personal best of 86.27m at Tokyo 2025 World Championships. The pipeline is real.</p>$b$,
  'published', '2025-05-16T00:00:00Z'
),
(
  'nc-classic',
  $t$NC Classic 2025: India Hosts Its First World Athletics Gold Level Event$t$,
  'India News', 'Amentum Editorial',
  $s$Neeraj Chopra won the inaugural NC Classic in Bengaluru with 86.18m — India's first-ever World Athletics Continental Tour Gold event.$s$,
  '7 min',
  $b$<p>The Sree Kanteerava Stadium in Bengaluru made history on July 5, 2025 — hosting India's first-ever World Athletics Continental Tour Gold Level (Category A) event. The NC Classic, co-organised by Neeraj Chopra, JSW Sports, AFI, and World Athletics, was a landmark moment for Indian athletics infrastructure.</p><h4>A Home Victory</h4><p>Chopra won with a best throw of 86.18m on his third attempt. Kenya's Julius Yego — 2015 World Champion and Rio 2016 Olympic silver medalist — finished second with a season's best 84.51m. A field of 12, including seven international stars, competed under Bengaluru floodlights.</p><h4>More Than Just a Competition</h4><p>The NC Classic proved India could host world-class athletics events. Neeraj's coach Jan Železný — the world record holder — was felicitated at the event. India's growing capacity to host international meets creates pathways for domestic athletes to compete against world-class fields without travelling abroad — exactly the infrastructure development that Amentum's Mission 2028 vision champions.</p>$b$,
  'published', '2025-07-05T00:00:00Z'
),
(
  'nadeem-olympic',
  $t$Arshad Nadeem's 92.97m Olympic Record — A New Era for South Asian Javelin$t$,
  'World Athletics', 'Amentum Editorial',
  $s$At Paris 2024, Arshad Nadeem threw 92.97m to win Olympic gold while Neeraj Chopra took silver with 89.45m.$s$,
  '7 min',
  $b$<p>August 8, 2024. The Stade de France. In a javelin final that will be discussed for decades, Arshad Nadeem of Pakistan launched a 92.97m throw — an Olympic record, an Asian record, and the sixth longest throw in the history of men's javelin. Neeraj Chopra answered with 89.45m to claim silver.</p><h4>The Rivalry That Captivated a Billion People</h4><p>Chopra became the most successful individual Indian Olympian in history with back-to-back Olympic medals. Nadeem's throw was the longest by any human since Germany's Johannes Vetter threw 97.76m in 2020. In a single Olympic competition, it was perhaps the greatest individual javelin performance in modern history.</p><h4>The South Asian Javelin Story</h4><p>Five years ago, no one from South Asia had ever stood on an Olympic javelin podium. Now India has two medals and Pakistan has one. The story of how javelin became dominant across the subcontinent — driven by talent from Punjab, Haryana, and Khyber Pakhtunkhwa — is one of sport's most remarkable transformations.</p>$b$,
  'published', '2024-08-08T00:00:00Z'
),
(
  'biomechanics',
  $t$The Biomechanics of a 90-Metre Throw: Grip, Run-up, Release$t$,
  $c$Pro's Playbook$c$, 'Amentum Training Team',
  $s$What separates an 80m thrower from a 90m thrower? Breaking down the four critical phases.$s$,
  '10 min',
  $b$<p>The difference between an 80-metre throw and a 90-metre throw is not primarily about strength. It is about the synchronisation of four biomechanical phases that, when executed in perfect sequence, generate the elastic energy and release angle needed for elite distances.</p><h4>Phase 1: The Approach Run</h4><p>The run-up accounts for 35-40% of final throw velocity. Elite throwers run at 8-9 m/s at the cross-step. The critical mistake for junior athletes is running too fast and losing body control. The javelin should be withdrawn fully during the last three strides. Elbow must stay high — below-shoulder elbow position is the most common fault Amentum's training team corrects in video analysis.</p><h4>Phase 2: Cross-Step and Blocking</h4><p>The cross-step creates the bow position — chest open, hips forward, throwing arm fully extended behind. The left leg (for right-handed throwers) must plant firmly as the block foot, creating a braking force that the upper body rotates against. This is the "loaded" moment.</p><h4>Phase 3: The Delivery</h4><p>Throwing sequence is sequential: hip rotation first, then torso, then shoulder, then elbow, then wrist. The release angle for maximum distance is approximately 33-36 degrees above horizontal. Too steep wastes energy in altitude; too flat creates premature landing.</p><h4>Phase 4: Follow-Through</h4><p>A complete follow-through ensures maximum energy is transferred to the javelin and reduces shoulder injury risk. The throwing arm should follow through across the body, hips rotating fully through to the target. Fix three common issues — incomplete withdrawal, low elbow, insufficient blocking — and you typically gain 5-8 metres.</p>$b$,
  'published', '2025-06-01T00:00:00Z'
),
(
  'zelezny-record',
  $t$Jan Železný's 98.48m — Why the World Record Has Stood for 30 Years$t$,
  'World Athletics', 'Amentum Editorial',
  $s$Set in Jena, Germany in May 1996, the men's javelin world record remains one of sport's most enduring marks.$s$,
  '9 min',
  $b$<p>On May 25, 1996, at the Ernst-Abbe-Sportfeld in Jena, Germany, Jan Železný of Czech Republic launched a javelin 98.48 metres. Nearly three decades later, it remains the men's javelin world record. This is the story of why it may never be broken.</p><h4>The Perfect Storm</h4><p>Three things converged simultaneously. Železný was at the peak of his powers — three-time Olympic champion, four-time world record holder. The stadium was nearly open on one side, allowing a near-perfect legal tailwind. The throw itself was technically flawless — run-up speed of ~9.2 m/s, release angle of 34 degrees, and a carry that even Železný has struggled to fully explain.</p><h4>How Close Has Anyone Come?</h4><p>Germany's Johannes Vetter came closest. In 2020, he threw 97.76m in Chorzow, Poland — missing the record by less than a metre. Vetter also threw 96.29m, 95.97m, and 94.56m that same season. By conventional analysis, he should have broken it — but conditions never aligned as they did for Železný in Jena.</p><h4>Neeraj's Coach Holds the Record</h4><p>The most extraordinary subplot: Jan Železný — world record holder since 1996 — is now the personal coach of India's Neeraj Chopra. Under Železný's tutelage, Chopra crossed 90 metres for the first time in 2025. The Czech legend who set an apparently unbreakable record is now training the man most likely to one day threaten it.</p>$b$,
  'published', '2025-03-01T00:00:00Z'
),
(
  'ajc-2024',
  $t$Amentum Javelin Championship 2024 — Grassroots Glory Across India$t$,
  'Amentum in Action', 'Amentum Sports',
  $s$Our flagship annual competition attracted athletes from 18+ states. Multiple talents went on to compete at national level.$s$,
  '5 min',
  $b$<p>The Amentum Javelin Championship (AJC) returned for its third edition in 2024, cementing its place as India's most significant dedicated grassroots javelin event. Athletes from 18+ states descended on the competition across six age categories — U-14 to Open — in what has become the most important talent-identification event in Indian junior javelin.</p><h4>Results and Talent</h4><p>This year's event produced outstanding throws across categories. In U-18 boys, multiple athletes broke the 75m barrier. The Open Women's category saw two competitors exceed 48m — reflecting growing depth of female javelin throwers discovering the sport through Amentum's grassroots programme.</p><h4>Winners and Prizes</h4><p>Every category winner received an Amentum javelin matched to their age group and gender — not a certificate, but the actual tool they need to continue competing. Runners-up received Amentum training kit and three months' access to our online coaching programme.</p><h4>AJC 2026 Registration</h4><p>Registration for AJC 2026 opens in early 2026. All athletes — regardless of ability — are welcome. Coaches, academies, and sports bodies interested in partnering or hosting a regional qualifier: contact us on WhatsApp at +91 9827654830.</p>$b$,
  'published', '2024-04-01T00:00:00Z'
),
(
  'india-depth',
  $t$India's New Javelin Depth: From Neeraj Chopra to Sachin Yadav and Beyond$t$,
  'India News', 'Amentum Editorial',
  $s$India's javelin scene is no longer a one-man show. Sachin Yadav's 86.27m PB at Tokyo 2025 signals genuine international depth.$s$,
  '7 min',
  $b$<p>For most of the past decade, India's javelin story had one protagonist. Neeraj Chopra. But 2025 has started to change the narrative. India is no longer a one-man show.</p><h4>Sachin Yadav's Breakthrough</h4><p>At the World Athletics Championships in Tokyo in September 2025, Sachin Yadav finished 4th with a personal best of 86.27m — narrowly missing a podium that included gold medalist Julian Weber (Germany). A 4th-place World Championship finish is elite. Yadav's trajectory suggests 88-90m is achievable within three years.</p><h4>The Emerging Pipeline</h4><p>Beyond Yadav, India has multiple athletes in the 78-84m range. The AFI National Championships has seen several under-23 athletes exceed 75m — distances that would have placed them in the national top five just five years ago. The sport is expanding rapidly at the base.</p><h4>What Amentum Is Doing</h4><p>Our Mission 2028 programme identifies talented athletes through the Amentum Javelin Championship, provides proper equipment (from ₹1,180 for grassroots Mini-Javelins to ₹26,000 for elite competition models), connects them to online coaching, and supports their progression toward national competition.</p>$b$,
  'published', '2025-09-01T00:00:00Z'
),
(
  'injury-prevention',
  $t$Injury Prevention for Javelin Athletes: Shoulder, Elbow, and Wrist$t$,
  $c$Pro's Playbook$c$, 'Amentum Training Team',
  $s$The javelin throw generates enormous forces. Evidence-based prevention strategies from Amentum's training programme.$s$,
  '8 min',
  $b$<p>The javelin throw generates some of the highest forces of any throwing event. The shoulder joint experiences enormous stress through delivery — up to 7,500 Newton-centimetres of torque in elite throwers. Without proper technique and conditioning, injury is a matter of when, not if.</p><h4>Most Common Injuries</h4><p><strong>Shoulder:</strong> Rotator cuff impingement results from high elbow position combined with insufficient external rotation during withdrawal. Many Indian junior athletes develop these by throwing adult-weight javelins before their bodies are ready.</p><p><strong>Elbow:</strong> Medial epicondylitis (golfer's elbow) results from the valgus stress during delivery. Inadequate warm-up, poor technique, and too many maximal efforts are the primary causes.</p><p><strong>Wrist:</strong> Overuse in the flexor tendons, occasionally stress fractures of the radius, seen in athletes who train with excessive volume.</p><h4>Prevention Strategies</h4><p><strong>Appropriate implement weight:</strong> The most important strategy. This is why Amentum designed the Vayuj Mini-Javelin (300g/400g) and Gold Kids (500g) — appropriate implements for appropriate development stages.</p><p><strong>Shoulder conditioning:</strong> Regular rotator cuff strengthening (external rotation, Y/T/W exercises) must be part of every javelin athlete's programme. These muscles require isolated work.</p><p><strong>Volume management:</strong> Never more than two maximum-effort throwing sessions per week. Competition-intensity throws should constitute no more than 20% of total volume.</p>$b$,
  'published', '2025-04-01T00:00:00Z'
),
(
  'special-olympics',
  $t$Special Olympics Bharat Partnership: Teaching Mini-Javelin Across India$t$,
  'Amentum in Action', 'Amentum Sports',
  $s$As the official Mini-Javelin partner of Special Olympics India, Amentum trained coaches nationwide.$s$,
  '5 min',
  $b$<p>When Amentum Sports became the official Mini-Javelin partner of Special Olympics India, we committed to training coaches across the country on how to teach Mini-Javelin throwing to specially-abled athletes — safely, effectively, and with joy.</p><h4>What is Mini-Javelin?</h4><p>The Vayuj uses a safe rubber tip and aerodynamic fin design that allows children or athletes with limited mobility to experience the thrill of throwing. At 300g or 400g and ~60cm long, it can be thrown in gymnasiums, school halls, or outdoor fields without safety concerns.</p><h4>The Coach Training Programme</h4><p>Amentum designed a one-day certification workshop covering: basic throwing mechanics for differently-abled athletes, adapting technique cues for various physical and cognitive needs, safety protocols, equipment care, and competition formats. Coaches receive a Mini-Javelin coaching certificate from Amentum Sports and Special Olympics Bharat, plus a starter kit of Vayuj 300g javelins.</p><h4>Impact</h4><p>Since the partnership began, Amentum has trained coaches across multiple states. Special Olympics India's athletics programmes have reported significant participation increases in javelin. Several athletes who began in Mini-Javelin have progressed to competition-weight javelins and now compete at regional Special Olympics events.</p>$b$,
  'published', '2025-02-01T00:00:00Z'
),
(
  'business-of-javelin',
  $t$The Business of Javelin in India: Why It's Finally Happening$t$,
  'Industry Deep Dive', 'Amentum Editorial',
  $s$From Neeraj Chopra's Tokyo gold to proliferating grassroots competition, India's javelin ecosystem is at an inflection point.$s$,
  '9 min',
  $b$<p>Before 2021, a javelin brand focused entirely on the Indian market would have seemed unusual. The sport had produced individual talent but no system, no infrastructure, and no commercial ecosystem. Amentum Sports was founded on the belief that this was about to change.</p><h4>The Chopra Effect</h4><p>Neeraj Chopra's Tokyo 2021 Olympic gold was India's first athletics gold and only the second individual gold in Olympic history. Within weeks, hundreds of academies across India reported inquiries from parents wanting to enroll children in javelin training. The AFI reported a surge in junior registrations. For a company selling javelins in India, this was a market-creating moment.</p><h4>The Supply Problem</h4><p>India had no domestic javelin manufacturers. All javelins were imported — primarily from Hungary (Nemeth), Poland (Polanik), Sweden (Nordic), and Germany. Import duties of 15-30% made international-grade javelins prohibitively expensive. Amentum's response: design and manufacture in India, for Indian conditions and budgets, while maintaining international quality. Result: a full range from ₹1,180 to ₹26,000.</p><h4>The Path to 2028</h4><p>India's javelin ecosystem in 2025 is fundamentally different from 2020. Dedicated grassroots competitions (Amentum Javelin Championship), structured online training, accessible equipment at every price point, and multiple athletes operating at international level. Mission 2028 is not a marketing slogan — it is an operational plan to build the ecosystem that makes multiple Olympic medals possible.</p>$b$,
  'published', '2025-01-01T00:00:00Z'
),
(
  'choosing-javelin',
  $t$Choosing the Right Javelin: A Complete Guide for Indian Athletes$t$,
  'Equipment Guide', 'Amentum Product Team',
  $s$Weight, stiffness, balance point, aerodynamics — choosing a javelin is more technical than most coaches realise.$s$,
  '11 min',
  $b$<p>Choosing the right javelin is one of the most consequential decisions an athlete and coach can make — and one of the least discussed in Indian athletics. The wrong implement can cost several metres of distance and potentially years of wasted development.</p><h4>Key Specifications</h4><p><strong>Weight:</strong> Competition rules specify 800g (senior men), 600g (senior women), 700g (U-20 men), 500g (U-17 girls). Training javelins can be any weight — heavier training implements build specific strength for lighter competition models.</p><p><strong>Flex (Stiffness):</strong> The most misunderstood variable. Stiffer (Low Flex) suits high-velocity, technically advanced throwers — energy transfers without bending. Softer javelins are forgiving for beginners. Amentum classifies products as Soft, Medium, Low, or Medium-Low.</p><h4>Selection by Level</h4><p><strong>Beginner (under 50m):</strong> Vayuj 300g/400g for children; Gold Kids (500g) for youth; Amentum Red (600g) for adult beginners.</p><p><strong>Developing (50-70m):</strong> Purple White or Amentum Red for training; Olympic Gold 600g (₹13,000) for first competition implement.</p><p><strong>Intermediate (70-80m):</strong> Olympic Gold 700/800g or Black Panther 600/700g.</p><p><strong>Advanced (80m+):</strong> Black Panther 800g for training; The Chhatrapati for competition.</p><p><strong>Elite (85m+):</strong> The Nalwa (AM-BLGR) — World Athletics Certified, 800g, 90m range. Also consider Nemeth or Polanik for international-standard competition.</p><p>Contact us on WhatsApp for a personalised equipment recommendation based on your current distance, age, and training frequency.</p>$b$,
  'published', '2025-05-01T00:00:00Z'
),
(
  'la2028',
  $t$India at LA 2028: What It Will Take for Multiple Javelin Medals$t$,
  'Mission 2028', 'Amentum Editorial',
  $s$Neeraj Chopra showed India can win Olympic gold. Can the country build a team for multiple medals at Los Angeles?$s$,
  '12 min',
  $b$<p>When Neeraj Chopra won gold in Tokyo and silver in Paris, India became a permanent fixture in Olympic javelin discussion. The question for Los Angeles 2028 is whether India produces one champion or a sporting system.</p><h4>The Talent Is There</h4><p>The 2025 World Athletics Championships showed India's depth. Sachin Yadav finished 4th. Neeraj has a 90.23m PB. India has at least two athletes capable of competing for medals at LA 2028 — potentially three or four by the time Los Angeles arrives.</p><h4>What Needs to Change</h4><p><strong>Coaching infrastructure:</strong> India still has few coaches with technical knowledge to develop 80m+ throwers. The athletes from Punjab and Haryana self-coaching their way to 75m need structured technical coaching to leap to 85m+.</p><p><strong>Equipment access:</strong> Too many Indian athletes still throw improvised implements or adult-weight javelins before they are ready. Amentum's Vayuj and Gold Kids ranges address this, but wider distribution through school sports systems is needed.</p><p><strong>Competition pathways:</strong> The AJC and NC Classic are excellent models. More such competitions at state and district level are needed to create the match experience that turns talented athletes into elite competitors.</p><h4>Mission 2028: Amentum's Commitment</h4><p>Amentum Sports exists to build this ecosystem. Equipment. Coaching access. Competition. Athlete management. Structured pathways from Mini-Javelin to podium. We believe India will stand on the Los Angeles 2028 podium with more than one javelin medallist.</p>$b$,
  'published', '2024-10-01T00:00:00Z'
)
on conflict (slug) do update set
  title = excluded.title,
  category = excluded.category,
  author = excluded.author,
  summary = excluded.summary,
  read_time = excluded.read_time,
  body = excluded.body,
  status = excluded.status,
  published_at = excluded.published_at,
  updated_at = now();
