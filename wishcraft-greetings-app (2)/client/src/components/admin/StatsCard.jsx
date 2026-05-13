import { motion } from 'framer-motion';
import './StatsCard.css';

const StatsCard = ({ title, value, icon, color, delay = 0 }) => (
  <motion.div className="stats-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>
    <div className="stats-card__icon" style={{ background: color + '15', color }}>{icon}</div>
    <div className="stats-card__content">
      <h3 className="stats-card__value">{value}</h3>
      <p className="stats-card__title">{title}</p>
    </div>
  </motion.div>
);

export default StatsCard;
