import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import CategoryFilter from '../components/home/CategoryFilter';
import TemplateGrid from '../components/home/TemplateGrid';
import PremiumPopup from '../components/premium/PremiumPopup';
import { useAuth } from '../hooks/useAuth';
import { useTemplates } from '../hooks/useTemplates';
import './HomePage.css';

const HomePage = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [premiumModalOpen, setPremiumModalOpen] = useState(false);
  const { user } = useAuth();
  const { templates, loading } = useTemplates(activeCategory);
  const navigate = useNavigate();

  const trendingTemplates = templates.filter(t => t.trending).slice(0, 3);

  const handleTemplateClick = (template) => {
    if (template.isPremium) setPremiumModalOpen(true);
    else navigate(`/editor/${template._id}`);
  };

  return (
    <motion.div className="home-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="home-page__hero">
        <motion.h1 className="home-page__hero-title" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          Craft Beautiful <span className="gradient-text">Wishes</span>
        </motion.h1>
        <motion.p className="home-page__hero-subtitle" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          Personalize greeting cards with your name and photo
        </motion.p>
      </div>
      <div className="container">
        <CategoryFilter active={activeCategory} onChange={setActiveCategory} />
        {trendingTemplates.length > 0 && (
          <motion.section className="home-page__trending" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <h2 className="home-page__section-title"><span className="home-page__fire">🔥</span> Trending for Today</h2>
            <TemplateGrid templates={trendingTemplates} user={user} onTemplateClick={handleTemplateClick} loading={false} />
          </motion.section>
        )}
        <section className="home-page__all">
          <h2 className="home-page__section-title">All Templates</h2>
          <TemplateGrid templates={templates} user={user} onTemplateClick={handleTemplateClick} loading={loading} />
        </section>
      </div>
      <PremiumPopup isOpen={premiumModalOpen} onClose={() => setPremiumModalOpen(false)} />
    </motion.div>
  );
};

export default HomePage;
