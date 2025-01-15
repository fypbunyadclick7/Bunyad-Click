import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import BuyerNavbar from '../../Components/buyernavbar';
import SkillsInput from '../../Components/skills';
import CustomCombobox from '../../Components/CustomCombobox';
import toast from 'react-hot-toast';
import Spinner from '../../Components/spinner';
import { useHistory } from 'react-router-dom';

export default function PostProject() {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [skills, setSkills] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    scope: '',
    budget: '',
    category: '',
    subcategory: '',
    description: ''
  });
  
  // State for categories and subcategories
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');

  const handleSkillsChange = (newSkills) => {
    setSkills(newSkills); // Update skills for seller
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    console.log(value)
    const category = categories.find(cat => cat.Id === value);
    console.log(category)
    if (category) {
      setSubcategories(category.SubCategories);
    }
    setFormData({ ...formData, category: value, subcategory: '' }); // Reset subcategory
    setSelectedSubcategory(''); // Reset selected subcategory
  };

  const handleSubcategoryChange = (value) => {
    setSelectedSubcategory(value);
    setFormData({ ...formData, subcategory: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userId = Cookies.get('userId'); // Assuming the user ID is stored in a cookie

      const postData = {
        UserId: userId,
        Title: formData.title,
        Timeline: formData.scope,
        Budget: formData.budget,
        Description: formData.description,
        CategoryId: selectedCategory, // Use selectedCategory state
        SubCategoryId: selectedSubcategory, // Use selectedSubcategory state
        Skills: skills
      };

      const apiUrl = `${process.env.REACT_APP_API_URL}/api/v1/job/postJob`;

      const response = await axios.post(
        apiUrl,
        postData,
        {
          headers: {
            'Content-Type': 'application/json',
            'api-key': process.env.REACT_APP_API_KEY
          }
        }
      );

      toast.success(response.data.message);
      setLoading(false);

      // Clear form after successful submission
      setFormData({
        title: '',
        scope: '',
        budget: '',
        category: '',
        subcategory: '',
        description: ''
      });

      setSkills([]); // Reset skills after submission
      setSelectedCategory(''); // Reset selected category
      setSelectedSubcategory(''); // Reset selected subcategory
      setSubcategories([]); // Reset subcategories
      history.push('/viewbuyerpostJob');
     

    } catch (error) {
      setLoading(false);
      toast.error('Failed to post the project. Please try again.');
      console.error('Error posting project:', error);
    }
  };

  // Fetch categories and subcategories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/job/getCategories`, {
          headers: {
            'Content-Type': 'application/json',
            'api-key': process.env.REACT_APP_API_KEY // Include the API key from environment variables
          }
        });
        setCategories(response.data); // Store categories in state
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
  
    fetchCategories();
  }, []);
  

  return (
    <div>
      <BuyerNavbar />
      <h3 style={{ textAlign: 'center' }}>Post Your Project Here!</h3>
      <div className="container mb-2">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <input
            id="title"
            name="title"
            type="text"
            required
            className="custom-input block w-full"
            placeholder="Enter Job Title"
            value={formData.title}
            onChange={handleChange}
          />

          <input
            id="scope"
            name="scope"
            type="number"
            required
            className="custom-input block w-full"
            placeholder="Enter Timeline in days"
            value={formData.scope}
            onChange={handleChange}
          />

          <input
            id="budget"
            name="budget"
            type="number"
            required
            className="custom-input block w-full"
            placeholder="Enter your Budget"
            value={formData.budget}
            onChange={handleChange}
          />

          <CustomCombobox
            options={categories.map(cat => ({ value: cat.Id, label: cat.Title }))}
            selectedCategory={selectedCategory}
            onChange={handleCategoryChange}
            placeholder="Select Category"
          />

          <CustomCombobox
            options={subcategories.map(sub => ({ value: sub.Id, label: sub.Title }))}
            selectedCategory={selectedSubcategory}
            onChange={handleSubcategoryChange}
            placeholder="Select SubCategory"
          />

          <SkillsInput onChange={handleSkillsChange} skills={skills} />

          <textarea
            id="description"
            name="description"
            rows="6"
            required
            placeholder="Enter Description"
            className="custom-input block w-full"
            value={formData.description}
            onChange={handleChange}
          />

          <button
            type="submit"
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500"
            disabled={loading}
          >
            {loading ? <Spinner /> : 'Post a Project'}
          </button>
        </form>
      </div>
    </div>
  );
}
