/* Zapis fonetyczny nazw stacji dla polskiego syntezatora (lektor TSW, głosy Marek / Zofia).
   Na ekranie zostaje oryginalna nazwa — zamiana dotyczy tylko tego, co czyta lektor.

   routes   — pełne nazwy stacji pogrupowane po trasach (dokładnie tak, jak podaje je OpenStreetMap / gra).
              Dłuższe nazwy wygrywają z krótszymi („Reading West” przed „Reading”). Działają w każdym kraju.
   wordsEn  — człony nazw angielskich (Wielka Brytania, USA): używane, gdy GPS gry pokazuje UK/USA.
   wordsDe  — człony nazw niemieckich (Niemcy, Austria, Szwajcaria), w tym polskie nazwy miast (Köln → Kolonia).
   words    — człony wspólne dla obu języków.
   Człony działają tylko od wielkiej litery i jako całe słowa (≥ 3 znaki) — nie ruszą polskich wyrazów.

   Nazwy spoza słownika lektor czyta wg reguł kraju trasy (tsw-msg.js): niemieckie (ei→aj, eu→oj, sch→sz, z→c, ü→i …)
   albo angielskie (-ham → -em, -ley → -li, -bury → -bery, sh → sz, th → t, w → ł …). Słownik ma zawsze pierwszeństwo.

   Zasady zapisu: angielskie „w” → „ł”, „th” → „t”, „sh” → „sz”, „ay/ey” → „ej”, nieme litery pomijamy (Slough → Slał,
   Lewes → Luis); niemieckie „ei” → „aj”, „eu/äu” → „oj”, „ie” → „i”, „sch” → „sz”, „z/tz” → „c”, „st/sp” na początku → „szt/szp”,
   „ü” → „y”, „ö” → „e”, „ß” → „s”. Duże miasta z przyjętą polską nazwą — po polsku (München → Monachium).
   Uwaga: głos Marek zmiękcza „chi” w „Monachium” (Whisper słyszy „Monasium” nawet bez obróbki) — zapis „Monachijum” 4/4.
   Ronkonkoma: „Ron-kon-ko-ma” 4/4 (bez podziału 0/4).
   Sprawdzone Whisperem (19.11.2026): nazwę uznajemy za dobrą, gdy rozpoznawanie mowy odtworzy z niej oryginał.
   Jak dopisać: dodaj blok w „routes” (albo w konsoli 2. monitora: TSW_PHON_ADD('Trasa', { 'Nazwa': 'Wymowa' })), wgraj portal, odśwież. */
