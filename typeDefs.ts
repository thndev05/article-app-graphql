export const typeDefs = `#graphql
  type Article {
    id: ID,
    title: String,
    avatar: String,
    description: String,
    category: Category
  }

  type Category {
    id: ID,
    title: String,
    avatar: String,
  }

  type Query {
    hello: String,
    getListArticle: [Article],
    getArticle(id: ID): Article,

    getListCategory: [Category],
    getCategory(id: ID): Category,
  }

  input ArticleInput {
    title: String,
    avatar: String,
    description: String,
  }

  input CategoryInput {
    title: String,
    avatar: String,
    description: String,
  }

  type Mutation {
    createArticle(article: ArticleInput): Article,
    deleteArticle(id: ID): String,
    updateArticle(id: ID, article: ArticleInput): Article

    createCategory(category: CategoryInput): Category,
    deleteCategory(id: ID): String,
    updateCategory(id: ID, category: CategoryInput): Category
  }
`;