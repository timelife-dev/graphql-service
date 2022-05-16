import { MyContext } from "src/types";
import { User } from "../entities/User";
import {
  Resolver,
  Arg,
  Mutation,
  ObjectType,
  Field,
  Ctx,
  Query,
} from "type-graphql";
import argon2 from "argon2";

@ObjectType()
class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() { req }: MyContext) {
    if (!req.session.userId) {
      return null;
    }

    const user = await User.findOne({ id: req.session.userId });

    return user;
  }

  @Mutation(() => User)
  async registerUser(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() { req }: MyContext
  ): Promise<User> {
    const hashedPassword = await argon2.hash(password);
    const user = await User.create({
      email: email,
      password: hashedPassword,
    }).save();
    req.session.userId = user.id;
    return user;
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return {
        errors: [{ field: "username", message: "user does not exist!" }],
      };
    }

    const valid = await argon2.verify(user.password, password);
    if (!valid) {
      return {
        errors: [{ field: "password", message: "passowrd is incorrect!" }],
      };
    }

    req.session.userId = user.id;

    console.log(req.session.userId);

    return { user: user };
  }
}