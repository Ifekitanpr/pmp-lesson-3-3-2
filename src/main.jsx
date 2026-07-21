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
    kicker: "WHO THEY ARE",
    text: "The stakeholder register and engagement plan reveal role, interest, influence, and current engagement—the baseline for deciding what each person actually needs.",
  },
  {
    name: "Org chart + RACI",
    icon: Network,
    image: orgChartRaciImg,
    kicker: "HOW INFORMATION MOVES",
    text: "Organizational charts and responsibility matrices expose formal relationships, reporting lines, accountability, and the routes updates should follow.",
  },
  {
    name: "Development approach",
    icon: GitBranch,
    image: developmentApproachImg,
    kicker: "THE OPERATING RHYTHM",
    text: "Predictive, adaptive, and hybrid delivery create different cadences. A sprint review and a phase-gate report cannot use the same rhythm.",
  },
  {
    name: "Legal requirements",
    icon: Gavel,
    image: legalRequirementsImg,
    kicker: "WHEN DISCRETION ENDS",
    text: "Law or regulation may prescribe exactly what must be communicated, to whom, and in what form. In those cases tailoring begins inside a fixed boundary.",
  },
];
const dimensions = [
  {
    name: "Content",
    icon: FileChartColumn,
    image: contentImg,
    kicker: "WHAT THEY NEED",
    text: "Sponsors need strategic progress and ROI signals. Technical teams need issues, dependencies, and specifications. Regulators need evidence. End users need plain-language impact.",
  },
  {
    name: "Format",
    icon: FolderKanban,
    image: formatImg,
    kicker: "HOW IT IS SHAPED",
    text: "Executives often need concise visual summaries; specialists need detailed documentation; users and communities need jargon-free explanations they can act on.",
  },
  {
    name: "Channel",
    icon: Send,
    image: channelImg,
    kicker: "HOW IT REACHES THEM",
    text: "Urgency, sensitivity, location, time zone, and language determine whether the message belongs in a private conversation, meeting, report, database, site, or social channel.",
  },
  {
    name: "Frequency",
    icon: RefreshCw,
    image: frequencyImg,
    kicker: "WHEN IT ARRIVES",
    text: "High-power, high-interest stakeholders may need weekly touchpoints; peripheral groups may need milestones; regulators may require formal phase-triggered communication.",
  },
];
const quiz1 = {
  q: "The same scope change is being communicated to the executive sponsor and the end-user community. What is the correct approach?",
  answers: [
    "Send both groups the same detailed change-control document",
    "Tailor content, format, and channel separately for each",
    "Only inform the sponsor",
    "Wait for the next newsletter and inform everyone together",
  ],
  correct: 1,
  yes: "Right—identical facts, but the sponsor needs strategic framing while end users need plain-language impact.",
  no: "Reconsider: the event is the same, but what each audience needs from it is not.",
};
const quiz2 = {
  q: "Every stakeholder receives the full weekly report, including technical logs, and engagement is dropping. What is happening?",
  answers: [
    "The report is not frequent enough",
    "Over-communication is burying relevant signal",
    "Stakeholders need even more detail",
    "Engagement is unrelated to communication",
  ],
  correct: 1,
  yes: "Exactly—sending everyone everything buries the signal in irrelevant noise.",
  no: "Look at the direction of the problem: this is too much undifferentiated information, not too little.",
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
        {picked === data.correct && (
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
    [done, setDone] = useState(false);
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
                      <p className="eyebrow">LESSON 3.3.2 · ANALYZE AND TAILOR COMMUNICATION TO STAKEHOLDER NEEDS</p>
                      <h1>
                        Same facts.
                        <br />
                        <em>Different receiver.</em>
                      </h1>
                      <p>
                        A doctor does not explain one diagnosis to a patient
                        with the same vocabulary used for a room of specialists.
                        The facts stay true. The communication changes.
                      </p>
                      <button
                        className="primary compact-cta"
                        onClick={() => {
                          setReveal(true);
                          setDetail({
                            title: "Information disposal is not communication",
                            kicker: "THE STAKE",
                            icon: Send,
                            image: informationDisposalImg,
                            text: "ECO People Task 4 asks the project manager to analyze stakeholder power, interest, influence, and impact before communicating. That analysis determines what each stakeholder needs to know, the language and level of detail they can use, the most effective format and channel, and how often communication should occur.",
                            note: "Sending information is not the same as creating understanding. If the receiver cannot interpret or act on it, the information was disposed of—not communicated.",
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
                      <p className="eyebrow">TAILORING IS CONTINUOUS</p>
                      <h2>
                        A communication plan can <em>drift too.</em>
                      </h2>
                      <p>
                        Stakeholders change. New parties join. Project phases
                        alter the rhythm. A tailoring decision made at kickoff
                        cannot remain correct forever.
                      </p>
                      <button
                        className="primary compact-cta"
                        onClick={() => {
                          setReveal(true);
                          setDetail({
                            title: "Keep recalibrating",
                            kicker: "NOT A ONE-TIME SETTING",
                            icon: SlidersHorizontal,
                            image: continuousRecalibrationImg,
                            text: "Tailoring is a continuous assessment, not a kickoff decision. Review and adjust the approach as stakeholders join or leave, influence changes, project phases alter the required rhythm, and feedback reveals that a channel or format is no longer working. A static plan quietly drifts away from the audience it was designed to serve.",
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
                    title="Four places reveal what stakeholders need."
                    lede="Open each source, read its role, then mark it complete."
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
                      title="Tailor every message across four dimensions."
                      lede="The same event needs a different version for each receiver."
                      items={dimensions}
                      open={dimOpen}
                      seen={dimSeen}
                      setOpen={setDimOpen}
                      openItem={openItem}
                    />
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
                    <p className="eyebrow">TWO WAYS TO FAIL</p>
                    <h2>Too little and too much land in the same place.</h2>
                    <p className="lede">Flip both cards to see why.</p>
                    <div className="flip-grid">
                      {[
                        {
                          name: "Under-communication",
                          icon: MailWarning,
                          image: underCommunicationCard,
                          text: "Stakeholders receive too little, too late, or nothing. Decisions arrive without context, risks are discovered after they become problems, and people learn through the grapevine instead of the project. Trust erodes because silence is interpreted as exclusion or concealment.",
                        },
                        {
                          name: "Over-communication",
                          icon: FolderKanban,
                          image: overCommunicationCard,
                          text: "Every stakeholder receives every detail, regardless of relevance or decision authority. Message volume becomes noise, people stop reading, and the few signals that genuinely require attention disappear inside routine information.",
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
                        Both failures leave stakeholders effectively uninformed
                        when it matters. Tailoring is the discipline of putting
                        the right signal—in an usable form—in front of the right
                        person at the right time.
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
                      <p className="eyebrow">
                        EXAM LENS · RIGHT MESSAGE, RIGHT RECEIVER
                      </p>
                      <h2>One approach cannot serve every stakeholder.</h2>
                      <p className="lede">Effective communication preserves the facts while changing the message so each receiver can understand it, trust it, and use it.</p>
                      <button
                        className="primary compact-cta"
                        onClick={() => setDone(true)}
                      >
                        {done
                          ? "Communication tailored"
                          : "Reveal the exam rules"}
                        <Sparkles />
                      </button>
                      {done && (
                        <ul>
                          <li>
                            Tailor content, format, channel, and frequency.
                          </li>
                          <li>
                            Use the register, org/RACI, development approach,
                            and legal requirements.
                          </li>
                          <li>Avoid both under- and over-communication.</li>
                          <li>Revisit tailoring as the project evolves.</li>
                        </ul>
                      )}
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
            A project with 20 stakeholders has up to 190 possible communication
            paths.
          </span>
          <Network />
        </div>
      )}
    </div>
  );
}
createRoot(document.getElementById("root")).render(<App />);
