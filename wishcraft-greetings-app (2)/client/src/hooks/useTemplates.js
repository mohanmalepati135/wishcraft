import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

export const useTemplates = (category = 'All') => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        const url = category !== 'All' ? `/templates?category=${category}` : '/templates';
        const { data } = await axiosInstance.get(url);
        setTemplates(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load templates');
      } finally {
        setLoading(false);
      }
    };
    fetchTemplates();
  }, [category]);

  return { templates, loading, error, refetch: () => setLoading(true) };
};
