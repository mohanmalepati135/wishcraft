import { motion } from 'framer-motion';
import './TemplateCard.css';

const TemplateCard = ({ template, user, onClick, index }) => {
  const isPremium = template.isPremium;

  return (
    <motion.div
      className="template-card"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      whileHover={{ y: -6 }}
      onClick={() => onClick(template)}
    >
      <div className="template-card__image-wrapper">
        <img src={template.backgroundImage} alt={template.title} className="template-card__image" loading="lazy" />
        <div className="template-card__overlay">
          <div className="template-card__banner">
            <span className="template-card__name">{user?.name || 'Your Name'}</span>
          </div>
          {user?.profilePicture && (
            <img src={user.profilePicture} alt="" className="template-card__profile" />
          )}
          <div className="template-card__quote">{template.quoteText.slice(0, 60)}...</div>
        </div>
        <span className={`template-card__badge template-card__badge--${isPremium ? 'premium' : 'free'}`}>
          {isPremium ? 'PREMIUM' : 'FREE'}
        </span>
        <motion.div className="template-card__cta" initial={{ opacity: 0 }} whileHover={{ opacity: 1 }}>
          <span className="template-card__cta-text">{isPremium ? 'Unlock' : 'Personalize'}</span>
        </motion.div>
      </div>
      <div className="template-card__info">
        <h3 className="template-card__title">{template.title}</h3>
        <span className="template-card__category">{template.category}</span>
      </div>
    </motion.div>
  );
};

export default TemplateCard;
