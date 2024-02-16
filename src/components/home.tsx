import { Button } from "./ui/button";

import { Input } from "./ui/input";
import { DatePickerWithPresets } from "./ui/date-picker";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import TaskCard from "./TaskCard";
import { useEffect, useState } from "react";
import { api } from "@/lib/statics";
import { Task, TaskSchema } from "@/lib/types";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
export default function Home() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Task>({ resolver: zodResolver(TaskSchema) });
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskDate, setTaskDate] = useState<Date>();

  const handleTaskSubmit = async (data: Task) => {
    const formattedDate = taskDate?.toDateString().slice(0, 11);

    data.dueDate = formattedDate;
    data.completed = false;
    data.username = localStorage.getItem("username") as string;

    console.log(data);

    try {
      const response = await fetch(`${api}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (response.ok) {
        reset();
        fetchTasks();
      }
    } catch (e) {
      console.error(e);
    }
  };
  const fetchTasks = async () => {
    try {
      const response = await fetch(`${api}/tasks/get`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: localStorage.getItem("username") }),
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data.tasks);
        setTasks(data.tasks);
      }
    } catch (e) {
      console.error(e);
    }
  };
  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <section className="flex flex-col ">
      <form
        className="flex flex-col my-4 gap-4 sm:min-w-[350px] w-auto"
        onSubmit={handleSubmit(handleTaskSubmit)}
      >
        <Label className="text-left ">Title</Label>
        <Input
          placeholder="Task"
          className="w-full"
          {...register("title", { required: true })}
        />
        <Label className="text-left ">Due date</Label>
        <DatePickerWithPresets onDateChange={setTaskDate} />
        <Label className="text-left">Description</Label>
        <Textarea
          placeholder="Description"
          className="w-full"
          {...register("description")}
        />
        <Button
          className="w-full"
          type="submit"
          disabled={isSubmitting}
          onClick={() => {
            console.log("clicked");

            handleTaskSubmit;
          }}
        >
          {isSubmitting ? <Loader2 className="animate-spin" /> : null}
          Add
        </Button>

        {errors.title && (
          <span className="text-red-500">Title is required</span>
        )}
        {errors.description && (
          <span className="text-red-500">Description is required</span>
        )}
        {errors.dueDate && (
          <span className="text-red-500">Due date is required</span>
        )}
        {errors.username && (
          <span className="text-red-500">Username is required</span>
        )}
        {errors.completed && (
          <span className="text-red-500">Completed is required</span>
        )}
        {errors._id && <span className="text-red-500">Id is required</span>}
      </form>

      <div className="flex flex-col gap-4">
        {tasks && tasks.length > 0 ? (
          tasks.map((task, index) => (
            <TaskCard key={index} task={task} fetchTasks={fetchTasks} />
          ))
        ) : (
          <p className="text-muted-foreground text-center">No tasks yet</p>
        )}
      </div>
    </section>
  );
}
