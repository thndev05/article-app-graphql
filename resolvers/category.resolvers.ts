import Article from '../models/article.model';
import Category from '../models/category.model';

export const resolversCategory = {
  Query: {
    getListCategory: async () => {
      const categories = await Category.find({ 
        deleted: false 
      });
      
      return categories;
    },
    getCategory: async (_: any, args: any) => {
      const { id } = args;

      const category = await Category.findOne({ 
        _id: id,
        deleted: false 
      });

      return category;
    },
  },
  Mutation: {
    createCategory: async (_: any, args: any, context: any) => {
      if (!context.user) {
        throw new Error("Unauthorized - Token required");
      }

      const { category } = args;

      const newCategory = new Article({
        ...category
      });

      await newCategory.save();

      return newCategory;
    },
    deleteCategory: async (_: any, args: any, context: any) => {
      if (!context.user) {
        throw new Error("Unauthorized - Token required");
      }

      const { id } = args;

      await Category.findByIdAndUpdate({
        _id: id
      }, {
        deleted: true,
        deletedAt: new Date()
      });

      return "Delete category successfully!";
    },
    updateCategory: async (_: any, args: any, context: any) => {
      if (!context.user) {
        throw new Error("Unauthorized - Token required");
      }

      const { id, category } = args;

      await Category.updateOne({
        _id: id,
        deleted: false
      }, category);

      const updatedCategory = await Category.findOne({
        _id: id,
        deleted: false 
      });

      return updatedCategory;
    },
  }
};