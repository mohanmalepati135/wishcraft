const Template = require('../models/Template');
const Analytics = require('../models/Analytics');

exports.getTemplates = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category && category !== 'All' ? { category } : {};
    const templates = await Template.find(filter).sort({ createdAt: -1 });
    res.json(templates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTemplate = async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);
    if (!template) return res.status(404).json({ message: 'Template not found' });
    template.viewCount += 1;
    await template.save();
    // Track analytics
    await Analytics.create({
      templateId: template._id,
      userId: req.user?._id,
      action: 'view',
      category: template.category,
      isPremium: template.isPremium
    });
    res.json(template);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createTemplate = async (req, res) => {
  try {
    const { title, category, backgroundImage, quoteText, isPremium, trending, tags } = req.body;
    
    // Validate required fields
    if (!title || !category || !backgroundImage || !quoteText) {
      return res.status(400).json({ message: 'Missing required fields: title, category, backgroundImage, quoteText' });
    }

    const template = await Template.create({
      title: title.trim(),
      category,
      backgroundImage: backgroundImage.trim(),
      quoteText: quoteText.trim(),
      isPremium: !!isPremium,
      trending: !!trending,
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [])
    });
    
    res.status(201).json(template);
  } catch (error) {
    console.error('Template creation error:', error);
    res.status(500).json({ message: error.message || 'Failed to create template' });
  }
};

exports.updateTemplate = async (req, res) => {
  try {
    const { title, category, backgroundImage, quoteText, isPremium, trending, tags } = req.body;
    
    // Validate required fields if provided
    if (title !== undefined && !title) {
      return res.status(400).json({ message: 'Title cannot be empty' });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (category !== undefined) updateData.category = category;
    if (backgroundImage !== undefined) updateData.backgroundImage = backgroundImage.trim();
    if (quoteText !== undefined) updateData.quoteText = quoteText.trim();
    if (isPremium !== undefined) updateData.isPremium = !!isPremium;
    if (trending !== undefined) updateData.trending = !!trending;
    if (tags !== undefined) updateData.tags = Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : []);

    const template = await Template.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!template) return res.status(404).json({ message: 'Template not found' });
    res.json(template);
  } catch (error) {
    console.error('Template update error:', error);
    res.status(500).json({ message: error.message || 'Failed to update template' });
  }
};

exports.deleteTemplate = async (req, res) => {
  try {
    const template = await Template.findByIdAndDelete(req.params.id);
    if (!template) return res.status(404).json({ message: 'Template not found' });
    await Analytics.deleteMany({ templateId: req.params.id });
    res.json({ message: 'Template deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.trackAction = async (req, res) => {
  try {
    const { templateId, action } = req.body;
    const template = await Template.findById(templateId);
    if (!template) return res.status(404).json({ message: 'Template not found' });

    if (action === 'share') template.shareCount += 1;
    if (action === 'download') template.downloadCount += 1;
    await template.save();

    await Analytics.create({
      templateId: template._id,
      userId: req.user?._id,
      action,
      category: template.category,
      isPremium: template.isPremium
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
