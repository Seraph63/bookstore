# 🎯 Job Interview — Domande Tecniche per il Progetto Bookstore

---

## ☕ Spring Boot 3

1. **Qual è la differenza tra `@Component`, `@Service`, `@Repository` e `@Controller`? Sono intercambiabili?**

   > Tecnicamente sono tutte specializzazioni di `@Component` e funzionano come bean Spring, quindi sono intercambiabili a livello di DI. Tuttavia hanno semantiche diverse: `@Service` indica la business logic, `@Repository` aggiunge la traduzione automatica delle eccezioni SQL in `DataAccessException`, `@Controller` è usato per MVC/REST. Usare l'annotazione corretta migliora la leggibilità e permette a Spring (e agli strumenti AOP) di comportarsi in modo appropriato.

2. **Come funziona il meccanismo di auto-configuration di Spring Boot? Cosa fa `@SpringBootApplication` sotto il cofano?**

   > `@SpringBootApplication` è un'annotazione composita che include: `@Configuration` (classe di configurazione), `@EnableAutoConfiguration` (attiva l'auto-configurazione) e `@ComponentScan` (scansiona il package corrente). L'auto-configuration funziona tramite il file `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`: Spring carica le classi candidate e le applica solo se le condizioni (`@ConditionalOnClass`, `@ConditionalOnMissingBean`, ecc.) sono soddisfatte.

3. **Spiega il ciclo di vita di un bean Spring. Quali sono le fasi principali e come puoi agganciarti ad esse?**

   > Le fasi sono: **istanziazione** → **dependency injection** → **post-processing** (`BeanPostProcessor`) → **inizializzazione** (`@PostConstruct` o `afterPropertiesSet()`) → **uso** → **distruzione** (`@PreDestroy` o `destroy()`). Ci si aggancia implementando `InitializingBean`/`DisposableBean`, usando `@PostConstruct`/`@PreDestroy`, oppure registrando `BeanPostProcessor` custom.

4. **Cosa sono i profili Spring (`@Profile`)? Come li useresti per gestire ambienti diversi (dev, staging, prod)?**

   > I profili permettono di attivare bean e configurazioni diversi per ambiente. Si usano `@Profile("dev")` sui bean o sui file `application-dev.yml`. Il profilo attivo si imposta con `spring.profiles.active=dev` in `application.properties`, variabile d'ambiente `SPRING_PROFILES_ACTIVE`, o flag JVM `-Dspring.profiles.active=prod`. Si possono combinare più profili e usare `@Profile("!prod")` per escludere.

5. **Qual è la differenza tra `@RequestParam`, `@PathVariable` e `@RequestBody` in un controller REST?**

   > - `@PathVariable`: estrae valori dall'URL path (es. `/books/{id}`)
   > - `@RequestParam`: estrae parametri query string (es. `/books?page=1&size=10`)
   > - `@RequestBody`: deserializza il corpo JSON della richiesta in un oggetto Java (usato in POST/PUT)
   >
   > Esempio: `GET /books/42?lang=it` → `@PathVariable Long id = 42`, `@RequestParam String lang = "it"`.

6. **Come gestisci le eccezioni in modo centralizzato in Spring Boot? Spiega `@ControllerAdvice` e `@ExceptionHandler`.**
7. **Cosa fa `@Transactional`? Quali sono i livelli di propagazione e di isolamento disponibili?**
8. **Come funziona la dependency injection in Spring? Quali tipi esistono (constructor, setter, field) e quale preferisci?**
9. **Come implementeresti la paginazione in un endpoint REST con Spring Boot?**
10. **Qual è la differenza tra `application.properties` e `application.yml`? Come si sovrascrivono le proprietà con variabili d'ambiente?**

---

## 🗃️ PostgreSQL

1. **Qual è la differenza tra `INNER JOIN`, `LEFT JOIN`, `RIGHT JOIN` e `FULL OUTER JOIN`? Portami un esempio pratico.**

   > - `INNER JOIN`: restituisce solo le righe con corrispondenza in entrambe le tabelle.
   > - `LEFT JOIN`: tutte le righe della tabella sinistra + corrispondenze destra (NULL se assente).
   > - `RIGHT JOIN`: inverso del LEFT.
   > - `FULL OUTER JOIN`: tutte le righe di entrambe, con NULL dove mancano corrispondenze.
   >
   > Esempio: `SELECT b.title, a.name FROM books b LEFT JOIN authors a ON b.author_id = a.id` — restituisce tutti i libri, anche quelli senza autore associato.

