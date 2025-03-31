import { FunctionComponent, useState, useCallback } from "react";
import CHATBOT from "./CHATBOT";
import PortalPopup from "./PortalPopup";
import styles from "./CallToActionContainer.module.css";

export type CallToActionContainerType = {
  className?: string;
};

const CallToActionContainer: FunctionComponent<CallToActionContainerType> = ({
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
      <section className={[styles.callToActionContainer, className].join(" ")}>
        <b className={styles.nothingToLoseContainer}>
          <p className={styles.nothingToLose}>{`NOTHING TO LOSE. `}</p>
          <p className={styles.nothingToLose}>EVERYTHING TO GAIN</p>
        </b>
        <button className={styles.ctaButton} onClick={openCHATBOTPopup}>
          <div className={styles.startNow}>START NOW</div>
        </button>
        <div className={styles.callToActionContainer1}>
          <span>{`When you submit, you’ll instantly receive your `}</span>
          <b>free</b>
          <span>{` Personality & Relationship Report. `}</span>
        </div>
      </section>
      {isCHATBOTPopupOpen && (
        <PortalPopup
          overlayColor="rgba(113, 113, 113, 0.3)"
          placement="Bottom right"
          onOutsideClick={closeCHATBOTPopup}
        >
          <CHATBOT onClose={closeCHATBOTPopup} />
        </PortalPopup>
      )}
    </>
  );
};

export default CallToActionContainer;
