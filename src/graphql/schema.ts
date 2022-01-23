import _ from 'lodash'
import {gql} from 'apollo-server-express';
import {makeExecutableSchema} from '@graphql-tools/schema';

import {prisma} from '../config/prismaClient';

import Role from './types/role';
import User from "./types/user";
import Callback from "./types/callback";
import Article from "./types/article";
import Favorite from "./types/favorite";
import PaymentType from "./types/paymentType";
import DeliveryService from "./types/deliveryService";
import ArticleCategory from "./types/articleCategory";
import Banner from "./types/banner";
import BannerImage from "./types/bannerImage";
import Category from "./types/category";
import Characteristic from "./types/characteristic";
import Comment from "./types/comment";
import DeliveryType from "./types/deliveryType";
import Discount from "./types/discount";
import Gallery from "./types/gallery";
import Image from "./types/image";
import Product from "./types/product";

import {getUserByToken} from "../typescript/user";
import {roleDirective, authDirective} from './directives';
import {GraphQLSchema} from "graphql/index";


export const typeDefs: any = gql`
    
	directive @hasRole(role: String) on FIELD_DEFINITION
	directive @auth on FIELD_DEFINITION
    
    ${User.typeDefs()}
    ${Role.typeDefs()}
    ${Callback.typeDefs()}
    ${Article.typeDefs()}
    ${Favorite.typeDefs()}
    ${PaymentType.typeDefs()}
    ${DeliveryService.typeDefs()}
    ${Favorite.typeDefs()}
    ${ArticleCategory.typeDefs()}
    ${Banner.typeDefs()}
    ${BannerImage.typeDefs()}
    ${Category.typeDefs()}
    ${Characteristic.typeDefs()}
    ${Comment.typeDefs()}
    ${DeliveryType.typeDefs()}
    ${Discount.typeDefs()}
    ${Gallery.typeDefs()}
    ${Image.typeDefs()}
    ${Product.typeDefs()}
    
	input Pagination {
		limit: Int
		offset: Int
	}
	
	type Query {
		getImage(id: Int!): Image
		
		getProduct(id: Int!): Product
		getProducts(pagination: Pagination, filter: ProductFilter): ProductQuantityAndList
		
		getGallery(id: Int!): Gallery
		getGalleries(pagination: Pagination, filter: GalleryFilter): GalleryQuantityAndLisr
		
		getDiscount(id: Int!): Discount
		getDiscounts(pagination: Pagination): Discount
		
		getDeliveryType(id: Int!): DeliveryType
		getDeliveryTypes: [DeliveryType]
		
		getComment(id: Int!): Comment
		getComments(pagination: Pagination, filter: CommentFilter): CommentQuantityAndList
        
		getCharacteristic(id: Int!): Characteristic
		getCharacteristics(pagination: Pagination): CharacteristiQuantityAndList
        
		getCategory(id: Int!): Category
		getCategories(pagination: Pagination): CategoryQuantityAndLisr
		
		getBannerImage(id: Int!): ImageBanner
		getBannerImages(pagination: Pagination): ImageBannerQuantityAndList
		
		getBanner(id: Int!): Banner
		getBanners(pagination: Pagination): BannerQuantityAndList
        
		getArticleCategory(id: Int!): ArticleCategory
		getArticleCategories(filter: ArticelCategoryFilter): ArticleCategory
		
		logIn(input: LogInInput): Token
        
		getRoles(limit: Int, offset: Int): [Role]                                                                       @auth @hasRole(role: "ADMIN")
		
		getArticle(id: Int!): Boolean
		getArticles(filter: ArticleFilter): ArticleResponse

		getPaymentTypes(limit: Int, offset: Int): [PaymentType]                                                         @auth @hasRole(role: "ADMIN")
		getPaymentType(id: Int!): PaymentType                                                                           @auth @hasRole(role: "ADMIN")
		getUsers(filter: UserInputFilter): UsersAndCount                                                                @auth @hasRole(role: "ADMIN")
		getUser(id: Int!): User                                                                                         @auth @hasRole(role: "ADMIN")

		getDeliveryService(id: Int!): DeliveryService																	@auth @hasRole(role: "ADMIN")
		getDeliveryServices: [DeliveryService]																			@auth @hasRole(role: "ADMIN")
    }
    
    type Mutation {
		addImages(input: AddImages): [Image]
		removeImages(input: RemoveImages): [Image]
		updateImage(input: AddImages, id: Int!): Image
		
		createProduct(input: ProductInput): Product
		updateProduct(input: ProductInput, id: Int!): Product
		removeProduct(id: Int!): Product
		
		createGallery(input: GalleryInput): Gallery
		updateGallery(input: GalleryInput, id: Int!): Gallery
		removeGallery(id: Int!): Gallery
        
		addDiscount(input: DiscountInput): Discount
		updateDiscount(input: DiscountInput, id: Int!): Discount
		removeDiscount(id: Int!): Discount
		
		createDeliveryType(input: CreateDeliveryTypeInput): DeliveryType
		updateDeliveryType(input: CreateDeliveryTypeInput, id: Int!): DeliveryType
		removeDeliveryType(id: Int!): DeliveryType
        
		addComment(input: AddComment): Comment
		removeComment(id: Int!): Comment
        
		createCharacteristic(input: CharacteristicInput): Characteristic
		updateCharacteristic(input: CharacteristicInput, id: Int!): Characteristic
		removeCharacteristic(id: Int!): Characteristic
        
		createCategory(input: CategoryInput): Category
		updateCategory(input: CategoryInput, id: Int!): Category
		removeCategory(id: Int!): Category
		
		addBannerImages(input: [AddImageBanner]): [ImageBanner]
		updateBannerImage(input: AddImageBanner, id: Int!): ImageBanner
		removeBannerImage(id: Int!): ImageBanner
		
		createBanner(input: BannerInput): Banner
		updateBanner(input: BannerInput, id: Int!): Banner
		removeBanner(id: Int!): Banner
        
		createArticleCategory(input: ArticelCategoryInput!): ArticleCategory
		updateArticleCategory(input: ArticelCategoryInput!, id: Int!): ArticleCategory
		removeArticleCategory(id: Int!): ArticleCategory

		createDeliveryService(input: CreateDeliveryServiceInput): DeliveryService										#@auth @hasRole(role: "ADMIN")
		updateDeliveryService(input: UpdateDeliveryServiceInput): DeliveryService										#@auth @hasRole(role: "ADMIN")
		removeDeliveryService(id: Int!): DeliveryService																#@auth @hasRole(role: "ADMIN")
		
		banUser(input: BanUserInput): User                                                                              @auth @hasRole(role: "ADMIN")
		unbanUser(input: UnbanUserInput): User                                                                          @auth @hasRole(role: "ADMIN")
        
		signIn(input: SignInInput): User
        
		createRole(name: String!): Role                                                                                 @auth @hasRole(role: "ADMIN")
		updateRole(id: Int!, name: String!): Role                                                                       @auth @hasRole(role: "ADMIN")
		removeRole(id: Int!): Role                                                                                      @auth @hasRole(role: "ADMIN")
		
        requestCallback(phone: String!): Boolean!                                                                       @auth @hasRole(role: "CUSTOMER")
        
		closeCallback(id: Int!): Boolean!                                                                               @auth @hasRole(role: "ADMIN")
        
		createArticle(input: ArticelInput!): Article!                                                                   @auth @hasRole(role: "GOVERNING_ARTICLES")
		updateArticle(input: ArticelInput!, id: Int!): Article                                                          @auth @hasRole(role: "GOVERNING_ARTICLES")
		removeArticle(id: Int!): Article                                                                                @auth @hasRole(role: "GOVERNING_ARTICLES")

		createUser(input: CreateUserInput!): User!                                                                      @auth @hasRole(role: "ADMIN")
		updateUser(input: UpdateUserInput): User!                                                                       @auth @hasRole(role: "ADMIN")

		addOrRemoveFavorite(input: FavoriteIpnut!): Favorite                                                            @auth @hasRole(role: "CUSTOMER")

		createPaymentType(input: PaymentTypeInput!): PaymentType                                                        @auth @hasRole(role: "ADMIN")
		removePaymentType(id: Int!): PaymentType                                                                        @auth @hasRole(role: "ADMIN")
		updatePaymentType(input: PaymentTypeInput!, id: Int!): PaymentType                                              @auth @hasRole(role: "ADMIN")
    }
`;

export const context: any = async (context: any) => {
    context.prisma = prisma;
    context.user = null;

    const token = context?.req?.headers?.authorization?.split(' ')
    if (token?.[1]) {
        context.user = await getUserByToken(token[1]);
        if (context.user) {
        	context.user.isCustomer = context.user.role === 'CUSTOMER';
		}
    }

    return context;
};

export const combineResolvers: any = () => {
    return _.merge(
        User.resolver(),
        Role.resolver(),
		Callback.resolver(),
		Article.resolver(),
        Favorite.resolver(),
        PaymentType.resolver(),
		DeliveryService.resolver(),
		ArticleCategory.resolver(),
		Banner.resolver(),
		BannerImage.resolver(),
        Category.resolver(),
        Characteristic.resolver(),
        Comment.resolver(),
		DeliveryType.resolver(),
		Discount.resolver(),
		Gallery.resolver(),
		Image.resolver(),
		Product.resolver(),
    )
}

export let schema: GraphQLSchema = makeExecutableSchema({
    typeDefs,
    resolvers: combineResolvers()
});


schema = roleDirective(schema);
schema = authDirective(schema);
