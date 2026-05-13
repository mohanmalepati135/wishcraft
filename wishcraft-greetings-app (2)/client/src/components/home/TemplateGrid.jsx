import TemplateCard from './TemplateCard';
import Loader from '../common/Loader';
import './TemplateGrid.css';

const TemplateGrid = ({ templates, user, onTemplateClick, loading }) => {
  if (loading) return <Loader />;
  if (!templates.length) return (
    <div className="template-grid__empty">
      <span className="template-grid__empty-icon">✨</span>
      <p>No templates found in this category.</p>
    </div>
  );

  return (
    <div className="template-grid">
      {templates.map((template, i) => (
        <TemplateCard key={template._id} template={template} user={user} onClick={onTemplateClick} index={i} />
      ))}
    </div>
  );
};

export default TemplateGrid;
