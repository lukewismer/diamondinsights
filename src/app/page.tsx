'use client'

import Head from 'next/head'
import { useState, useEffect } from 'react'
import styles from './page.module.css'
import { FaSpinner } from 'react-icons/fa'

// FA5 icons
import {
  FaRocket,
  FaPlayCircle,
  FaChartLine,
  FaLongArrowAltRight,
  FaDatabase,
  FaBrain,
  FaSyncAlt,
  FaBolt,
  FaCrown,
  FaUsers,
  FaTwitter,
  FaInstagram,
  FaTiktok
} from 'react-icons/fa'

// FA6-only icons
import { FaArrowTrendUp, FaRobot } from 'react-icons/fa6'

export default function LandingPage() {
  
  const PLAYER_IDS = [
    '3e67d1f24ebdbbbe125e7040442f6e84', // Aaron Judge
    'b2585f509345e30749a913d76f462bc3', // Fernando Tatis (now middle)
    '514cce4a132d7b9e56401205f68d9c04'  // Player 3
  ]
  
  interface LandingPlayer { card: Record<string, unknown>; pred: Record<string, unknown> }
  const [players, setPlayers] = useState<LandingPlayer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string|null>(null)

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const playerData = await Promise.all(
          PLAYER_IDS.map(id => 
            Promise.all([
              fetch(`/api/cards/${id}`).then(r => r.json()),
              fetch(`/api/cards/${id}/predictions`).then(r => r.json())
            ])
          )
        )
        
        setPlayers(playerData.map(([card, pred]) => ({ card, pred })))
        setLoading(false)
      } catch (err: unknown) {
        console.error(err)
        if (!(err instanceof DOMException && err.name === 'AbortError')) {
          setError((err as Error).message || 'Unknown error')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchPlayers()
  }, [])

  if (loading) {
    return (
      <div className={styles.spinnerContainer}>
        <FaSpinner className={styles.spinner} />
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p>Oops—something went wrong:</p>
        <pre className={styles.errorMessage}>{error}</pre>
        <button className="btn btn-primary" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    )
  }

  const fmt = (n: number, d = 2) => n.toFixed(d)

  return (
    <>
      <Head>
        <title>DiamondInsights</title>
      </Head>
      <main className={styles.landingContainer}>

        {/* Hero */}
        <section className={styles.heroSection}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              AI-Powered <span>Roster Predictions</span> for MLB The Show
            </h1>
            <p className={styles.heroSubtitle}>
              Get ahead of roster updates with machine learning-powered predictions
            </p>
            <div className={styles.heroCta}>
              <a href="/signup" className="btn btn-primary">
                <FaRocket /> Get Started Free
              </a>
              <a href="#how-it-works" className="btn btn-secondary">
                <FaPlayCircle /> See How It Works
              </a>
            </div>
          </div>

          <div className={styles.heroCards}>
            {players.map(({ card, pred }, index) => {
              const oldRank = parseFloat(String(pred.old_rank))
              const pr = parseFloat(String(pred.predicted_rank))
              const isMiddleCard = index === 1;
              
              return (
                <div key={index} className={`${styles.playerCard} ${isMiddleCard ? styles.focusedCard : styles.blurredCard}`}>
                  <div className={styles.cardHeader}>
                    <img 
                      src={String(pred.baked_img || card.baked_img)}
                      alt={pred.name as string}
                      className={styles.playerImage}
                    />
                    <div className={styles.playerInfo}>
                      <h3 className={styles.playerName}>{String(pred.name)}</h3>
                      <p className={styles.playerPosition}>{String(pred.display_position)}</p>
                    </div>
                  </div>
                  
                  <div className={styles.ratingComparison}>
                    <div className={styles.currentRating}>
                      <div className={styles.ratingLabel}>Current</div>
                      <div className={styles.ratingValue}>{fmt(oldRank, 0)}</div>
                    </div>

                    <div className={styles.predictionArrow}>
                      <FaLongArrowAltRight />
                    </div>

                    <div className={styles.predictedRating}>
                      <div className={styles.ratingLabel}>Predicted</div>
                      <div className={styles.ratingValue}>
                        {fmt(pr)}
                      </div>
                    </div>
                  </div>
                  
                  <div className={styles.confidenceBadge}>
                    <FaChartLine /> {String(pred.confidence_percentage)}% Confidence
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Stats */}
        <section className={styles.statsSection}>
          <div className={styles.statItem}>
            <div className={styles.statValue}>96%</div>
            <div className={styles.statLabel}>Accuracy Rate</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statValue}>18k+</div>
            <div className={styles.statLabel}>Players Analyzed</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statValue}>#1</div>
            <div className={styles.statLabel}>MLB The Show Investment Tool</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statValue}>2k+</div>
            <div className={styles.statLabel}>Active Investors</div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className={styles.howSection}>
          <div className={styles.sectionHeader}>
            <h2>How Our AI Predictions Work</h2>
            <p>
              Advanced machine learning models analyze player performance data
              to forecast roster updates
            </p>
          </div>
          <div className={styles.processSteps}>
            <div className={styles.step}>
              <div className={styles.stepIcon}><FaDatabase /></div>
              <h3>Data Collection</h3>
              <p>Aggregate player stats, performance metrics, and historical roster data</p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepIcon}><FaBrain /></div>
              <h3>AI Analysis</h3>
              <p>Machine learning models identify patterns and predict rating changes</p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepIcon}><FaChartLine /></div>
              <h3>Investment Strategy</h3>
              <p>Get actionable insights to build your investment portfolio</p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepIcon}><FaSyncAlt /></div>
              <h3>Continuous Updates</h3>
              <p>Models retrained daily with the latest player performance data</p>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className={styles.benefitsSection}>
          <div className={styles.sectionHeader}>
            <h2>Why Choose DiamondInsights</h2>
            <p>Maximize your MLB The Show investments with our powerful tools</p>
          </div>
          <div className={styles.benefitsGrid}>
            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}><FaArrowTrendUp /></div>
              <h3>Maximize Stubs</h3>
              <p>Identify undervalued players before their ratings increase</p>
            </div>
            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}><FaRobot /></div>
              <h3>AI-Powered Accuracy</h3>
              <p>96%+ prediction accuracy on roster updates</p>
            </div>
            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}><FaUsers /></div>
              <h3>Investor Community</h3>
              <p>Share strategies with thousands of successful investors</p>
            </div>
            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}><FaBolt /></div>
              <h3>Real-Time Updates</h3>
              <p>Get alerts when prediction confidence changes</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className={styles.ctaSection}>
          <div className={styles.ctaContent}>
            <h2>Ready to Dominate the Market?</h2>
            <p>Join thousands of MLB The Show investors making smarter decisions</p>
            <div className={styles.ctaButtons}>
              <a href="/signup" className="btn btn-primary">
                <FaCrown /> Sign up now
              </a>
              <a href="/predictions" className="btn btn-secondary">
                <FaChartLine /> View Predictions
              </a>
            </div>
          </div>
        </section>

        {/* Community */}
        <section id="community" className={styles.communitySection}>
          <div className={styles.sectionHeader}>
            <h2>Join Our Community</h2>
            <p>Connect with thousands of MLB The Show investors</p>
          </div>
          <div className={styles.communityCta}>
            <a href="https://x.com/DiamondIns58780" className={styles.communityLink}><FaTwitter /> Follow on Twitter</a>
            <a href="https://www.instagram.com/diamondinsights.app/" className={styles.communityLink}><FaInstagram /> Follow on Instagram</a>
            <a href="https://www.tiktok.com/@diamondinsights.app" className={styles.communityLink}><FaTiktok /> Follow on TikTok</a>
          </div>
        </section>
      </main>
    </>
  )
}
