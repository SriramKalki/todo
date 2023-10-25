"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from "date-fns";
import { Inter } from "next/font/google";
import { Check, Edit, Trash } from "lucide-react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DatePickerDemo } from "@/components/ui/date-picker";
import Sidebar from './Sidebar';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { ComboboxDemo } from "@/components/ui/combobox";

ChartJS.register(ArcElement, Tooltip, Legend);

const inter = Inter({ subsets: ["latin"] });

const tasksApi = 'http://localhost:5500/api/tasks'; // Replace with the correct API route

interface Task {
  name: string;
  number: number;
  dueDate: Date;
  completed: boolean;
  completedAt: Date;
  userId: string;
}

export default function Home() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<Task>({
    name: '',
    number: 0,
    dueDate: new Date(),
    completed: false,
    completedAt: new Date(),
    userId: user?.primaryEmailAddressId ? user?.primaryEmailAddressId : ""
  });
  const [sortOption, setSortOption] = useState(""); // State to store the sorting option



  // State to manage the edited task name
  const [updatedTaskName, setUpdatedTaskName] = useState<string>(''); // Initialize as an empty string

  // State to keep track of the editing task
  const [editingTaskNumber, setEditingTaskNumber] = useState<number | null>(null);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(tasksApi, {
        params: { sort: sortOption },
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const removeTask = async (id: string) => {
    alert('test')
  }

  useEffect(() => {
    if (isSignedIn) {
      fetchTasks();
    }
  }, [isSignedIn, sortOption]);

  // Function to handle changes in the input fields and date picker
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };


  // Function to handle the date picker change
  const handleDateChange = (newDate: Date) => {
    setNewTask((prevTask) => ({
      ...prevTask,
      dueDate: newDate,
    }));
  };

  // Function to handle changes in the sorting dropdown
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
    console.log(sortOption);
    fetchTasks();
  };

  const handleFormSubmit = async () => {
    try {
      const data = await axios.get(tasksApi);
      // Send a POST request to create a new task
      console.log(newTask.userId)
      newTask.number = data.data.length + 1;

      const response = await axios.post(tasksApi, newTask);
      fetchTasks(); // Refresh the task list after creating the task
      setNewTask({
        name: '',
        number: 0,
        dueDate: new Date(),
        completed: false,
        completedAt: new Date(),
        userId: user?.primaryEmailAddressId ? user?.primaryEmailAddressId : ""
      });
    } catch (error) {
      console.error('Error creating a task:', error);
    }
  };

  const handleDeletion = async (taskNumber: Number) => {
    try {
      const response = await axios.get(tasksApi);
      for (const element of response.data) {
        if (element.number === taskNumber) {
          console.log(`deleting ${element._id}`);
          const res2 = await axios.delete(`http://localhost:5500/api/tasks/${element._id}`);
          console.log("done")
          break;
        }
      }
      fetchTasks();
    } catch (error) {
      console.error('Error deleting a task:', error);
    }

  };

  // Function to update the "completed" field of a task
  const handleCheckboxChange = async (taskNumber: Number, taskCompleted: Boolean) => {
    try {

      const response = await axios.get(tasksApi);
      for (const element of response.data) {
        if (element.number === taskNumber) {

          const res2 = await axios.put(`http://localhost:5500/api/tasks/${element._id}`, {
            completed: taskCompleted,
            completedAt: new Date()
          });
          console.log("updating checkbox to");
          console.log(taskCompleted);
          break;
        }
      }
      fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  // Function to enable editing mode
  const handleEditClick = (taskNumber: number, taskName: string) => {
    setEditingTaskNumber(taskNumber);
    setUpdatedTaskName(taskName);
  };

  // Function to save the updated task name
  const handleDoneClick = async (taskNumber: number) => {
    try {
      // Find the task to update based on the task number

      const response = await axios.get(tasksApi);
      for (const element of response.data) {
        if (element.number === taskNumber) {
          console.log(`deleting ${element._id}`);
          const res2 = await axios.put(`http://localhost:5500/api/tasks/${element._id}`, {
            name: updatedTaskName,
          });
          console.log("done")
          break;
        }
      }
      // Reset the editing state
      setEditingTaskNumber(null);
      setUpdatedTaskName('');

      // Refresh the task list
      fetchTasks();
    } catch (error) {
      console.error('Error updating task name:', error);
    }
  };

  const handleGenerateReport = () => {
    const reportText = generateDailyReport(tasks, user?.firstName ? user?.firstName : "User");

    // Create a Blob from the report text and save it as a .txt file
    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    // Create an anchor element to download the file
    const a = document.createElement('a');
    a.href = url;
    a.download = 'daily_report.txt';
    a.click();
    URL.revokeObjectURL(url);
  };


  return (
    <div className="flex-1 space-y-4 p-[12rem] pt-6">

      <div className="flex-1">

        <h1 className="scroll-m-20 text-2xl font-semibold tracking-tight py-4">
          <span className="wave me-2">👋</span> Hey there, {user?.firstName}
        </h1>
        <div className="mx-auto">
          
        </div>
        <div className="grid lg:grid-cols-6 sm:grid-cols-2 space-x-2">
          <div className="col-span-3">
            <Input
              placeholder="The task you want to work on."
              value={newTask.name}
              name="name"
              onChange={handleInputChange}
            ></Input>
          </div>
          <div className="col-span-2">
            <DatePickerDemo
              onChange={(newDate: Date) => {
                handleDateChange(newDate)
              }}
            ></DatePickerDemo>
          </div>
          <div className="col-span-1 flex">
            <div className="ms-auto">
            <Button variant={"outline"} onClick={handleFormSubmit}>
              <Check className="w-4 h-4 me-3" />
              Generate Task
            </Button>
              </div>
          </div>
        </div>
        <div className="py-4">
          <Table>
            <TableCaption>
              A list of all tasks you&apos;ve assigned yourself.
            </TableCaption>
            <TableHeader>
              <TableHead className="w-100">Status</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead className="text-right">Options</TableHead>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.number}>
                  <TableCell className="flex">
                    <div className="my-auto">
                      <Checkbox
                        checked={task.completed}
                        onClick={() => handleCheckboxChange(task.number, !task.completed)}
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    {editingTaskNumber === task.number ? (
                      // Render an input field in editing mode
                      <Input
                        value={updatedTaskName}
                        onChange={(e) => setUpdatedTaskName(e.target.value)}
                      />
                    ) : (
                      // Render the task name
                      task.name
                    )}
                  </TableCell>
                  <TableCell>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No Due Date!"}</TableCell>
                  <TableCell className="flex">
                    <div className="space-x-4 ms-auto flex">
                      {editingTaskNumber === task.number ? (
                        // Render "Done" button in editing mode
                        <Button className="my-auto" onClick={() => handleDoneClick(task.number)}>Done</Button>
                      ) : (
                        // Render "Edit" button to enable editing mode
                        <Button className="my-auto" onClick={() => handleEditClick(task.number, task.name)}>
                          Edit
                        </Button>
                      )}
                      <Button variant={'destructive'} className="my-auto" onClick={() => handleDeletion(task.number)}>
                        <Trash className="w-4 h-4 me-2" />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex space-x-2 items-center py-[60px] grid lg:grid-cols-2 sm:grid-cols-1">
            <ComboboxDemo />

            <div className="flex">
              <div className="ms-auto">
                <Button variant="ghost" onClick={handleGenerateReport}>
                  Generate Daily Report
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}

function generateDailyReport(tasks: Task[], name: string): string {
  const currentDate = new Date();
  const past24Hours = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);

  const completedTasks = tasks.filter(
    (task) => task.completed && new Date(task.completedAt) > past24Hours
  );
  const lateTasks = completedTasks.filter(
    (task) => new Date(task.dueDate) < new Date(task.completedAt) || !task.completed
  );
  const onTimeTasks = completedTasks.filter(
    (task) => new Date(task.dueDate) >= new Date(task.completedAt)
  );

  // Calculate reminders for tasks due in one, three, and five days
  const oneDayReminder = tasks.filter(
    (task) =>
      !task.completed &&
      new Date(task.dueDate) > currentDate &&
      new Date(task.dueDate) <= new Date(currentDate.getTime() + 24 * 60 * 60 * 1000)
  );
  const threeDayReminder = tasks.filter(
    (task) =>
      !task.completed &&
      new Date(task.dueDate) > new Date(currentDate.getTime() + 24 * 60 * 60 * 1000) &&
      new Date(task.dueDate) <= new Date(currentDate.getTime() + 3 * 24 * 60 * 60 * 1000)
  );
  const fiveDayReminder = tasks.filter(
    (task) =>
      !task.completed &&
      new Date(task.dueDate) > new Date(currentDate.getTime() + 3 * 24 * 60 * 60 * 1000) &&
      new Date(task.dueDate) <= new Date(currentDate.getTime() + 5 * 24 * 60 * 60 * 1000)
  );

  const reportText = `
    Daily Update Report for ${name}
    Date and Time: ${format(currentDate, 'PPp')}

    Summary of Completed Tasks (Past 24 Hours):
    - Total Completed Tasks: ${completedTasks.length}
    - Completed on Time: ${onTimeTasks.length}
    - Completed Late: ${lateTasks.length}

    Reminders:
    - Tasks due in one day: ${oneDayReminder.map((task) => task.name).join(', ')}
    - Tasks due in three days: ${threeDayReminder.map((task) => task.name).join(', ')}
    - Tasks due in five days: ${fiveDayReminder.map((task) => task.name).join(', ')}
  `;

  return reportText;
}