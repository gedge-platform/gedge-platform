import axios from "axios";
import React, {useEffect, useRef, useState} from "react";
import styles from "./css/sidebar.module.css";

const Sidebar = ({
    width = 280,
    children,
    toggleFlag
}) => {
    const [isOpen, setOpen] = useState(false);
    const [xPosition, setX] = useState(-width);
    const side = useRef();

    // button 클릭 시 토글
    const toggleMenu = () => {
        if (xPosition < 0) {
          toggleFlag.set(true)
          openMenu();
        } else {
          toggleFlag.set(false)
          closeMenu();
        }
    };

    const openMenu = () => {
      setX(0);
      setOpen(true);
    };

    const closeMenu = () => {
      setX(-width);
      setOpen(false);
    };

    useEffect(() => {
      if(toggleFlag.value != false){
        openMenu();
      }
      else{
        closeMenu();
      }
    },[toggleFlag.value])

    return (
        <div className={styles.container}>
            <div
                ref={side}
                className={styles.sidebar}
                style={{
                    width: `${width}px`,
                    height: '100%',
                    transform: `translatex(${ - xPosition}px)`
                }}>
                <button onClick={() => toggleMenu()} className={styles.button}>
                </button>
                <div className={styles.content}>{children}</div>
            </div>
        </div>
    );
};

export default Sidebar;