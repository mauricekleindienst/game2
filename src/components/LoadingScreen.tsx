"use client";

import React, { useEffect, useState } from 'react';
import styles from './styles/LoadingScreen.module.scss';

interface LoadingScreenProps {
  onLoadingComplete?: () => void;
  minDisplayTime?: number;
}

export default function LoadingScreen({ 
  onLoadingComplete, 
  minDisplayTime = 5000 
}: LoadingScreenProps) {
  const [isComplete, setIsComplete] = useState(false);
  
  useEffect(() => {
    const startTime = Date.now();
    
    // Set a timer for the minimum display time
    const timer = setTimeout(() => {
      setIsComplete(true);
      if (onLoadingComplete) {
        onLoadingComplete();
      }
    }, minDisplayTime);
    
    // Cleanup function
    return () => {
      clearTimeout(timer);
    };
  }, [minDisplayTime, onLoadingComplete]);
  
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.canvas}>
        <div className={styles.stars}>
          <div className={`${styles.star} ${styles['star-1']} ${styles['opacity-quarter']}`}></div>
          <div className={`${styles.star} ${styles['star-2']} ${styles['opacity-quarter']}`}></div>
          <div className={`${styles.star} ${styles['star-3']} ${styles['opacity-half']}`}></div>
          <div className={`${styles.star} ${styles['star-4']} ${styles['opacity-half']}`}></div>
          <div className={`${styles.star} ${styles['star-5']} ${styles['opacity-half']}`}></div>
          <div className={`${styles.star} ${styles['star-6']} ${styles['opacity-half']}`}></div>
          <div className={`${styles.star} ${styles['star-7']}`}></div>
          <div className={`${styles.star} ${styles['star-8']} ${styles['opacity-quarter']}`}></div>
          <div className={`${styles.star} ${styles['star-9']} ${styles['opacity-quarter']}`}></div>
          <div className={`${styles.star} ${styles['star-10']}`}></div>
          <div className={`${styles.star} ${styles['star-11']}`}></div>
          <div className={`${styles.star} ${styles['star-12']} ${styles['opacity-half']}`}></div>
          <div className={`${styles.star} ${styles['star-13']} ${styles['opacity-quarter']}`}></div>
          <div className={`${styles.star} ${styles['star-14']} ${styles['opacity-quarter']}`}></div>
          <div className={`${styles.star} ${styles['star-15']}`}></div>
          <div className={`${styles.star} ${styles['star-16']} ${styles['opacity-half']}`}></div>
          <div className={`${styles.star} ${styles['star-17']}`}></div>
          <div className={`${styles.star} ${styles['star-18']} ${styles['opacity-half']}`}></div>
          <div className={`${styles.star} ${styles['star-19']}`}></div>
          <div className={`${styles.star} ${styles['star-20']}`}></div>
          <div className={`${styles.star} ${styles['star-21']}`}></div>
          <div className={`${styles.star} ${styles['star-22']} ${styles['opacity-half']}`}></div>
          <div className={`${styles.star} ${styles['star-23']} ${styles['opacity-quarter']}`}></div>
          <div className={`${styles.star} ${styles['star-24']} ${styles['opacity-quarter']}`}></div>
          <div className={`${styles.star} ${styles['star-25']} ${styles['opacity-half']}`}></div>
          <div className={`${styles.star} ${styles['star-26']}`}></div>
          <div className={`${styles.star} ${styles['star-27']} ${styles['opacity-half']}`}></div>
          <div className={`${styles.star} ${styles['star-28']} ${styles['opacity-quarter']}`}></div>
          <div className={`${styles.star} ${styles['star-29']}`}></div>
          <div className={`${styles.star} ${styles['star-30']} ${styles['opacity-half']}`}></div>
        </div>
        <div className={styles['shooting-star']}></div>
        <div className={styles.sun}></div> 
        <div className={styles.forest}>
          <div className={`${styles.tree} ${styles.tree1}`}></div>
          <div className={`${styles.tree} ${styles.tree2}`}></div>
          <div className={`${styles.tree} ${styles.tree3}`}></div>
          <div className={`${styles.tree} ${styles.tree4}`}></div>
          <div className={`${styles.tree} ${styles.tree5}`}></div>
          <div className={`${styles.tree} ${styles.tree6}`}></div>
          <div className={`${styles.tree} ${styles.tree7}`}></div>
          <div className={`${styles.tree} ${styles.tree8}`}></div>
          <div className={`${styles.tree} ${styles.tree9}`}></div>
          <div className={`${styles.tree} ${styles.tree10}`}></div>
          <div className={`${styles.tree} ${styles.tree11}`}></div>
          <div className={`${styles.tree} ${styles.tree12}`}></div>
          <div className={`${styles.tree} ${styles.tree13}`}></div>
          <div className={`${styles.tree} ${styles.tree14}`}></div>
        </div>
        <div className={styles.house}>
          <div className={styles.windmill}>
            <div className={styles['mill-fan']}>
              <div className={`${styles['fan-wing']} ${styles['fan-1']}`}>
                <div className={styles['fan-comb']}>
                  <ul>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                  </ul>
                </div>
              </div>
              <div className={`${styles['fan-wing']} ${styles['fan-2']}`}>
                <div className={styles['fan-comb']}>
                  <ul>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                  </ul>
                </div>
              </div>
              <div className={`${styles['fan-wing']} ${styles['fan-3']}`}>
                <div className={styles['fan-comb']}>
                  <ul>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                  </ul>
                </div>
              </div>
              <div className={`${styles['fan-wing']} ${styles['fan-4']}`}>
                <div className={styles['fan-comb']}>
                  <ul>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                  </ul>
                </div>
              </div>
            </div> 
          </div>
          <div className={styles.roof}></div>
          <div className={styles.floors}>
            <div className={styles.light}></div>
            <div className={styles.door}></div>
          </div>
        </div>
      </div>
      <div className={styles.loadingText}>
        <span>Loading game world...</span>
      </div>
    </div>
  );
} 