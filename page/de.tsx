"Benutze Client";

importiere { Hero } von "@/components/ui/hero-with-group-of-images-and-two-buttons";
importiere { Feature108 } von "@/components/shadcnblocks-com-feature108";
importiere { Marquee } von "@/components/ui/marquee";
importiere { Feature197 } von "@/components/accordion-feature-section";
importiere { FeaturesSectionWithHoverEffects } von "@/components/feature-section-with-hover-effects";
importiere { Stats } von "@/components/ui/stats-section";
importiere { Feature2 } von "@/components/feature-2";
FAQs von "@/components/text-reveal-faqs" importieren;
importiere FooterSection von "@/components/footer";
importiere { AnimatedSection } von "@/components/ui/animated-section";
importiere { StickyEmailInput } von "@/components/ui/sticky-email-input";

Export der Standardfunktion Home() {

  zurück (
    <div className="min-h-screen w-full overflow-x-hidden pb-32">
      <StickyEmailInput />
      <Hero />
      <AnimatedSection animationType="fade-up" delay={200}>
        <Feature108 
          badge="Beziehungs-Intelligenz"
          heading="Erweiterte Funktionen für vollständige Beziehungstransparenz"
          description="Entdecke die Wahrheit über die Online-Aktivität deines Partners mit AI-gestützter Multi-Plattform-Überwachungs- und Gesichtserkennungstechnologie."
          tabs={[
            {
              wert: "Analyse",
              icon: <span>📊</span>,
              label: "Multi-Plattform-Scan",
              content: {
                abzeichen: "Abdeckung"
                title: "Entdecken Sie ihren digitalen Fußabdruck wie nie zuvor."
                Beschreibung: Finden Sie heraus, wenn ihr Konto noch aktiv ist, einschließlich der letzten Zeit und des Standorts, den sie Dating Plattformen verwendet haben. Erhalte einen echten Beweis für ihre Online-Dating Aktivität mit Zeitstempeln und Standortdaten.",
                buttonText: "Untersuchung starten",
                imageSrc: "Heldenbilder/Profil-1.png",
                imageAlt: "Multi-Plattform-Scanning-Schnittstelle",
              },
            },
            {
              wert: "Übereinstimmung",
              icon: <span>❤️</span>,
              bezeichnet: "Aktivitäten-Tracking",
              content: {
                badge: "Aktivitätsinformation",
                title: "Sehen Sie, wann und wo sie bei Dating-Apps aktiv sind.",
                Beschreibung: Finden Sie heraus, wenn ihr Konto noch aktiv ist, einschließlich der letzten Zeit und des Standorts, den sie Dating Plattformen verwendet haben. Erhalte einen echten Beweis für ihre Online-Dating Aktivität mit Zeitstempeln und Standortdaten.",
                buttonText: "Untersuchung starten",
                imageSrc: "hero-images/profile-2.png",
                imageAlt: "Schnittstelle zur Gesichtserkennung",
              },
            },
            {
              wert: "Standort",
              icon: <span>📍</span>,
              label: "KI Gesichtserkennung",
              content: {
                badge: "Aktivitätsinformation",
                title: "Laden Sie jedes Foto hoch, um ihre versteckten Profile zu finden.",
                Beschreibung: "Our KI scannt ihr Gesicht über 50+ Dating Plattformen, um passende Profile zu finden, auch wenn sie gefälschte Namen oder verschiedene Fotos verwenden. Erhalte vollständige Ergebnisse in Minuten.",
                buttonText: "Untersuchung starten",
                imageSrc: "Heldenbilder/Kartenschnittstelle.png",
                imageAlt: "Aktivitäts-Tracking-Schnittstelle",
              },
            },
          ]}
        />
      </AnimatedSection>
      
      {/* Marquee Abschnitt - Vertikal auf Mobil, Horizontal auf Desktop */}
      <AnimatedSection animationType="fade-up" delay={100}>
        <section className="pt-8 pb-4 md:pt-16 md:pb-8">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-4">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tighter font-bold mb-4 leading-tight">
                Vertrauen, aber überprüfen
              </h2>
              <p className="text-base sm:text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-2xl mx-auto">
                Intelligente Leute, die sich dafür entschieden haben, zu verifizieren, anstatt sich zu wundern,
              </p>
            </div>
          
          {/* Mobil: Vertikaler Marquee */}
          <div className="block md:hidden">
            <Marquee
              vertical={true}
              pauseOnHover={true}
              className="h-64 [--Dauer: 30s]"
            >
              <div className="bg-white rounded-2xl p-3 md:p-6 shadow-sm mx-auto max-w-sm hover:scale-105 transition-transform duration-300">
                <div className="flex items-center mb-2 md:mb-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold text-base md:text-lg mr-2 md:mr-3">
                    S
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm md:text-base">Sarah M.</h3>
                    <p className="text-gray-600 text-xs md:text-sm">verifizierter Benutzer</p>
                  </div>
                </div>
                <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                  &ldquo;Ich war misstrauisch über das Verhalten meines Partners&apos;s. Dieses Tool hat mir geholfen, die Wahrheit zu finden. Jetzt kann ich fundierte Entscheidungen über meine Beziehung treffen.&rdquo;
                </p>
              </div>
              
              <div className="bg-white rounded-2xl p-3 md:p-6 shadow-sm mx-auto max-w-sm hover:scale-105 transition-transform duration-300">
                <div className="flex items-center mb-2 md:mb-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-base md:text-lg mr-2 md:mr-3">
                    M
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm md:text-base">Mike R.</h3>
                    <p className="text-gray-600 text-xs md:text-sm">verifizierter Benutzer</p>
                  </div>
                </div>
                <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                  &ldquo;Die KI-Gesichtserkennung ist unglaublich. Gefundene Profile, die ich nie kannte. Seelenfrieden ist unbezahlbar.&rdquo;
                </p>
              </div>
              
              <div className="bg-white rounded-2xl p-3 md:p-6 shadow-sm mx-auto max-w-sm hover:scale-105 transition-transform duration-300">
                <div className="flex items-center mb-2 md:mb-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-base md:text-lg mr-2 md:mr-3">
                    L
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm md:text-base">Lisa K.</h3>
                    <p className="text-gray-600 text-xs md:text-sm">verifizierter Benutzer</p>
                  </div>
                </div>
                <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                  &ldquo;Endlich ein Werkzeug, das tatsächlich funktioniert! Mehrere versteckte Profile auf verschiedenen Plattformen gefunden. Sehr empfehlenswert.&rdquo;
                </p>
              </div>
            </Marquee>
          </div>
          
          {/* Desktop: Horizontaler Marquee */}
          <div className="hidden md:block">
            <Marquee
              pauseOnHover={true}
              className="py-8 [--Dauer: 40s]"
            >
              <div className="bg-white rounded-2xl p-6 shadow-sm mx-4 hover:scale-105 transition-transform duration-300 min-w-[400px]">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3">
                    S
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Sarah M.</h3>
                    <p className="text-gray-600 text-sm">verifizierter Benutzer</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  &ldquo;Ich war misstrauisch über das Verhalten meines Partners&apos;s. Dieses Tool hat mir geholfen, die Wahrheit zu finden. Jetzt kann ich fundierte Entscheidungen über meine Beziehung treffen.&rdquo;
                </p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm mx-4 hover:scale-105 transition-transform duration-300 min-w-[400px]">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3">
                    M
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Mike R.</h3>
                    <p className="text-gray-600 text-sm">verifizierter Benutzer</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  &ldquo;Die KI-Gesichtserkennung ist unglaublich. Gefundene Profile, die ich nie kannte. Seelenfrieden ist unbezahlbar.&rdquo;
                </p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm mx-4 hover:scale-105 transition-transform duration-300 min-w-[400px]">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3">
                    L
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Lisa K.</h3>
                    <p className="text-gray-600 text-sm">verifizierter Benutzer</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  &ldquo;Endlich ein Werkzeug, das tatsächlich funktioniert! Mehrere versteckte Profile auf verschiedenen Plattformen gefunden. Sehr empfehlenswert.&rdquo;
                </p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm mx-4 hover:scale-105 transition-transform duration-300 min-w-[400px]">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3">
                    D
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">David L.</h3>
                    <p className="text-gray-600 text-sm">verifizierter Benutzer</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  &ldquo;Die Multi-Plattform-Scanning-Funktion ist ein Spielwechsel. Found profiles on platforms I didn&apos;t even know existed.&rdquo;
                </p>
              </div>
            </Marquee>
          </div>
          </div>
        </section>
      </AnimatedSection>

      <AnimatedSection animationType="fade-up" delay={300}>
        <Feature197 
          funktionen={[
            {
              id: 1,
              title: "Standort & Zeiterfassung",
              bild: "tHzBF9VtTHyDQVb6yHGsTjVms.avif",
              Beschreibung: "Genau wie die Karte Aktivitäten von vor 2 Tagen zeigt, erfasst unsere Plattform Echtzeit-Standortdaten, wenn Ihr Partner Dating-Apps verwendet. Unsere KI analysiert ihre Bewegungsmuster, Zeitstempel und geografische Aktivität, um konkrete Beweise für ihr Online-Dating Verhalten zu liefern.
            },
            {
              id: 2,
              title: "Aktive Profilerkennung",
              image: "zS8PvTIANwCEPMbE5AiFHxFqbI8.avif",
              Beschreibung: "Unsere Technologie zur Gesichtserkennung von Gesichtsprofilen identifiziert sofort aktive Dating Profile, genau wie das Profil von Mandy, das vor 8 Stunden aktiv war. Erhalten Sie Echtzeitbenachrichtigungen, wenn wir ihre versteckten Konten mit genauen Zeitstempeln, Standorten und Profildetails entdecken.",
            },
            {
              id: 3,
              title: "Abonnement-Level Erkennung",
              image: "3ab3Z01bd2hmmiDPvu2ESnFp1YA.avif",
              Beschreibung: "Entdecken Sie genau, wie investiert sie in Dating-Apps. Unser System erkennt ob es kostenlose Konten nutzt oder für Premium-Funktionen wie Tinder Platinum, Gold oder Plus-Abonnements bezahlt. Premium-Abonnements weisen auf ernsthafte Dating Absichten und höhere Aktivitätsniveaus hin.",
            },
          ]}
        />
      </AnimatedSection>

      <AnimatedSection animationType="fade-up" delay={400}>
        <FeaturesSectionWithHoverEffects />
      </AnimatedSection>

      <AnimatedSection animationType="fade-up" delay={500}>
        <Stats />
      </AnimatedSection>

      <AnimatedSection animationType="fade-up" delay={600}>
        <Feature2 
          imageSrc="hp-gma-video.webp"
          imageAlt="Good Morning America feature about dating platform"
        />
      </AnimatedSection>

      <AnimatedSection animationType="fade-up" delay={700}>
        <FAQs />
      </AnimatedSection>

      <AnimatedSection animationType="fade-up" delay={800}>
        <FooterSection />
      </AnimatedSection>
    </div>
  );
}
