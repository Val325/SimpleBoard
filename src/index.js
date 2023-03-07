import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { SubText } from "./components/subText.js";
import { SendText } from "./components/sendMsg.js";
import { AdminPanelReg, AdminPanelLog } from "./components/adminPanel.js";

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";



const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "b/thread/:page",
    element: <SendText />,
  },
  {
    path: "b/thread/:page/:threadId",
    element: <SubText />,
  },
  {
    path: "/api/admin/registation",
    element: <AdminPanelReg />,
  },
  {
    path: "/api/admin/logup",
    element: <AdminPanelLog />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

