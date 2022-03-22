import { Task } from "../entities/Task";
import { Resolver, Query, Arg, Mutation } from "type-graphql";

@Resolver()
export class TaskResolver {
  @Query(() => [Task])
  async tasks(): Promise<Task[]> {
    return Task.find();
  }

  @Query(() => Task)
  async task(@Arg("id") id: number): Promise<Task | undefined> {
    return Task.findOne(id);
  }

  @Mutation(() => Task)
  async createTask(@Arg("summary") summary: string): Promise<Task> {
    return Task.create({ summary }).save();
  }

  @Mutation(() => Task)
  async deleteTask(@Arg("id") id: number): Promise<boolean> {
    await Task.delete(id);
    return true;
  }
}