window.TSW_PHON = {
  version: 14,
  routes: {
    /* ================================================================ WIELKA BRYTANIA */
    'Henley Branch (Great Western)': {
      'Henley-on-Thames': 'Henli on Tems', 'Henley on Thames': 'Henli on Tems', 'Shiplake': 'Szyplejk', 'Wargrave': 'Łorgrejw', 'Twyford': 'Tłajford',
    },
    'Great Western Express: Paddington – Reading – Oxford': {
      'London Paddington': 'Landon Pedington', 'Paddington': 'Pedington', 'Acton Main Line': 'Akton Mejn Lajn', 'Ealing Broadway': 'Iling Brodłej',
      'West Ealing': 'Łest Iling', 'Hanwell': 'Hanłel', 'Southall': 'Sałtol', 'Hayes & Harlington': 'Hejz end Harlington', 'Hayes and Harlington': 'Hejz end Harlington',
      'West Drayton': 'Łest Drejton', 'Iver': 'Ajwer', 'Langley': 'Lengli', 'Slough': 'Slał', 'Burnham': 'Bernam', 'Taplow': 'Teplou', 'Maidenhead': 'Mejdenhed',
      'Reading': 'Reding', 'Reading West': 'Reding Łest', 'Tilehurst': 'Tajlherst', 'Pangbourne': 'Pengbern', 'Goring & Streatley': 'Goring end Stritli',
      'Goring and Streatley': 'Goring end Stritli', 'Cholsey': 'Czolsi', 'Didcot Parkway': 'Didkot Parkłej', 'Didcot': 'Didkot', 'Appleford': 'Epelford',
      'Culham': 'Kalem', 'Radley': 'Redli', 'Oxford': 'Oksford', 'Heathrow Airport': 'Hitrou Erport', 'Heathrow': 'Hitrou',
    },
    'East Coastway (Brighton – Lewes – Eastbourne / Seaford)': {
      'Brighton': 'Brajton', 'London Road': 'Landon Roud', 'Moulsecoomb': 'Moulskum', 'Falmer': 'Falmer', 'Lewes': 'Luis', 'Southease': 'Sałtis',
      'Newhaven Town': 'Niuhejwen Tałn', 'Newhaven Harbour': 'Niuhejwen Harbor', 'Bishopstone': 'Biszopston', 'Seaford': 'Siford', 'Glynde': 'Glajnd',
      'Berwick': 'Berik', 'Polegate': 'Polgejt', 'Hampden Park': 'Hempden Park', 'Eastbourne': 'Istborn', 'Pevensey & Westham': 'Pewenzi end Łestem',
      'Bexhill': 'Bekshil', 'St Leonards Warrior Square': 'Sent Lenards Łorior Skłer', 'Hastings': 'Hejstings',
    },
    'Southeastern High Speed (St Pancras – Ashford / Faversham)': {
      'St Pancras International': 'Sent Pankras Internaszynal', 'London St. Pancras International': 'Landon Sent Pankras Internaszynal', 'London St Pancras International': 'Landon Sent Pankras Internaszynal', 'St. Pancras International': 'Sent Pankras Internaszynal', 'London St Pancras': 'Landon Sent Pankras', 'Stratford International': 'Stratford Internaszynal',
      'Ebbsfleet International': 'Ebsflit Internaszynal', 'Gravesend': 'Grejwzend', 'Strood': 'Strud', 'Rochester': 'Roczester', 'Chatham': 'Czetem',
      'Gillingham': 'Dżilingem', 'Rainham': 'Rejnem', 'Sittingbourne': 'Sitingborn', 'Faversham': 'Fawerszem', 'Ashford International': 'Eszford Internaszynal',
    },
    'Brighton Main Line (London Bridge – Brighton)': {
      'London Bridge': 'Landon Bridż', 'London Victoria': 'Landon Wiktorija', 'Victoria': 'Wiktorija', 'Blackfriars': 'Blekfrajers', 'Farringdon': 'Feringdon',
      'Clapham Junction': 'Klepem Dżankszyn', 'Balham': 'Balem', 'Norwood Junction': 'Norłud Dżankszyn', 'East Croydon': 'Ist Krojdon', 'Purley': 'Perli',
      'Redhill': 'Redhil', 'Gatwick Airport': 'Getłik Erport', 'Three Bridges': 'Tri Bridżyz', 'Haywards Heath': 'Hejłerds Hif', 'Burgess Hill': 'Berdżes Hil',
      'Hassocks': 'Hesoks', 'Preston Park': 'Preston Park',
    },
    'Bakerloo Line (London Underground)': {
      'Elephant & Castle': 'Elefant end Kasel', 'Lambeth North': 'Lambet Nort', 'Waterloo': 'Łoterlu', 'Embankment': 'Embenkment', 'Charing Cross': 'Czering Kros',
      'Piccadilly Circus': 'Pikadili Serkus', 'Oxford Circus': 'Oksford Serkus', "Regent's Park": 'Ridżents Park', 'Baker Street': 'Bejker Strit',
      'Marylebone': 'Marlibon', 'Edgware Road': 'Edżłer Roud', 'Warwick Avenue': 'Łorik Ewenju', 'Maida Vale': 'Mejda Wejl', 'Kilburn Park': 'Kilbern Park',
      "Queen's Park": 'Kłinz Park', 'Kensal Green': 'Kenzal Grin', 'Willesden Junction': 'Łilzden Dżankszyn', 'Harlesden': 'Harlzden',
      'Stonebridge Park': 'Stounbridż Park', 'Wembley Central': 'Łembli Sentral', 'North Wembley': 'Nort Łembli', 'South Kenton': 'Sałt Kenton',
      'Kenton': 'Kenton', 'Harrow & Wealdstone': 'Herou end Łildston',
    },
    'West Coast Main Line South (Euston – Milton Keynes)': {
      'London Euston': 'Landon Juston', 'Euston': 'Juston', 'Watford Junction': 'Łotford Dżankszyn', 'Kings Langley': 'Kings Lengli', 'Apsley': 'Epsli',
      'Hemel Hempstead': 'Hemel Hemsted', 'Berkhamsted': 'Berkemsted', 'Tring': 'Tring', 'Cheddington': 'Czedington', 'Leighton Buzzard': 'Lejton Bazard',
      'Bletchley': 'Bleczli', 'Milton Keynes Central': 'Milton Kins Sentral', 'Wolverton': 'Łulwerton', 'Northampton': 'Nortempton', 'Rugby': 'Ragbi', 'Crewe': 'Kru',
    },
    'East Coast Main Line (King’s Cross – Peterborough)': {
      "London King's Cross": 'Landon Kings Kros', "King's Cross": 'Kings Kros', 'Finsbury Park': 'Finzberi Park', 'Alexandra Palace': 'Aleksandra Peles',
      'New Southgate': 'Niu Sałtgejt', 'Oakleigh Park': 'Oukli Park', 'New Barnet': 'Niu Barnet', 'Hadley Wood': 'Hedli Łud', 'Potters Bar': 'Poters Bar',
      'Hatfield': 'Hetfild', 'Welham Green': 'Łelem Grin', 'Welwyn Garden City': 'Łelin Garden Siti', 'Welwyn North': 'Łelin Nort', 'Knebworth': 'Nebłert',
      'Stevenage': 'Stiwenidż', 'Hitchin': 'Hiczin', 'Arlesey': 'Arlzi', 'Biggleswade': 'Bigelsłejd', 'Sandy': 'Sendi', 'St Neots': 'Sent Nits',
      'Huntingdon': 'Hantingdon',
    },
    'Midland / East Coast Main Line (Leicester – Derby – Doncaster)': {
      'Leicester': 'Lester', 'Loughborough': 'Laf-bera', 'East Midlands Parkway': 'Ist Midlends Parkłej', 'Derby': 'Darbi', 'Nottingham': 'Notingem',
      'Long Eaton': 'Long Iton', 'Beeston': 'Biston', 'Peterborough': 'Piterbera', 'Grantham': 'Grentem', 'Newark North Gate': 'Niuark Nort Gejt',
      'Retford': 'Retford', 'Doncaster': 'Donkaster', 'Gloucester': 'Gloster', 'Worcester': 'Łuster',
    },
    'Liverpool – Crewe (Spirit of Steam)': {
      'Liverpool Lime Street': 'Liwerpul Lajm Strit', 'Edge Hill': 'Edż Hil', 'Mossley Hill': 'Mosli Hil', 'West Allerton': 'Łest Alerton',
      'Liverpool South Parkway': 'Liwerpul Sałt Parkłej', 'Hunts Cross': 'Hants Kros', 'Runcorn': 'Rankorn', 'Acton Bridge': 'Akton Bridż',
      'Hartford': 'Hartford', 'Winsford': 'Łinsford',
    },
    'Trans-Pennine / Northern (Manchester – Huddersfield – Leeds)': {
      'Manchester Victoria': 'Manczester Wiktorija', 'Manchester Piccadilly': 'Manczester Pikadili', 'Ashton-under-Lyne': 'Eszton ander Lajn',
      'Stalybridge': 'Stejlibridż', 'Mossley': 'Mosli', 'Greenfield': 'Grinfild', 'Marsden': 'Marzden', 'Slaithwaite': 'Slełet', 'Huddersfield': 'Hadersfild',
      'Deighton': 'Diton', 'Mirfield': 'Merfild', 'Ravensthorpe': 'Rejwenstorp', 'Dewsbury': 'Djuzbery', 'Batley': 'Batli', 'Morley': 'Morli',
      'Cottingley': 'Kotingli', 'Leeds': 'Lids',
    },
    'Glossop Line (Manchester Piccadilly – Glossop / Hadfield)': {
      'Ashburys': 'Eszberiz', 'Gorton': 'Gorton', 'Fairfield': 'Ferfild', 'Guide Bridge': 'Gajd Bridż', 'Flowery Field': 'Flauri Fild', 'Newton for Hyde': 'Niuton for Hajd',
      'Godley': 'Godli', 'Hattersley': 'Hetersli', 'Broadbottom': 'Brodbotom', 'Dinting': 'Dinting', 'Glossop': 'Glosop', 'Hadfield': 'Hedfild',
    },
    'Tees Valley Line (Darlington – Middlesbrough – Saltburn)': {
      'Darlington': 'Darlington', 'Middlesbrough': 'Midelzbra', 'Saltburn': 'Soltbern', 'Bishop Auckland': 'Biszop Okland', 'Thornaby': 'Tornabi',
      'Stockton': 'Stokton', 'Redcar Central': 'Redkar Sentral', 'Marske': 'Mask', 'Eaglescliffe': 'Iglzklif', 'Shildon': 'Szildon',
      'Newton Aycliffe': 'Niuton Ejklif', 'Heighington': 'Hiington', 'North Road': 'Nort Roud',
    },
    'Cathcart Circle (Glasgow)': {
      'Glasgow Central': 'Glazgoł Sentral', 'Pollokshields East': 'Polokszilds Ist', 'Pollokshields West': 'Polokszilds Łest', 'Queens Park': 'Kłinz Park',
      'Crosshill': 'Kroshil', 'Mount Florida': 'Maunt Florida', 'Cathcart': 'Katkart', 'Langside': 'Langsajd', 'Pollokshaws East': 'Polokszoz Ist',
      'Shawlands': 'Szolends', 'Crossmyloof': 'Krosmajluf', 'Muirend': 'Mjurend', 'Williamwood': 'Łiliemłud', 'Whitecraigs': 'Łajtkrejgz',
      'Patterton': 'Peterton', 'Neilston': 'Nilston', 'Maxwell Park': 'Makswel Park', 'Newton': 'Niuton', 'Kings Park': 'Kings Park', 'Croftfoot': 'Kroftfut',
    },
    'Birmingham Cross City Line': {
      'Lichfield Trent Valley': 'Liczfild Trent Weli', 'Lichfield City': 'Liczfild Siti', 'Shenstone': 'Szenston', 'Blake Street': 'Blejk Strit',
      'Butlers Lane': 'Batlers Lejn', 'Four Oaks': 'For Ouks', 'Sutton Coldfield': 'Saton Koldfild', 'Wylde Green': 'Łajld Grin', 'Chester Road': 'Czester Roud',
      'Erdington': 'Erdington', 'Gravelly Hill': 'Greweli Hil', 'Aston': 'Eston', 'Duddeston': 'Dadeston', 'Birmingham New Street': 'Bermingem Niu Strit',
      'Five Ways': 'Fajw Łejz', 'University': 'Juniwersiti', 'Selly Oak': 'Seli Ouk', 'Bournville': 'Bornwil', 'Kings Norton': 'Kings Norton',
      'Northfield': 'Nortfild', 'Longbridge': 'Longbridż', 'Barnt Green': 'Barnt Grin', 'Alvechurch': 'Olwczercz', 'Redditch': 'Redicz', 'Bromsgrove': 'Bromzgrouw',
    },
    'Isle of Wight (Island Line)': {
      'Ryde Pier Head': 'Rajd Pir Hed', 'Ryde Esplanade': 'Rajd Esplanejd', 'Ryde St Johns Road': 'Rajd Sent Dżons Roud', 'Smallbrook Junction': 'Smolbruk Dżankszyn',
      'Brading': 'Brejding', 'Sandown': 'Sandaun', 'Lake': 'Lejk', 'Shanklin': 'Szenklin',
    },
    'South Wales / Peak Forest': {
      'Bristol Temple Meads': 'Bristol Tempel Midz', 'Bristol Parkway': 'Bristol Parkłej', 'Severn Tunnel Junction': 'Sewern Tanel Dżankszyn', 'Newport': 'Niuport',
      'Cardiff Central': 'Kardif Sentral', 'Bridgend': 'Bridżend', 'Pyle': 'Pajl', 'Port Talbot Parkway': 'Port Tolbot Parkłej', 'Neath': 'Nif',
      'Swansea': 'Słonsi', 'Llanelli': 'Hlanełi', 'Buxton': 'Bakston', 'Chinley': 'Czinli', 'Peak Forest': 'Pik Forest',
    },
    'West Somerset Railway': {
      'Bishops Lydeard': 'Biszops Lidiard', 'Crowcombe Heathfield': 'Kroukom Hitfild', 'Stogumber': 'Stogamber', 'Williton': 'Łiliton', 'Watchet': 'Łoczet',
      'Washford': 'Łoszford', 'Blue Anchor': 'Blu Enkor', 'Dunster': 'Danster', 'Minehead': 'Majnhed',
    },
    'Wielka Brytania — duże miasta': {
      'London Waterloo': 'Landon Łoterlu', 'Southampton Central': 'Sałtempton Sentral', 'Bournemouth': 'Bornmut', 'Weymouth': 'Łejmut', 'Portsmouth': 'Portsmut',
      'Edinburgh': 'Edynburg', 'Edinburgh Waverley': 'Edynburg Łejwerli', 'York': 'Jork', 'Newcastle': 'Niukasel', 'Sheffield': 'Szefild', 'Liverpool': 'Liwerpul',
      'Manchester': 'Manczester', 'Birmingham': 'Bermingem', 'Glasgow': 'Glazgoł',
    },
    /* ================================================================ USA */
    'South Florida: Brightline / Tri-Rail (Miami – West Palm Beach)': {
      'Miami': 'Majami', 'MiamiCentral': 'Majami Sentral', 'Miami Central': 'Majami Sentral', 'Miami Airport': 'Majami Erport', 'Aventura': 'Awentura',
      'Fort Lauderdale': 'Fort Loderdejl', 'Fort Lauderdale Airport': 'Fort Loderdejl Erport', 'Boca Raton': 'Bouka Rejton', 'Pompano Beach': 'Pompanou Biicz', 'Delray Beach': 'Delrej Bicz',
      'Boynton Beach': 'Bojnton Bicz', 'Lake Worth Beach': 'Lejk Łert Bicz', 'West Palm Beach': 'Łest Pam Bicz', 'Mangonia Park': 'Mangonija Park',
      'Hialeah Market': 'Hajalija Market', 'Metrorail Transfer': 'Metrorejl Transfer', 'Opa-locka': 'Opa Loka', 'Golden Glades': 'Golden Glejdz',
      'Hollywood': 'Holiłud', 'Sheridan Street': 'Szeridan Strit', 'Cypress Creek': 'Sajpres Krik', 'Pompano Beach': 'Pompano Bicz', 'Deerfield Beach': 'Dirfild Bicz',
      'Orlando International Airport': 'Orlando Internaszynal Erport', 'Orlando': 'Orlando',
    },
    // warianty sprawdzone Whisperem (jazda AMTK 2172, 2026-11-19)
    'Northeast Corridor (Boston – Providence)': {
      'Providence': 'Prowidens', 'Pawtucket': 'Petakit', 'Pawtucket/Central Falls': 'Petakit, Sentral Fols', 'South Attleboro': 'Sałt Atelbero',
      'Attleboro': 'Atelbero', 'Mansfield': 'Mansfild', 'Sharon': 'Szaron', 'Canton Junction': 'Kantyn Dżankszyn', 'Canton Center': 'Kantyn Senter',
      'Stoughton': 'Stouton', 'Route 128': 'Rałt sto dwadzieścia osiem', 'Readville': 'Ridwil', 'Hyde Park': 'Hajd Park', 'Forest Hills': 'Forest Hils',
      'Ruggles': 'Ragels', 'Back Bay': 'Bek Bej', 'South Station': 'Sałt Stejszyn', 'Boston South Station': 'Boston, Sałt Stejszyn', 'Boston': 'Boston',
      'TF Green Airport': 'Ti Ef Grin Erport', 'T.F. Green Airport': 'Ti Ef Grin Erport', 'Wickford Junction': 'Wikford Dżankszyn',
    },
    'Northeast Corridor (New York – Trenton)': {
      'New York Penn Station': 'Nowy Jork Pen Stejszyn', 'New York': 'Nowy Jork', 'Newark Penn Station': 'Niuark Pen Stejszyn', 'Newark Penn': 'Niuark Pen',
      'Newark Liberty International Airport': 'Niuark Liberti Erport', 'Secaucus Junction': 'Sikokus Dżankszyn', 'Elizabeth': 'Elizabet', 'Linden': 'Linden',
      'Rahway': 'Rołej', 'Metropark': 'Metropark', 'Metuchen': 'Metaczen', 'Edison': 'Edison', 'New Brunswick': 'Niu Branzłik', 'Princeton Junction': 'Prinston Dżankszyn',
      'Hamilton': 'Hemilton', 'Trenton': 'Trenton', 'Philadelphia': 'Filadelfia',
    },
    'Harlem Line (Grand Central – Southeast)': {
      'Grand Central Terminal': 'Grend Sentral Terminal', 'Grand Central': 'Grend Sentral', 'Fordham': 'Fordem', 'Woodlawn': 'Łudlon', 'Wakefield': 'Łejkfild',
      'Mount Vernon West': 'Maunt Wernon Łest', 'Bronxville': 'Bronkswil', 'Tuckahoe': 'Takahou', 'Crestwood': 'Krestłud', 'Scarsdale': 'Skarsdejl',
      'Hartsdale': 'Hartsdejl', 'White Plains': 'Łajt Plejnz', 'North White Plains': 'Nort Łajt Plejnz', 'Valhalla': 'Walhala', 'Pleasantville': 'Plezentwil',
      'Chappaqua': 'Czepakła', 'Mount Kisco': 'Maunt Kisko', 'Bedford Hills': 'Bedford Hils', 'Katonah': 'Katona', 'Goldens Bridge': 'Goldens Bridż',
      "Purdy's": 'Perdiz', 'Croton Falls': 'Kroton Fols', 'Brewster': 'Bruster', 'Southeast': 'Sałtist',
    },
    'Long Island Rail Road': {
      'Penn Station': 'Pen Stejszyn', 'Atlantic Terminal': 'Atlantik Terminal', 'Jamaica': 'Dżamejka', 'Woodside': 'Łudsajd', 'Forest Hills': 'Forest Hils',
      'Kew Gardens': 'Kju Gardens', 'Hicksville': 'Hikswil', 'Mineola': 'Miniola', 'Babylon': 'Babilon', 'Ronkonkoma': 'Ron-kon-ko-ma', 'Hempstead': 'Hemsted',
      'Long Beach': 'Long Bicz', 'Valley Stream': 'Weli Strim', 'Freeport': 'Friport', 'Hunterspoint Avenue': 'Hanters Pojnt Ewenju',
    },
    'Cajon Pass / Sand Patch Grade': {
      'San Bernardino': 'San Bernardino', 'Barstow': 'Barstou', 'Victorville': 'Wiktorwil', 'Hesperia': 'Hesperija', 'Cajon': 'Kahon', 'Summit': 'Samit',
      'Cumberland': 'Kamberlend', 'Meyersdale': 'Majersdejl', 'Rockwood': 'Rokłud', 'Sand Patch': 'Send Pecz', 'Connellsville': 'Koneliswil', 'Hyndman': 'Hajndmen',
    },
    'Peninsula Corridor (San Francisco – San Jose)': {
      'San Francisco': 'San Francisko', 'Bayshore': 'Bejszor', 'South San Francisco': 'Sałt San Francisko', 'San Bruno': 'San Bruno', 'Millbrae': 'Milbrej',
      'Burlingame': 'Berlingejm', 'San Mateo': 'San Mateo', 'Hillsdale': 'Hilsdejl', 'Belmont': 'Belmont', 'San Carlos': 'San Karlos', 'Redwood City': 'Redłud Siti',
      'Menlo Park': 'Menlo Park', 'Palo Alto': 'Palo Alto', 'California Avenue': 'Kalifornija Ewenju', 'Mountain View': 'Mauntin Wju', 'Sunnyvale': 'Saniwejl',
      'Lawrence': 'Lorens', 'Santa Clara': 'Santa Klara', 'San Jose Diridon': 'San Hozej Diridon', 'San Jose': 'San Hozej',
    },
    /* ================================================================ NIEMCY / AUSTRIA / SZWAJCARIA */
    'Hauptstrecke Hamburg – Lübeck': {
      'Hamburg Hbf': 'Hamburg, dworzec główny', 'Hamburg-Hasselbrook': 'Hamburg Haselbruk', 'Hamburg-Wandsbek': 'Hamburg Wandsbek', 'Ahrensburg': 'Arensburg',
      'Ahrensburg-Gartenholz': 'Arensburg Gartenholc', 'Bargteheide': 'Barkthajde', 'Bad Oldesloe': 'Bad Oldeslo', 'Reinfeld (Holstein)': 'Rajnfeld',
      'Reinfeld': 'Rajnfeld', 'Lübeck Hbf': 'Lubeka, dworzec główny',
    },
    'Ruhr-Sieg (Hagen – Finnentrop – Siegen)': {
      'Hagen Hbf': 'Hagen, dworzec główny', 'Hohenlimburg': 'Hoenlimburg', 'Letmathe': 'Letmate', 'Iserlohn-Letmathe': 'Izerlon Letmate', 'Altena (Westf)': 'Altena',
      'Werdohl': 'Werdol', 'Plettenberg': 'Pletenberg', 'Finnentrop': 'Finentrop', 'Lennestadt-Grevenbrück': 'Lenesztat Grewenbryk',
      'Lennestadt-Altenhundem': 'Lenesztat Altenhundem', 'Welschen Ennest': 'Welszen Enest', 'Kreuztal': 'Krojctal', 'Siegen-Weidenau': 'Zigen Wajdenau',
      'Siegen Hbf': 'Zigen, dworzec główny', 'Siegen': 'Zigen',
    },
    'Main-Spessart-Bahn (Würzburg – Aschaffenburg)': {
      'Würzburg Hbf': 'Wyrcburg, dworzec główny', 'Retzbach-Zellingen': 'Recbach Celingen', 'Karlstadt (Main)': 'Karlsztat', 'Gemünden (Main)': 'Gemynden',
      'Lohr Bahnhof': 'Lor', 'Lohr': 'Lor', 'Partenstein': 'Partensztajn', 'Laufach': 'Laufach', 'Heigenbrücken': 'Hajgenbryken', 'Hösbach': 'Hesbach',
      'Aschaffenburg Hbf': 'Aszafenburg, dworzec główny', 'Aschaffenburg': 'Aszafenburg', 'Goldbach': 'Goldbach',
    },
    'Rhein-Ruhr (Wuppertal – Hagen – Dortmund – Essen)': {
      'Wuppertal Hbf': 'Wupertal, dworzec główny', 'Wuppertal-Oberbarmen': 'Wupertal Oberbarmen', 'Schwelm': 'Szwelm', 'Gevelsberg': 'Gefelsberg',
      'Witten Hbf': 'Witen, dworzec główny', 'Bochum Hbf': 'Bochum, dworzec główny', 'Essen Hbf': 'Esen, dworzec główny', 'Dortmund Hbf': 'Dortmund, dworzec główny',
      'Gelsenkirchen Hbf': 'Gelzenkirchen, dworzec główny', 'Wanne-Eickel Hbf': 'Wane Ajkel, dworzec główny', 'Duisburg Hbf': 'Djusburg, dworzec główny',
      'Düsseldorf Hbf': 'Diseldorf, dworzec główny', 'Mülheim (Ruhr) Hbf': 'Milhajm, dworzec główny',
    },
    'Linke Rheinstrecke (Köln – Koblenz – Mainz)': {
      'Koblenz Hbf': 'Koblencja, dworzec główny', 'Boppard': 'Bopart', 'St. Goar': 'Sankt Goar', 'Oberwesel': 'Oberwezel', 'Bacharach': 'Bacharach',
      'Bingen (Rhein) Hbf': 'Bingen, dworzec główny', 'Bingen (Rhein)': 'Bingen', 'Mainz Hbf': 'Moguncja, dworzec główny', 'Andernach': 'Andernach',
      'Remagen': 'Remagen', 'Bonn Hbf': 'Bonn, dworzec główny', 'Bonn-Bad Godesberg': 'Bonn Bad Godesberg', 'Brohl': 'Brol',
    },
    // Vorarlberg / Lindau (S1, jazda 19.11.2026) — warianty wybrane Whisperem
    'Vorarlberg (Lindau – Bregenz – Bludenz)': {
      'Lindau-Insel': 'Lindau, Inzel', 'Lindau-Aeschach': 'Lindau, Eszach', 'Lindau-Reutin': 'Lindau, Rojtin', 'Götzis': 'Getzis',
      'Schwarzach in Vorarlberg': 'Szwarcach, Forarlberg', 'Klaus in Vorarlberg': 'Klaus, Forarlberg', 'Bregenz': 'Bregenc', 'Bregenz Hafen': 'Bregenc, Hafen',
      'Dornbirn Schoren': 'Dornbirn, Szoren', 'Sulz-Röthis': 'Sulc, Retis', 'Lauterach Unterfeld': 'Lauterach, Unterfeld',
    },
    'Köln – Aachen': {
      'Köln Hbf': 'Kolonia, dworzec główny', 'Köln Messe/Deutz': 'Kolonia Mese Dojc', 'Köln-Ehrenfeld': 'Kolonia Erenfeld',
      'Köln-Müngersdorf Technologiepark': 'Kolonia Myngersdorf', 'Köln-Müngersdorf/Technologiepark': 'Kolonia Myngersdorf', 'Horrem': 'Horem', 'Sindorf': 'Zindorf', 'Buir': 'Buir', 'Düren': 'Dyren',
      'Langerwehe': 'Langerwee', 'Eschweiler Hbf': 'Eszwajler, dworzec główny', 'Stolberg (Rheinl) Hbf': 'Sztolberg, dworzec główny',
      'Aachen-Rothe Erde': 'Akwizgran Rote Erde', 'Aachen Hbf': 'Akwizgran, dworzec główny',
      // jazda ICE 10 (19.11.2026): przystanki S-Bahn na linii
      'Köln-Lövenich': 'Kolonia Lewenich', 'Lövenich': 'Lewenich', 'Frechen-Königsdorf': 'Frechen, Kenigsdorf', 'Merzenich': 'Mercenich',
      'Köln-Weiden West': 'Kolonia Wajden West', 'Kerpen-Horrem': 'Kerpen Horem', 'Kerpen-Sindorf': 'Kerpen Zindorf',
      'Köln Hansaring': 'Kolonia Hanzaring', 'Köln-Nippes': 'Kolonia Nipes', 'Köln West': 'Kolonia West', 'Köln Süd': 'Kolonia Zjud',
    },
    'Dresden / Leipzig – Dresden': {
      'Dresden Hbf': 'Drezno, dworzec główny', 'Dresden-Neustadt': 'Drezno Nojsztat', 'Dresden Mitte': 'Drezno Mite', 'Radebeul Ost': 'Radebojl Ost',
      'Coswig (Sachs)': 'Kosfik', 'Meißen': 'Majsen', 'Meißen Triebischtal': 'Majsen Tribisztal', 'Pirna': 'Pirna', 'Heidenau': 'Hajdenau',
      'Bad Schandau': 'Bad Szandau', 'Riesa': 'Riza', 'Freital-Potschappel': 'Frajtal Poczapel', 'Tharandt': 'Tarant', 'Leipzig Hbf': 'Lipsk, dworzec główny',
      'Wurzen': 'Wurcen', 'Oschatz': 'Oszac', 'Priestewitz': 'Pristewic',
    },
    'Berlin – Leipzig': {
      'Berlin Hbf': 'Berlin, dworzec główny', 'Berlin Südkreuz': 'Berlin Zjudkrojc', 'Berlin Gesundbrunnen': 'Berlin Gezundbrunen', 'Berlin Ostbahnhof': 'Berlin Ostbanhof',
      'Berlin Friedrichstraße': 'Berlin Fridrichsztrase', 'Berlin Alexanderplatz': 'Berlin Aleksanderplac', 'Berlin Zoologischer Garten': 'Berlin Zoologiszer Garten',
      'Berlin-Spandau': 'Berlin Szpandau', 'Ludwigsfelde': 'Ludwigsfelde', 'Jüterbog': 'Jyterbog', 'Lutherstadt Wittenberg Hbf': 'Lutersztat Witenberg, dworzec główny',
      'Bitterfeld': 'Biterfeld',
    },
    'München – Augsburg / Nürnberg': {
      'München Hbf': 'Monachijum, dworzec główny', 'München-Pasing': 'Monachijum Pazink', 'München Ost': 'Monachijum Ost', 'Olching': 'Olching', 'Maisach': 'Majzach',
      'Mammendorf': 'Mamendorf', 'Haspelmoor': 'Haspelmor', 'Mering': 'Mering', 'Augsburg Hbf': 'Augsburg, dworzec główny', 'Augsburg-Hochzoll': 'Augsburg Hochcol',
      'Nürnberg Hbf': 'Norymberga, dworzec główny',
    },
    'Salzburg – Rosenheim': {
      'Salzburg Hbf': 'Salcburg, dworzec główny', 'Freilassing': 'Frajlasing', 'Bad Reichenhall': 'Bad Rajchenhal', 'Teisendorf': 'Tajzendorf',
      'Traunstein': 'Traunsztajn', 'Bergen (Oberbay)': 'Bergen', 'Übersee': 'Ybeze', 'Prien am Chiemsee': 'Prin am Kimze', 'Bad Endorf': 'Bad Endorf',
      'Rosenheim': 'Rozenhajm',
    },
    'Brennerbahn / Arlbergbahn (Austria)': {
      'Innsbruck Hbf': 'Insbruk, dworzec główny', 'Patsch': 'Pacz', 'Matrei': 'Matraj', 'Steinach in Tirol': 'Sztajnach in Tirol', 'Gries am Brenner': 'Gris am Brener',
      'Brenner': 'Brener', 'Brennero/Brenner': 'Brener', 'Bludenz': 'Bludenc', 'Braz': 'Brac', 'Dalaas': 'Dalas', 'Langen am Arlberg': 'Langen am Arlberg',
      'St. Anton am Arlberg': 'Sankt Anton am Arlberg', 'Landeck-Zams': 'Landek Cams', 'Wien Hbf': 'Wiedeń, dworzec główny', 'Linz Hbf': 'Linc, dworzec główny',
    },
    'Frankfurt / Hessen': {
      'Frankfurt (Main) Hbf': 'Frankfurt nad Menem, dworzec główny', 'Frankfurt (Main) Süd': 'Frankfurt nad Menem Zjud', 'Frankfurt am Main': 'Frankfurt nad Menem',
      'Hanau Hbf': 'Hanau, dworzec główny', 'Offenbach (Main) Hbf': 'Ofenbach, dworzec główny', 'Fulda': 'Fulda', 'Darmstadt Hbf': 'Darmsztat, dworzec główny',
      'Kassel-Wilhelmshöhe': 'Kasel Wilhelmshee',
    },
    'Stuttgart i okolice (S-Bahn, Frankenbahn)': {
      'Stuttgart Hbf': 'Sztutgart, dworzec główny', 'Bietigheim-Bissingen': 'Bitighajm, Bisingen', 'Kornwestheim': 'Kornwesthajm', 'Zuffenhausen': 'Cufenhauzen',
      'Stuttgart-Zuffenhausen': 'Sztutgart Cufenhauzen', 'Feuerbach': 'Fojerbach', 'Bad Cannstatt': 'Bad Kanstat', 'Esslingen': 'Eslingen', 'Plochingen': 'Plochingen',
      'Ludwigsburg': 'Ludwigsburg', 'Asperg': 'Asperk', 'Tamm (Württ)': 'Tam', 'Tamm': 'Tam', 'Besigheim': 'Bezikhajm', 'Kirchheim (Neckar)': 'Kirchhajm',
      'Lauffen (Neckar)': 'Laufen', 'Heilbronn Hbf': 'Hajlbron, dworzec główny', 'Heilbronn': 'Hajlbron', 'Marbach (Neckar)': 'Marbach', 'Backnang': 'Baknang',
      'Waiblingen': 'Wajblingen', 'Böblingen': 'Beblingen', 'Herrenberg': 'Herenberg', 'Stuttgart-Vaihingen': 'Sztutgart Fajhingen', 'Schwabstraße': 'Szwabsztrase',
    },
    'Arosabahn (Rhätische Bahn: Chur – Arosa)': {
      'Chur': 'Chur', 'Chur Stadt': 'Chur Sztat', 'Chur Wiesental': 'Chur Wizental', 'Sassal': 'Sasal', 'Lüen-Castiel': 'Lien Kastiel', 'Lüen Castiel': 'Lien Kastiel',
      'St. Peter-Molinis': 'Sankt Peter Molinis', 'St. Peter Molinis': 'Sankt Peter Molinis', 'Peist': 'Pajst', 'Langwies': 'Langwis', 'Litzirüti': 'Lictiriti',
      'Arosa': 'Aroza', 'Rhätische Bahn': 'Retysze Ban', 'Zürich HB': 'Zurych, dworzec główny', 'Basel SBB': 'Bazylea', 'Luzern': 'Lucerna',
    },
  },
  // człony wspólne
  words: {
    Hauptbahnhof: 'dworzec główny', Bahnhof: 'dworzec',
  },
  // człony angielskie (UK / USA)
  wordsEn: {
    Junction: 'Dżankszyn', Parkway: 'Parkłej', Road: 'Roud', Street: 'Strit', Central: 'Sentral', International: 'Internaszynal', Town: 'Tałn', Halt: 'Holt',
    Bridge: 'Bridż', Lane: 'Lejn', Square: 'Skłer', Green: 'Grin', Cross: 'Kros', Gate: 'Gejt', Heath: 'Hif', Airport: 'Erport', Harbour: 'Harbor', Harbor: 'Harbor',
    Thames: 'Tems', Upon: 'apon', North: 'Nort', South: 'Sałt', East: 'Ist', West: 'Łest', Valley: 'Weli', Wood: 'Łud', Field: 'Fild', Hill: 'Hil', Hills: 'Hils',
    Avenue: 'Ewenju', Circus: 'Serkus', Broadway: 'Brodłej', Church: 'Czercz', Castle: 'Kasel', Abbey: 'Ebi', Village: 'Wilidż', Common: 'Komon',
    Crossing: 'Krosing', Pier: 'Pir', Beach: 'Bicz', Upper: 'Aper', Lower: 'Louer', Great: 'Grejt', Little: 'Litel', Station: 'Stejszyn', Center: 'Senter',
    Centre: 'Senter', Plains: 'Plejnz', Falls: 'Fols', Heights: 'Hajts', Point: 'Pojnt', Mount: 'Maunt', Saint: 'Sejnt', Palace: 'Peles', Quay: 'Ki',
    Wharf: 'Łorf', Terminal: 'Terminal', Penn: 'Pen', Grand: 'Grend', Union: 'Junion', Bay: 'Bej', New: 'Niu', Lake: 'Lejk', Creek: 'Krik', Springs: 'Springs',
    Main: 'Mejn', Line: 'Lajn', Market: 'Market', Hall: 'Hol', Water: 'Łoter', Bank: 'Benk', City: 'Siti', Gardens: 'Gardens', Forest: 'Forest',
  },
  // człony niemieckie (Niemcy / Austria / Szwajcaria) i polskie nazwy dużych miast
  /* Zapis nazw dla głosów NIE-polskich (lektor ?lang=en|de). Głos angielski czyta niemieckie nazwy po angielsku („Merzenik”,
     „Durham”) — poniższe zapisy sprawdzone Whisperem (rozpoznanie po niemiecku). Reszta: reguła ü→ue, ö→oe, ä→ae. */
  voice: {
    en: {
      'Düren': 'Dueren', 'Merzenich': 'Mertsenikh', 'Lövenich': 'Loevenich', 'Köln-Lövenich': 'Cologne Loevenich',
      'Frechen-Königsdorf': 'Frekhen, Kurnigsdorf', 'Buir': 'Buir', 'Götzis': 'Gertsis', 'Bregenz': 'Bray-gents', 'Horrem': 'Horrum',
      'London St. Pancras International': 'London Saint Pancras International', 'St Pancras International': 'Saint Pancras International', 'Köln Hbf': 'Cologne Central', 'Aachen Hbf': 'Aachen Central',
      'München Hbf': 'Munich Central', 'München-Pasing': 'Munich Pasing', 'Nürnberg Hbf': 'Nuremberg Central',
    },
    de: {},
  },
  wordsDe: {
    Insel: 'Inzel', Hafen: 'Hafen', Mitte: 'Mite', Süd: 'Zjud', Nord: 'Nord', Ost: 'Ost', West: 'West', Stadt: 'Sztat', Neustadt: 'Nojsztat', Altstadt: 'Altsztat', Straße: 'Sztrase',
    Strasse: 'Sztrase', Platz: 'Plac', Messe: 'Mese', Flughafen: 'lotnisko', Hafen: 'Hafen', Brücke: 'Bryke', Markt: 'Markt', Kirche: 'Kirche', Rhein: 'Rajn',
    Neckar: 'Nekar', Donau: 'Donau', Bad: 'Bad', Sankt: 'Sankt',
    Köln: 'Kolonia', München: 'Monachijum', Nürnberg: 'Norymberga', Aachen: 'Akwizgran', Lübeck: 'Lubeka', Dresden: 'Drezno', Leipzig: 'Lipsk',
    Mainz: 'Moguncja', Koblenz: 'Koblencja', Braunschweig: 'Brunszwik', Wien: 'Wiedeń', Zürich: 'Zurych', Basel: 'Bazylea', Luzern: 'Lucerna', Bern: 'Berno',
    Stuttgart: 'Sztutgart', Würzburg: 'Wyrcburg', Düsseldorf: 'Diseldorf', Hannover: 'Hanower', Frankfurt: 'Frankfurt', Innsbruck: 'Insbruk', Salzburg: 'Salcburg',
  },
};
// dopisanie trasy bez edycji pliku (np. z konsoli przeglądarki na 2. monitorze; do następnego odświeżenia)
window.TSW_PHON_ADD = function (route, map) {
  const P = window.TSW_PHON; P.routes[route] = Object.assign(P.routes[route] || {}, map); P.version = (P.version || 0) + 1;
};