2. **Cosa sono gli indici in PostgreSQL? Quando conviene crearli e quando possono essere controproducenti?**

   > Gli indici accelerano le query di lettura (SELECT con WHERE, JOIN, ORDER BY) creando strutture dati aggiuntive (B-Tree di default). Conviene crearli su colonne frequentemente filtrate o usate in JOIN. Sono controproducenti su tabelle con molte scritture (INSERT/UPDATE/DELETE rallentano perché l'indice va aggiornato), su colonne con bassa cardinalità (es. colonna boolean), o su tabelle molto piccole dove il sequential scan è già veloce.

3. **Spiega il concetto di ACID. Come PostgreSQL garantisce queste proprietà?**

   > - **Atomicity**: la transazione è tutto-o-niente → garantita da WAL (Write-Ahead Log) e rollback.
   > - **Consistency**: i dati rispettano sempre i vincoli (FK, CHECK, UNIQUE) → garantita dai constraint.
   > - **Isolation**: le transazioni concorrenti non si interferiscono → garantita da MVCC e lock.
   > - **Durability**: dopo il commit i dati sono persistiti anche in caso di crash → garantita dal WAL su disco.

4. **Qual è la differenza tra `VARCHAR` e `TEXT` in PostgreSQL?**

   > In PostgreSQL non c'è differenza di performance o storage tra `VARCHAR(n)`, `VARCHAR` e `TEXT`: sono tutti memorizzati allo stesso modo internamente (tipo `varlena`). L'unica differenza è che `VARCHAR(n)` applica un vincolo sulla lunghezza massima. `TEXT` è preferito nella pratica perché più flessibile e semanticamente chiaro che non c'è limite.

5. **Cosa sono le CTE (Common Table Expressions) e quando le useresti rispetto a una subquery?**

   > Le CTE sono query temporanee definite con `WITH nome AS (...)` riutilizzabili nella query principale. Si preferiscono alle subquery per: leggibilità (query complesse step-by-step), riutilizzo della stessa sub-query più volte, e query ricorsive (`WITH RECURSIVE`). Le CTE in PostgreSQL 12+ non sono più sempre "fence" (il planner può ottimizzarle inline), quindi la differenza di performance è ridotta.

6. **Come funziona il meccanismo di MVCC (Multi-Version Concurrency Control) in PostgreSQL?**
7. **Quali sono le differenze tra `TRUNCATE` e `DELETE`? In quale scenario preferiresti uno o l'altro?**
8. **Come gestiresti una migrazione del database in produzione senza downtime?**
9. **Spiega la differenza tra `SERIAL`, `BIGSERIAL` e `GENERATED ALWAYS AS IDENTITY`.**
10. **Cosa sono le window functions? Fai un esempio con `ROW_NUMBER()` o `RANK()`.**

---

## 🔐 Spring Security

1. **Descrivi il flusso di autenticazione con JWT in Spring Security: dalla richiesta HTTP alla validazione del token.**

   > 1. Il client invia le credenziali a `/auth/login`.
   > 2. `AuthenticationManager` autentica tramite `UserDetailsService` (carica l'utente dal DB).
   > 3. Se valido, viene generato un JWT firmato (con secret o chiave RSA) e restituito al client.
   > 4. Per le richieste successive, il client include il JWT nell'header `Authorization: Bearer <token>`.
   > 5. Un filtro custom (`OncePerRequestFilter`) intercetta la richiesta, estrae il token, lo valida (firma, scadenza), e popola il `SecurityContext` con l'`Authentication`.

2. **Qual è la differenza tra autenticazione e autorizzazione? Come Spring Security gestisce entrambe?**

   > - **Autenticazione**: verifica l'identità ("chi sei?") → gestita da `AuthenticationManager` e `UserDetailsService`.
   > - **Autorizzazione**: verifica i permessi ("cosa puoi fare?") → gestita da `AccessDecisionManager`, `@PreAuthorize`, `hasRole()` nella `SecurityFilterChain`.
   > Spring Security separa nettamente le due fasi: prima autentica (popola il `SecurityContext`), poi autorizza (valuta i ruoli/permessi per la risorsa richiesta).

3. **Cosa fa la `SecurityFilterChain`? Quali filtri sono eseguiti e in quale ordine?**

   > `SecurityFilterChain` è la catena di filtri Servlet che intercetta ogni richiesta HTTP. I principali filtri (in ordine) sono: `SecurityContextPersistenceFilter`, `UsernamePasswordAuthenticationFilter` (o filtro JWT custom), `ExceptionTranslationFilter`, `FilterSecurityInterceptor`. La configurazione avviene tramite il bean `SecurityFilterChain` con `HttpSecurity`, dove si definiscono regole CORS, CSRF, sessioni, e accesso alle route.

4. **Come configureresti CORS in Spring Security per permettere richieste da un frontend Next.js?**

   > Si configura nella `SecurityFilterChain` con `.cors(cors -> cors.configurationSource(...))` e si definisce un `CorsConfigurationSource` bean che specifica `allowedOrigins` (es. `http://localhost:3000`), `allowedMethods` (GET, POST, PUT, DELETE), `allowedHeaders` e `allowCredentials(true)`. È importante che la configurazione CORS sia applicata prima dei filtri di autenticazione.

5. **Cosa sono i `GrantedAuthority` e i `Role`? Come si usa `@PreAuthorize` e `@Secured`?**

   > `GrantedAuthority` è l'interfaccia base per permessi; i ruoli sono `GrantedAuthority` con prefisso `ROLE_` per convenzione. `@Secured({"ROLE_ADMIN"})` è il modo semplice ma meno flessibile. `@PreAuthorize("hasRole('ADMIN') or #userId == authentication.principal.id")` supporta SpEL ed è molto più espressivo, permettendo di verificare condizioni basate sui parametri del metodo. Richiede `@EnableMethodSecurity` sulla configurazione.

6. **Come gestiresti il refresh del JWT token? Quali sono i rischi di sicurezza da considerare?**
7. **Cos'è il CSRF e perché spesso viene disabilitato nelle API stateless? Quando invece va abilitato?**
8. **Come implementeresti un `UserDetailsService` custom per caricare utenti da database?**
9. **Spiega il meccanismo di `PasswordEncoder`. Perché non si dovrebbe mai salvare la password in chiaro?**
10. **Cosa sono i Security Context e come vengono propagati tra thread diversi?**

---

## 📊 JPA/Hibernate

1. **Qual è la differenza tra `FetchType.LAZY` e `FetchType.EAGER`? Quando useresti uno o l'altro?**

   > `EAGER` carica le entità correlate subito, nella stessa query (o query aggiuntiva). `LAZY` le carica solo al primo accesso (proxy). Di default: `@ManyToOne` e `@OneToOne` sono EAGER, `@OneToMany` e `@ManyToMany` sono LAZY. In pratica si preferisce sempre LAZY per evitare caricamenti inutili di dati, usando `JOIN FETCH` nelle query JPQL quando serve caricare esplicitamente le relazioni.

2. **Cos'è il problema N+1 in JPA? Come lo individueresti e come lo risolveresti?**

   > Si verifica quando si carica una lista di N entità e poi per ognuna viene eseguita una query separata per caricare una relazione → 1 query iniziale + N query = N+1 totali. Si individua abilitando il log SQL (`show-sql: true`) o con strumenti come Hibernate Statistics. Si risolve con: `JOIN FETCH` nelle query JPQL, `@EntityGraph`, o batch fetching (`@BatchSize`).

3. **Spiega la differenza tra `@OneToMany`, `@ManyToOne`, `@ManyToMany` e `@OneToOne`. Quando usi `mappedBy`?**

   > Definiscono la cardinalità della relazione tra entità. `mappedBy` si usa sul lato **non-owning** della relazione bidirezionale per indicare che l'altra entità possiede la FK — evita la creazione di una tabella di join superflua. Ad esempio, in `@OneToMany(mappedBy = "book")` sulla classe `Book`, Hibernate sa che la FK è nella tabella `Review`, non in `books`.

4. **Cosa sono le entità in stato `transient`, `managed`, `detached` e `removed` nel lifecycle JPA?**

   > - **Transient**: oggetto creato con `new`, non tracciato da JPA.
   > - **Managed**: associato a un `EntityManager` attivo, le modifiche sono tracciate automaticamente.
   > - **Detached**: era managed ma la sessione è chiusa; le modifiche non sono sincronizzate con il DB.
   > - **Removed**: schedulato per la cancellazione al flush/commit.
   > Si transita tra stati con `persist()`, `merge()`, `remove()`, `detach()`, `refresh()`.

5. **Cos'è la `PersistenceContext` e come funziona il primo livello di cache di Hibernate?**

   > La `PersistenceContext` è il contesto gestito dall'`EntityManager` per la durata di una transazione. Funziona come cache di primo livello (L1): ogni entità caricata per la stessa sessione viene cachata in memoria — se richiedi due volte la stessa entità per ID, la seconda volta viene restituita dalla cache senza query SQL. Questo garantisce anche l'identità degli oggetti (`==` vera per la stessa entità nella stessa sessione).

6. **Qual è la differenza tra JPQL, HQL e SQL nativo? Quando useresti `@Query` con `nativeQuery = true`?**
7. **Come gestiresti l'ottimistic locking con `@Version` in JPA? Quando è preferibile al pessimistic locking?**
8. **Cosa fa `cascade = CascadeType.ALL`? Quali operazioni include e quali sono i rischi?**
9. **Come funziona il `ddl-auto` di Hibernate? Quali valori esistono e quale useresti in produzione?**
10. **Cos'è il `LazyInitializationException`? Come si genera e come si previene?**

---

## 🧪 JUnit 5

1. **Qual è la differenza tra `@Test`, `@ParameterizedTest`, `@RepeatedTest` e `@TestFactory`?**

   > - `@Test`: test semplice a singola esecuzione.
   > - `@ParameterizedTest`: esegue lo stesso test con input diversi (via `@ValueSource`, `@CsvSource`, `@MethodSource`).
   > - `@RepeatedTest(n)`: ripete il test n volte (utile per verificare comportamenti non deterministici).
   > - `@TestFactory`: genera test dinamicamente a runtime restituendo uno stream/collection di `DynamicTest`.

2. **Spiega la differenza tra `@BeforeEach`, `@BeforeAll`, `@AfterEach` e `@AfterAll`.**

   > - `@BeforeEach` / `@AfterEach`: eseguiti prima/dopo **ogni** singolo test method.
   > - `@BeforeAll` / `@AfterAll`: eseguiti una sola volta prima/dopo **tutti** i test della classe. Devono essere `static` (a meno di usare `@TestInstance(Lifecycle.PER_CLASS)`).
   > Si usano per setup/teardown: inizializzare mock, aprire connessioni, pulire stato condiviso.

3. **Cos'è Mockito? Qual è la differenza tra `@Mock`, `@Spy` e `@InjectMocks`?**

   > Mockito è un framework per creare oggetti simulati (mock) nei test.
   > - `@Mock`: crea un oggetto completamente simulato; tutti i metodi restituiscono valori di default.
   > - `@Spy`: avvolge un oggetto reale; i metodi non stubbati eseguono il codice reale.
   > - `@InjectMocks`: crea l'istanza della classe sotto test e inietta automaticamente i mock/spy dichiarati.
   > Richiede `@ExtendWith(MockitoExtension.class)` su JUnit 5.

4. **Come testeresti un controller Spring Boot senza avviare il server completo? Cos'è `@WebMvcTest`?**

   > `@WebMvcTest(BookController.class)` carica solo il layer web (controller, filtri, `MockMvc`) senza avviare il contesto Spring completo né il database. Si usa `MockMvc` per simulare richieste HTTP e verificare response status, headers e body JSON. I service e repository vengono mockati con `@MockBean`. È molto più veloce di `@SpringBootTest` per testare la logica dei controller.

5. **Qual è la differenza tra unit test, integration test e end-to-end test? Come li organizzeresti?**

   > - **Unit test**: testa una singola classe/metodo in isolamento, con dipendenze mockate. Velocissimi.
   > - **Integration test**: testa l'interazione tra più componenti reali (es. service + repository + DB). Con `@SpringBootTest` + `@DataJpaTest`.
   > - **E2E test**: testa l'intera applicazione dal frontend al backend (es. con Playwright o Selenium).
   > Organizzazione tipica: molti unit test (fast feedback), integration test selettivi per i flussi critici, pochi E2E costosi.

6. **Cosa fa `@SpringBootTest`? Quando è appropriato usarlo rispetto a `@WebMvcTest` o `@DataJpaTest`?**
7. **Come verificheresti che un metodo lanci una specifica eccezione in JUnit 5?**
8. **Cos'è il test coverage? Quale percentuale consideri accettabile e perché il 100% non è sempre l'obiettivo?**
9. **Come testeresti un metodo che chiama un servizio esterno (es. REST API di terze parti)?**
10. **Spiega la differenza tra `verify()` e `when().thenReturn()` in Mockito. Quando useresti l'uno o l'altro?**

---

## ⚡ Next.js 14

1. **Qual è la differenza tra Server Components e Client Components in Next.js 14? Come sceglieresti quale usare?**

   > I **Server Components** (default nell'App Router) vengono renderizzati sul server: accedono direttamente a DB/filesystem, non aumentano il bundle JS del client, ma non possono usare hooks o event listeners. I **Client Components** (marcati con `"use client"`) girano nel browser: supportano useState, useEffect, event handlers. Regola: usa Server Components per fetch dati e layout statici, Client Components solo dove serve interattività.

2. **Spiega le strategie di rendering: SSR, SSG, ISR e CSR. Quando useresti ciascuna?**

   > - **SSR** (Server-Side Rendering): HTML generato a ogni richiesta → dati sempre aggiornati (es. pagina profilo utente).
   > - **SSG** (Static Site Generation): HTML generato a build time → massima performance (es. blog, pagine marketing).
   > - **ISR** (Incremental Static Regeneration): SSG con `revalidate` → rigenera la pagina in background ogni N secondi (es. catalogo prodotti).
   > - **CSR** (Client-Side Rendering): fetch nel browser con useEffect → per dati privati non cachibili (es. dashboard utente dopo login).

3. **Come funziona il nuovo App Router rispetto al Pages Router? Quali sono i vantaggi principali?**

   > L'App Router usa la cartella `app/` con React Server Components per default, layout annidati (`layout.tsx`), loading UI (`loading.tsx`), error boundaries (`error.tsx`) e route groups. Il Pages Router usa `pages/` con tutti i componenti client-side di default. I vantaggi dell'App Router: streaming, Suspense nativo, fetch dati inline nei componenti, migliore code-splitting per layout condivisi.

4. **Cos'è il file `layout.tsx` nell'App Router? Come funziona il nesting dei layout?**

   > `layout.tsx` definisce la UI condivisa tra più pagine di una stessa route e persiste tra le navigazioni (non si ri-renderizza). I layout sono annidati: `app/layout.tsx` (root) → `app/admin/layout.tsx` → `app/admin/books/page.tsx`. Ogni layout riceve `children` (la pagina o il layout figlio). Questo evita re-mount di navbar e sidebar ad ogni navigazione.

5. **Come gestiresti le chiamate API in un Server Component vs un Client Component?**

   > In un **Server Component** si usa `fetch()` direttamente nella funzione asincrona del componente (no useEffect): `const data = await fetch('http://api/books').then(r => r.json())`. Next.js estende `fetch` con caching automatico e `revalidate`. In un **Client Component** si usa `useEffect` + `fetch`/`axios`, oppure librerie come SWR o React Query per gestire loading, caching e refetch automaticamente.

6. **Cosa sono i Route Handlers in Next.js 14 e come sostituiscono le API Routes del Pages Router?**
7. **Come implementeresti la gestione dello stato globale in Next.js 14? (Context API, Zustand, Redux)**
8. **Spiega il funzionamento del middleware in Next.js. Cosa puoi fare nel file `middleware.ts`?**
9. **Come ottimizzeresti le immagini in Next.js? Cos'è il componente `<Image>` e quali vantaggi offre?**
10. **Come gestiresti l'autenticazione in Next.js 14 con token JWT? Dove conserveresti il token?**

---

## 🎨 Tailwind CSS

1. **Qual è la filosofia "utility-first" di Tailwind? In cosa differisce dall'approccio CSS tradizionale o BEM?**

   > Con Tailwind si compone lo stile direttamente nell'HTML con classi atomiche (`flex`, `p-4`, `text-blue-500`) invece di scrivere CSS separato. Differisce da BEM (`.card__title--active`) che crea classi semantiche custom: Tailwind evita il problema di naming e del CSS che cresce nel tempo. Il trade-off è HTML verboso, ma con componenti React questo si gestisce bene perché lo stile è co-localizzato con il markup.

2. **Come configureresti un tema personalizzato in `tailwind.config.ts`? (colori, font, breakpoint)**

   > Si estende la sezione `theme.extend` per aggiungere senza sovrascrivere i valori di default:
   > ```ts
   > theme: { extend: { colors: { brand: '#6D28D9' }, fontFamily: { sans: ['Inter', 'sans-serif'] }, screens: { '3xl': '1920px' } } }
   > ```
   > Usando `extend` i colori/font/breakpoint Tailwind originali restano disponibili. Per sovrascrivere completamente si usa `theme` direttamente (senza `extend`).

3. **Cos'è il `content` array in `tailwind.config.ts` e perché è importante per il tree-shaking?**

   > Il `content` array specifica i file in cui Tailwind cerca le classi usate (es. `./src/**/*.{ts,tsx}`). In produzione, Tailwind analizza staticamente questi file e rimuove dal CSS finale tutte le classi non trovate (PurgeCSS integrato). Senza una configurazione corretta, il CSS di output includerebbe tutte le classi (~3MB), invece di pochi KB delle sole classi effettivamente usate.

4. **Come gestiresti i responsive breakpoints in Tailwind? (sm, md, lg, xl, 2xl)**

   > Tailwind usa un approccio **mobile-first**: le classi senza prefisso si applicano a tutti gli schermi, i prefissi (`sm:`, `md:`, `lg:`) si applicano da quella dimensione in su. Esempio: `class="text-sm md:text-base lg:text-lg"` → testo piccolo su mobile, medio su tablet, grande su desktop. I breakpoint di default sono: sm=640px, md=768px, lg=1024px, xl=1280px, 2xl=1536px.

5. **Qual è la differenza tra `@apply` nelle direttive CSS e l'uso diretto delle classi utility?**

   > `@apply` permette di raggruppare classi Tailwind in una classe CSS custom (es. `.btn { @apply px-4 py-2 bg-blue-500 rounded; }`). È utile per evitare ripetizione in componenti non-React (es. HTML puro, email template). Tuttavia, in React è preferibile creare componenti riutilizzabili con le classi direttamente nel JSX, o usare `cn()`/`clsx()`, perché `@apply` riduce i vantaggi del tree-shaking e complica il mantenimento.

6. **Come implementeresti il dark mode in Tailwind? Quali strategie esistono (`class` vs `media`)?**
7. **Come gestiresti stili condizionali in React con Tailwind? Conosci librerie come `clsx` o `cn`?**
8. **Come eviteresti la duplicazione di lunghe stringhe di classi Tailwind in componenti riutilizzabili?**
9. **Cos'è JIT (Just-In-Time) mode in Tailwind e quali vantaggi porta rispetto alla modalità classica?**
10. **Come testeresti visualmente i componenti stilizzati con Tailwind? Conosci Storybook o Chromatic?**

---

## 📱 TypeScript

1. **Qual è la differenza tra `interface` e `type` in TypeScript? Quando useresti uno o l'altro?**

   > Entrambi definiscono la forma di un oggetto, ma: `interface` è estendibile con `extends` e supporta la **declaration merging** (stessa interfaccia dichiarata due volte si fondono). `type` è più versatile: può definire union, intersection, tuple, tipi primitivi. In pratica: usa `interface` per oggetti/contratti pubblici di una libreria (può essere estesa), usa `type` per union types, alias complessi o quando vuoi prevenire il merging accidentale.

2. **Cosa sono i generici (`generics`) in TypeScript? Fai un esempio pratico.**

   > I generici permettono di creare componenti/funzioni type-safe che funzionano con tipi diversi. Esempio:
   > ```ts
   > function getFirst<T>(arr: T[]): T | undefined { return arr[0]; }
   > getFirst<string>(['a', 'b']); // restituisce string
   > getFirst<number>([1, 2]);     // restituisce number
   > ```
   > Nel progetto sono utili per tipi come `ApiResponse<T>`, `Page<Book>`, repository generici, ecc.

3. **Spiega la differenza tra `unknown`, `any` e `never`. Perché `any` è considerato una bad practice?**

   > - `any`: disabilita completamente il type checking → evitarlo perché annulla i benefici di TypeScript.
   > - `unknown`: tipo sicuro per valori di tipo sconosciuto → bisogna fare type narrowing prima di usarlo.
   > - `never`: rappresenta valori che non esistono mai (funzioni che non ritornano, rami impossibili in uno switch exhaustivo).
   > `unknown` è il sostituto sicuro di `any`: ti obbliga a verificare il tipo prima di operare sul valore.

4. **Cos'è il type narrowing? Come funziona con `typeof`, `instanceof` e i type guards custom?**

   > Type narrowing è il meccanismo con cui TypeScript restringe un tipo ampio a uno più specifico in un branch di codice. Con `typeof value === 'string'` TypeScript sa che nel ramo `true` il valore è `string`. Con `instanceof Error` restringe a `Error`. I **type guards custom** sono funzioni con `value is Type` come return type: `function isBook(x: unknown): x is Book { return typeof x === 'object' && x !== null && 'title' in x; }`.

5. **Cosa sono i mapped types e i conditional types? Fai un esempio con `Partial<T>` o `Pick<T, K>`.**

   > - **Mapped types**: trasformano un tipo iterando sulle sue chiavi. `Partial<T>` rende tutte le proprietà opzionali: `type Partial<T> = { [K in keyof T]?: T[K] }`.
   > - `Pick<T, K>`: estrae solo alcune chiavi: `type Pick<T, K extends keyof T> = { [P in K]: T[P] }`.
   > - **Conditional types**: `T extends U ? X : Y`. Usati in `NonNullable<T>`, `ReturnType<F>`, ecc.
   > Sono fondamentali per creare DTOs, form types e utility types senza duplicare le definizioni.

6. **Qual è la differenza tra `as const` e `readonly`? In quale scenario useresti l'uno o l'altro?**
7. **Come funziona il sistema di moduli in TypeScript? Qual è la differenza tra `import type` e `import`?**
8. **Cosa fa `strict: true` nel `tsconfig.json`? Quali controlli aggiuntivi attiva?**
9. **Come gestiresti i tipi per le risposte delle API (fetch/axios) in TypeScript?**
10. **Cos'è il `satisfies` operator introdotto in TypeScript 4.9? Quando è preferibile al type assertion (`as`)?**

---

## 🧩 React Hooks

1. **Spiega la differenza tra `useState` e `useReducer`. Quando è preferibile usare uno o l'altro?**

   > `useState` è per stato semplice e indipendente (stringa, numero, boolean). `useReducer` è preferibile quando lo stato è complesso (oggetto con più campi), le transizioni di stato seguono logica dipendente dallo stato precedente, o quando le azioni di aggiornamento sono molte e strutturate (pattern action/reducer simile a Redux). Esempio: un form con validazione multi-campo o uno state machine sono ottimi casi per `useReducer`.

2. **Come funziona `useEffect`? Spiega il dependency array e quando potrebbe causare loop infiniti.**

   > `useEffect(fn, deps)` esegue `fn` dopo il render. Con `[]` si esegue solo al mount; con `[a, b]` si riesegue quando `a` o `b` cambiano; senza secondo argomento si esegue dopo ogni render. Un **loop infinito** si verifica quando l'effect aggiorna uno stato che è nella dependency array, scatenando un re-render che riesegue l'effect, all'infinito. Un caso classico: inserire un oggetto/array inline nella dep array (nuovo riferimento ad ogni render).

3. **Cos'è `useCallback` e `useMemo`? Quando le ottimizzazioni di memoization sono effettivamente utili?**

   > - `useMemo(() => compute(), [deps])`: memoizza un **valore** computato costoso.
   > - `useCallback(() => fn(), [deps])`: memoizza una **funzione** (evita che cambi riferimento ad ogni render).
   > Sono effettivamente utili solo quando il componente figlio usa `React.memo` (altrimenti si ri-renderizza comunque), o quando il valore è usato come dipendenza di altri hook. **Non vanno usati indiscriminatamente**: aggiungono overhead di confronto e complessità.

4. **Come funziona `useRef`? Quali sono i casi d'uso oltre al riferimento a elementi DOM?**

   > `useRef` restituisce un oggetto `{ current: value }` che persiste tra i render senza causare re-render quando cambia. Usi principali: (1) riferimento a elementi DOM (`ref={myRef}` + `myRef.current.focus()`); (2) conservare il valore precedente di una prop/stato; (3) tenere un timer ID (`setTimeout`/`setInterval`) tra i render; (4) flag per evitare esecuzioni su componenti smontati.

5. **Cos'è il Context API e come si usa con `useContext`? Quali sono i limiti in termini di performance?**

   > Context API permette di condividere stato globale senza prop drilling. Si crea con `createContext`, si avvolge l'albero con `<MyContext.Provider value={...}>`, e si consuma con `useContext(MyContext)`. Il limite principale è la **performance**: ogni cambio del valore del context causa il re-render di **tutti** i componenti che lo consumano, anche se usano solo una parte del valore. Si mitigano con context separati per aree diverse, `useMemo` sul valore, o soluzioni come Zustand/Jotai.

6. **Come implementeresti un custom hook? Porta un esempio pratico (es. `useFetch`, `useLocalStorage`).**
7. **Spiega il problema dello "stale closure" in React. Come si manifesta e come si risolve?**
8. **Cos'è `useTransition` e `useDeferredValue` introdotti in React 18? Quando li useresti?**
9. **Come funziona il reconciliation di React? Cos'è la key prop e perché è importante nelle liste?**
10. **Qual è la differenza tra rendering controllato e non controllato nei form React?**

---

## 🍞 Sonner (Toast Notifications)

1. **Come configureresti il `<Toaster>` di Sonner a livello globale in un'app Next.js?**

   > Si aggiunge il componente `<Toaster>` nel layout root (`app/layout.tsx`), così è disponibile in tutta l'applicazione senza dover essere importato in ogni pagina. Essendo un componente client-side (usa DOM), nel contesto Next.js 14 App Router va importato in un Client Component o nel layout con `"use client"` se necessario. Configurazione base: `<Toaster position="top-right" richColors />`.

2. **Qual è la differenza tra `toast()`, `toast.success()`, `toast.error()` e `toast.promise()`?**

   > - `toast('msg')`: toast neutro/informativo.
   > - `toast.success('msg')`: toast verde con icona di successo.
   > - `toast.error('msg')`: toast rosso con icona di errore.
   > - `toast.promise(promise, { loading, success, error })`: gestisce automaticamente i tre stati di una Promise mostrando messaggi diversi per loading, risoluzione e rigetto. Ideale per operazioni async come salvataggio dati o chiamate API.

3. **Come gestiresti notifiche toast asincrone con `toast.promise()` per una chiamata fetch?**

   > ```ts
   > toast.promise(
   >   fetch('/api/books', { method: 'POST', body: JSON.stringify(data) }),
   >   {
   >     loading: 'Salvataggio in corso...',
   >     success: 'Libro salvato con successo!',
   >     error: (err) => `Errore: ${err.message}`,
   >   }
   > );
   > ```
   > Sonner mostra automaticamente lo spinner durante il fetch, poi sostituisce con il messaggio di successo o errore.

4. **Come personalizzaresti lo stile di un toast (colori, posizione, durata) in Sonner?**

   > A livello globale nel `<Toaster>`: `position="bottom-left"`, `duration={5000}`, `toastOptions={{ style: { background: '#1e1e1e', color: '#fff' } }}`. Per singolo toast: `toast.success('msg', { duration: 3000, style: { border: '1px solid green' } })`. Con `richColors` si ottengono colori semantici automatici senza CSS custom. Per temi dark/light si usa `theme="dark"` sul `<Toaster>`.

5. **Come implementeresti toast con azioni interattive (es. pulsante "Annulla") in Sonner?**

   > ```ts
   > toast('Elemento eliminato', {
   >   action: {
   >     label: 'Annulla',
   >     onClick: () => restoreItem(id),
   >   },
   >   duration: 5000,
   > });
   > ```
   > Sonner renderizza il pulsante "Annulla" nel toast. È utile per implementare pattern "undo" senza modale di conferma, migliorando la UX. La durata va calibrata per dare tempo all'utente di reagire.

6. **Sonner vs react-hot-toast vs react-toastify: quali sono le differenze principali?**
7. **Come gestiresti i toast in un contesto di Server Components di Next.js 14?**
8. **Come testeresti unitariamente un componente che chiama `toast.error()` con Jest?**
9. **Cos'è il `richColors` prop del `<Toaster>`? Cosa cambia visivamente nell'output?**
10. **Come gestiresti la deduplicazione dei toast (evitare duplicati per lo stesso errore)?**

---

## 🐳 Docker & Docker Compose

1. **Qual è la differenza tra un'immagine Docker e un container? Come funziona il layering delle immagini?**

   > Un'**immagine** è un template immutabile (read-only) composto da layer sovrapposti (ogni istruzione `RUN`, `COPY`, `ADD` nel Dockerfile crea un layer). Un **container** è un'istanza in esecuzione di un'immagine, con un layer scrivibile aggiunto sopra. I layer sono condivisi tra immagini con base comune (es. `openjdk:21`) → efficienza di storage. Le immagini sono costruite con `docker build`, i container creati/avviati con `docker run`.

2. **Spiega la differenza tra `CMD` e `ENTRYPOINT` in un Dockerfile. Come interagiscono tra loro?**

   > - `ENTRYPOINT`: definisce il comando principale dell'eseguibile del container (non sovrascrivibile con argomenti semplici in `docker run`).
   > - `CMD`: fornisce argomenti di default che possono essere sovrascritti in `docker run`.
   > Usati insieme: `ENTRYPOINT ["java", "-jar"]` + `CMD ["app.jar"]` → il container esegue `java -jar app.jar` ma si può sovrascrivere solo `app.jar` senza cambiare `ENTRYPOINT`. Solo `CMD`: tutto è sovrascrivibile.

3. **Cos'è un multi-stage build in Docker? Quali vantaggi porta in termini di dimensioni dell'immagine?**

   > Un multi-stage build usa più istruzioni `FROM` nello stesso Dockerfile. Ad esempio: primo stage con Maven/JDK per compilare il JAR, secondo stage con solo JRE per eseguirlo. Il risultato finale contiene solo gli artefatti copiati dall'ultimo stage (es. il JAR compilato), escludendo il JDK, Maven, sorgenti e dipendenze di build. Riduzione tipica dell'immagine: da ~700MB a ~200MB.

4. **Come funzionano i volumi in Docker? Qual è la differenza tra volume, bind mount e tmpfs?**

   > - **Volume** (`-v myvolume:/data`): gestito da Docker in `/var/lib/docker/volumes`. Persistente, portabile, ideale per dati DB in produzione.
   > - **Bind mount** (`-v /host/path:/container/path`): monta una directory dell'host nel container. Utile in sviluppo per hot-reload del codice.
   > - **tmpfs**: montato in memoria RAM, non persistente. Utile per dati sensibili temporanei (es. token, file di sessione).

5. **Come gestiresti i secret (password, API key) in Docker Compose in modo sicuro?**

   > Le opzioni sicure sono: (1) **variabili d'ambiente da file `.env`** (mai committare il `.env` con segreti); (2) **Docker Secrets** (in Swarm mode): `secrets:` in compose, montati in `/run/secrets/` nel container; (3) **vault esterni** (HashiCorp Vault, AWS Secrets Manager) con sidecar o SDK. In sviluppo si usa `.env` + `.gitignore`; in produzione si preferiscono Docker Secrets o vault. Mai hardcodare segreti nel `docker-compose.yml` o nel Dockerfile.

6. **Spiega la network di Docker Compose. Come comunicano i servizi tra loro per nome?**
7. **Qual è la differenza tra `docker-compose up`, `docker-compose up --build` e `docker-compose restart`?**
8. **Come implementeresti un health check in Docker Compose per attendere che il DB sia pronto prima dell'app?**
9. **Cos'è `.dockerignore`? Quali file è importante escludere e perché?**
10. **Come ottimizzeresti un Dockerfile per sfruttare al meglio la cache dei layer?**

---

## 🔧 Maven

1. **Spiega la struttura di un `pom.xml`. Cosa sono `groupId`, `artifactId` e `version`?**

   > Il `pom.xml` è il file di configurazione centrale di Maven. Le coordinate del progetto sono: `groupId` (organizzazione/namespace, es. `com.bookstore`), `artifactId` (nome del modulo/artefatto, es. `demo`), `version` (versione, es. `1.0.0-SNAPSHOT`). Insieme formano le "Maven Coordinates" che identificano univocamente il progetto nel repository. Il POM include anche dipendenze, plugin, profili e configurazione del build.

2. **Qual è il ciclo di vita di Maven? Spiega le fasi principali: `validate`, `compile`, `test`, `package`, `install`, `deploy`.**

   > Il lifecycle `default` procede in ordine: `validate` (verifica POM) → `compile` (compila sorgenti) → `test` (esegue unit test) → `package` (crea JAR/WAR) → `verify` (integration test) → `install` (copia nel repo locale `~/.m2`) → `deploy` (pubblica su repo remoto). Eseguire una fase include tutte quelle precedenti: `mvn package` esegue validate, compile, test e package.

3. **Qual è la differenza tra `dependency` e `plugin` in Maven?**

   > Una `dependency` è una libreria usata dal codice dell'applicazione a runtime o in compilazione (finisce nel classpath). Un `plugin` è uno strumento che estende il build process di Maven (es. `maven-compiler-plugin` per compilare, `spring-boot-maven-plugin` per creare il fat JAR eseguibile, `maven-surefire-plugin` per eseguire i test). I plugin eseguono goal durante le fasi del lifecycle, le dependency sono consumate dall'applicazione.

4. **Cos'è il Maven Repository locale (`~/.m2`)? Come funziona la risoluzione delle dipendenze?**

   > Il repository locale è una cache sul disco locale in `~/.m2/repository`. Quando Maven risolve una dipendenza, cerca prima nel repo locale; se non trovata, la scarica dal repository remoto (Maven Central di default, o repo aziendali come Nexus/Artifactory) e la salva in `~/.m2`. Questo evita download ripetuti. La struttura è `groupId/artifactId/version/artifactId-version.jar`.

5. **Cosa fa il tag `<scope>` nelle dipendenze? Spiega `compile`, `test`, `provided` e `runtime`.**

   > - `compile` (default): disponibile in compilazione e runtime, inclusa nel JAR finale.
   > - `test`: solo per i test (JUnit, Mockito), non nel JAR finale.
   > - `provided`: in compilazione ma non nel JAR finale (fornita dal container, es. `servlet-api` in un app server).
   > - `runtime`: non necessaria a compile time ma necessaria a runtime (es. driver JDBC, inclusa nel JAR finale).
   > Lo scope corretto riduce le dipendenze del JAR e previene conflitti.

6. **Come gestiresti le versioni delle dipendenze in modo centralizzato con `<dependencyManagement>`?**
7. **Cos'è il Maven Wrapper (`mvnw`)? Perché è preferibile includerlo nel progetto?**
8. **Come skipperesti i test durante la build con Maven? Quando è accettabile farlo?**
9. **Cos'è un BOM (Bill of Materials) in Maven? Come lo importeresti nel tuo `pom.xml`?**
10. **Come configureresti il Maven Surefire Plugin per personalizzare l'esecuzione dei test JUnit 5?**

---

## 📦 npm

1. **Qual è la differenza tra `dependencies` e `devDependencies` in `package.json`?**
2. **Spiega la differenza tra `npm install`, `npm ci` e quando si usa ciascuno (sviluppo vs CI/CD).**
3. **Cos'è il `package-lock.json`? Perché è importante committarlo nel repository?**
4. **Come gestiresti le versioni delle dipendenze? Spiega il significato di `^`, `~` e versione esatta.**
5. **Cos'è npm workspaces? Quando sarebbe utile in un progetto monorepo?**
6. **Come pubblicare un pacchetto npm privato? Cosa sono i scope (`@organization/package`)?**
7. **Qual è la differenza tra `npm run build` e `npm run dev` in un progetto Next.js?**
8. **Come gestiresti le variabili d'ambiente in un progetto Next.js con npm?**
9. **Cos'è `npx`? Come differisce da `npm exec` e quando lo useresti?**
10. **Come identificheresti e risolveresti vulnerabilità nelle dipendenze con `npm audit`?**

---

*Documento generato il 23 aprile 2026 — Progetto Bookstore*
