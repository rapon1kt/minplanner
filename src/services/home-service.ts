import {
  TagRepository,
  TaskRepository,
} from "@/infra/db/mongoose/repositories";
import { sortTasks } from "@/utils";

export const homeService = {
  async getHomeData(userId: string) {
    const [tasks, tags] = await Promise.all([
      TaskRepository.getTasksByUserId(userId),
      TagRepository.getTagsByUserId(userId),
    ]);

    const cleanTasks = JSON.parse(JSON.stringify(sortTasks(tasks)));
    const cleanTags = JSON.parse(JSON.stringify(tags));

    return { tasks: cleanTasks, tags: cleanTags };
  },
};
