import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  Check,
  ChevronDown,
  FileChartColumn,
  FolderKanban,
  Gavel,
  GitBranch,
  MailWarning,
  Menu,
  Network,
  RefreshCw,
  Scale,
  Send,
  SlidersHorizontal,
  Sparkles,
  Target,
  Users,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import "./styles.css";
import SynthesisModal from "./SynthesisModal";
import audienceTailoringImg from "./assets/illustrations/audience-tailoring.png";
import calibrationImg from "./assets/illustrations/continuous-calibration.png";
import failuresImg from "./assets/illustrations/communication-failures.png";
import tailoredOutputsImg from "./assets/illustrations/tailored-outputs.png";
import underCommunicationCard from "./assets/illustrations/under-communication-card.png";
import overCommunicationCard from "./assets/illustrations/over-communication-card.png";
import informationDisposalImg from "./assets/illustrations/information-disposal.png";
import continuousRecalibrationImg from "./assets/illustrations/continuous-recalibration.png";
import stakeholderRegisterImg from "./assets/illustrations/stakeholder-register.png";
import orgChartRaciImg from "./assets/illustrations/org-chart-raci.png";
import developmentApproachImg from "./assets/illustrations/development-approach.png";
import legalRequirementsImg from "./assets/illustrations/legal-requirements.png";
import contentImg from "./assets/illustrations/content.png";
import formatImg from "./assets/illustrations/format.png";
import channelImg from "./assets/illustrations/channel.png";
import frequencyImg from "./assets/illustrations/frequency.png";

const screens = [
  "Audience first",
  "Keep calibrating",
  "Find the requirements",
  "Tailor four ways",
  "Avoid both failures",
  "Exam lens",
];
const sources = [
  {
    name: "Stakeholder register",
    icon: Users,
    image: stakeholderRegisterImg,
    kicker: "Stakeholder Register & Engagement Plan",
    text: "Captures each stakeholder's role, interest, and current engagement level — the baseline picture of who they are and how involved they currently are.",
  },
  {
    name: "Org chart + RACI",
    icon: Network,
    image: orgChartRaciImg,
    kicker: "Organizational Charts & Responsibility Matrices",
    text: "Reveal the formal relationships and information flows that govern how updates should actually move through the organization — who reports to whom, and who's accountable for what.",
  },
  {
    name: "Development approach",
    icon: GitBranch,
    image: developmentApproachImg,
    kicker: "Development Approach",
    text: "Whether the project runs predictive, adaptive, or hybrid shapes the cadence and format communication should take — a weekly sprint review calls for a different rhythm than a phase-gate report.",
  },
  {
    name: "Legal requirements",
    icon: Gavel,
    image: legalRequirementsImg,
    kicker: "Legal Requirements",
    text: "May specify outright what must be communicated, to whom, and in what form — removing discretion entirely in some cases.",
  },
];
const dimensions = [
  {
    name: "Content",
    icon: FileChartColumn,
    image: contentImg,
    kicker: "Content — what does this stakeholder actually need to know?",
    text: "A sponsor needs strategic progress and ROI signals. A technical team needs issue logs, dependency updates, and technical specifications. A regulator needs compliance evidence tied to defined milestones. End users need to understand what's changing, when, and what it means for them. Same event, four completely different messages.",
  },
  {
    name: "Format",
    icon: FolderKanban,
    image: formatImg,
    kicker: "Format — how should it be presented?",
    text: "PMBOK® 8 identifies communication skills as oral, visual, or electronic. Executive stakeholders typically need concise summaries with visual data. Technical teams may need detailed written documentation. Community or user groups may need plain-language summaries with the project management jargon stripped out entirely.",
  },
  {
    name: "Channel",
    icon: Send,
    image: channelImg,
    kicker: "Channel — how should it be delivered?",
    text: "PMBOK® 8 lists conversations, meetings, written documents, databases, social media, and websites as common methods. The right choice depends on urgency, sensitivity, the stakeholder's location, and the working environment — face-to-face or virtual, across time zones, across languages. A sensitive escalation calls for a private conversation; a routine update is well served by a structured report.",
  },
  {
    name: "Frequency",
    icon: RefreshCw,
    image: frequencyImg,
    kicker: "Frequency — how often does this stakeholder need to hear from the project?",
    text: "High-power, high-interest stakeholders may need weekly touchpoints. Peripheral stakeholders may need only milestone-triggered updates. Regulators may need formal communications tied to phase completions. The goal was never maximum communication — it's the right communication at the right time.",
  },
];
const quiz1 = {
  q: "The same scope change is being communicated to the executive sponsor and the end-user community. What is the correct approach?",
  answers: [
    "Send both groups the same detailed change-control document — consistency matters most",
    "Tailor content, format, and channel separately for each — same event, different needs",
    "Only inform the sponsor; end users don't need to know about scope changes",
    "Wait until the next scheduled newsletter to inform everyone at once",
  ],
  correct: 1,
  yes: "Right — identical facts, but the sponsor needs strategic/ROI framing while end users need plain-language \"what changes for you\" framing. Sending one version to both is what PMBOK® 8 calls information disposal, not communication.",
  no: "Reconsider — the underlying event is the same, but what each audience needs from that event isn't.",
};
const quiz2 = {
  q: "A project manager sends every stakeholder the full weekly status report, including detailed technical logs, regardless of role. Engagement scores are dropping. What's happening?",
  answers: [
    "The report isn't being sent frequently enough",
    "Over-communication — irrelevant detail is burying what each stakeholder actually needs, so they've stopped reading",
    "Under-communication — stakeholders need more detail, not less",
    "Engagement scores are unrelated to communication practices",
  ],
  correct: 1,
  yes: "Exactly — sending everyone everything looks thorough, but it's the over-communication failure mode: relevant signal gets lost in irrelevant noise, and stakeholders disengage rather than read.",
  no: "Look again at the direction of the problem — this is too much undifferentiated information, not too little.",
};

