import { categoryDAO } from '../data-access';

const categoryService = {

  async addCategory(teamId, categoryInfo) {
    await categoryDAO.addCategory(teamId, categoryInfo);
  },

  async getCategoriesByTeamId(teamId) {
    const categories = await categoryDAO.getCategories(teamId);
    return categories;
  },

  async getCategoryByCategoryId(categoryId) {
    const category = await categoryDAO.getCategoryByCategoryId(categoryId);

    return category;
  },

  async updateCategoryByCategoryId(categoryId, updateInfo) {
    await categoryDAO.updateCategoryByCategoryId(categoryId, updateInfo);
  },

  async deleteCategoryByCategoryId(categoryId) {
    await categoryDAO.deleteCategoryByCategoryId(categoryId);
  },
};

export { categoryService };