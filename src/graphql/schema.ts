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
    
	directive @hasRole(roles: [String]) on FIELD_DEFINITION
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
		getCharacteristics(pagination: Pagination): CharacteristicQuantityAndList
        
		getCategory(id: Int!): Category
		getCategories(pagination: Pagination): CategoryQuantityAndList
		
		getBannerImage(id: Int!): ImageBanner
		getBannerImages(pagination: Pagination): ImageBannerQuantityAndList
		
		getBanner(id: Int!): Banner
		getBanners(pagination: Pagination): BannerQuantityAndList
        
		getArticleCategory(id: Int!): ArticleCategory
		getArticleCategories(filter: ArticleCategoryFilter, pagination: Pagination): ArticleCategoryQuantityAndList
		
		logIn(input: LogInInput): Token
        
		getRoles(limit: Int, offset: Int): [Role]                                                                       @auth @hasRole(roles: ["ADMIN"])
		
		getArticle(id: Int!): Article
		getArticles(filter: ArticleFilter, pagination: Pagination): ArticleResponse

		getPaymentTypes(limit: Int, offset: Int): [PaymentType]                                                         @auth @hasRole(roles: ["ADMIN"])
		getPaymentType(id: Int!): PaymentType                                                                           @auth @hasRole(roles: ["ADMIN"])
		getUsers(filter: UserInputFilter): UsersAndCount                                                                @auth @hasRole(roles: ["ADMIN"])
		getUser(id: Int!): User                                                                                         @auth @hasRole(roles: ["ADMIN"])

		getDeliveryService(id: Int!): DeliveryService																	@auth @hasRole(roles: ["ADMIN"])
		getDeliveryServices: [DeliveryService]																			@auth @hasRole(roles: ["ADMIN"])
    }
    
    type Mutation {
		addImages(input: AddImages): [Image]																			@auth @hasRole(roles: ["ADMIN", "MANAGER"])
		removeImages(input: RemoveImages): [Image]																		@auth @hasRole(roles: ["ADMIN", "MANAGER"])
		updateImage(input: AddImages, id: Int!): Image																	@auth @hasRole(roles: ["ADMIN", "MANAGER"])
		
		createProduct(input: ProductInput): Product																		@auth @hasRole(roles: ["ADMIN", "MANAGER"])
		updateProduct(input: ProductInput, id: Int!): Product															@auth @hasRole(roles: ["ADMIN", "MANAGER"])
		removeProduct(id: Int!): Product																				@auth @hasRole(roles: ["ADMIN", "MANAGER"])
		
		createGallery(input: GalleryInput): Gallery																		@auth @hasRole(roles: ["ADMIN", "MANAGER"])
		updateGallery(input: GalleryInput, id: Int!): Gallery															@auth @hasRole(roles: ["ADMIN", "MANAGER"])
		removeGallery(id: Int!): Gallery																				@auth @hasRole(roles: ["ADMIN", "MANAGER"])
        
		addDiscount(input: DiscountInput): Discount																		@auth @hasRole(roles: ["ADMIN", "MANAGER"])
		updateDiscount(input: DiscountInput, id: Int!): Discount														@auth @hasRole(roles: ["ADMIN", "MANAGER"])
		removeDiscount(id: Int!): Discount																				@auth @hasRole(roles: ["ADMIN", "MANAGER"])
		
		createDeliveryType(input: CreateDeliveryTypeInput): DeliveryType												@auth @hasRole(roles: ["ADMIN", "MANAGER"])
		updateDeliveryType(input: CreateDeliveryTypeInput, id: Int!): DeliveryType										@auth @hasRole(roles: ["ADMIN", "MANAGER"])
		removeDeliveryType(id: Int!): DeliveryType																		@auth @hasRole(roles: ["ADMIN", "MANAGER"])
        
		addComment(input: AddComment): Comment																			@auth @hasRole(roles: ["CUSTOMER"])
		removeComment(id: Int!): Comment																				@auth @hasRole(roles: ["ADMIN"])
        
		createCharacteristic(input: CharacteristicInput): Characteristic												@auth @hasRole(roles: ["ADMIN", "MANAGER"])
		updateCharacteristic(input: CharacteristicInput, id: Int!): Characteristic										@auth @hasRole(roles: ["ADMIN", "MANAGER"])
		removeCharacteristic(id: Int!): Characteristic																	@auth @hasRole(roles: ["ADMIN", "MANAGER"])
        
		createCategory(input: CategoryInput): Category																	@auth @hasRole(roles: ["ADMIN", "MANAGER"])
		updateCategory(input: CategoryInput, id: Int!): Category														@auth @hasRole(roles: ["ADMIN", "MANAGER"])
		removeCategory(id: Int!): Category																				@auth @hasRole(roles: ["ADMIN", "MANAGER"])
		
		addBannerImages(input: [AddImageBanner]): Int																	@auth @hasRole(roles: ["ADMIN", "BANNER_MANAGER"])
		updateBannerImage(input: AddImageBanner, id: Int!): ImageBanner													@auth @hasRole(roles: ["ADMIN", "BANNER_MANAGER"])
		removeBannerImage(id: Int!): ImageBanner																		@auth @hasRole(roles: ["ADMIN", "BANNER_MANAGER"])
		
		createBanner(input: BannerInput): Banner																		@auth @hasRole(roles: ["ADMIN", "BANNER_MANAGER"])
		updateBanner(input: BannerInput, id: Int!): Banner																@auth @hasRole(roles: ["ADMIN", "BANNER_MANAGER"])
		removeBanner(id: Int!): Banner																					@auth @hasRole(roles: ["ADMIN", "BANNER_MANAGER"])
        
		createArticleCategory(input: ArticleCategoryInput!): ArticleCategory											@auth @hasRole(roles: ["ADMIN", "GOVERNING_ARTICLES"])
		updateArticleCategory(input: ArticleCategoryInput!, id: Int!): ArticleCategory									@auth @hasRole(roles: ["ADMIN", "GOVERNING_ARTICLES"])
		removeArticleCategory(id: Int!): ArticleCategory																@auth @hasRole(roles: ["ADMIN", "GOVERNING_ARTICLES"])

		createDeliveryService(input: CreateDeliveryServiceInput): DeliveryService										@auth @hasRole(roles: ["ADMIN"])
		updateDeliveryService(input: UpdateDeliveryServiceInput, id: Int!): DeliveryService								@auth @hasRole(roles: ["ADMIN"])
		removeDeliveryService(id: Int!): DeliveryService																@auth @hasRole(roles: ["ADMIN"])
		
		banUser(input: BanUserInput, some: [String]!): User                                                             @auth @hasRole(roles: ["ADMIN"])
		unbanUser(input: UnbanUserInput): User                                                                          @auth @hasRole(roles: ["ADMIN"])
        
		signIn(input: SignInInput): User
        
		createRole(name: String!): Role                                                                                 @auth @hasRole(roles: ["ADMIN"])
		updateRole(id: Int!, name: String!): Role                                                                       @auth @hasRole(roles: ["ADMIN"])
		removeRole(id: Int!): Role                                                                                      @auth @hasRole(roles: ["ADMIN"])
		
        requestCallback(phone: String!): Boolean!                                                                       @auth @hasRole(roles: ["CUSTOMER"])
        
		closeCallback(id: Int!): Boolean!                                                                               @auth @hasRole(roles: ["ADMIN", "MANAGER"])
        
		createArticle(input: ArticleInput!): Article!                                                                   @auth @hasRole(roles: ["ADMIN", "GOVERNING_ARTICLES"])
		updateArticle(input: ArticleInput!, id: Int!): Article                                                          @auth @hasRole(roles: ["ADMIN", "GOVERNING_ARTICLES"])
		removeArticle(id: Int!): Article                                                                                @auth @hasRole(roles: ["ADMIN", "GOVERNING_ARTICLES"])

		createUser(input: CreateUserInput!): User!                                                                      @auth @hasRole(roles: ["ADMIN"])
		updateUser(input: UpdateUserInput): User!                                                                       @auth @hasRole(roles: ["ADMIN"])

		addOrRemoveFavorite(input: FavoriteIpnut!): Favorite                                                            @auth @hasRole(roles: ["CUSTOMER"])

		createPaymentType(input: PaymentTypeInput!): PaymentType                                                        @auth @hasRole(roles: ["ADMIN"])
		removePaymentType(id: Int!): PaymentType                                                                        @auth @hasRole(roles: ["ADMIN"])
		updatePaymentType(input: PaymentTypeInput!, id: Int!): PaymentType                                              @auth @hasRole(roles: ["ADMIN"])
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