function tone(ok, on) {
  if (!on) return;
  const C = window.AudioContext || window.webkitAudioContext;
  if (!C) return;
  const c = new C(),
    o = c.createOscillator(),
    g = c.createGain(),
    n = c.currentTime;
  o.frequency.value = ok ? 720 : 430;
  g.gain.setValueAtTime(0.025, n);
  g.gain.exponentialRampToValueAtTime(0.0001, n + 0.14);
  o.connect(g);
  g.connect(c.destination);
  o.start();
  o.stop(n + 0.15);
  o.onended = () => c.close();
}
function Quiz({ data, sound, onFinish }) {
  const [picked, setPicked] = useState(null);
  const choose = (i) => {
    if (picked === data.correct) return;
    setPicked(i);
    tone(i === data.correct, sound);
  };
  return createPortal(
    <div className="knowledge-modal-backdrop">
      <motion.section
        className="quiz knowledge-modal"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="quiz-label">
          <Target size={16} /> MICRO KNOWLEDGE CHECK
        </div>
        <h3>{data.q}</h3>
        <div className="answers">
          {data.answers.map((a, i) => (
            <button
              key={a}
              className={
                picked === i ? (i === data.correct ? "correct" : "wrong") : ""
              }
              onClick={() => choose(i)}
            >
              <span>{String.fromCharCode(65 + i)}</span>
              {a}
            </button>
          ))}
        </div>
        {picked !== null && (
          <p className={`feedback ${picked === data.correct ? "good" : "bad"}`}>
            {picked === data.correct ? data.yes : data.no}
          </p>
        )}
        {picked !== null && (
          <button className="finish-check" onClick={onFinish}>
            Finish check <ArrowRight size={18} />
          </button>
        )}
      </motion.section>
    </div>,
    document.body,
  );
}
function Sheet({ detail, onClose, onRead, modal = false }) {
  useEffect(() => {
    const f = (e) => e.key === "Escape" && onClose();
    addEventListener("keydown", f);
    return () => removeEventListener("keydown", f);
  }, [onClose]);
  if (!detail) return null;
  const I = detail.icon;
  return createPortal(
    <motion.div
      className={`modal-backdrop ${modal ? "focused-modal-backdrop" : ""}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: .22 }}
      onClick={onClose}
    >
      <motion.aside
        className={modal ? "detail-sheet detail-modal" : "detail-sheet"}
        initial={modal ? { opacity: 0, y: 28, scale: .96 } : { x: "100%" }}
        animate={modal ? { opacity: 1, y: 0, scale: 1 } : { x: 0 }}
        exit={modal ? { opacity: 0, y: 18, scale: .97 } : { x: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30, mass: .8 }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button className="drawer-close" onClick={onClose}>
          <X />
        </button>
        {detail.image ? (
          <img className="drawer-illustration" src={detail.image} alt="" />
        ) : (
          I && (
            <div className="sheet-icon">
              <I />
            </div>
          )
        )}
        <p className="mini-label">{detail.kicker}</p>
        <h3>{detail.name || detail.title}</h3>
        <p>{detail.text}</p>
        {detail.note && (
          <div className="sheet-note">
            <Target size={18} />
            <span>{detail.note}</span>
          </div>
        )}
        <button className="modal-close-bottom" onClick={onRead}>
          <Check size={18} /> Mark as read
        </button>
      </motion.aside>
    </motion.div>,
    document.body,
  );
}
function LessonArt({ src, alt, className = "" }) {
  return (
    <img className={`custom-lesson-art ${className}`} src={src} alt={alt} />
  );
}
function App() {
  const [page, setPage] = useState(0),
    [sound, setSound] = useState(true),
    [menu, setMenu] = useState(false),
    [reveal, setReveal] = useState(false),
    [sourceOpen, setSourceOpen] = useState(0),
    [sourceSeen, setSourceSeen] = useState([]),
    [dimOpen, setDimOpen] = useState(0),
    [dimSeen, setDimSeen] = useState([]),
    [flips, setFlips] = useState([]),
    [quiz, setQuiz] = useState(null),
    [q1, setQ1] = useState(false),
    [q2, setQ2] = useState(false),
    [detail, setDetail] = useState(null),
    [done, setDone] = useState(false),
    [synthesisOpen, setSynthesisOpen] = useState(false);
  useEffect(() => {
    setReveal(false);
    setQuiz(null);
  }, [page]);
  const can = [
    reveal,
    reveal,
    sourceSeen.length === 4,
    dimSeen.length === 4 && q1,
    flips.length === 2 && q2,
    done,
  ][page];
  const items = page === 2 ? sources : dimensions,
    open = page === 2 ? sourceOpen : dimOpen,
    seen = page === 2 ? sourceSeen : dimSeen;
  const openItem = (index = open) => setDetail(items[index]);
  const markRead = () => {
    if (page === 2) {
      setSourceSeen((v) => (v.includes(sourceOpen) ? v : [...v, sourceOpen]));
      setDetail(null);
      if (sourceOpen < 3) setSourceOpen(sourceOpen + 1);
    } else if (page === 3) {
      setDimSeen((v) => (v.includes(dimOpen) ? v : [...v, dimOpen]));
      setDetail(null);
      if (dimOpen < 3) setDimOpen(dimOpen + 1);
    } else setDetail(null);
  };
  const next = () => {
    if (can && page < 5) {
      setPage(page + 1);
      scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="course-select">
          <Award />
          <span>PMP Project Management Professional</span>
          <ChevronDown />
        </button>
        <div className="module-progress">
          <div>
            {Array.from({ length: 10 }, (_, i) => (
              <span
                key={i}
                className={`progress-dot ${i < 8 ? "done" : i === 8 ? "active" : ""}`}
              >
                {i < 8 ? <Check size={10} /> : <span />}
              </span>
            ))}
          </div>
        </div>
        <div className="top-actions">
          <button className="ghost-button" onClick={() => setSound(!sound)}>
            {sound ? <Volume2 size={20} /> : <VolumeX size={20} />}
            <span>{sound ? "Sound on" : "Sound off"}</span>
          </button>
          <button className="ghost-button">
            <X size={20} />
            <span>Quit</span>
          </button>
        </div>
      </header>
      <main className="workspace">
        <section className="lesson-stage">
          <div className="outline">
            <button className="menu-button" onClick={() => setMenu(!menu)}>
              <Menu />
            </button>
            {menu && (
              <div className="outline-panel">
                <div className="outline-summary">
                  <b>Lesson 3.3.2</b>
                  <span className="summary-track">
                    <span
                      style={{
                        width: `${((page + (can ? 1 : 0)) / 6) * 100}%`,
                      }}
                    />
                  </span>
                </div>
                <div className="lesson-list">
                  {screens.map((s, i) => (
                    <button
                      key={s}
                      className={`lesson ${i === page ? "current" : ""}`}
                      disabled={i > page}
                      onClick={() => setPage(i)}
                    >
                      <span
                        className={`progress-dot ${i < page ? "done" : i === page ? "active" : ""}`}
                      >
                        {i < page ? <Check size={10} /> : <span />}
                      </span>
                      <span>{s}</span>
                      <small>{i + 1}</small>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <article className="lesson-card">
            <nav className="section-tabs">
              <p className="section-tabs-count">Section {page + 1} of 6</p>
              <div className="section-tabs-row">
                {screens.map((s, i) => (
                  <button
                    key={s}
                    className={`section-tab ${i === page ? "active" : i < page ? "done" : "locked"}`}
                    disabled={i > page}
                    onClick={() => setPage(i)}
                  >
                    {i < page && <Check size={14} />}
                    <span>{s}</span>
                  </button>
                ))}
              </div>
            </nav>
            <AnimatePresence mode="wait">
              <motion.section
                key={page}
                className={`lesson-content comm-page page-${page}`}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -35 }}
              >
                {page === 0 && (
                  <div className="comm-hero">
                    <div>
                      <p className="eyebrow">LESSON 3.3.2</p>
                      <h1>Analyze and Tailor Communication to Stakeholder Needs</h1>
                      <p>A doctor explaining a diagnosis to a patient doesn't use the same words she'd use presenting that same case to a room full of specialists. Same diagnosis. Same underlying facts. Completely different vocabulary, detail level, and delivery — because using the wrong one on the wrong audience either terrifies the patient or insults the specialists' intelligence.</p>
                      <button
                        className="primary compact-cta"
                        onClick={() => {
                          setReveal(true);
                          setDetail({
                            title: "Stakeholder communication works exactly the same way",
                            kicker: "CLICK-TO-REVEAL",
                            icon: Send,
                            image: informationDisposalImg,
                            text: "Stakeholder communication on a project works exactly the same way. The third enabler of ECO People Task 4, Engage Stakeholders, asks the project manager to analyze and tailor communication — using what the stakeholder analysis already revealed about each stakeholder's power, interest, influence, and impact to determine what information they need, in what format, through what channel, and at what frequency. PMBOK® 8 is blunt about the stakes here: communication that is not tailored to the receiver is not communication — it is information disposal.",
                            note: "Communication that is not tailored to the receiver is not communication — it is information disposal.",
                          });
                        }}
                      >
                        Reveal the communication gap <ArrowRight />
                      </button>
                    </div>
                    <LessonArt
                      src={audienceTailoringImg}
                      alt="One diagnosis tailored into a simple patient explanation and a detailed specialist presentation"
                    />
                  </div>
                )}
                {page === 1 && (
                  <div className="calibration">
                    <div>
                      <p className="eyebrow">SCREEN 2</p>
                      <h2>Tailoring Is Not a One-Time Task</h2>
                      <p>It would be convenient if tailoring communication were something you decided once, during planning, and never touched again. It isn't — and treating it that way is one of the quieter ways stakeholder engagement quietly breaks down.</p>
                      <button
                        className="primary compact-cta"
                        onClick={() => {
                          setReveal(true);
                          setDetail({
                            title: "Tailoring must be reviewed and adjusted continuously",
                            kicker: "CLICK-TO-REVEAL",
                            icon: SlidersHorizontal,
                            image: continuousRecalibrationImg,
                            text: "As stakeholder needs shift, as new parties join, and as the project moves through phases, the communication approach has to be reviewed and adjusted continuously. A tailoring plan built at kickoff and never revisited will drift out of step with the stakeholders it was built for — the same way any other plan does when the project around it keeps changing and the plan doesn't.",
                          });
                        }}
                      >
                        Reveal the calibration rule <ArrowRight />
                      </button>
                    </div>
                    <LessonArt
                      src={calibrationImg}
                      alt="Communication is recalibrated across three phases as the stakeholder group changes"
                    />
                  </div>
                )}
                {page === 2 && (
                  <Explorer
                    title="Analyzing Communication Requirements"
                    lede="Before anything can be tailored, the project manager first has to understand what each stakeholder actually needs to know — and PMBOK® 8 points to four specific places to find that answer."
                    items={sources}
                    open={sourceOpen}
                    seen={sourceSeen}
                    setOpen={setSourceOpen}
                    openItem={openItem}
                    stat
                  />
                )}
                {page === 3 && (
                  <>
                    <Explorer
                      title="Four Dimensions to Tailor"
                      lede="Once the requirements are understood, tailoring itself comes down to four dimensions — and the same underlying event, say a scope change or a delay, needs a completely different version of each one depending on who's receiving it. Click each to explore."
                      items={dimensions}
                      open={dimOpen}
                      seen={dimSeen}
                      setOpen={setDimOpen}
                      openItem={openItem}
                    />
                    {dimSeen.length === 4 && <div className="backing">PMBOK® 8 also names communication styles assessment as a specific technique for stakeholders who are unsupportive or resistant — assessing their preferred communication style to spot gaps in engagement and determine which tailored activities would actually move them toward alignment.</div>}
                    {dimSeen.length === 4 && !q1 && (
                      <button
                        className="knowledge-check-cta"
                        onClick={() => setQuiz(quiz1)}
                      >
                        <Target /> Start knowledge check <ArrowRight />
                      </button>
                    )}
                  </>
                )}
                {page === 4 && (
                  <div className="wide">
                    <p className="eyebrow">SCREEN 5</p>
                    <h2>Why Tailoring Matters: Two Ways to Get It Wrong</h2>
                    <p className="lede">PMBOK® 8 is explicit that stakeholder satisfaction depends on continuous communication. But "continuous" without "tailored" doesn't protect anyone — it just fails in one of two predictable directions. Flip both cards to see them.</p>
                    <div className="flip-grid">
                      {[
                        {
                          name: "Under-communication",
                          icon: MailWarning,
                          image: underCommunicationCard,
                          text: "Leaving stakeholders without the information they need to make decisions or stay engaged. They're informed too late, too little, or not at all — and find out through the grapevine instead of through the project.",
                        },
                        {
                          name: "Over-communication",
                          icon: FolderKanban,
                          image: overCommunicationCard,
                          text: "Flooding stakeholders with information irrelevant to their role until they stop reading entirely. The signal that actually matters gets buried in noise they've learned to tune out.",
                        },
                      ].map((f, i) => {
                        const I = f.icon;
                        return (
                          <div className="illustrated-flip" key={f.name}>
                          <img className="flip-card-art" src={f.image} alt="" />
                          <button
                            className={`flip ${flips.includes(i) ? "flipped" : ""}`}
                            onClick={() =>
                              setFlips((v) => (v.includes(i) ? v : [...v, i]))
                            }
                          >
                            <div className="flip-inner">
                              <div className="flip-front">
                                <small>CLICK TO FLIP</small>
                                <h3>{f.name}</h3>
                              </div>
                              <div className="flip-back">
                                <small>FAILURE MODE</small>
                                <h3>{f.name}</h3>
                                <p>{f.text}</p>
                              </div>
                            </div>
                          </button>
                          </div>
                        );
                      })}
                    </div>
                    {flips.length === 2 && (
                      <div className="backing">
                        Both failure modes land in the exact same place: stakeholders who aren't informed when they need to be, decisions made without the right input, and resistance that builds quietly until it surfaces as a visible problem. Tailored communication is what prevents both at once — it puts the right information in front of the right stakeholder, at the right moment, in a format they can use, through a channel they'll actually access.
                      </div>
                    )}
                    {flips.length === 2 && !q2 && (
                      <button
                        className="knowledge-check-cta"
                        onClick={() => setQuiz(quiz2)}
                      >
                        <Target /> Start knowledge check <ArrowRight />
                      </button>
                    )}
                  </div>
                )}
                {page === 5 && (
                  <div className="exam">
                    <LessonArt
                      src={tailoredOutputsImg}
                      alt="One project update tailored into concise executive, detailed technical, and plain-language community outputs"
                    />
                    <div>
                      <p className="eyebrow">SCREEN 6 · SYNTHESIS (EXAM LENS)</p>
                      <h2>Every stakeholder on a project sits in a different seat, with a different stake in the outcome — and one idea underlies everything this enabler is testing for.</h2>
                      <button
                        className="primary compact-cta"
                        disabled={done}
                        onClick={() => setSynthesisOpen(true)}
                      >
                        {done ? "Synthesis reviewed" : "Reveal the synthesis"}
                        <Sparkles />
                      </button>
                    </div>
                  </div>
                )}
              </motion.section>
            </AnimatePresence>
            {can && (
              <div className="anchor">
                <Check /> Interaction complete — continue when ready.
              </div>
            )}
            <footer className="nav-footer">
              <button
                className="secondary-button"
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
              >
                <ArrowLeft /> Previous
              </button>
              <button
                className={`primary-button ${can ? "unlocked" : ""}`}
                disabled={!can}
                onClick={next}
              >
                {page === 5 ? "Complete" : "Continue"}
                <ArrowRight />
              </button>
            </footer>
          </article>
        </section>
      </main>
      <AnimatePresence>
      {detail && (
        <Sheet
          detail={detail}
          modal={page <= 3}
          onClose={() => setDetail(null)}
          onRead={markRead}
        />
      )}
      {synthesisOpen && (
        <SynthesisModal
          title="Tailor communication to the receiver"
          onClose={() => setSynthesisOpen(false)}
          onReviewed={() => {
            setDone(true);
            setSynthesisOpen(false);
          }}
        >
          <p>A single communication approach cannot serve all of them. Analyze communication requirements. Understand what each stakeholder needs to know, in what format, through what channel, and at what frequency. Then tailor accordingly — and revisit that tailoring as the project evolves and stakeholder needs shift. Communication that isn't tailored to the receiver isn't communication at all — it's information landing in the wrong place, in the wrong form, at the wrong time, producing exactly the friction good stakeholder engagement exists to prevent.</p>
          <h4>Exam-relevant enablers to remember:</h4>
          <ul>
            <li>Tailoring rests on four dimensions: content, format, channel, frequency — all four, not just one</li>
            <li>Requirements come from the stakeholder register, org charts/RACI, development approach, and legal requirements</li>
            <li>Under-communication and over-communication are both failures — the goal is right information, not maximum information</li>
            <li>Tailoring is continuous, revisited as stakeholders, phases, and needs change</li>
          </ul>
        </SynthesisModal>
      )}
      </AnimatePresence>{" "}
      {quiz && (
        <Quiz
          data={quiz}
          sound={sound}
          onFinish={() => {
            if (quiz === quiz1) setQ1(true);
            else setQ2(true);
            setQuiz(null);
          }}
        />
      )}
    </div>
  );
}
function Explorer({ title, lede, items, open, seen, setOpen, openItem, stat }) {
  return (
    <div className="wide">
      <p className="eyebrow">ANALYZE BEFORE YOU SEND</p>
      <h2>{title}</h2>
      <p className="lede">{lede}</p>
      <div className="direct-card-grid">
          {items.map((x, i) => {
            const X = x.icon;
            return (
              <button
                key={x.name}
                className={`direct-detail-card ${seen.includes(i) ? "visited" : ""}`}
                onClick={() => {
                  setOpen(i);
                  openItem(i);
                }}
              >
                <span className="direct-card-icon">
                  <X />
                </span>
                <span className="direct-card-copy">
                  <small>{seen.includes(i) ? <><Check size={14}/> READ</> : `0${i + 1}`}</small>
                  <strong>{x.name}</strong>
                </span>
                <ArrowRight className="direct-card-arrow" />
              </button>
            );
          })}
      </div>
      {stat && (
        <div className="stat-callout">
          <b>190</b>
          <span>
            The number of potential communication channels matters too. A project with 20 stakeholders has up to 190 possible communication paths. Not all of them are relevant — but understanding the size of that network is what prevents both communication gaps and communication overload.
          </span>
          <Network />
        </div>
      )}
    </div>
  );
}
createRoot(document.getElementById("root")).render(<App />);
