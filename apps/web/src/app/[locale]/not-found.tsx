import styles from './not-found.module.scss';
import React from 'react';

const NotFound = () => {
  return (
    <div style={{ backgroundColor: "black", color: "#fff", fontFamily: 'Urbanist', textAlign: "center", height: "100vh", display: "flex", alignItems: "center", flexFlow: "column", justifyContent: "center"}}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Urbanist:wght@400;700&display=swap"></link>
      <h1 className={styles.title}>S C R E E N I F Y</h1>
        <div>
            <p className={styles.description}>Not found</p>
            <p className={styles.description}>404</p>
        </div>
    </div>
  );
};

export default NotFound;
