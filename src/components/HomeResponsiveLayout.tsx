import { FunctionComponent, useState, useCallback } from "react";
import { CHATBOT } from "./CHATBOT";
import PortalPopup from "./PortalPopup";
import CallToActionContainer from "./CallToActionContainer";
import styles from "./HomeResponsiveLayout.module.css";

export type HomeResponsiveLayoutType = {
  className?: string;
};

const HomeResponsiveLayout: FunctionComponent<HomeResponsiveLayoutType> = ({
  className = "",
}) => {
  const [isCHATBOTPopupOpen, setCHATBOTPopupOpen] = useState(false);

  const openCHATBOTPopup = useCallback(() => {
    setCHATBOTPopupOpen(true);
  }, []);

  const closeCHATBOTPopup = useCallback(() => {
    setCHATBOTPopupOpen(false);
  }, []);

  return (
    <>
      <div className={[styles.homeResponsiveLayout, className].join(" ")}>
        <header className={styles.logo}>
          <b className={styles.logo1}>mATCHPRIVÉ</b>
        </header>
        <section className={styles.heroBanner}>
          <h2 className={styles.tagline}>
            <p className={styles.noSwiping}>{`No swiping. `}</p>
            <p className={styles.noSwiping}>{`No browsing. `}</p>
            <p className={styles.noSwiping}>Just meaningful matches.</p>
          </h2>
        </section>
        <section className={styles.heroContent}>
          <div className={styles.leftContentContainer}>
            <b className={styles.leftContentText}>
              Traditional premium matchmaking costs thousands.
            </b>
            <div className={styles.leftContentHighlight} />
          </div>
          <div className={styles.rightContent}>
            <b className={styles.leftContentText}>
              We think Finding love should be free.
            </b>
            <div className={styles.leftContentHighlight1} />
          </div>
        </section>
        <section className={styles.stepsContent}>
          <div className={styles.one}>
            <div className={styles.titleOne}>
              <div className={styles.titleOneChild} />
              <b className={styles.stepOneTitle}>ONE</b>
            </div>
            <div className={styles.stepOneDescriptionContainer}>
              <span>{`Answer thoughtful questions designed to help our AI deeply understand your values, lifestyle, and `}</span>
              <b>what truly matters to you</b>
              <span>.</span>
            </div>
          </div>
          <div className={styles.two}>
            <div className={styles.titleTwo}>
              <div className={styles.activeIndicator} />
              <b className={styles.stepOneTitle}>TWO</b>
            </div>
            <div className={styles.stepOneDescriptionContainer}>
              <span>
                Our deeply trained AI carefully assesses your profile, matching
                you
              </span>
              <b>
                {" "}
                only when there's genuine potential for meaningful connection.
              </b>
            </div>
          </div>
          <div className={styles.two}>
            <div className={styles.titleTwo}>
              <div className={styles.titleOneChild} />
              <b className={styles.stepOneTitle}>THREE</b>
            </div>
            <div className={styles.stepOneDescriptionContainer}>
              <span>{`Engage in meaningful conversations with `}</span>
              <b>carefully selected matches</b>
              <span> who truly align with your life and aspirations.</span>
            </div>
          </div>
        </section>
        <CallToActionContainer />
        <footer className={styles.content}>
          <div className={styles.content1}>
            <b className={styles.faqTitle}>
              WHAT HAPPENS AFTER I GET MY MATCH?
            </b>
            <div className={styles.faqDescription}>
              When we find someone truly compatible with you, you'll receive an
              email invitation to view your match. If you're interested, both of
              you will confirm before moving forward—no awkward surprises. Once
              confirmed, you'll complete a quick identity verification to ensure
              every match is real and serious. From there, you'll get access to
              a private, secure chat where you can exchange a few messages
              before deciding whether to continue the conversation on your own
              terms. No endless swiping, no wasted time—just real, meaningful
              connections.
            </div>
          </div>
          <div className={styles.content2}>
            <b className={styles.whyMatchprivTitle}>WHY mATCHPRIVÉ?</b>
            <div
              className={styles.faqDescription}
            >{`MatchPrivé was inspired by real love stories from couples we've met through Lark & Berry, a luxury jewelry brand we founded to celebrate genuine connections. Hearing their stories while creating engagement rings made us realize we could use AI to help more people find the kind of rare love that lasts forever.`}</div>
          </div>
        </footer>
        <section className={styles.footer}>
          <div className={styles.footerContents}>
            <div className={styles.links}>
              <b className={styles.privacyPolicy}>Privacy Policy •</b>
              <b className={styles.privacyPolicy}>{`Terms & Conditions •`}</b>
              <b className={styles.privacyPolicy}>Contact</b>
            </div>
            <b className={styles.rights}>
              © 2025 MatchPrivé. All Rights Reserved.
            </b>
          </div>
        </section>
      </div>
      <CHATBOT />
    </>
  );
};

export default HomeResponsiveLayout;
