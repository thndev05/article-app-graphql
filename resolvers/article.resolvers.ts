import Article from '../models/article.model';
import Category from '../models/category.model';

export const resolversArticle = {
  Query: {
    getListArticle: async (_: any, args: any) => {
      const { 
        sortKey, 
        sortValue, 
        currentPage,
        limitItem,
        filterKey,
        filterValue,
        keyword
      } = args;

      const find: any = { 
        deleted: false 
      };

      // sort
      const sort: any = {};
      if (sortKey && sortValue) { 
        sort[sortKey] = sortValue
      }
      // end sort

      //pagination
      const skip: number = (currentPage - 1) * limitItem;
      //end pagination

      // filter
      if (filterKey && filterValue) {
        find[filterKey] = filterValue;
      }
      // end filter

      // search
      if (keyword) {
        const regex = new RegExp(keyword, 'i');
        find['$or'] = [
          { title: { $regex: regex } },
          { description: { $regex: regex } }
        ];
      }
      // end search

      const articles = await Article.find(find)
        .sort(sort)
        .limit(limitItem)
        .skip(skip);

      return articles;
    },
    getArticle: async (_: any, args: any) => {
      const { id } = args;

      const article = await Article.findOne({ 
        _id: id,
        deleted: false 
      });

      return article;
    }
  },
  Article: {
    category: async (article: any) => {
      const categoryId = article.categoryId;

      const category = await Category.findOne({
        _id: categoryId,
        deleted: false
      });

      return category;
    }
  },
  Mutation: {
    createArticle: async (_: any, args: any) => {
      const { article } = args;

      const newArticle = new Article({
        ...article
      });

      await newArticle.save();

      return newArticle;
    },
    deleteArticle: async (_: any, args: any) => {
      const { id } = args;

      await Article.findByIdAndUpdate({
        _id: id
      }, {
        deleted: true,
        deletedAt: new Date()
      });

      return "Delete article successfully!";
    },
    updateArticle: async (_: any, args: any) => {
      const { id, article } = args;

      await Article.updateOne({
        _id: id,
        deleted: false
      }, article);

      const updatedArticle = await Article.findOne({
        _id: id,
        deleted: false 
      });

      return updatedArticle;
    }
  }
};