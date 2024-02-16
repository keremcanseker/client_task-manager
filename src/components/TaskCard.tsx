import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import { Check } from "lucide-react";
import { Edit } from "lucide-react";

import { api } from "@/lib/statics";
import { Checkbox } from "./ui/checkbox";
import { useState } from "react";
import { Input } from "./ui/input";

import { Textarea } from "./ui/textarea";

type TaskCardProps = {
  task: {
    title: string;
    description: string;
    dueDate?: string;
    _id?: string;
    completed?: boolean;
  };
  fetchTasks: () => void;
};

export default function TaskCard({ task, fetchTasks }: TaskCardProps) {
  const {
    title: initialTitle,
    description: initialDescription,
    dueDate,
    completed,
    _id,
  } = task;

  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [isEditing, setIsEditing] = useState(false);
  const [completedState, setCompletedState] = useState(completed);

  const handleTaskDelete = async () => {
    try {
      const response = await fetch(`${api}/tasks`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: _id }),
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        fetchTasks();
      }
    } catch (e) {
      console.error(e);
    }
  };
  const handleSave = async () => {
    try {
      const response = await fetch(`${api}/tasks`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: _id, title, description }), // Include id in the request body
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        fetchTasks();
        setIsEditing(false); // Exit edit mode after saving
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between">
        {isEditing ? (
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        ) : (
          <CardTitle>{title}</CardTitle>
        )}
      </CardHeader>

      <CardContent>
        {isEditing ? (
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        ) : (
          <CardDescription>{description}</CardDescription>
        )}
      </CardContent>
      <CardContent className="text-sm text-muted-foreground my-0 py-1 ">
        Due: {dueDate}
      </CardContent>

      <CardFooter className="flex justify-start gap-2">
        {isEditing ? (
          <Button variant="secondary" onClick={handleSave}>
            Save
          </Button>
        ) : (
          <Button
            size="icon"
            variant="secondary"
            onClick={() => setIsEditing(true)}
          >
            <Edit />
          </Button>
        )}
        <Button
          size={"icon"}
          variant={"ghostSuccess"}
          onClick={handleTaskDelete}
        >
          <Check></Check>
        </Button>
        {/* <Checkbox
          checked={completedState}
          onCheckedChange={() =>
            setCompletedState(completedState === false ? true : false)
          }
        /> */}
        {/* <label
          htmlFor="terms1"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Completed
        </label> */}
      </CardFooter>
    </Card>
  );
}
