---
headline: >-
  Director of Software Engineering at BrightSign, leading the Cloud, Platform
  and Client teams behind the BSN.Cloud SaaS platform.
updated: 2026-09-09
summary: >-
  Accomplished Director of Software Engineering with 30+ years of experience
  across investment banking, Formula 1 motorsport (including career-highlight
  contract roles at McLaren Applied and Mercedes AMG HPP), and digital
  infrastructure. Leads three engineering teams (Cloud, Platform, and Client)
  at BrightSign, delivering the BSN.Cloud SaaS platform and BrightSign Control
  Plus to hundreds of thousands of IoT-connected devices globally. Promoted
  from Server Engineering Lead through Software Engineering Manager to Director
  over four years, driven by hands-on delivery of platform-critical work
  (database crisis recovery, Kubernetes migration, SOC 2 compliance, SSO/MFA)
  as much as by team leadership. Stays directly in the codebase and
  infrastructure rather than managing from a distance, and has built AI
  tooling (including an AI-assisted live diagnostics workflow via Grafana MCP
  and Kubernetes MCP)
  directly into day-to-day engineering and delivery, not just as a talking
  point. Expertise spans full-stack software development, cloud-native
  architecture, observability engineering, and incident management.
  Self-motivated, results-driven leader with strong communication skills,
  including public speaking to enterprise clients, and a commitment to code
  quality and continuous improvement.
leadership: >-
  A Director who still ships. Alongside leading three teams, personally:
  co-develops production code with AI assistance (e.g. porting critical
  certificate-management API components); built and uses Grafana MCP and
  Kubernetes MCP for AI-assisted live diagnostics across logs, metrics and
  cluster state; and runs internal AI
  side-projects exploring new product opportunities for the business (e.g.
  prototyping an MCP server for the BSN.Cloud platform itself). As AI
  reshapes what engineering leadership requires, staying hands-on has become
  a competitive advantage rather than a distraction from the job: directors
  and VPs who can still operate in the code are increasingly valued over
  those who only route tickets, and this is a deliberate bet that has paid
  off in scope and trust gained, while still protecting team wellbeing and
  preventing burnout under sustained delivery pressure.
education: >-
  BSc (Hons) Computer Science (Software Engineering), Upper Second-Class
  Honours (2:1), University of Hertfordshire, 1991-1995.
alumniOf:
  name: "University of Hertfordshire"
  url: "https://www.herts.ac.uk"
awards:
  - "Finalist, 2025 Graham Impact Awards: a company-wide award run by Graham Partners, BrightSign's private equity backer since 2021, recognising contribution(s) to BrightSign"
certifications:
  - "AWS Knowledge: Amazon EKS - Training Badge (Amazon Web Services Training and Certification, April 2024)"
skillGroups:
  - label: "Leadership & Strategy"
    items: ["Software Engineering Management", "Engineering Leadership", "Technical Strategy", "Cross-functional Team Leadership", "People Management", "Incident Management"]
  - label: "Cloud & Platform"
    items: ["Cloud-Native Architecture", "AWS (EKS, Control Tower)", "Azure", "Kubernetes (Helm, Minikube, Kubernetes MCP)", "Terraform", "Ansible", "Docker", "Docker Compose"]
  - label: "Observability & Incident Management"
    items: ["Software Observability", "OpenTelemetry", "Grafana (incl. Grafana MCP)", "Prometheus", "Loki", "Alertmanager", "PagerDuty", "OpsGenie", "incident.io", "on-call/escalation design", "blameless postmortems"]
  - label: "Security & Compliance"
    items: ["SOC 2 Type II", "Identity and Access Management (IAM)", "OAuth 2.0/OIDC", "OWIN/ASP.NET Identity", "SCIM", "Keycloak", "HashiCorp Vault", "DDoS/bot mitigation"]
  - label: "Messaging & APIs"
    items: ["NATS", "RabbitMQ", "REST", "gRPC", "Swagger", "Postman"]
  - label: "Languages & Frameworks"
    items: ["C# / .NET (6-10)", "VB.NET", "WPF/MVVM/MEF/TPL", "ASP.NET/MVC/Razor/WebAPI", "TypeScript", "JavaScript", "HTML/CSS", "Go", "Python"]
  - label: "Testing & CI/CD"
    items: ["Spec-Driven Development", "Test-Driven Development", "xUnit", "NUnit", "MSTest", "Fluent Assertions", "NSubstitute", "SpecFlow", "Selenium", "GitHub Actions", "Azure DevOps", "TeamCity", "Jenkins", "Octopus Deploy"]
  - label: "Databases"
    items: ["Database Design and Administration", "Microsoft SQL Server", "T-SQL", "PostgreSQL", "MySQL", "SQLite"]
  - label: "AI-Assisted Engineering"
    items: ["GitHub Copilot", "Claude Code", "Claude", "AI pair-programming for production code", "AI-assisted incident diagnostics (Grafana MCP, Kubernetes MCP)", "internal AI tooling/side-projects (BSN.Cloud MCP server prototype)"]
