---
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
  tooling (including an AI-assisted live diagnostics workflow via Grafana MCP)
  directly into day-to-day engineering and delivery, not just as a talking
  point. Expertise spans full-stack software development, cloud-native
  architecture, observability engineering, and incident management.
  Self-motivated, results-driven leader with strong communication skills,
  including public speaking to enterprise clients, and a commitment to code
  quality and continuous improvement.
leadership: >-
  A Director who still ships. Alongside leading three teams, personally:
  co-develops production code with AI assistance (e.g. porting critical
  certificate-management API components); built and uses Grafana MCP for
  AI-assisted live log/metric incident diagnosis; and runs internal AI
  side-projects exploring new product opportunities for the business. As AI
  reshapes what engineering leadership requires, staying hands-on has become
  a competitive advantage rather than a distraction from the job: directors
  and VPs who can still operate in the code are increasingly valued over
  those who only route tickets, and this is a deliberate bet that has paid
  off in scope and trust gained, while still protecting team wellbeing and
  preventing burnout under sustained delivery pressure.
education: >-
  BSc (Hons) Computer Science (Software Engineering), Upper Second-Class
  Honours (2:1), University of Hertfordshire, 1991-1995.
awards:
  - "Finalist, 2025 Graham Impact Awards: a company-wide award run by Graham Partners, BrightSign's private equity backer since 2021, recognising contribution(s) to BrightSign"
certifications:
  - "AWS Knowledge: Amazon EKS - Training Badge (Amazon Web Services Training and Certification, April 2024)"
