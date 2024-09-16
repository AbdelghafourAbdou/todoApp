import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Layout from './Components/Layout';
import { loader as menuLoader } from './Components/Menu';
import Tasks, { loader as tasksLoader } from './Components/Tasks';
import Task, { loader as taskLoader, action as taskAction } from './Components/Task';
import { action as newTaskAction } from "./Components/NewTask";
import './App.css';

const queryClient = new QueryClient();

const router = createBrowserRouter(createRoutesFromElements(
  <>
    <Route path='/' element={<Layout />} loader={menuLoader(queryClient)}>
      <Route path=':param' element={<Tasks />} loader={tasksLoader(queryClient)} action={newTaskAction(queryClient)}>
        <Route path=':id' element={<Task />} loader={taskLoader(queryClient)} action={taskAction(queryClient)} />
      </Route>
    </Route>
  </>
))

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools />
    </QueryClientProvider>
  )
}

export default App