roles:
  - company: "BrightSign"
    tier: current
    titles:
      - title: "Director of Software Engineering"
        dates: "Oct 2025 - Present"
      - title: "Software Engineering Manager"
        dates: "Jul 2023 - Oct 2025"
      - title: "Server Engineering Lead"
        dates: "Aug 2022 - Jul 2023"
    body: |
      BrightSign is the world's leading manufacturer of digital signage media players, with hundreds of thousands of devices connected globally to its BSN.Cloud SaaS management platform.

      Promoted twice in four years (Server Engineering Lead to Software Engineering Manager to Director of Software Engineering) in recognition of strategic impact and leadership growth, named a **Finalist for the 2025 Graham Impact Awards** for contributions to BrightSign along the way. Now lead three engineering teams: **Cloud** (BSN.Cloud SaaS platform), **Platform** (Kubernetes/AWS infrastructure and operations), and **Client** (customer-facing applications), while remaining directly hands-on in the codebase, architecture, and incident response.

      Manages 8 direct reports across the three teams (Cloud: 4, including engineers based in Ukraine; Platform: 2 direct based in Ukraine and Poland, plus 2 indirect reports via a consultancy engagement; Client: 2, with a third planned pending budget approval), leading daily across UK, Poland, Ukraine and US Pacific time zones.

      - Led the technical response to a database performance and scaling risk: drove analysis of a planned AWS PostgreSQL migration, and when it proved infeasible due to code coupling, pivoted to vertically scaling and re-tuning the existing MS SQL Server estate with a hot-standby, avoiding a six-figure Enterprise licensing cost and buying at least a year of stability to fund a wider refactor, later followed by hiring a dedicated DBA to further improve performance
      - Built the company's first observability stack (Prometheus, Grafana, Loki, Alertmanager) ahead of a dedicated DevOps hire, later evolving it into an AI-assisted live diagnostics workflow using Grafana MCP and Kubernetes MCP, and migrating incident response from PagerDuty/OpsGenie to incident.io
      - Migrated the BSN.Cloud platform to .NET 8 and later .NET 10, and onto Kubernetes via AWS EKS, materially reducing AWS infrastructure costs
      - Delivered a new SSO/MFA authentication system and led the platform to SOC 2 Type II compliance, unlocking enterprise customer revenue
      - Led a full architectural remodel of BSN.Cloud (dependency-injection refactor, multi-account AWS Control Tower setup, and a provisioning system rewrite), enabling BrightSign Control Plus, a new device management revenue stream launched August 2026
      - Cut logging data volume by switching the platform's logging format from JSON to logfmt, reducing daily log volume from around 1.5 TB to just a few hundred GB
      - Driving ongoing Kubernetes cost optimisation: redesigning cluster topology across Availability Zones to cut inter-AZ data transfer costs, and separating hundreds of GB/day of player-fleet log traffic into a dedicated Loki tenant, apart from platform server logs, to improve both cost and operability
      - Co-develops production code with AI assistance and runs internal AI side-projects exploring new product opportunities (e.g. prototyping an MCP server for the BSN.Cloud platform itself), alongside advising senior engineers on architecture and running cross-team PR review across .NET, TypeScript, Go and Python
      - Represents the business externally: presented BrightSign Control Plus at InfoComm (Las Vegas) and ISE (Barcelona), including client-facing meetings with Disney and Comcast
      - Operates at every level of the business: biweekly updates directly to the CEO, close day-to-day partnership with the VP of Software, and direct engagement with Sales and Product executives, while building personal working relationships across Marketing, Sales, Support, Development, Infrastructure and IT, using in-person time at InfoComm and ISE to connect with remote US and European colleagues beyond the usual video calls
  - company: "Savernake Capital"
    tier: current
    titles:
      - title: "Chief Technology Officer (Permanent)"
        dates: "Feb 2021 - Jul 2022"
    body: |
      Savernake Capital is a quantitative investment management company specialising in adaptive machine learning. They utilise a self-learning portfolio building system to trade global financial markets, adapting in real time to changing conditions.

      Employed as CTO, reporting directly to the CEO. In this small start-up company, responsibilities were very hands-on, covering all areas from implementing a DevOps solution with Microsoft Azure, .NET software architecture, development and deployment using C# on Windows and Linux, unit testing, debugging, performance profiling, network infrastructure design, provisioning and administration and hardware specifications and building.

      Regularly involved in code reviews, pair programming, mentoring, interviewing, purchasing, support and communicating with investors.

      Further details include the design and administration of PostgreSQL databases, migrating from MySQL. Migration of .NET Framework real-time trading applications to .NET 6. Migration from legacy MSMQ to RabbitMQ. Design and prototyping of a scalable product platform using microservices and containers.

      Savernake was attempting adaptive machine-learning-driven predictive trading years ahead of today's AI boom, a genuinely forward-thinking bet, though ultimately the predictive models never reached the reliability needed for production trading.
  - company: "Triangle / Outcomes Star"
    tier: earlier
    titles:
      - title: "Star Online Technical Oversight (Contract)"
        dates: "Jun 2020 - Jan 2021"
    body: |
      Triangle is the company behind the Outcomes Star, an evidence-based tool for measuring and supporting change when working with people.

      Contracted to provide technical oversight between the business and a 3rd party development company (QES). The role involved auditing and validating the database, code and architecture of the system, reviewing the infrastructure and system performance, assisting with the migration process of 30,000 users from version 1 to version 2, advising on future technologies and pathways, and assisting in getting a robust testing foundation in place to minimise re-occurring bugs.
  - company: "De Beers Forevermark"
    tier: earlier
    titles:
      - title: "Senior Developer / Technical Lead (Contract)"
        dates: "Oct 2018 - Mar 2020"
    body: |
      De Beers Forevermark is a diamond Grading, Inscription and Retail company. It grades and inscribes diamonds using bespoke hardware along with bespoke software and workflow-based applications, with grading laboratories in Maidenhead, Antwerp and Surat, and head office in London.

      As Technical Lead, part of a 5-man team designing and developing the next generation of workflow processing software used to grade and inscribe diamonds in the laboratories for the end customer.

      This involved analysis and support of the existing 14-year-old legacy WPF / ASP.NET software and replacing it with a microservices-based architecture built with .NET Core 3, WPF, Web API and SQL Server. Initially hosted on-premise in Docker containers, with a view to later migration to Azure.

      Additionally migrated the entire legacy build and deployment architecture from MSTFS and Final Builder with a custom deployment tool, initially to GIT, TeamCity and Octopus Deploy and then later to Azure DevOps Repos and Pipelines.
  - company: "Mercedes AMG HPP"
    tier: earlier
    titles:
      - title: "Senior Developer (Contract)"
        dates: "Oct 2017 - Mar 2018"
    body: |
      A career-highlight role: Mercedes AMG High Performance Powertrains is a team of over 500 people responsible for the design, manufacture and testing of Formula 1 power units for the Mercedes AMG Petronas, Sahara Force India and Williams Martini Racing F1 teams.

      As part of the I.T. Business Systems team, partly responsible for the re-design and maintenance of several key data transfer packages that provided raw data from the Formula 1 telemetry systems back to the teams in the pit lane and at the factory in order for them to quickly diagnose and resolve problems.

      Also responsible for designing and developing a new application framework (C# .NET / WPF / MVVM / MEF) to host the data transfer packages and supporting applications, porting several legacy VB.NET applications to C#, and maintaining and improving the Mercedes Damage Planner application, used to predict wear and damage to F1 car components in order to anticipate which part would fail next.
  - company: "Britdaq Ltd"
    tier: earlier
    titles:
      - title: "Senior Developer (Contract)"
        dates: "Jul 2017 - Sep 2017"
    body: |
      Britdaq is a financial services company, offering share matching facilities for private companies and investors, a live company share registrar service, company secretarial services via Companies House, and an online discussion forum for investors.

      A short-term return to Britdaq after a 3-year contract mainly away from home with McLaren, taken to work from home and spend more time with family. Migrated the backend from Microsoft SQL Server to PostgreSQL, moved the legacy ASP.NET Webforms membership and role providers to the newer ASP.NET Identity API with OWIN Middleware, and began moving hosting off an unmanaged Windows 2012 server to AWS, with NUnit, NCrunch, Fluent Assertions and NSubstitute test coverage across the migration.
  - company: "McLaren Applied Technologies"
    tier: earlier
    titles:
      - title: "Senior Developer (Contract)"
        dates: "Jul 2014 - Jun 2017"
    body: |
      A career-highlight role: McLaren Applied is the technology division of the McLaren Group, building ATLAS (Advanced Telemetry Linked Acquisition System), the telemetry platform used by every team across Formula 1, plus NASCAR and Birmingham Children's Hospital.

      Contracted as a senior developer to work on their ATLAS software, implemented with WPF + MVVM and DirectX in a multi-threading architecture. The project used Agile SCRUM as its development methodology and was a fully Test-Driven Development project. Work involved direct contact with McLaren's own Formula 1 race engineers, gathering feedback and validating the software against real trackside and factory use.

      Role was to assist the team in producing a release version of the new ATLAS 10 Platform to all of the major teams and the FIA in time for the 2017 Formula 1 racing season.

      - Assisted with the design and development of the ATLAS 10 software using C# .NET 4.6.2, WPF/MVVM, Multi-threading, DirectX and TPL
      - Writing and maintaining unit and integration tests to ensure good code coverage across the project assemblies using TDD with NUnit, NCrunch, Fluent Assertions and NSubstitute
      - Team point of contact for liaison with some third-party tools, e.g. Actipro
      - Bug fixing, maintenance and refactoring as necessary
      - Practising Agile SCRUM methodology throughout; daily stand-ups, backlog refinement, sprint retrospectives, etc.
  - company: "Britdaq Ltd"
    tier: earlier
    titles:
      - title: "Technical Architect / Team Lead / Senior Developer (Contract)"
        dates: "Aug 2011 - Jun 2014"
    body: |
      See the Britdaq Ltd entry above for a company description.

      Led the re-design and re-development of Britdaq's prototype website into a production-ready, n-tier public platform (C#, .NET 4.0, MS SQL Server 2008, ASP.NET, later migrating off Silverlight to pure ASP.NET 4.5), including a trade matching engine, a user forum, and a Companies House XML Gateway integration for statutory filings, delivered using Agile SCRUM with a NUnit/Jenkins-CI build and test environment, alongside setup and maintenance of live, test and UAT servers and general IT administration for the company.
  - company: "Early Career"
    tier: earlier
    titles:
      - title: "Various Software Developer / Analyst roles (Contract & Permanent)"
        dates: "1993 - 2011"
    body: |
      Eighteen years building the technical foundation for later architect and CTO-level roles, spanning investment banking, futures and options trading, mortgage technology, and telecoms.

      Roles included Royal Bank of Scotland (Credit Risk, .NET/NHibernate), Linermark Systems (Consultant/Architect across a dozen client projects in C#, WPF and SQL Server), Barclays Capital (Credit Risk systems in Visual Basic 6 and C#), EasyScreen / Refco (Futures and Options trading platforms, including a secondment to Chicago), Intelligent Risk (a mortgage technology start-up), NatWest Global Financial Markets, Union Bank of Switzerland, and Human Enterprise / Computer Telephony Services, plus a university industrial placement at UBS.

      Technologies from this period (Visual Basic, VB.NET, ASP, SQL Server, early .NET) reflect the era rather than current practice.

      **University Final Year Project**

      - Developed a 'Market Data Distribution Mechanism' proof of concept application using Microsoft Visual C++. The project was based around the Reuters Triarch system
interests:
  - body: >-
      Scuba Diving (TDI Normoxic Tri-mix diver & PADI Assistant Instructor,
      not currently active), IAM Advanced Driver (Institute of Advanced
      Motorists), Road and Mountain Biking, Swimming, Running, Electronics.
  - heading: "Renewable Energy & Sustainability"
    body: >-
      Hands-on experience with home solar, battery storage, and heat pumps
      via a personal Sigenergy system, passionate about eco engineering,
      virtual power plants (VPP), and energy trading and arbitrage, a strong
      advocate for EV adoption, with a keen interest in companies like Axle
      Energy and Octopus Energy driving the renewable energy transition.
  - heading: "Smart Home & IoT"
    body: >-
      Highly skilled in Home Assistant automation, ESP32 and Arduino
      development, and Zigbee-based smart controls. Exploring the
      intersection of IoT, automation, and renewable energy systems.
  - heading: "Home Lab & Telemetry"
    body: >-
      Runs a home lab (a 42U rack running a Kubernetes cluster on multiple
      Raspberry Pis, and a fully-segmented UniFi network with multiple
      switches and secure VLAN zoning), with telemetry monitored end-to-end
      via Home Assistant. A direct extension of the same
      telemetry/observability instincts developed professionally, from
      Formula 1 telemetry systems (ATLAS) to BrightSign's
      OpenTelemetry/Grafana stack, into a personal setup.
  - heading: "Other Interests"
    body: >-
      Drones, cryptocurrencies, and emerging AI applications in daily
      workflows. Lucky enough that the day job and the hobby turned out to
      be the same thing, the same curiosity behind the home lab and AI
      side-projects shows up at work every day too.
recommendations:
  - name: "Greg Herlein"
    relationship: "VP of Software Engineering at BrightSign; managed Gareth directly"
    quote: >-
      Gareth is on a trajectory for great things. He's a fantastic Engineer
      with great "taste" about the "right" way things should be done - but
      he's also fantastic as a leader and a human. I'm honored that I've
      gotten to work with him - and hopefully pass on a few things to him.
      He is still a hands-on Engineer and leader. That not only earns him
      the respect of his team but has positioned him perfectly to fully
      embrace the future of AI agentic development. If you are reading this
      later, when he and I no longer work together, you should just recruit
      him heavily. You won't find better. Until then, I'm glad to work with
      him and I hope to work with him for many more years!
---
