import { motion } from 'framer-motion';
import './CategoryFilter.css';

const categories = ['All', 'Shayari', 'Birthday', 'Anniversary', 'Festivals', 'Joke', 'Updesh', 'Love', 'Friendship', 'Motivation'];

const CategoryFilter = ({ active, onChange }) => (
  <div className="category-filter">
    <div className="category-filter__scroll">
      {categories.map((cat) => (
        <motion.button
          key={cat}
          className={`category-filter__pill ${active === cat ? 'category-filter__pill--active' : ''}`}
          onClick={() => onChange(cat)}
          whileTap={{ scale: 0.95 }}
          layout
        >
          {cat}
          {active === cat && (
            <motion.div className="category-filter__indicator" layoutId="activeIndicator" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
          )}
        </motion.button>
      ))}
    </div>
  </div>
);

export default CategoryFilter;