skillGroups:
  - label: "Leadership & Strategy"
    items: ["Software Engineering Management", "Engineering Leadership", "Technical Strategy", "Cross-functional Team Leadership", "People Management", "Incident Management"]
  - label: "Cloud & Platform"
    items: ["Cloud-Native Architecture", "AWS (EKS, Control Tower)", "Azure", "Kubernetes (Helm, Minikube)", "Terraform", "Ansible", "Docker", "Docker Compose"]
  - label: "Observability & Incident Management"
    items: ["Software Observability", "OpenTelemetry", "Grafana (incl. Grafana MCP)", "Prometheus", "Loki", "Alertmanager", "PagerDuty", "OpsGenie", "Incident.io", "on-call/escalation design", "blameless postmortems"]
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
    items: ["GitHub Copilot", "Claude / Claude Code", "AI pair-programming for production code", "AI-assisted incident diagnostics (Grafana MCP)", "internal AI tooling/side-projects"]
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
      - Built the company's first observability stack (Prometheus, Grafana, Loki, Alertmanager, PagerDuty/OpsGenie) ahead of a dedicated DevOps hire, later evolving it into an AI-assisted live diagnostics workflow using Grafana MCP
      - Migrated the BSN.Cloud platform to .NET 8 and later .NET 10, and onto Kubernetes via AWS EKS, materially reducing AWS infrastructure costs
      - Delivered a new SSO/MFA authentication system and led the platform to SOC 2 Type II compliance, unlocking enterprise customer revenue
      - Led a full architectural remodel of BSN.Cloud (dependency-injection refactor, multi-account AWS Control Tower setup, and a provisioning system rewrite), enabling BrightSign Control Plus, a new device management revenue stream launched August 2026
      - Cut logging data volume by switching the platform's logging format from JSON to logfmt, reducing daily log volume by roughly 1.5 TB
      - Driving ongoing Kubernetes cost optimisation: redesigning cluster topology across Availability Zones to cut inter-AZ data transfer costs, and separating hundreds of GB/day of player-fleet log traffic into a dedicated Loki tenant, apart from platform server logs, to improve both cost and operability
      - Co-develops production code with AI assistance and runs internal AI side-projects exploring new product opportunities, alongside advising senior engineers on architecture and running cross-team PR review across .NET, TypeScript, Go and Python
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

      After the 3-year contract mainly away from home with McLaren, took up a short-term contract with Britdaq again to allow working from home and spending more time with family.

      Tasks included:

      - Migrating away from the Microsoft SQL Server backend database platform to the open source PostgreSQL database. This allowed Britdaq to reduce their running costs as a commercial database licence was no longer required
      - Establishing an MVC framework to allow Britdaq to migrate from the legacy ASP.NET Webforms to ASP.NET MVC. This predominately involved re-writing the ASP.NET Webforms Membership and Role providers to use the newer ASP.NET Identity API with OWIN Middleware. Installing and configuring development and production PostgreSQL databases and modifying the database schemas appropriately
      - Investigating and implementing a test platform on Amazon Web Services to move Britdaq off an unmanaged Windows 2012 server platform in order to simplify the day-to-day backend management and to further reduce running costs
      - Implementing unit, integration and system tests where possible to cover the migration of all application tiers to the new framework. This involved using NUnit, NCrunch, Fluent Assertions and NSubstitute
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
      See the Britdaq Ltd entry above for a company description. Roles consisted of:

      - Re-design and re-development of the prototype Britdaq website to make it suitable for release to the general public. This involved re-writing the majority of the system, splitting it into an n-tier design and extracting into separate components where appropriate. All development was in C# using .NET 4.0, with MS SQL Server 2008, ASP.NET, Silverlight 4, RIA Services and Entity Framework. Later removed the Silverlight project and replaced with pure ASP.NET 4.5 website
      - Development of a secure and robust public facing website that provided a trade matching engine, a user forum, and a client interface to Companies House XML Gateway for the submission of all UK Company legal documents (e.g. Annual Returns, Director Appointments)
      - All development utilised the AGILE SCRUM methodology to deliver regular incremental updates to the system
      - Creating a build and unit test environment for the development process using NUnit and Jenkins-CI
      - Set-up and maintenance of live, test and UAT servers hosted by 3rd party providers. Installation of the software on the servers, along with monitoring and performance tuning where necessary
      - General handling of all I.T. administration functions within the company such as supporting the users' email accounts, Internet access and hardware requirements
  - company: "Royal Bank of Scotland"
    tier: earlier
    titles:
      - title: "Senior Software Developer (Contract)"
        dates: "Feb 2011 - Aug 2011"
    body: |
      The role at RBS was directly with the Credit Risk team and involved the design and development of a new software application suite to measure credit risk. Working with the business directly allowed use of tools and technologies (.NET, NHibernate) that were not necessarily part of the core RBS IT technologies (JAVA).

      - Developing server-side software components in .NET to calculate credit risk along with supporting utilities to store and extract the data to a MS SQL Server database using NHibernate
      - Designing and creating a stable automated build and test environment for the development process using TeamCity and NUnit
      - Developing unit tests for existing and new components
      - Refactoring and debugging components as necessary
  - company: "Linermark Systems Ltd"
    tier: earlier
    titles:
      - title: "Consultant / Architect / Senior Software Developer (Contract)"
        dates: "Sep 2008 - Jan 2011"
    body: |
      Linermark Systems is an independent software development company specialising in designing, developing and supporting business applications for any business sector.

      - Assisted in gathering and analysing requirements directly from clients and producing specifications
      - Designed and developed an Aggregates Measuring system for JClubb in C#, WPF and SQL Server
      - Architected, designed and developed an n-tier retail stock management system (Top2Toe) in Silverlight and RIA Services
      - Designed and developed a Fleet Management system (Fleet Minder) for Raymond Brown Group in C#, WinForms and SQL Server
      - Designed and developed a Plant Management system (Plant Minder) for Raymond Brown Group in C#, WinForms and SQL Server
      - Designed and developed a Skip Management and Tracking system (Skip Minder) for Raymond Brown Group in C#, WinForms and SQL Server
      - Designed and developed a web and desktop based Property Services job tracking and invoicing system for RedRose, including integration with Iris Exchequer accounting system in ASP.NET, C#, WinForms and SQL Server
      - Designed and developed a warehouse container and pallet content tracking system for Kuoni Transport. Final enhancements and go-live support provided on-site in Switzerland in C#, WinForms and SQL Server
      - Responsible for support and enhancing Aram Design's retail stock management system. Work was frequently undertaken on-site in the Covent Garden store
      - Assisted in supporting and enhancing a Quarry Management system (Quarry Minder) and ReadyMix Concrete system (ReadiMinder) for Raymond Brown Group (mindersoftware.net)
      - Re-engineered stored procedures to reduce bottlenecks and enhance performance with The Continuity Company's global SQL Server database
      - Solely developed an in-house code generation application to reduce the time spent creating new client applications in C#
      - Solely developed a suite of common library routines for use with all Linermark client projects in C#
      - Re-designed the company website for Linermark Systems (linermark.com)
  - company: "Barclays Capital"
    tier: earlier
    titles:
      - title: "Software Developer (Contract)"
        dates: "Aug 2006 - Aug 2008"
    body: |
      Barclays Capital is the investment banking division of Barclays Bank PLC.

      - Provided support and performance enhancements to the existing Visual Basic 6 based Credit Risk system (CVAR)
      - Assisted in designing and prototyping a new object-oriented replacement Credit Risk system (UVAR) in C# and SQL Server
      - Solely responsible for developing the middle-tier trade processing application for UVAR in C#
      - Provided direct client support during the UAT and go-live phases of the UVAR project
  - company: "EasyScreen Plc"
    tier: earlier
    titles:
      - title: "Software Developer (Contract)"
        dates: "Dec 2004 - May 2006"
    body: |
      EasyScreen is a financial software house that develops Futures and Options trading systems. EasyScreen's core product, EasyTrade, comprises an n-tier architecture written in Microsoft Visual Basic 6, Visual C++ and SQL Server. This was superseded by EasyRouter (a server based trade routing system) and EasyActiveTrade (EAT), a light-weight but fully functional trading front-end to EasyRouter.

      - Design and prototyping of a web retail trading front-end and middle-tier with ASP.NET, C# using Visual Studio 2005 (.NET 2.0)
      - Design and prototyping of a Smart Device (Pocket PC 2003) retail trading front-end and middle-tier web service with the .NET Compact Framework, C# using Visual Studio 2005 (.NET 2.0)
      - Design and prototyping of a monitoring application to pro-actively monitor the status of EasyServer installations at client sites. ASP.NET, C# using Visual Studio 2005 (.NET 2.0), windows services and web services
      - Design and prototyping of custom RSS server and client application to monitor the status of EasyServer installations at client sites. ASP.NET, C# using Visual Studio 2005 (.NET 2.0), windows services
      - Design and development of a Microsoft Excel based trading platform, incorporating Excel trading add-ins and Smart Tag DLLs written in C#, supported by .NET web services and a SQL server database
  - company: "Intelligent Risk Ltd"
    tier: earlier
    titles:
      - title: "Software Developer (Permanent)"
        dates: "Jun 2003 - Nov 2004"
    body: |
      A green-field start-up company, Intelligent Risk developed an innovative mortgage product to fundamentally change the way people financed their house purchases. Their new system required various .NET components to enable mortgage brokers to track workflow and communicate with external suppliers, valuers, credit checking agencies and regulatory companies. Unfortunately, the company was dissolved in 2004 due to lack of funding.

      - Assisted in the design and implementation of the relational database system (Microsoft SQL Server / Oracle) for the data warehouse and several of the smaller "satellite" databases
      - Software and hardware design and implementation of a "web-farm" to securely facilitate the web-sites and web services used in the company to provide internal services and external links to various suppliers
      - Development of externally facing "public" and "broker" web-sites in ASP.NET, C#
      - Development of various internal web services, tools and utilities in WinForms, C#
      - Assisted in the day-to-day maintenance and support of the company where necessary
  - company: "EasyScreen Plc"
    tier: earlier
    titles:
      - title: "Software Developer / Team Leader (Permanent)"
        dates: "Jan 2000 - Jun 2003"
    body: |
      - Development of the EasyTrade front-end product, EasyScreen's primary trading software package. Written in Visual Basic 6, EasyTrade was a component-based system that ran on the Windows platform. It utilised multiple exchange connections to provide real-time market data to the client. Trade state and history were persisted via ADO to SQL Server
      - Assisted in testing the functionality of the system under different environments and loads
      - Assisted in the maintenance and support of the system and related components
      - Assisted the support team with the rollout of EasyTrade to various clients in London
      - Design and development of future products for EasyScreen plc
      - Working directly with a key client, ABN AMRO in Chicago, to address specific requirements
      - Planning and allocation of work for team members

      **Refco EasySolutions (Joint Venture) based in London & Chicago**

      - Seconded to EasyScreen joint venture with Refco LLC, mainly based in Chicago (6 months)
      - Assisted in the design and development of a new Futures and Options Internet based retail product to replace the existing Lind Waldock system. The product was developed as an ASP, HTML and JavaScript web client specifically for Internet Explorer and was hosted on IIS 5.0. It used Visual Basic 6.0 business objects hosted on MTS to connect to the EasyRouter Order Routing platform
      - Assisted in the design and development of a new client based Futures trading platform to be deployed globally for Refco. Its primary purpose was to replace the existing EasyTrade product that was too "heavy" for the proposed Refco platform. This completely new "lightweight" product was developed in three months. Written in Visual Basic, communicating with EasyRouter via SOAP/HTTP and utilising Visual Basic business objects hosted on MTS

      **Futures & Options Trading: Software Developer (from April 2002)**

      - Continued development of the new EasyScreen lightweight product called EasyActiveTrade (EAT)
      - Self-training in VB.NET and ADO.NET in order to establish company expertise and to aid in porting the middle-tier and front-end products to .NET
      - Prototyping the phase 1 version of EasyActiveTrade in .NET to determine the feasibility of conversion
      - Design and analysis of future EasyActiveTrade requirements
      - Specified the requirements for and implemented a new Defect Tracking and Customer Support system (Perfect Tracker) for internal development and external client access
  - company: "NatWest Global Financial Markets"
    tier: earlier
    titles:
      - title: "Software Developer (Contract)"
        dates: "Feb 1998 - Jan 2000"
    body: |
      The Credit Risk Technology team required an intranet presence and enquiry tools to query counterparty limits and hierarchies.

      - Responsible for the development of an intranet web site for the team
      - Developed tools for limit and counter-party enquiries using ASP and Visual Basic Web Forms
      - Documented and presented all systems and technologies used

      **Technology Infrastructure: Support Analyst / Developer**

      The Technology Infrastructure team required assistance in analysing and implementing a new global standard for the desktop refresh programme.

      - Assisted in analysing all software used within NatWest GFM
      - Assisted in the global rollout of the new standard desktop
      - Assisted in the administration and global rollout of Microsoft Systems Management Server
      - Assisted the team with day-to-day administration tasks and short to medium term solutions
      - Seconded to the NT Server team to assist with the daily administration tasks
      - Developed the NT Server team intranet site to aid their workflow and provide reporting
      - Seconded to the Market Data team to develop an internal SQL Server database for the management and reporting of Market Data, Networking, Private Wires and Asset Management information

      **Finance Technology: Support Analyst / Developer**

      The Finance Technology team required assistance in converting numerous legacy databases, spreadsheets and VBA code modules to ensure Y2K compliance.

      - Converted all back-office MS Access v2/95 databases to v97 to ensure Y2K compliance and continued connectivity to live data
      - Re-coded VBA code modules where necessary
      - Developed and standardised ODBC server connectivity for client databases
      - Provided VB development support to internal finance developers
  - company: "Union Bank of Switzerland"
    tier: earlier
    titles:
      - title: "Programmer (Permanent)"
        dates: "Sep 1997 - Feb 1998"
    body: |
      The Rapid Application Development (RAD) team was involved in producing in-house Visual Basic and C++ solutions for UBS's business areas. Due to the merger of businesses the position was made redundant after 6 months.

      - Designed and developed a document faxing solution for an existing product used in the front and back-offices
      - Assisted in the development of a middleware-messaging component DataExpress
  - company: "Human Enterprise Ltd / Computer Telephony Services Ltd"
    tier: earlier
    titles:
      - title: "Programmer / Consultant (Permanent)"
        dates: "Jun 1995 - Sep 1997"
    body: |
      Human Enterprise was an I.T. Consultancy providing solutions for various clients, including News International, Union Bank of Switzerland, Commerzbank and Saudi International Bank.

      - Developed a document library system to facilitate the storage and retrieval of legal documentation using Visual Basic 3 for the Union Bank of Switzerland
      - Designed and developed a help desk system using Visual Basic 4 and SQL Server for News International
      - Installation and configuration of MS Windows NT 3.51 to 100+ users at Commerzbank, Frankfurt
      - Installation and configuration of MS Outlook and Internet Explorer to 250+ users at Saudi International Bank, London

      Computer Telephony Services was a new company formed by Human Enterprise Ltd with the sole objective of entering the Computer Telephony Integration (CTI) market to provide real-time telephony services.

      - Developed real-time telephony/voice, voice-mail, IVR and TAPI applications using Visual Basic and SQL Server
      - Built and administered NT Servers, SQL Server databases and high-performance client workstations to host CTI applications
      - Designed and developed Internet sites for both companies, HEL and CTS, using MS FrontPage
      - Created multimedia projects using Visual Basic
  - company: "Union Bank of Switzerland"
    tier: earlier
    titles:
      - title: "Support Analyst & Developer (Industrial Placement)"
        dates: "Jun 1993 - Sep 1994"
    body: |
      Industrial placement with UBS (London) I.T. Infrastructure department.

      **University Industrial Placement**

      - Investigated private wire (ISDN) systems, including billing and physical line terminations
      - Assisted with Novell networking and PC support
      - Analysed the bank's data feeds to determine utilisation in order to reduce costs
      - Assisted the Local Area Network security team perform an audit of the bank's networks
      - Visual Basic developer for the DICE (Distributed Integrated Customer Environment) team

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
---
